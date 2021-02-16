var doRole = function (creep) {
	var targets;

	if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
		creep.memory.building = false;
		creep.say('harvest');
	}
	if (!creep.memory.building && creep.store.getFreeCapacity() == 0) {
		creep.memory.building = true;
		creep.say('build');
	}

	if (creep.memory.building) {
		if (creep.store[RESOURCE_ENERGY] == 0) { return; }

		targets = creep.room.find(FIND_CONSTRUCTION_SITES);
		if (targets.length) {
			creep.memory.buildTarget = targets[0].id;
			if (creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
				creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#0000ff' } });
			}
		}

		else if (creep.room.controller) {
			if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
				creep.moveTo(creep.room.controller);
			}
		}

	}
	else {
		var sources = creep.pos.findClosestByRange(FIND_STRUCTURES, {
			filter: (structure) => {
				return (structure.structureType == STRUCTURE_CONTAINER &&
					structure.store[RESOURCE_ENERGY] > creep.store.getFreeCapacity())
			}
		});
		if (sources) {
			if (creep.withdraw(sources, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				creep.moveTo(sources, { visualizePathStyle: { stroke: '#0000ff' } });
				return;
			}
		}

		var sources = creep.pos.findClosestByRange(FIND_SOURCES);
		if (creep.harvest(sources) == ERR_NOT_IN_RANGE) {
			creep.moveTo(sources, { visualizePathStyle: { stroke: '#0000ff' } });
		}
	}
}

module.exports = {
	/** @param {Creep} creep **/
	run: function (creep) {
		try {
			doRole(creep);
		} catch (e) { }
	}
};