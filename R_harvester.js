var doTransfer = function (targets, creep, res = RESOURCE_ENERGY) {
	if (targets.length > 0) {
		var result = creep.transfer(targets[0], res);
		if (result == ERR_NOT_IN_RANGE) {
			creep.moveTo(targets[0], {
				visualizePathStyle: { stroke: "#00ff00" },
				maxOps: 100,
				reusePath: 4,
				range: 1,
			});
			return true;
		}
		return result == OK;
	}

	return false;
};

var doTask = function (creep) {
	if (creep.getActiveBodyparts(WORK) == 0 || (creep.body.filter((i) => i.type == WORK).length < 5 && creep.room.energyAvailable > 600)) {
		creep.suicide();
		return;
	}

	var targets;

	if (creep.memory.harvest && creep.store.getFreeCapacity() == 0) {
		creep.memory.harvest = false;
		creep.say("transfer");
	}
	if (!creep.memory.harvest && creep.store.getUsedCapacity() == 0) {
		creep.memory.harvest = true;
		creep.say("harvest");
	}

	if (creep.memory.harvest) {
		if (creep.memory.mode == 1) {
			targets = creep.pos.findClosestByRange(FIND_MINERALS);
			var harv = creep.harvest(targets);
			if (harv != OK) {
				const distance = creep.pos.getRangeTo(targets);
				creep.moveTo(targets, { visualizePathStyle: { stroke: "#00ff00" }, range: 1, reusePath: distance * 2 });
			}
			targets = creep.pos.findInRange(FIND_STRUCTURES, 1, {
				filter: { structureType: STRUCTURE_TERMINAL },
			});
			if (targets.length == 0) {
				targets = creep.pos.findInRange(FIND_STRUCTURES, 1, {
					filter: { structureType: STRUCTURE_CONTAINER },
				});
			}
			res = _.filter(Object.keys(creep.store), (res) => res != RESOURCE_ENERGY && creep.store[res] != 0);
			doTransfer(targets, creep, res[0]);
			return;
		}

		targets = creep.room.find(FIND_SOURCES);
		var harv = creep.harvest(targets[0]);
		if (harv == ERR_NOT_IN_RANGE) {
			creep.moveTo(targets[0], { visualizePathStyle: { stroke: "#00ff00" }, maxOps: 100, range: 1 });
		} else if (harv == ERR_NOT_ENOUGH_RESOURCES) {
			creep.memory.harvest = false;
			creep.say("!_!");
		}
		if (creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
			targets = creep.pos
				.findInRange(FIND_STRUCTURES, 1, {
					filter: { structureType: STRUCTURE_CONTAINER },
				})
				.sort((a, b) => b.store.getFreeCapacity() - a.store.getFreeCapacity());
			doTransfer(targets, creep);
		}
	} else {
		if (creep.memory.mode == 1) {
			targets = creep.pos.findClosestByRange(FIND_STRUCTURES, {
				filter: (structure) => {
					return structure.structureType == STRUCTURE_TERMINAL && structure.store.getFreeCapacity() > 0;
				},
			});
			if (!targets) {
				targets = creep.pos.findClosestByRange(FIND_STRUCTURES, {
					filter: (structure) => {
						return structure.structureType == STRUCTURE_CONTAINER && structure.store.getFreeCapacity() > 0;
					},
				});
			}
			res = _.filter(Object.keys(creep.store), (res) => res != RESOURCE_ENERGY && creep.store[res] != 0);
			doTransfer([targets], creep, res[0]);
			return;
		}

		targets = creep.pos.findClosestByRange(FIND_STRUCTURES, {
			filter: { structureType: STRUCTURE_CONTAINER },
		});
		if (doTransfer([targets], creep)) {
			return;
		}

		targets = creep.room.find(FIND_STRUCTURES, {
			filter: (structure) => {
				return structure.structureType == STRUCTURE_SPAWN && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
			},
		});
		if (doTransfer(targets, creep)) {
			return;
		}

		if (creep.store.getFreeCapacity() > 0) {
			creep.memory.harvest = true;
			creep.say("harvest");
		}

		targets = creep.room.find(FIND_STRUCTURES, {
			filter: { structureType: STRUCTURE_SPAWN },
		});
		if (doTransfer(targets, creep)) {
			return;
		}
	}
};

module.exports = {
	/** @param {Creep} creep **/
	run: function (creep) {
		doTask(creep);
	},
};
