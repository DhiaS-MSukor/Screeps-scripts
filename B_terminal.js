function getMaxAmount(terminal, order) {
    const amount = terminal.store.getUsedCapacity(RESOURCE_ENERGY);
    const distance = Game.map.getRoomLinearDistance(order.roomName, terminal.room.name, true);
    return order.resourceType == RESOURCE_ENERGY
        ? Math.floor(amount / Math.exp(-distance / 30)) - 1
        : Math.floor(amount / (1 - Math.exp(-distance / 30))) - 1;
}

function tryDeal(terminal, order) {
    const amount = Math.min(order.remainingAmount
        , getMaxAmount(terminal, order)
        , terminal.store.getUsedCapacity(order.resourceType)
    )

    if (amount > 0) {
        const cost = Game.market.calcTransactionCost(amount, terminal.room.name, order.roomName);
        if (cost < terminal.store.getUsedCapacity(RESOURCE_ENERGY)) {
            var deal = Game.market.deal(order.id, amount, terminal.room.name);
            if (deal == OK || deal == ERR_TIRED || deal == ERR_FULL) {
                return true;
            }
        }
    }
    return false;
}

function sellResource(terminal, resource) {
    var orders = Game.market.getAllOrders(
        {
            type: ORDER_BUY, resourceType: resource
        }).sort((a, b) => b.price - a.price);
    for (const key1 in orders) {
        if (Object.hasOwnProperty.call(orders, key1)) {
            const order = orders[key1];
            if (tryDeal(terminal, order)) { return true; }
        }
    }
    return false;
}

function doRole(terminal) {
    if (terminal.store.getUsedCapacity(RESOURCE_ENERGY) > 1000
        && sellResource(terminal, RESOURCE_ENERGY)) {
        return;
    }


    res = _.filter(Object.keys(terminal.store)
        , (res) => (res != RESOURCE_ENERGY && terminal.store[res] != 0)
    ).sort((a, b) => terminal.store[a] - terminal.store[b]);
    if (res.length) {
        for (const key in res) {
            if (Object.hasOwnProperty.call(res, key)) {
                const element = res[key];
                if (sellResource(terminal, element)) { return; }
            }
        }
    }
}

module.exports = {
    fx: function (terminal) {
        doRole(terminal);
    },
}