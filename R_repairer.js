var target;

var find_target = function(creep){
	var targets = creep.room.find(FIND_STRUCTURES);
	for (var i in targets) {
		if (targets[i].hits < targets[i].hitsMax) {
			target = targets[i];
		}
	}
}

module.exports = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('harvest');
	    }
	    if(!creep.memory.building && creep.store.getFreeCapacity() == 0) {
	        creep.memory.building = true;
			find_target(creep);
	        creep.say('repair');
	    }

	    if(creep.memory.building) {
            if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffee'}});
            }
	    }
	    else {
	        var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffbb00'}});
            }
	    }
	}
    
};