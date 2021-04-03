function doRole(terminal) {
    res = _.filter(Object.keys(terminal.store), (res) => (res != RESOURCE_ENERGY && terminal.store[res] != 0));
    if (res.length) {
        for (const key in res) {
            if (Object.hasOwnProperty.call(res, key)) {
                const element = res[key];
                var orders = Game.market.getAllOrders(
                    {
                        type: ORDER_BUY, resourceType: element
                    }).sort((a, b) => a.price - b.price);
                for (const key1 in orders) {
                    if (Object.hasOwnProperty.call(orders, key1)) {
                        const order = orders[key1];
                        var cost = Game.market.calcTransactionCost(terminal.store.getUsedCapacity(element)
                            , terminal.room.name
                            , order.roomName);
                        if (cost < terminal.store.getUsedCapacity(RESOURCE_ENERGY)) {
                            Game.market.deal(order.id, order.amount, terminal.room.name);
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