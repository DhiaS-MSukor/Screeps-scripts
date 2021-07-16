var r_harvester = require("R_harvester");
var r_builder = require("R_builder");
var r_repairer = require("R_repairer");
var r_runner = require("R_runner");
var r_claimer = require("R_claimer");
var r_defender = require("R_defender");
var b_tower = require("B_tower");
var b_spawn = require("B_spawn");
var b_terminal = require("B_terminal");
require("Creep");
require("Source");
require("Room");

function clean_mem() {
	const startCpu = Game.cpu.getUsed();

	for (var name in Memory.creeps) {
		if (!Game.creeps[name]) {
			delete Memory.creeps[name];
		}
	}

	for (const name in Memory.rooms) {
		if (!Game.rooms[name]) {
			delete Memory.rooms[name];
		}
	}

	for (const name in Memory.spawns) {
		if (!Game.spawns[name]) {
			delete Memory.spawns[name];
		}
	}
	const elapsed = Game.cpu.getUsed() - startCpu;
	if (!Memory.cpuLog) {
		Memory.cpuLog = {};
	}
	if (!Memory.cpuLog.memClear) {
		Memory.cpuLog.memClear = 0;
	}
	Memory.cpuLog.memClear = (Memory.cpuLog.memClear * 99 + elapsed) / 100;
}

function gen_pixel() {
	if (Game.cpu.bucket >= PIXEL_CPU_COST) {
		Game.cpu.generatePixel();
	}
}

function trade_pixel() {
	const startCpu = Game.cpu.getUsed();

	const orders = Game.market
		.getAllOrders({
			type: ORDER_SELL,
			resourceType: PIXEL,
		})
		.sort((a, b) => a.price - b.price);
	if (orders.length > 0) {
		const order = orders[0];
		Memory.bestPixelPrice = order.price;
		let amount = Math.floor(Game.market.credits / order.price);
		amount = amount > order.remainingAmount ? order.remainingAmount : amount;
		const deal = Game.market.deal(order.id, amount);
		if (deal == OK || deal == ERR_TIRED || deal == ERR_FULL) {
			return;
		}
	}

	const elapsed = Game.cpu.getUsed() - startCpu;
	if (!Memory.cpuLog) {
		Memory.cpuLog = {};
	}
	if (!Memory.cpuLog.pixelTrade) {
		Memory.cpuLog.pixelTrade = 0;
	}
	Memory.cpuLog.pixelTrade = (Memory.cpuLog.pixelTrade * 99 + elapsed) / 100;
}

function handle_creeps() {
	const startCpu1 = Game.cpu.getUsed();
	for (const name in Game.creeps) {
		const startCpu = Game.cpu.getUsed();
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
		const elapsed = Game.cpu.getUsed() - startCpu;
		if (!Memory.cpuLog) {
			Memory.cpuLog = {};
		}
		if (!Memory.cpuLog[creep.role]) {
			Memory.cpuLog[creep.role] = 0;
		}
		Memory.cpuLog[creep.role] = (Memory.cpuLog[creep.role] * 99 + elapsed) / 100;
	}
	const elapsed1 = Game.cpu.getUsed() - startCpu1;
	if (!Memory.cpuLog) {
		Memory.cpuLog = {};
	}
	if (!Memory.cpuLog.creep) {
		Memory.cpuLog.creep = 0;
	}
	Memory.cpuLog.creep = (Memory.cpuLog.creep * 99 + elapsed1) / 100;
}

function handle_buildings() {
	const startCpu1 = Game.cpu.getUsed();
	for (const element in Game.structures) {
		const startCpu = Game.cpu.getUsed();
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
		const elapsed = Game.cpu.getUsed() - startCpu;
		if (!Memory.cpuLog) {
			Memory.cpuLog = {};
		}
		if (!Memory.cpuLog[structure.structureType]) {
			Memory.cpuLog[structure.structureType] = 0;
		}
		Memory.cpuLog[structure.structureType] = (Memory.cpuLog[structure.structureType] * 99 + elapsed) / 100;
	}
	const elapsed1 = Game.cpu.getUsed() - startCpu1;
	if (!Memory.cpuLog) {
		Memory.cpuLog = {};
	}
	if (!Memory.cpuLog.structure) {
		Memory.cpuLog.structure = 0;
	}
	Memory.cpuLog.structure = (Memory.cpuLog.structure * 99 + elapsed1) / 100;
}

