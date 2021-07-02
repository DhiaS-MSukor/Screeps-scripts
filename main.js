var r_harvester = require("R_harvester");
var r_builder = require("R_builder");
var r_repairer = require("R_repairer");
var r_runner = require("R_runner");
var r_claimer = require("R_claimer");
var r_defender = require("R_defender");
var b_tower = require("B_tower");
var b_spawn = require("B_spawn");
var b_terminal = require("B_terminal");
var creep = require("Creep");

var clean_mem = function () {
	for (var name in Memory.creeps) {
		if (!Game.creeps[name]) {
			delete Memory.creeps[name];
		}
	}
};

var gen_pixel = function () {
	if (Game.cpu.bucket >= PIXEL_CPU_COST) {
		Game.cpu.generatePixel();
	}
};
function trade_pixel() {
	const orders = Game.market
		.getAllOrders({
			type: ORDER_SELL,
			resourceType: PIXEL,
		})
		.sort((a, b) => a.price - b.price);
	for (const key in orders) {
		if (Object.hasOwnProperty.call(orders, key)) {
			const order = orders[key];
			let amount = Math.floor(Game.market.credits / order.price);
			amount = amount > order.remainingAmount ? order.remainingAmount : amount;
			const deal = Game.market.deal(order.id, amount);
			if (deal == OK || deal == ERR_TIRED || deal == ERR_FULL) {
				return;
			}
		}
	}
}

module.exports.loop = function () {
	gen_pixel();

	if (Game.time % 1000 == 0) {
		trade_pixel();
		clean_mem();
	}

	for (const name in Game.creeps) {
		const creep = Game.creeps[name];
		switch (creep.role) {
			case "harvester":
				r_harvester.run(creep);
				break;

			case "builder":
				r_builder.run(creep);
				break;

			case "repairer":
				r_repairer.run(creep);
				break;

			case "runner":
				r_runner.run(creep);
				break;

			case "defender":
			case "healer":
			case "ranger":
			case "troll":
				r_defender.run(creep);
				break;

			case "claimer":
				r_claimer.run(creep);
				break;

			default:
				break;
		}
	}

	for (const element in Game.structures) {
		const structure = Game.structures[element];
		switch (structure.structureType) {
			case STRUCTURE_TOWER:
				b_tower.fx(Game.getObjectById(element));
				break;

			case STRUCTURE_SPAWN:
				b_spawn.fx(Game.getObjectById(element));
				break;
			case STRUCTURE_TERMINAL:
				b_terminal.fx(Game.getObjectById(element));
				break;
			default:
				break;
		}
	}
};
