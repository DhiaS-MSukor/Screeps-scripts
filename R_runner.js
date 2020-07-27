// JavaScript source code
var doTransfer = function(targets, creep, res = RESOURCE_ENERGY) {
	if (targets.length) {
		if (creep.transfer(targets[0], res) == ERR_NOT_IN_RANGE){
			creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ff00ff'}});  
			return true;
		} 
	}
	return false;
}

var doWithdraw = function(creep, targets, res = RESOURCE_ENERGY) {
	if (targets.length) {
		if (creep.withdraw(targets[0], res) == ERR_NOT_IN_RANGE){
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
		var res;

	    if(creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
            creep.memory.building = false;
            creep.say('harvest');
	    }
	    if(!creep.memory.building && creep.store[RESOURCE_ENERGY] != 0) {
	        creep.memory.building = true;
	        creep.say('pass');
	    }

	    if(creep.memory.building) { 
			res = _.filter(creep.store.keys, (res) => (res != 'RESOURCE_ENERGY' && creep.store[res] != 0));

			if (res.length) {
				targets = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (targets) => { return (targets.structureType == STRUCTURE_CONTAINER && 
																						   targets.store.getFreeCapacity() > 0)}});
				doTransfer([targets], creep, res[0])
				return;
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
			if (targets) {
				if (doTransfer([targets], creep)) {return;} 
			} 

			targets = creep.pos.findClosestByRange(FIND_MY_CREEPS, {filter: (targets) => {return (targets.memory.role == 'repairer' && 
																						 targets.store.getFreeCapacity(RESOURCE_ENERGY) > 0)}});
			if (targets) {
				if (doTransfer([targets], creep)) {return;} 
			} 
	    }
	    else { 
			targets = creep.room.find(FIND_DROPPED_RESOURCES);
			if(targets.length) {
				if(creep.pickup(targets[0]) == ERR_NOT_IN_RANGE) {
					creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ff00ff'}});
					return;
				}
			} 

			targets = creep.room.find(FIND_RUINS, {filter: (targets) => { return (targets.store[RESOURCE_ENERGY] != 0)}});
			if (doWithdraw(creep, targets)) {return;} 

			targets = creep.room.find(FIND_TOMBSTONES, {filter: (targets) => { return (targets.store[RESOURCE_ENERGY] != 0)}});
			if (doWithdraw(creep, targets)) {return;}  

			targets = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (targets) => { return (targets.structureType == STRUCTURE_CONTAINER && 
																						   targets.store[RESOURCE_ENERGY] != 0)}}); 
			if (targets) {
				if (doWithdraw(creep, [targets])) {return;}  
			} 
	    }
	}
};