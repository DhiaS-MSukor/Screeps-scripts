// JavaScript source code
var doTransfer = function(targets, creep) {
	if (targets.length > 0) {
		if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
			creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffeeee'}});  
			return true;
		} 
	}
	return false;
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
	        creep.say('pass');
	    }

	    if(creep.memory.building) {
			var targets = creep.room.find(FIND_STRUCTURES, {filter: (targets) => { return (targets.structureType == STRUCTURE_SPAWN && 
																						   targets.store.getFreeCapacity(RESOURCE_ENERGY) > 0)}});
			if (doTransfer(targets, creep)) {return;}

			var targets = creep.room.find(FIND_STRUCTURES, {filter: (targets) => { return (targets.structureType == STRUCTURE_TOWER && 
																						   targets.store.getFreeCapacity(RESOURCE_ENERGY) > 0)}});
			if (doTransfer(targets, creep)) {return;}

			var targets = creep.room.find(FIND_STRUCTURES, {filter: (targets) => { return (targets.structureType == STRUCTURE_EXTENSION && 
																						   targets.store.getFreeCapacity(RESOURCE_ENERGY) > 0)}});
			if (doTransfer(targets, creep)) {return;} 
			 
			var targets = creep.room.find(FIND_MY_CREEPS, {filter: (targets) => {return (targets.memory.role == 'builder' && 
																						 targets.store.getFreeCapacity(RESOURCE_ENERGY) > 0)}});
			if (doTransfer(targets, creep)) {return;} 

			var targets = creep.room.find(FIND_MY_CREEPS, {filter: (targets) => {return (targets.memory.role == 'repairer' && 
																						 targets.store.getFreeCapacity(RESOURCE_ENERGY) > 0)}});
			if (doTransfer(targets, creep)) {return;} 
	    }
	    else {
			var targets = creep.room.find(FIND_STRUCTURES, {filter: (targets) => { return (targets.structureType == STRUCTURE_CONTAINER && 
																						   targets.store[RESOURCE_ENERGY] != 0)}});
			if (targets.length > 0) {
				if (creep.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ff0022'}});
					return;
				}
			}

	        var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ff0022'}});
            }
	    }
	}
};