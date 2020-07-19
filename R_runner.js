// JavaScript source code
var doTransfer = function(targets, creep) {
	if (targets.length) {
		creep.memory.target = targets[0].id;
		if (creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
			creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ff00ff'}});  
			return true;
		} 
	}
	return false;
}

var doWithdraw = function(creep, targets) {
	if (targets.length) {
		creep.memory.source = targets[0].id;
		if (creep.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
			creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ff00ff'}});  
			return true;
		} 
	}
	return false;
}

module.exports = {
    /** @param {Creep} creep **/
    run: function(creep) {
		var targets;
		var cache

	    if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('harvest');
	    }
	    if(!creep.memory.building && creep.store[RESOURCE_ENERGY] != 0) {
	        creep.memory.building = true;
	        creep.say('pass');
	    }

	    if(creep.memory.building) { 
            cache = Game.getObjectById(creep.memory.target);
			if (cache) {
				if (cache.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
					if (doTransfer([cache], creep)) {return;}
				}
			}

			targets = creep.room.find(FIND_STRUCTURES, {filter: (targets) => { return (targets.structureType == STRUCTURE_SPAWN && 
																						   targets.store.getFreeCapacity(RESOURCE_ENERGY) > 0)}});
			if (doTransfer(targets, creep)) {return;}

			targets = creep.room.find(FIND_STRUCTURES, {filter: (targets) => { return (targets.structureType == STRUCTURE_TOWER && 
																						   targets.store.getFreeCapacity(RESOURCE_ENERGY) > 0)}});
			if (doTransfer(targets, creep)) {return;}

			targets = creep.room.find(FIND_STRUCTURES, {filter: (targets) => { return (targets.structureType == STRUCTURE_EXTENSION && 
																						   targets.store.getFreeCapacity(RESOURCE_ENERGY) > 0)}});
			if (doTransfer(targets, creep)) {return;} 
			 
			targets = creep.pos.findClosestByRange(FIND_MY_CREEPS, {filter: (targets) => {return (targets.memory.role == 'builder' && 
																						 targets.store.getFreeCapacity(RESOURCE_ENERGY) > 0)}});
			if (doTransfer([targets], creep)) {return;} 

			targets = creep.pos.findClosestByRange(FIND_MY_CREEPS, {filter: (targets) => {return (targets.memory.role == 'repairer' && 
																						 targets.store.getFreeCapacity(RESOURCE_ENERGY) > 0)}});
			if (doTransfer([targets], creep)) {return;} 
	    }
	    else { 
			cache = Game.getObjectById(creep.memory.target); 
			if (cache) {
				if (cache.store[RESOURCE_ENERGY] != 0 && !(cache instanceof Structure)) {
					if (doWithdraw([cache], creep)) {return;}
				}
			}
			
			targets = creep.room.find(FIND_DROPPED_RESOURCES);
			if(targets.length) {
				if(creep.pickup(targets[0]) == ERR_NOT_IN_RANGE) {
					creep.moveTo(targets[0]);
					return;
				}
			} 

			targets = creep.room.find(FIND_RUINS, {filter: (targets) => { return (targets.store[RESOURCE_ENERGY] != 0)}});
			if (doWithdraw(creep, targets)) {return;} 

			targets = creep.room.find(FIND_TOMBSTONES, {filter: (targets) => { return (targets.store[RESOURCE_ENERGY] != 0)}});
			if (doWithdraw(creep, targets)) {return;}  
			
			if (cache) {
				if (cache.store[RESOURCE_ENERGY] != 0) {
					if (doWithdraw([cache], creep)) {return;}
				}
			}

			targets = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (targets) => { return (targets.structureType == STRUCTURE_CONTAINER && 
																						   targets.store[RESOURCE_ENERGY] != 0)}}); 
			if (targets) {
				if (doWithdraw(creep, [targets])) {return;}  
			} 
	    }
	}
};