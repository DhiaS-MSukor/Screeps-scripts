var doRepair = function (creep, targets) {
	if (targets.length) {
		if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
			creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffff00' } });
		}
		return true;
	}
	return false;
}

var doTask = function (creep) {
	var targets;

	if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
		creep.memory.building = false;
		creep.say('harvest');
	}
	if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
		creep.memory.building = true;
		creep.memory.task = (creep.memory.task + 1) % 3;
		creep.say('repair');
	}

	if (creep.memory.building) {
		if (creep.store[RESOURCE_ENERGY] == 0) { return; }

		if (creep.memory.task == 0) {
			targets = creep.room.find(FIND_MY_STRUCTURES, { filter: (structure) => { return (structure.hits < structure.hitsMax) } });
			if (doRepair(creep, targets)) { return; }
		}
		else if (creep.memory.task == 1) {
			targets = creep.room.find(FIND_STRUCTURES, {
				filter: (structure) => {
					return (structure.hits < structure.hitsMax &&
						structure.structureType == STRUCTURE_CONTAINER)
				}
			});
			if (doRepair(creep, targets)) { return; }
		}
		else if (creep.memory.task == 2) {
			targets = creep.room.find(FIND_STRUCTURES, {
				filter: (structure) => {
					return (structure.hits < structure.hitsMax &&
						structure.structureType == STRUCTURE_ROAD)
				}
			});
			if (doRepair(creep, targets)) { return; }
		}

		targets = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: (structure) => { return (structure.hits < structure.hitsMax) } });
		if (doRepair(creep, [targets])) { return; }

		if (creep.room.controller) {
			if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
				creep.moveTo(creep.room.controller);
			}
		}
	}

	else {
		targets = creep.room.find(FIND_STRUCTURES, {
			filter: (structure) => {
				return (structure.structureType == STRUCTURE_CONTAINER &&
					structure.store[RESOURCE_ENERGY] != 0)
			}
		});
		if (targets.length) {
			if (creep.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffff00' } });
				return;
			}
		}

		targets = creep.room.find(FIND_SOURCES);
		if (creep.harvest(targets[0]) == ERR_NOT_IN_RANGE) {
			creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#ffff00' } });
		}
	}
}

module.exports = {

	/** @param {Creep} creep **/
	run: function (creep) {
		try {
			doTask(creep);
		} catch (e) { }
	}

};