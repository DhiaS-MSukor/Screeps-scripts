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

	const avgPrice = GetMedian(history.map((i) => i.avgPrice));
	const stddev = GetMedian(history.map((i) => i.stddevPrice));

	const avg = avgPrice + stddev / 2;
	const orders = Game.market
		.getAllOrders({
			type: ORDER_BUY,
			resourceType: resource,
		})
		.sort((a, b) => b.price - a.price);
	for (const key1 in orders) {
		if (Object.hasOwnProperty.call(orders, key1)) {
			const order = orders[key1];
			if (order.price > avg && this.trySell(order, left)) {
				return true;
			}
		}
	}
	return false;
};

StructureTerminal.prototype.buyResource = function (resource, left = 2000) {
	if (Game.market.credits < left) {
		return false;
	}

	const history = Game.market.getHistory(resource);
	const transactions = history.reduce((a, b) => a.transactions + b.transactions) / history.length;
	if (transactions > 100) {
		const avgPrice = GetMedian(history.map((i) => i.avgPrice));
		const stddev = history.reduce((a, b) => Math.min(a.stddevPrice, b.stddevPrice), history[0].stddevPrice);

		const avg = avgPrice - stddev / 4;
		const orders = Game.market
			.getAllOrders({
				type: ORDER_SELL,
				resourceType: resource,
			})
			.sort((a, b) => a.price - b.price);
		for (const key1 in orders) {
			if (Object.hasOwnProperty.call(orders, key1)) {
				const order = orders[key1];
				if (order.price < avg && this.tryBuy(order, left)) {
					return true;
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

	res = Object.keys(this.store).filter((res) => res != RESOURCE_ENERGY);
	if (res.length) {
		for (const key in res) {
			if (Object.hasOwnProperty.call(res, key)) {
				const element = res[key];
				if (this.sellResource(element)) {
					return;
				}
			}
		}
	}
	
	for (const element of RESOURCES_ALL) {
		if (element != RESOURCE_ENERGY && this.buyResource(element)) {
			return;
		}
	}

	if (this.sellResource(RESOURCE_ENERGY, 10000)) {
		return;
	}

	this.buyResource(RESOURCE_ENERGY);
};

module.exports = {
	fx: function (terminal) {
		terminal.doRole();
	},
};
