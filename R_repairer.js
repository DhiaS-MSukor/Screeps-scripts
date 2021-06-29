function move(creep, target, range = 3) {
	if (target) {
		const distance = creep.pos.getRangeTo(target);
		return creep.moveTo(target, {
			visualizePathStyle: { stroke: "#ffff00" },
			range: range,
			reusePath: Math.floor(Math.random() * distance * 10) + distance,
		});
	}
}

var doRepair = function (creep, targets) {
	if (targets) {
		if (targets.length) {
			if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
				move(creep, targets[0]);
			}
			return true;
		} else {
			if (creep.repair(targets) == ERR_NOT_IN_RANGE) {
				move(creep, targets);
			}
			return true;
		}
	}
	return false;
};

var doTask = function (creep) {
	if (creep.getActiveBodyparts(WORK) == 0) {
		creep.suicide();
		return;
	}

	var targets;

	if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
		creep.memory.building = false;
		creep.say("harvest");
	}
	if (!creep.memory.building && creep.store.getFreeCapacity() < HARVEST_POWER * creep.getActiveBodyparts(WORK)) {
		creep.memory.building = true;
		creep.memory.task = (creep.memory.task + 1) % 3;
		creep.say("repair");
	}

	if (creep.memory.building && creep.store[RESOURCE_ENERGY] > 0) {
		// if (creep.memory.task == 0) {
		// 	targets = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
		// 		filter: (structure) => {
		// 			return structure.hits < structure.hitsMax;
		// 		},
		// 	});
		// 	if (doRepair(creep, targets)) {
		// 		return;
		// 	}
		// } else if (creep.memory.task == 1) {
		// } else if (creep.memory.task == 2) {
		// 	targets = creep.pos.findClosestByRange(FIND_STRUCTURES, {
		// 		filter: (structure) => {
		// 			return structure.hits < structure.hitsMax && structure.structureType == STRUCTURE_ROAD;
		// 		},
		// 	});
		// 	if (doRepair(creep, targets)) {
		// 		return;
		// 	}
		// }
		targets = creep.pos.findClosestByRange(FIND_STRUCTURES, {
			filter: (structure) => {
				return structure.hits < structure.hitsMax && (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_ROAD);
			},
		});
		if (doRepair(creep, targets)) {
			return;
		}

		targets = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
			filter: (structure) => {
				return structure.hits < structure.hitsMax;
			},
		});
		if (doRepair(creep, targets)) {
			return;
		}

		targets = creep.pos.findClosestByRange(FIND_STRUCTURES, {
			filter: (structure) => {
				return structure.hits < structure.hitsMax && structure.structureType == STRUCTURE_RAMPART;
			},
		});
		if (doRepair(creep, targets)) {
			return;
		}

		targets = creep.pos.findClosestByRange(FIND_STRUCTURES, {
			filter: (structure) => {
				return structure.hits < structure.hitsMax;
			},
		});
		if (targets && doRepair(creep, targets)) {
			return;
		}

		if (creep.room.controller) {
			if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
				move(creep, creep.room.controller);
			}
		}
	} else {
		targets = creep.pos.findClosestByRange(FIND_STRUCTURES, {
			filter: (structure) => {
				return structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > creep.store.getFreeCapacity();
			},
		});
		if (targets) {
			if (creep.withdraw(targets, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				move(creep, targets, 1);
				return;
			}
		}

		var t = creep.room.find(FIND_SOURCES_ACTIVE);
		if (t.length) {
			targets = t[t.length - 1];
			if (creep.harvest(targets) != OK) {
				move(creep, targets, 1);
			}
		}
	}
};

module.exports = {
	/** @param {Creep} creep **/
	run: function (creep) {
		try {
			doTask(creep);
		} catch (e) {}
	},
};
