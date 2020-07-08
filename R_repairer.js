
module.exports = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('harvest');
	    }
	    if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
	        creep.memory.building = true;
	        creep.say('repair');
	    }

	    if(creep.memory.building) {
			var targets = creep.room.find(FIND_STRUCTURES);
			for (var i in targets) {
				if (targets[i].hits < targets[i].hitsMax && creep.repair(targets[i]) == ERR_NOT_IN_RANGE) {
					creep.moveTo(targets[i], {visualizePathStyle: {stroke: '#ffffee'}}); 
					break;
				}
			}
	    }
	    else {
			var sources = creep.room.find(FIND_STRUCTURES, {filter: (structure) => { return (structure.structureType == STRUCTURE_CONTAINER)}});
			for (var i in sources) {
				if(sources[i].store[RESOURCE_ENERGY] != 0 && creep.withdraw(sources[i], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(sources[i], {visualizePathStyle: {stroke: '#ffaa11'}});
					return;
				} 
			}

	        var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffbb00'}});
            }
	    }
	}
    
};