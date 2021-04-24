function getMul(spawn, baseCost, baseCount) {
    const i = Math.floor(Game.spawns[spawn].room.energyAvailable / baseCost)
    return Math.min(Math.floor(50 / baseCount), i)
}

var do_spawn = function (spawn, theRole, mode) {
    const name = theRole + (Math.floor(Game.time / 7) % 1000);
    const mem = { memory: { role: theRole, spawn: spawn, mode: mode, task: 0 } };
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
    else if (theRole == 'harvester') {
        const w = getMul(spawn, 50, 1)
        const c = Math.ceil(w * HARVEST_POWER / CARRY_CAPACITY)
        const body = new Array(w).fill(WORK, 0, w - c).fill(CARRY, w - c, c).concat([MOVE]);
        res = Game.spawns[spawn].spawnCreep(body, name, mem);
    }
    else if (theRole == 'troll') {
        const base = BODYPART_COST[MOVE] + BODYPART_COST[HEAL] + BODYPART_COST[ATTACK]
        const mul = getMul(spawn, base, 2)
        const body = new Array(mul * 3).fill(MOVE, 0, mul).fill(ATTACK, mul, mul + mul).fill(HEAL, mul + mul);
        res = Game.spawns[spawn].spawnCreep(body, name, mem);
    }

    return res == OK;
}

function spawn_check(spawn, theRole, mode, n) {
    var creeps = _.filter(Game.creeps, (creep) => {
        return creep.memory.role == theRole && creep.memory.mode == mode && creep.memory.spawn == spawn;
    });

    return creeps.length < n && do_spawn(spawn, theRole, mode);
}

var auto_respawn = function (spawn) {
    if (Game.spawns[spawn].room.energyAvailable < 100) { return; }
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