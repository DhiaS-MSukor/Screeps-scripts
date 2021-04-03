// JavaScript source code

var clean_mem = function () {
    for (var name in Memory.creeps) {
        if (!Game.creeps[name]) {
            delete Memory.creeps[name];
            return;
        }
    }
}

var gen_pixel = function () {
    if (Game.cpu.bucket > 5000) {
        Game.cpu.generatePixel();
    }

}
function trade_pixel() {
    var orders = Game.market.getAllOrders({
        type: ORDER_SELL , resourceType: PIXEL
    }).sort((a, b) => b.price - a.price);
    for (const key in orders) {
        if (Object.hasOwnProperty.call(orders, key)) {
            const order = orders[key];
            
        }
    }
}

module.exports = {
    run: function () {
        gen_pixel();
        try {
            clean_mem();
            trade_pixel();
        } catch (e) { }
    }
}