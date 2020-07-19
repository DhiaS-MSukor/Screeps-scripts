// JavaScript source code
var doTransfer = function(targets, creep) {
    if (targets.length) {
        creep.memory.transferTarget = targets[0].id;
        if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#00ff00'}});
            return true;
        }
    }

    return false;
}

var goToRoom = function (creep, target) {
    var routes = Game.map.findRoute(creep.room, target);

    if (routes.length) {
        creep.moveTo(creep.pos.findClosestByRange(routes[0].exit), {visualizePathStyle: {stroke: '#00ff00'}});
	} 
}

module.exports = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (!Memory.validTarget) {return;}

        var targets;
		var cache; 

        if (creep.memory.harvest && creep.store.getFreeCapacity() == 0) {
            creep.memory.harvest = false;
            creep.say('transfer');
	    }
	    if (!creep.memory.harvest && creep.store.getFreeCapacity() > 0) {
	        creep.memory.harvest = true;
	        creep.say('harvest');
	    }

	    if (creep.memory.harvest) { 
            if (creep.room.name != Memory.roomTarget) {
                goToRoom(creep, Memory.roomTarget)
                return;
			}

            cache = Game.getObjectById(creep.memory.harvestTarget);
            if (cache) {
                if (creep.harvest(cache) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(cache, {visualizePathStyle: {stroke: '#00ff00'}});
				}
			}

            targets = creep.room.find(FIND_DROPPED_RESOURCES);
			if(targets.length) {
				if(creep.pickup(targets[0]) == ERR_NOT_IN_RANGE) {
					creep.moveTo(targets[0]);
                    return;
				}
			} 

            targets = creep.room.find(FIND_SOURCES);
            if(creep.harvest(targets[0]) == ERR_NOT_IN_RANGE) {
                creep.memory.harvestTarget = targets[0].id;
                creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#00ff00'}});
            }
        }

        else {
            if (creep.room.name != Memory.mainRoom) {
                goToRoom(creep, Memory.mainRoom)
                return;
			}

            cache = Game.getObjectById(creep.memory.transferTarget);
            if (cache) {
                if (cache.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                    if (doTransfer([cache], creep)) {return;}        
				}     
			}

            targets = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (structure) => { return (structure.structureType == STRUCTURE_CONTAINER) &&
                                                                                     structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;}});
            if (doTransfer([targets], creep)) { return; }
             
            targets = creep.room.find(FIND_STRUCTURES, {filter: (structure) => { return (structure.structureType == STRUCTURE_SPAWN) &&
                                                                                     structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;}});
            if (doTransfer(targets, creep)) { return; }

        }
	}
};