function handle_room() {
	for (const roomName in Game.rooms) {
		if (Object.hasOwnProperty.call(Game.rooms, roomName)) {
			const room = Game.rooms[roomName];

			const gclPercent = Math.floor((Game.gcl.progress * 100) / Game.gcl.progressTotal);
			const gclLeft = Math.ceil(Game.gcl.progressTotal - Game.gcl.progress);

			const gplPercent = Math.floor((Game.gpl.progress * 100) / Game.gpl.progressTotal);
			const gplLeft = Math.ceil(Game.gpl.progressTotal - Game.gpl.progress);

			const credits = Game.market.credits;
			const pixel = Game.resources.pixel;

			room.visual.text(`Time: ${Game.time}`, 0, 0, { align: "left", opacity: 0.6 });
			room.visual.text(`CPU bucket: ${Game.cpu.bucket}`, 0, 1, { align: "left", opacity: 0.6 });
			room.visual.text(`GCL: ${gclPercent}% (${gclLeft}) @ ${Math.floor(Memory.gclPerformance.avg)}`, 0, 2, { align: "left", opacity: 0.6 });
			room.visual.text(`GPL: ${gplPercent}% (${gplLeft}) @ ${Math.floor(Memory.gplPerformance.avg)}`, 0, 3, { align: "left", opacity: 0.6 });
			room.visual.text(`Credit: ${credits} @ ${Math.floor(Memory.creditPerformance.avg * 1000) / 1000}`, 0, 4, { align: "left", opacity: 0.6 });
			room.visual.text(`Pixel: ${pixel} @ ${Math.floor(Memory.pixelPerformance.avg * 1000) / 1000}`, 0, 5, { align: "left", opacity: 0.6 });
			room.visual.text(`Pixel cost: ${Memory.bestPixelPrice}`, 0, 6, { align: "left", opacity: 0.6 });

			const ctrl = room.getControllerPerformance();
			if (ctrl) {
				const controllerPercent = Math.floor((room.controller.progress * 100) / room.controller.progressTotal);
				const controllerLeft = Math.ceil(room.controller.progressTotal - room.controller.progress);

				room.visual.text(`Energy: ${room.energyAvailable}`, 0, 48, { align: "left", opacity: 0.6 });
				room.visual.text(`Controller: ${controllerPercent}% (${controllerLeft}) @ ${Math.floor(ctrl.avg)}`, 0, 49, { align: "left", opacity: 0.6 });
			}
		}
	}
}

function calc_game_performance() {
	if (Memory.gclPerformance && "prev" in Memory.gclPerformance && "avg" in Memory.gclPerformance) {
		const progress = Game.gcl.progress;
		Memory.gclPerformance.avg = (Memory.gclPerformance.avg * 9999 + (progress - Memory.gclPerformance.prev)) / 10000;
		Memory.gclPerformance.prev = progress;
	} else {
		Memory.gclPerformance = { prev: Game.gcl.progress, avg: 0 };
	}

	if (Memory.gplPerformance && "prev" in Memory.gplPerformance && "avg" in Memory.gplPerformance) {
		const progress = Game.gpl.progress;
		Memory.gplPerformance.avg = (Memory.gplPerformance.avg * 9999 + (progress - Memory.gplPerformance.prev)) / 10000;
		Memory.gplPerformance.prev = progress;
	} else {
		Memory.gplPerformance = { prev: Game.gpl.progress, avg: 0 };
	}

	if (Memory.creditPerformance && "prev" in Memory.creditPerformance && "avg" in Memory.creditPerformance) {
		const progress = Game.market.credits;
		Memory.creditPerformance.avg = (Memory.creditPerformance.avg * 9999 + (progress - Memory.creditPerformance.prev)) / 10000;
		Memory.creditPerformance.prev = progress;
	} else {
		Memory.creditPerformance = { prev: Game.market.credits, avg: 0 };
	}

	if (Memory.pixelPerformance && "prev" in Memory.pixelPerformance && "avg" in Memory.pixelPerformance) {
		const progress = Game.resources.pixel;
		Memory.pixelPerformance.avg = (Memory.pixelPerformance.avg * 9999 + (progress - Memory.pixelPerformance.prev)) / 10000;
		Memory.pixelPerformance.prev = progress;
	} else {
		Memory.pixelPerformance = { prev: Game.resources.pixel, avg: 0 };
	}
}

module.exports.loop = function () {
	const startCpu = Game.cpu.getUsed();
	gen_pixel();

	if (Game.time % 1000 == 0) {
		trade_pixel();
		clean_mem();
	}
	handle_buildings();
	handle_creeps();

	calc_game_performance();

	handle_room();

	const elapsed = Game.cpu.getUsed() - startCpu;
	if (!Memory.cpuLog) {
		Memory.cpuLog = {};
	}
	if (!Memory.cpuLog.total) {
		Memory.cpuLog.total = 0;
	}
	Memory.cpuLog.total = (Memory.cpuLog.total * 99 + elapsed) / 100;
};
