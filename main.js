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
require("RoomPosition");

function GetMedian(values) {
	if (values.length === 0) return 0;

	values.sort(function (a, b) {
		return a - b;
	});

	var half = Math.floor(values.length / 2);

	if (values.length % 2) return values[half];

	return (values[half - 1] + values[half]) / 2.0;
}

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
	if (Game.cpu.bucket >= PIXEL_CPU_COST && Game.cpu.generatePixel() == OK) {
		UpdatePixelPerformance(1);
	}
}

function UpdatePixelPerformance(amount) {
	if (Memory.pixelPerformance && "time" in Memory.pixelPerformance && "avg" in Memory.pixelPerformance) {
		const timePast = Game.time - Memory.pixelPerformance.time;
		Memory.pixelPerformance.avg = (Memory.pixelPerformance.avg * 499 + amount / timePast) / 500;
		Memory.pixelPerformance.time = Game.time;
	} else {
		Memory.pixelPerformance = { avg: 0, time: Game.time };
	}
}

function trade_pixel() {
	const startCpu = Game.cpu.getUsed();

	const history = Game.market.getHistory(PIXEL);
	if (!history.length) {
		return false;
	}
	const avgPrice = GetMedian(history.map((i) => i.avgPrice));

	const orders = Game.market
		.getAllOrders({
			type: ORDER_SELL,
			resourceType: PIXEL,
		})
		.sort((a, b) => a.price - b.price);
	if (orders.length > 0) {
		for (const key in orders) {
			if (Object.hasOwnProperty.call(orders, key)) {
				const order = orders[key];
				Memory.bestPixelPrice = order.price;

				if (Game.market.credits < order.price || order.price > avgPrice) {
					break;
				}

				let amount = Math.floor(Game.market.credits / order.price);
				amount = amount > order.remainingAmount ? order.remainingAmount : amount;
				const deal = Game.market.deal(order.id, amount);
				if (deal == OK) {
					UpdatePixelPerformance(amount);
					break;
				} else if (deal == ERR_TIRED || deal == ERR_FULL) {
					break;
				}
			}
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

	const terminals = Object.values(Game.structures).filter((i) => i.structureType == STRUCTURE_TERMINAL && i.isActive());
	if (terminals.length > 0 && !_.isUndefined(Memory.lastTerminal)) {
		const startCpu = Game.cpu.getUsed();

		Memory.lastTerminal = (Memory.lastTerminal + 1) % terminals.length;
		b_terminal.fx(terminals[Memory.lastTerminal]);

		const elapsed = Game.cpu.getUsed() - startCpu;
		if (!Memory.cpuLog) {
			Memory.cpuLog = {};
		}
		if (!Memory.cpuLog[STRUCTURE_TERMINAL]) {
			Memory.cpuLog[STRUCTURE_TERMINAL] = 0;
		}
		Memory.cpuLog[STRUCTURE_TERMINAL] = (Memory.cpuLog[STRUCTURE_TERMINAL] * 99 + elapsed) / 100;
	} else {
		const startCpu = Game.cpu.getUsed();

		b_terminal.fx(terminals[0]);
		Memory.lastTerminal = 0;

		const elapsed = Game.cpu.getUsed() - startCpu;
		if (!Memory.cpuLog) {
			Memory.cpuLog = {};
		}
		if (!Memory.cpuLog[STRUCTURE_TERMINAL]) {
			Memory.cpuLog[STRUCTURE_TERMINAL] = 0;
		}
		Memory.cpuLog[STRUCTURE_TERMINAL] = (Memory.cpuLog[STRUCTURE_TERMINAL] * 99 + elapsed) / 100;
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

function rounder(n) {
	if (Math.abs(n) >= 10 || n === 0) {
		return Math.round(n);
	} else if (n) {
		return n.toFixed(10).match(/^-?\d*\.?0*\d{0,1}/)[0];
	} else {
		return n;
	}
}

function handle_room() {
	const bucket = Game.cpu.bucket;
	const bucketAvg = rounder(Memory.bucketPerformance.avg);
	const bucketEta = Math.ceil((PIXEL_CPU_COST - bucket) / Memory.bucketPerformance.avg);

	const gclPercent = Math.floor((Game.gcl.progress * 100) / Game.gcl.progressTotal);
	const gclLeft = Math.ceil(Game.gcl.progressTotal - Game.gcl.progress);
	const gclAvg = rounder(Memory.gclPerformance.avg);
	const gclEta = Math.ceil(gclLeft / Memory.gclPerformance.avg);

	const gplPercent = Math.floor((Game.gpl.progress * 100) / Game.gpl.progressTotal);
	const gplLeft = Math.ceil(Game.gpl.progressTotal - Game.gpl.progress);
	const gplAvg = rounder(Memory.gplPerformance.avg);
	const gplEta = Math.ceil(gplLeft / Memory.gplPerformance.avg);

	const credits = Game.market.credits;
	const creditAvg = rounder(Memory.creditPerformance.avg);
	const creditEta =
		Math.ceil((Memory.bestPixelPrice - (credits % Memory.bestPixelPrice)) / Memory.creditPerformance.avg) - Game.time + Memory.creditPerformance.time;

	const pixel = Game.resources.pixel;
	const pixelAvg = rounder(Memory.pixelPerformance.avg);
	const pixelEta = Math.ceil((500 - (pixel % 500)) / Memory.pixelPerformance.avg) - Game.time + Memory.pixelPerformance.time;

	for (const roomName in Game.rooms) {
		if (Object.hasOwnProperty.call(Game.rooms, roomName)) {
			const room = Game.rooms[roomName];

			room.visual.text(`Time: ${Game.time}`, 0, 0, { align: "left", opacity: 0.6 });
			room.visual.text(`CPU bucket: ${bucket} @ ${bucketAvg} ~ ${bucketEta}`, 0, 1, { align: "left", opacity: 0.6 });
			room.visual.text(`GCL: ${gclPercent}% (${gclLeft}) @ ${gclAvg} ~ ${gclEta}`, 0, 2, { align: "left", opacity: 0.6 });
			room.visual.text(`GPL: ${gplPercent}% (${gplLeft}) @ ${gplAvg} ~ ${gplEta}`, 0, 3, { align: "left", opacity: 0.6 });
			room.visual.text(`Credit: ${credits} @ ${creditAvg} ~ ${creditEta}`, 0, 4, { align: "left", opacity: 0.6 });
			room.visual.text(`Pixel: ${pixel} @ ${pixelAvg} ~ ${pixelEta}`, 0, 5, { align: "left", opacity: 0.6 });
			room.visual.text(`Pixel cost: ${Memory.bestPixelPrice}`, 0, 6, { align: "left", opacity: 0.6 });

			const ctrl = room.getControllerPerformance();
			if (ctrl) {
				const ctrlPercent = Math.floor((room.controller.progress * 100) / room.controller.progressTotal);
				const ctrlLeft = Math.ceil(room.controller.progressTotal - room.controller.progress);
				const ctrlEta = Math.ceil(ctrlLeft / ctrl.avg);
				const ctrlAvg = rounder(ctrl.avg);

				room.visual.text(`Energy: ${room.energyAvailable}`, 0, 7, { align: "left", opacity: 0.6 });
				room.visual.text(`Controller: ${ctrlPercent}% (${ctrlLeft}) @ ${ctrlAvg} ~ ${ctrlEta}`, 0, 8, { align: "left", opacity: 0.6 });
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

	if (Memory.bucketPerformance && "prev" in Memory.bucketPerformance && "avg" in Memory.bucketPerformance) {
		const progress = Math.max(Game.cpu.bucket - Memory.bucketPerformance.prev, 0);
		Memory.bucketPerformance.avg = (Memory.bucketPerformance.avg * 99 + progress) / 100;
		Memory.bucketPerformance.prev = Game.cpu.bucket;
	} else {
		Memory.bucketPerformance = { prev: Game.cpu.bucket, avg: 0 };
	}
}

module.exports.loop = function () {
	const startCpu = Game.cpu.getUsed();
	gen_pixel();

	if (Math.random() * 100 < 1) {
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
