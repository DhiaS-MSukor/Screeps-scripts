// JavaScript source code

var clean_mem = function () {
	if (Game.time % 1000 == 0) {
		for (var name in Memory.creeps) {
			if (!Game.creeps[name]) {
				delete Memory.creeps[name];
				return;
			}
		}
	}
};

var gen_pixel = function () {
	if (Game.cpu.bucket > 9900 && Game.cpu.bucket > PIXEL_CPU_COST) {
		Game.cpu.generatePixel();
	}
};
function trade_pixel() {
	var orders = Game.market
		.getAllOrders({
			type: ORDER_SELL,
			resourceType: PIXEL,
		})
		.sort((a, b) => a.price - b.price);
	for (const key in orders) {
		if (Object.hasOwnProperty.call(orders, key)) {
			const order = orders[key];
			var amount = Math.floor(Game.market.credits / order.price);
			amount = amount > order.amount ? order.amount : amount;
			const deal = Game.market.deal(order.id, amount);
			if (deal == OK || deal == ERR_TIRED || deal == ERR_FULL) {
				return;
			}
		}
	}
}

module.exports = {
	run: function () {
		gen_pixel();
		trade_pixel();
		try {
			clean_mem();
		} catch (e) {}
	},
};
