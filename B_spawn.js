function getMul(spawn, baseCost, baseCount) {
    const i = Math.floor(Game.spawns[spawn].room.energyAvailable / baseCost)
    return Math.min(Math.floor(50 / baseCount), i)
}

var do_spawn = function (spawn, theRole, varience, mode) {
    const name = theRole + (Math.floor(Game.time / 7) % 1000);
    const mem = { memory: { role: theRole, v: varience, spawn: spawn, mode: mode, task: 0 } };
    var res = -2;

    if (theRole == 'repairer') {
        res = Game.spawns[spawn].spawnCreep([WORK, MOVE, CARRY, MOVE], name, mem);
    }
    else if (theRole == 'runner') {
        const base = BODYPART_COST[MOVE] + BODYPART_COST[CARRY]
        const mul = getMul(spawn, base, 2)
        const body = new Array(mul * 2).fill(CARRY, 0, mul).fill(MOVE, mul);
        res = Game.spawns[spawn].spawnCreep(body, name, mem);
    }
    else if (theRole == 'builder') {
        const base = BODYPART_COST[MOVE] * 2 + BODYPART_COST[CARRY] + BODYPART_COST[WORK]
        const mul = getMul(spawn, base, 4)
        const body = new Array(mul * 4).fill(CARRY, 0, mul).fill(WORK, mul, mul * 2).fill(MOVE, mul * 2);
        res = Game.spawns[spawn].spawnCreep(body, name, mem);
    }
    else if (theRole == 'defender') {
        const base = BODYPART_COST[MOVE] + BODYPART_COST[ATTACK]
        const mul = getMul(spawn, base, 2)
        const body = new Array(mul * 2).fill(MOVE, 0, mul).fill(ATTACK, mul);
        res = Game.spawns[spawn].spawnCreep(body, name, mem);
    }
    else if (theRole == 'healer') {
        const base = BODYPART_COST[MOVE] + BODYPART_COST[HEAL]
        const mul = getMul(spawn, base, 2)
        const body = new Array(mul * 2).fill(MOVE, 0, mul).fill(HEAL, mul);
        res = Game.spawns[spawn].spawnCreep(body, name, mem);
    }
    else if (theRole == 'ranger') {
        const base = BODYPART_COST[MOVE] + BODYPART_COST[RANGED_ATTACK]
        const mul = getMul(spawn, base, 2)
        const body = new Array(mul * 2).fill(MOVE, 0, mul).fill(RANGED_ATTACK, mul);
        res = Game.spawns[spawn].spawnCreep(body, name, mem);
    }
    else if (theRole == 'claimer') {
        const base = BODYPART_COST[MOVE] + BODYPART_COST[CLAIM]
        const mul = getMul(spawn, base, 2)
        const body = new Array(mul * 2).fill(MOVE, 0, mul).fill(CLAIM, mul);
        res = Game.spawns[spawn].spawnCreep(body, name, mem);
    }

    if (varience == 'v0') { // 300 energy
        if (theRole == 'harvester') {
            res = Game.spawns[spawn].spawnCreep([WORK, WORK, CARRY, MOVE], name, mem);
        }
    }
    else if (varience == 'v1') { // 550 energy
        if (theRole == 'harvester') {
            res = Game.spawns[spawn].spawnCreep([WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE], name, mem);
        }
        else if (theRole == 'troll') {
            res = Game.spawns[spawn].spawnCreep([TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, ATTACK, HEAL], name, mem);
        }
    }
    else if (varience == 'v2') { // 800 energy 
        if (theRole == 'harvester') {
            res = Game.spawns[spawn].spawnCreep(new Array(7).fill(WORK).concat([CARRY, MOVE]), name, mem);
        }
        else if (theRole == 'troll') {
            res = Game.spawns[spawn].spawnCreep([TOUGH, MOVE, MOVE, MOVE, MOVE, ATTACK, HEAL, HEAL], name, mem);
        }
    }
    else if (varience == 'v3') { // 1300 energy
        if (theRole == 'harvester') {
            res = Game.spawns[spawn].spawnCreep(new Array(12).fill(WORK).concat([CARRY, MOVE]), name, mem);
        }
        else if (theRole == 'troll') {
            res = Game.spawns[spawn].spawnCreep(
                [TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, HEAL, HEAL, HEAL]
                , name, mem);
        }
    }
    else if (varience == 'v4') { // 1800 energy
        if (theRole == 'harvester') {
            res = Game.spawns[spawn].spawnCreep(new Array(17).fill(WORK).concat([CARRY, MOVE]), name, mem);
        }
        else if (theRole == 'troll') {
            res = Game.spawns[spawn].spawnCreep(
                [TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL]
                , name, mem);
        }
    }
    else if (varience == 'v5') { // 2300 energy
        if (theRole == 'harvester') {
            res = Game.spawns[spawn].spawnCreep(new Array(22).fill(WORK).concat([CARRY, MOVE]), name, mem);
        }
        else if (theRole == 'troll') {
            res = Game.spawns[spawn].spawnCreep(
                [TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL]
                , name, mem);
        }
    }
    else if (varience == 'v6') { // 5300 energy
        if (theRole == 'harvester') {
            res = Game.spawns[spawn].spawnCreep(new Array(47).fill(WORK).concat([CARRY, CARRY, MOVE]), name, mem);
        }
        else if (theRole == 'troll') {
            res = Game.spawns[spawn].spawnCreep(
                [TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                    ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL]
                , name, mem);
        }
    }
    else if (varience == 'v7') { // 12300 energy 
        if (theRole == 'troll') {
            res = Game.spawns[spawn].spawnCreep(
                [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                    MOVE, MOVE, MOVE, MOVE, ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL]
                , name, mem);
        }
    }

    return res == OK;
}

