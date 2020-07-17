// JavaScript source code
var doTransfer = function(targets, creep) {
    if (targets) {
        if(creep.transfer(targets, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets, {visualizePathStyle: {stroke: '#ffffff'}});
            return true;
        }
    }

    return false;
}

var goToRoom = function (creep, target) {
    var routes = Game.map.findRoute(creep.room, target);

    if (routes.length) {
        creep.moveTo(creep.pos.findClosestByRange(routes[0].exit), {visualizePathStyle: {stroke: '#ffaa00'}});
	} 
}

module.exports = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (!Memory.validTarget) {return;}

        var targets;
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

            targets = creep.pos.findClosestByRange(FIND_SOURCES);
            if(creep.harvest(targets) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }

        else {
            if (creep.room.name != Memory.mainRoom) {
                goToRoom(creep, Memory.mainRoom)
                return;
			}

            targets = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (structure) => { return (structure.structureType == STRUCTURE_CONTAINER) &&
                                                                                                      structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;}});
            if (doTransfer(targets, creep)) { return; }
             
            targets = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (structure) => { return (structure.structureType == STRUCTURE_SPAWN) &&
                                                                                                      structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;}});
            if (doTransfer(targets, creep)) { return; }

        }
	}
};
