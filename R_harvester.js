var doTransfer = function (targets, creep) {
    if (targets.length > 0) {
        var result = creep.transfer(targets[0], RESOURCE_ENERGY)
        if (result == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#00ff00' } });
            return true;
        }
        return result == OK;
    }

    return false;
}

var goToRoom = function (creep, target) {
    var routes = Game.map.findRoute(creep.room, target);

    if (routes.length) {
        creep.moveTo(creep.room.find(routes[0].exit)[0], { visualizePathStyle: { stroke: '#00ff00' } });
    }
}

var doTask = function (creep) {
    var targets;

    if (creep.memory.harvest && creep.store.getFreeCapacity() < HARVEST_POWER * creep.getActiveBodyparts(WORK)) {
        creep.memory.harvest = false;
        creep.say('transfer');
    }
    if (!creep.memory.harvest && creep.store.getUsedCapacity() == 0) {
        creep.memory.harvest = true;
        creep.say('harvest');
    }

    if (creep.memory.harvest) {
        if (creep.memory.mode == 1) {
            if (creep.room.name != Memory.roomTarget) {
                goToRoom(creep, Memory.roomTarget)
                return;
            }
        }

        targets = creep.room.find(FIND_SOURCES);
        var harv = creep.harvest(targets[0]);
        if (harv == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0], { visualizePathStyle: { stroke: '#00ff00' } });
        }
        else if (harv == ERR_NOT_ENOUGH_RESOURCES) {
            creep.memory.harvest = false;
            creep.say('!_!');
        }
        else {
            targets = creep.pos.findInRange(FIND_STRUCTURES, 1, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });
            doTransfer(targets, creep)
        }
    }

    else {
        if (creep.memory.mode == 1 && creep.room.name != Game.spawns[creep.memory.spawn].memory.mainRoom) {
            goToRoom(creep, Game.spawns[creep.memory.spawn].memory.mainRoom)
            return;
        }

        targets = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        if (doTransfer([targets], creep)) { return; }

        targets = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_SPAWN) &&
                    structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
            }
        });
        if (doTransfer(targets, creep)) { return; }
    }
}

module.exports = {
    /** @param {Creep} creep **/
    run: function (creep) {
        try {
            doTask(creep);
        } catch (e) { }
    }
};
