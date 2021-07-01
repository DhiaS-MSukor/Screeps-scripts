function getMaxAmount(terminal, order) {
	const amount = terminal.store.getUsedCapacity(RESOURCE_ENERGY);
	const distance = Game.map.getRoomLinearDistance(order.roomName, terminal.room.name, true);
	return order.resourceType == RESOURCE_ENERGY
		? Math.floor(amount / (2 - Math.exp(-distance / 30))) - 1
		: Math.floor(amount / (1 - Math.exp(-distance / 30))) - 1;
}

function tryDeal(terminal, order, left = 0) {
	let amount = Math.min(order.remainingAmount, getMaxAmount(terminal, order), terminal.store.getUsedCapacity(order.resourceType));
	amount =
		terminal.store.getUsedCapacity(order.resourceType) - amount < left ? terminal.store.getUsedCapacity(order.resourceType) % (left + 1) : amount;
	if (amount > 0) {
		const cost = Game.market.calcTransactionCost(amount, terminal.room.name, order.roomName);
		if (order.type == ORDER_SELL && order.resourceType == RESOURCE_ENERGY && cost >= amount) {
			return false;
		}

		if (cost < terminal.store.getUsedCapacity(RESOURCE_ENERGY)) {
			var deal = Game.market.deal(order.id, amount, terminal.room.name);
			if (deal == OK || deal == ERR_TIRED || deal == ERR_FULL) {
				return true;
			}
		}
	}
	return false;
}

function sellResource(terminal, resource, left = 0) {
	if (terminal.store.getUsedCapacity(resource) <= left) {
		return false;
	}

	const history = Game.market.getHistory(resource);
	const target = history[history.length - 2];
	const avg = target.avgPrice + target.stddevPrice / 2;
	const orders = Game.market
		.getAllOrders({
			type: ORDER_BUY,
			resourceType: resource,
		})
		.sort((a, b) => b.price - a.price);
	for (const key1 in orders) {
		if (Object.hasOwnProperty.call(orders, key1)) {
			const order = orders[key1];
			if (order.price > avg && tryDeal(terminal, order, left)) {
				return true;
			}
		}
	}
	return false;
}

function buyResource(terminal, resource) {
	if (resource == RESOURCE_ENERGY) {
		return false;
	}

	const history = Game.market.getHistory(resource);
	const target = history[history.length - 2];
	if (target.transactions > 100) {
		const avg = target.avgPrice - target.stddevPrice / 2;
		const orders = Game.market
			.getAllOrders({
				type: ORDER_SELL,
				resourceType: resource,
			})
			.sort((a, b) => a.price - b.price);
		for (const key1 in orders) {
			if (Object.hasOwnProperty.call(orders, key1)) {
				const order = orders[key1];
				if (order.price < avg && tryDeal(terminal, order)) {
					return true;
				}
			}
		}
	}
	return false;
}

function doRole(terminal) {
	if (terminal.cooldown > 0 || terminal.store.getUsedCapacity(RESOURCE_ENERGY) < 2 || Math.random() * TERMINAL_COOLDOWN > 2) {
		return;
	}

	res = Object.keys(terminal.store).filter((res) => res != RESOURCE_ENERGY && terminal.store[res] != 0);
	if (res.length) {
		for (const key in res) {
			if (Object.hasOwnProperty.call(res, key)) {
				const element = res[key];
				if (sellResource(terminal, element)) {
					return;
				}
			}
		}
	}

	for (const key in RESOURCES_ALL) {
		if (Object.hasOwnProperty.call(RESOURCES_ALL, key)) {
			const element = RESOURCES_ALL[key];
			if (buyResource(terminal, element)) {
				return;
			}
		}
	}

	if (terminal.store.getUsedCapacity(RESOURCE_ENERGY) > 20000) {
		sellResource(terminal, RESOURCE_ENERGY, 10000);
	}
}

module.exports = {
	fx: function (terminal) {
		doRole(terminal);
	},
};
