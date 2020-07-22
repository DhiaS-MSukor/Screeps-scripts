var doRepair = function(creep, targets) {
	if (targets.length) {
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

	    if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('harvest');
	    }
	    if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
	        creep.memory.building = true;
	        creep.say('repair');
	    }

	    if(creep.memory.building) { 
			targets = creep.room.find(FIND_MY_STRUCTURES, {filter: (structure) => { return (structure.hits < structure.hitsMax)}});
			if(doRepair(creep, targets)) {return;} 

			targets = creep.room.find(FIND_STRUCTURES, {filter: (structure) => { return (structure.hits < structure.hitsMax)}});
			if(doRepair(creep, targets)) {return;} 
	    }

	    else {
			targets = creep.room.find(FIND_STRUCTURES, {filter: (structure) => { return (structure.structureType == STRUCTURE_CONTAINER &&
																							 structure.store[RESOURCE_ENERGY] != 0)}});
			if (targets.length) {
				creep.memory.sourceTarget = targets[0].id;
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