module.exports = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('harvest');
	    }
	    if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
	        creep.memory.building = true;
	        creep.say('build');
	    }

	    if(creep.memory.building) {
	        var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if(targets.length) {
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffeeff'}});
                }
            }

			else if(creep.room.controller) {
				if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
					creep.moveTo(creep.room.controller);
				}
			}
			
	    }
	    else {
	        var sources = creep.room.find(FIND_STRUCTURES, {filter: (structure) => { return (structure.structureType == STRUCTURE_CONTAINER &&
																							 structure.store[RESOURCE_ENERGY] != 0)}});
			if (sources.length > 0) {
				if (creep.withdraw(sources[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa11'}});
					return;
				} 
			}

            var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa11'}});
            }
	    }
	}
    
};