function spawn_check(spawn, theRole, mode, n) {
    var creeps = _.filter(Game.creeps, (creep) => creep.memory.role == theRole && creep.memory.mode == mode && creep.memory.spawn == spawn);

    if (creeps.length < n) {
        if (do_spawn(spawn, theRole, 'v7', mode)) { return true; }
        else if (do_spawn(spawn, theRole, 'v6', mode)) { return true; }
        else if (do_spawn(spawn, theRole, 'v5', mode)) { return true; }
        else if (do_spawn(spawn, theRole, 'v4', mode)) { return true; }
        else if (do_spawn(spawn, theRole, 'v3', mode)) { return true; }
        else if (do_spawn(spawn, theRole, 'v2', mode)) { return true; }
        else if (do_spawn(spawn, theRole, 'v1', mode)) { return true; }
        else if (do_spawn(spawn, theRole, 'v0', mode)) { return true; }
    }
    return false;
}

var auto_respawn = function (spawn) {

    // first spawn
    // essentials
    if (spawn_check(spawn, 'harvester', 0, 1)) { return; }
    else if (spawn_check(spawn, 'builder', 0, 1)) { return; }
    else if (spawn_check(spawn, 'runner', 0, 1)) { return; }
    else if (spawn_check(spawn, 'repairer', 0, 1)) { return; }

    // spawn to num
    // essentials
    else if (spawn_check(spawn, 'harvester', 0, Game.spawns[spawn].room.find(FIND_SOURCES).length)) { return; }
    else if (spawn_check(spawn, 'harvester', 1, Game.spawns[spawn].room.find(FIND_MY_STRUCTURES, {
        filter: {
            structureType: STRUCTURE_EXTRACTOR
        }
    }).length)) { return; }
    else if (spawn_check(spawn, 'builder', 0, Memory.spawns[spawn].builder)) { return; }
    else if (spawn_check(spawn, 'runner', 0, Memory.spawns[spawn].runner)) { return; }
    //else if (spawn_check(spawn, 'repairer', 0, 1)) {return;}

    // local healer and defender
    else if (spawn_check(spawn, 'ranger', 0, 1)) { return; }
    //else if (spawn_check(spawn, 'healer', 0, 1)) {return;}  
    // else if (spawn_check(spawn, 'defender', 0, 1)) {return;}    

    // looters 
    //else if (spawn_check(spawn, 'harvester', 1, 1)) { return; }
    // else if (spawn_check(spawn, 'defender', 1, 1)) {return;} 

    // claimer
    else if (Memory.roomTarget != 'false'
        && !Game.rooms[Memory.roomTarget].controller.my
        && spawn_check(spawn, 'claimer', 0, 1)) { return; }
    else if (Memory.roomTarget != 'false' && spawn_check(spawn, 'ranger', 1, 1)) { return; }
    else if (Memory.roomTarget != 'false' && spawn_check(spawn, 'builder', 1, 3)) { return; }

    // raiders
    else if (Memory.raidTarget != 'false' && spawn_check(spawn, 'defender', 2, 1)) { return; }
    else if (Memory.raidTarget != 'false' && spawn_check(spawn, 'troll', 2, 1)) { return; }
}

module.exports = {
    run: function () {
        for (var spawn in Memory.spawns) {
            auto_respawn(spawn);
        }
    },
    fx: function (spawn) {
        auto_respawn(spawn);
    }
}