var doRepair = function(creep, targets) {
	if (targets.length) {
		creep.memory.repairTarget = targets[0].id;
		if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
			creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffff00'}});  
		}
		return true;
	}
	return false;
}

module.exports = {

    /** @param {Creep} creep **/
    run: function(creep) {
		var targets;
		var cache;

	    if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('harvest');
	    }
	    if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
	        creep.memory.building = true;
	        creep.say('repair');
	    }

	    if(creep.memory.building) { 
			cache = Game.getObjectById(creep.memory.repairTarget);
			if (cache) {
				if (cache.hits < cache.hitsMax) {
					if(doRepair(creep, [cache])) {return;} 
				} 
			}

			targets = creep.room.find(FIND_MY_STRUCTURES, {filter: (structure) => { return (structure.hits < structure.hitsMax)}});
			if(doRepair(creep, targets)) {return;} 

			targets = creep.room.find(FIND_STRUCTURES, {filter: (structure) => { return (structure.hits < structure.hitsMax)}});
			if(doRepair(creep, targets)) {return;} 
	    }

	    else {
			cache = Game.getObjectById(creep.memory.repairTarget);
			if (cache) {
				if (cache.store[RESOURCE_ENERGY] != 0) {
					if (creep.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffff00'}});
						return;
					}
				}
			}

			targets = creep.room.find(FIND_STRUCTURES, {filter: (structure) => { return (structure.structureType == STRUCTURE_CONTAINER &&
																							 structure.store[RESOURCE_ENERGY] != 0)}});
			if (targets.length) {
				if (creep.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffff00'}});
					return;
				} 
			}

	        targets = creep.room.find(FIND_SOURCES);
            if(creep.harvest(targets[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffff00'}});
            }
	    }
	}
    
};