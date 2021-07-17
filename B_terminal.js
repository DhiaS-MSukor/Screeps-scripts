function GetMedian(values) {
	if (values.length === 0) return 0;

	values.sort(function (a, b) {
		return a - b;
	});

	var half = Math.floor(values.length / 2);

	if (values.length % 2) return values[half];

	return (values[half - 1] + values[half]) / 2.0;
}

function CalcCreditPerformance(amount) {
	if (Memory.creditPerformance && "time" in Memory.creditPerformance && "avg" in Memory.creditPerformance) {
		const timePast = Game.time - Memory.creditPerformance.time;
		Memory.creditPerformance.avg = (Memory.creditPerformance.avg * 999 + amount / timePast) / 1000;
		Memory.creditPerformance.time = Game.time;
	} else {
		Memory.creditPerformance = { avg: 0, time: Game.time };
	}
}

StructureTerminal.prototype.getMaxAmount = function (order) {
	const amount = this.store.getUsedCapacity(RESOURCE_ENERGY);
	const distance = Game.map.getRoomLinearDistance(order.roomName, this.room.name, true);
	if (order) {
		const flag = [order.resourceType == RESOURCE_ENERGY, distance > 30].reduce((prev, curr, index) => (curr ? prev + 2 ** index : prev), 0);
		switch (flag) {
			case 0:
				return Math.floor(amount / (1 - Math.exp(-distance / 30))) - 1;
			case 1:
				return Math.floor(amount / (2 - Math.exp(-distance / 30))) - 1;
			case 2:
				return Math.min(order.remainingAmount, this.store.getUsedCapacity(order.resourceType));
			case 3:
				return Math.min(Math.floor(amount / 2), order.remainingAmount * 2);
			default:
				console.log("flag not found");
				return 0;
		}
	}
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
			if (deal == OK) {
				CalcCreditPerformance(amount * order.price);
				return true;
			} else if (deal == ERR_TIRED || deal == ERR_FULL) {
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
	const highDemand = allOrders.filter((order) => order.type == ORDER_SELL).length < 10;

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

StructureTerminal.prototype.buyResource = function (resource, left = 0) {
	if (Game.market.credits < left) {
		return false;
	}

	const history = Game.market.getHistory(resource);
	if (!history.length) {
		return false;
	}

	const transactions = GetMedian(history.map((i) => i.transactions));
	if (transactions > 100) {
		const allOrders = Game.market.getAllOrders({ resourceType: resource });

		if (allOrders.filter((order) => order.type == ORDER_BUY).length > 10) {
			const avgPrice = GetMedian(history.map((i) => i.avgPrice));
			const stddev = GetMedian(history.map((i) => i.stddevPrice));
			const avg = avgPrice - stddev;

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
				if (element != RESOURCE_ENERGY && this.buyResource(element, Memory.bestPixelPrice)) {
					return;
				}
			}
		}
	}
	if ((this.store.getUsedCapacity(RESOURCE_ENERGY) > 100000 || this.store.getFreeCapacity() < 10000) && this.sellResource(RESOURCE_ENERGY, 10000)) {
		return;
	}

	this.buyResource(RESOURCE_ENERGY, Memory.bestPixelPrice);
};

module.exports = {
	fx: function (terminal) {
		terminal.doRole();
	},
};
