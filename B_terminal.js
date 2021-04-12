function doRole(terminal) {
    if (terminal.store.getUsedCapacity(RESOURCE_ENERGY) > 1000) {
        var orders = Game.market.getAllOrders(
            {
                type: ORDER_BUY, resourceType: RESOURCE_ENERGY
            }).sort((a, b) => b.price - a.price);
        for (const key1 in orders) {
            if (Object.hasOwnProperty.call(orders, key1)) {
                const order = orders[key1];
                var amount = Math.min(order.amount
                    , terminal.store.getUsedCapacity(RESOURCE_ENERGY)
                    , terminal.store.getUsedCapacity(RESOURCE_ENERGY)
                );

                var cost = Game.market.calcTransactionCost(amount, terminal.room.name, order.roomName);
                if (cost < terminal.store.getUsedCapacity(RESOURCE_ENERGY)) {
                    var deal = Game.market.deal(order.id, amount, terminal.room.name);
                    if (deal == OK || deal == ERR_TIRED || deal == ERR_FULL) { return; }
                }
            }
        }
    }

    res = _.filter(Object.keys(terminal.store)
        , (res) => (res != RESOURCE_ENERGY && terminal.store[res] != 0)
    ).sort((a, b) => terminal.store[a] - terminal.store[b]);
    if (res.length) {
        for (const key in res) {
            if (Object.hasOwnProperty.call(res, key)) {
                const element = res[key];
                var orders = Game.market.getAllOrders(
                    {
                        type: ORDER_BUY, resourceType: element
                    }).sort((a, b) => b.price - a.price);
                for (const key1 in orders) {
                    if (Object.hasOwnProperty.call(orders, key1)) {
                        const order = orders[key1];
                        var amount = terminal.store.getUsedCapacity(element) > order.amount
                            ? order.amount
                            : terminal.store.getUsedCapacity(element);

                        var cost = Game.market.calcTransactionCost(amount, terminal.room.name, order.roomName);
                        if (cost < terminal.store.getUsedCapacity(RESOURCE_ENERGY)) {
                            var deal = Game.market.deal(order.id, amount, terminal.room.name);
                            if (deal == OK || deal == ERR_TIRED || deal == ERR_FULL) { return; }
                        }
                    }
                }
            }
        }
    }
}

module.exports = {
    fx: function (terminal) {
        doRole(terminal);
    },
}