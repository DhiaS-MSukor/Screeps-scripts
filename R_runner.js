// JavaScript source code
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
			var targets = creep.room.find(FIND_MY_CREEPS, {filter: (creep) => {return (creep.memory.role == 'builder')}});
			for (var i in targets) {
				if (targets[i].store[RESOURCE_ENERGY] < 50 && creep.transfer(targets[i], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(targets[i], {visualizePathStyle: {stroke: '#ffeeee'}}); 
					return;
				}
			}
			var targets = creep.room.find(FIND_MY_CREEPS, {filter: (creep) => {return (creep.memory.role == 'repairer')}});
			for (var i in targets) {
				if (targets[i].store[RESOURCE_ENERGY] < 50 && creep.transfer(targets[i], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(targets[i], {visualizePathStyle: {stroke: '#ffeeee'}}); 
					return;
				}
			}
	    }
	    else {
			var sources = creep.room.find(FIND_STRUCTURES, {filter: (structure) => { return (structure.structureType == STRUCTURE_CONTAINER)}});
			for (var i in sources) {
				if(sources[i].store[RESOURCE_ENERGY] != 0 && creep.withdraw(sources[i], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
					creep.moveTo(sources[i], {visualizePathStyle: {stroke: '#ff0022'}});
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