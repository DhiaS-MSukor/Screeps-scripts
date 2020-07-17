
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
			targets = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {filter: (structure) => { return (structure.hits < structure.hitsMax)}});
			if (targets) {
				if (creep.repair(targets) == ERR_NOT_IN_RANGE) {
					creep.moveTo(targets, {visualizePathStyle: {stroke: '#ffffee'}}); 
					return;
				}
			}

			targets = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (structure) => { return (structure.hits < structure.hitsMax)}});
			if (targets) {
				if (creep.repair(targets) == ERR_NOT_IN_RANGE) {
					creep.moveTo(targets, {visualizePathStyle: {stroke: '#ffffee'}}); 
					return;
				}
			}
	    }

	    else {
			targets = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (structure) => { return (structure.structureType == STRUCTURE_CONTAINER &&
																							 structure.store[RESOURCE_ENERGY] != 0)}});
			if (targets) {
				if (creep.withdraw(targets, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(targets, {visualizePathStyle: {stroke: '#ffaa11'}});
					return;
				} 
			} 
	    }
	}
    
};