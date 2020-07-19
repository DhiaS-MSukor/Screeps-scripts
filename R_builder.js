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
	        creep.say('build');
	    }

	    if(creep.memory.building) {
			cache = Game.getObjectById(creep.memory.buildTarget);
			if (cache instanceof ConstructionSite) {
				if(creep.build(cache) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(cache, {visualizePathStyle: {stroke: '#0000ff'}});
                }
				return;
			}

	        targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            
			if(targets.length) {
				creep.memory.buildTarget = targets[0].id;
                if(creep.build(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#0000ff'}});
                }
            }

			else if(creep.room.controller) {
				if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
					creep.moveTo(creep.room.controller);
				}
			}
			
	    }
	    else {
			cache = Game.getObjectById(creep.memory.energySource);
			if (cache) {
				if (cache.store[RESOURCE_ENERGY] != 0) {
					if (creep.withdraw(cache, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
						creep.moveTo(cache, {visualizePathStyle: {stroke: '#0000ff'}});
						return;
					} 
				} 
			}

	        var sources = creep.room.find(FIND_STRUCTURES, {filter: (structure) => { return (structure.structureType == STRUCTURE_CONTAINER &&
																							 structure.store[RESOURCE_ENERGY] != 0)}});
			if (sources.length) {
				creep.memory.energySource = sources[0].id;
				if (creep.withdraw(sources[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#0000ff'}});
					return;
				} 
			}

            var sources = creep.pos.findClosestByRange(FIND_SOURCES);
            if(creep.harvest(sources) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources, {visualizePathStyle: {stroke: '#0000ff'}});
            }
	    }
	}
    
};