// JavaScript source code
function goToRoom(creep, target) {
    creep.moveTo(Game.rooms[target].controller, { visualizePathStyle: { stroke: '#ff0000'}, maxOps = 100  });
    return;
}

function doTask(creep, target) {
    if (creep.memory.role == 'ranger') {
        return creep.rangedAttack(target);
    }
    else if (creep.memory.role == 'healer') {
        var res = creep.heal(target);
        if (res == ERR_NOT_IN_RANGE) {
            creep.rangedHeal(target);
            return res;
        }
        return res;
    }
    else if (creep.memory.role == 'troll') {
        creep.heal(creep);
        return ERR_NOT_IN_RANGE;
    }
    return creep.attack(target);
}

function doRole(creep, target) {
    if (doTask(creep, target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000' } });
        return;
    }
}

function doTask(creep) {
    var target;

    if (creep.memory.role == 'healer') {
        target = creep.pos.findClosestByRange(FIND_MY_CREEPS, { filter: (targets) => { return (targets.hits < targets.hitsMax); } });
        if (target) { doRole(creep, target); return; }
    }
    else {
        target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (target) { doRole(creep, target); return; }

        target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, { filter: (targets) => { return (targets.hits > 0); } });
        if (target) { doRole(creep, target); return; }
    }

    if (creep.memory.mode == 1 && creep.room.name != Memory.roomTarget) {
        goToRoom(creep, Memory.roomTarget);
        return;
    }
    // else if (creep.memory.mode == 2 && creep.room.name != Memory.raidTarget) {
    //     goToRoom(creep, Memory.raidTarget);
    //     return;
    // }

    target = creep.room.controller;
    if (target) {
        creep.moveTo(target, { visualizePathStyle: { stroke: '#ff0000' } });
        return;
    }

    target = creep.room.find(FIND_STRUCTURES, { filter: (structure) => { return structure.structureType == STRUCTURE_KEEPER_LAIR; } });
    target = target.sort((a, b) => a.ticksToSpawn - b.ticksToSpawn);
    if (target.length > 0) {
        creep.moveTo(target[0], { visualizePathStyle: { stroke: '#ff0000' } });
        return;
    }
}

module.exports = {

    /** @param {Creep} creep **/
    run: function (creep) { 
        doTask(creep);
    }
};
