function GetMedian(values) {
	if (values.length === 0) return 0;

	values.sort(function (a, b) {
		return a - b;
	});

	var half = Math.floor(values.length / 2);

	if (values.length % 2) return values[half];

	return (values[half - 1] + values[half]) / 2.0;
}

StructureTerminal.prototype.getMaxAmount = function (order) {
	const amount = this.store.getUsedCapacity(RESOURCE_ENERGY);
	const distance = Game.map.getRoomLinearDistance(order.roomName, this.room.name, true);
	return order.resourceType == RESOURCE_ENERGY
		? Math.floor(amount / (2 - Math.exp(-distance / 30))) - 1
		: Math.floor(amount / (1 - Math.exp(-distance / 30))) - 1;
};

StructureTerminal.prototype.trySell = function (order, left = 0) {
	if (order.type == ORDER_SELL) {
		return false;
	}

	const amount = Math.min(order.remainingAmount, this.getMaxAmount(order), this.store.getUsedCapacity(order.resourceType) - left);
	if (amount > 0) {
		const cost = Game.market.calcTransactionCost(amount, this.room.name, order.roomName);
		if (cost < this.store.getUsedCapacity(RESOURCE_ENERGY)) {
			var deal = Game.market.deal(order.id, amount, this.room.name);
			if (deal == OK || deal == ERR_TIRED || deal == ERR_FULL) {
				return true;
			}
		}
	}
	return false;
};

StructureTerminal.prototype.tryBuy = function (order, left = 0) {
	if (order.type == ORDER_BUY) {
		return false;
	}

	let amount = Math.min(order.remainingAmount, this.getMaxAmount(order), Math.floor((Game.market.credits - left) / order.price));
	if (amount > 0) {
		const cost = Game.market.calcTransactionCost(amount, this.room.name, order.roomName);
		if (order.resourceType == RESOURCE_ENERGY && cost >= amount) {
			return false;
		}

		if (cost < this.store.getUsedCapacity(RESOURCE_ENERGY)) {
			var deal = Game.market.deal(order.id, amount, this.room.name);
			if (deal == OK || deal == ERR_TIRED || deal == ERR_FULL) {
				return true;
			}
		}
	}
	return false;
};

StructureTerminal.prototype.sellResource = function (resource, left = 0) {
	if (this.store.getUsedCapacity(resource) <= left) {
		return false;
	}

	const history = Game.market.getHistory(resource);
	if (!history.length) {
		return false;
	}

	const avgPrice = GetMedian(history.map((i) => i.avgPrice));
	const stddev = GetMedian(history.map((i) => i.stddevPrice));

	const avg = avgPrice + stddev / 2;
	const allOrders = Game.market.getAllOrders({ resourceType: resource });

	const orders = allOrders.filter((order) => order.type == ORDER_BUY).sort((a, b) => b.price - a.price);
	const highDemand = allOrders.filter((order) => order.type == ORDER_SELL).length < 3;

	for (const order of orders) {
		if (highDemand || order.price > avg) {
			if (this.trySell(order, left)) {
				return true;
			}
		} else {
			break;
		}
	}
	return false;
};

StructureTerminal.prototype.buyResource = function (resource, left = 2000) {
	if (Game.market.credits < left) {
		return false;
	}

	const history = Game.market.getHistory(resource);
	if (!history.length) {
		return false;
	}

	const transactions = GetMedian(history.map((i) => i.transactions));
	if (transactions > 100) {
		const avgPrice = GetMedian(history.map((i) => i.avgPrice));
		const stddev = GetMedian(history.map((i) => i.stddevPrice));

		const avg = avgPrice - stddev;
		const allOrders = Game.market.getAllOrders({ resourceType: resource });

		if (allOrders.filter((order) => order.type == ORDER_BUY).length > 10) {
			const orders = allOrders.filter((order) => order.type == ORDER_SELL).sort((a, b) => a.price - b.price);

			for (const order of orders) {
				if (order.price < avg && order.price < Game.market.credits - left && avg < Game.market.credits - left) {
					if (this.tryBuy(order, left)) {
						return true;
					}
				} else {
					break;
				}
			}
		}
	}
	return false;
};

StructureTerminal.prototype.doRole = function () {
	if (this.cooldown > 0 || this.store.getUsedCapacity(RESOURCE_ENERGY) < 2 || Math.random() * TERMINAL_COOLDOWN > 2) {
		return;
	}

	for (const element of Object.keys(this.store)) {
		if (element != RESOURCE_ENERGY && this.sellResource(element)) {
			return;
		}
	}
	if (this.store.getUsedCapacity(RESOURCE_ENERGY) > 10000) {
		if (this.store.getFreeCapacity() > 10000) {
			for (const element of RESOURCES_ALL) {
				if (element != RESOURCE_ENERGY && this.buyResource(element)) {
					return;
				}
			}
		}

		if (this.sellResource(RESOURCE_ENERGY, 10000)) {
			return;
		}
	}

	this.buyResource(RESOURCE_ENERGY);
};

module.exports = {
	fx: function (terminal) {
		terminal.doRole();
	},
};
