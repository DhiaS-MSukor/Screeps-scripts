// JavaScript source code
var r_harvester = require('R_harvester');
var r_builder = require('R_builder');
var r_repairer = require('R_repairer');
var r_runner = require('R_runner'); 
var r_claimer = require('R_claimer');  
var r_defender = require('R_defender'); 

var run_role = function(){
    var creep;

    for(var name in Game.creeps) {
        creep = Game.creeps[name];

        if(creep.memory.role == 'harvester') {
            r_harvester.run(creep);
        }
        else if(creep.memory.role == 'builder') {
            r_builder.run(creep);
        }
        else if(creep.memory.role == 'repairer') {
            r_repairer.run(creep);
        }
        else if(creep.memory.role == 'runner') {
            r_runner.run(creep);
        }
        else if(creep.memory.role == 'defender') {
            r_defender.run(creep);
        } 
        else if(creep.memory.role == 'claimer') {
            r_claimer.run(creep);
        } 
    }
}

var do_spawn = function(spawn, theRole, varience, mode) {
    var name = theRole + varience + Game.time;
    var mem = {memory: {role: theRole, v: varience, spawn: spawn, mode: mode}};
    var res;

    if (varience == 'v0') { // 300 energy
        if (theRole == 'harvester') {
            res = Game.spawns[spawn].spawnCreep([WORK, WORK, CARRY, MOVE], name, mem);
        }
        else if (theRole == 'builder') {
            res = Game.spawns[spawn].spawnCreep([WORK, WORK, CARRY, MOVE], name, mem);
        }
        else if (theRole == 'repairer') {
            res = Game.spawns[spawn].spawnCreep([WORK, MOVE, CARRY, MOVE], name, mem);
        }
        else if (theRole == 'runner') {
            res = Game.spawns[spawn].spawnCreep([CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], name, mem);
        } 
        else if (theRole == 'defender') {
            res = Game.spawns[spawn].spawnCreep(new Array(4).fill(TOUGH).concat([ATTACK, MOVE, ATTACK, MOVE]), name, mem);
        }
        else if (theRole == 'claimer') {
            res = Game.spawns[spawn].spawnCreep([CLAIM, MOVE], name, mem);
        } 
	}
    else if (varience == 'v1') { // 550 energy
        if (theRole == 'harvester') {
            res = Game.spawns[spawn].spawnCreep([WORK, WORK, WORK, WORK, CARRY, MOVE], name, mem);
        }
        else if (theRole == 'builder') {
            res = Game.spawns[spawn].spawnCreep([WORK, WORK, WORK, WORK, CARRY, MOVE], name, mem);
        }
        else if (theRole == 'defender') {
            res = Game.spawns[spawn].spawnCreep([TOUGH, MOVE, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE], name, mem);
        }
        else if (theRole == 'runner') {
            res = Game.spawns[spawn].spawnCreep(new Array(10).fill(CARRY,0,5).fill(MOVE,5), name, mem);
        } 
    }
    else if (varience == 'v2') { // 800 energy
        if (theRole == 'defender') {
            res = Game.spawns[spawn].spawnCreep([TOUGH, TOUGH, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE, ATTACK, MOVE], name, mem);
        }
        else if (theRole == 'runner') {
            res = Game.spawns[spawn].spawnCreep(new Array(16).fill(CARRY,0,8).fill(MOVE,8), name, mem);
        } 
        else if (theRole == 'harvester') {
            res = Game.spawns[spawn].spawnCreep(new Array(7).fill(WORK).concat([CARRY, MOVE]), name, mem);
        }
    }
    else if (varience == 'v3') { // 1300 energy
        if (theRole == 'runner') {
            res = Game.spawns[spawn].spawnCreep(new Array(26).fill(CARRY,0,13).fill(MOVE,13), name, mem);
        }
	}
    else if (varience == 'v4') { // 1800 energy
        if (theRole == 'runner') {
            res = Game.spawns[spawn].spawnCreep(new Array(36).fill(CARRY,0,18).fill(MOVE,18), name, mem);
        }
	}
    else if (varience == 'v5') { // 2300 energy
        if (theRole == 'runner') {
            res = Game.spawns[spawn].spawnCreep(new Array(46).fill(CARRY,0,23).fill(MOVE,23), name, mem);
        }
	}
    else if (varience == 'v6') { // 5300 energy
        if (theRole == 'runner') {
            res = Game.spawns[spawn].spawnCreep(new Array(50).fill(CARRY,0,25).fill(MOVE,25), name, mem);
        }
	}
    else if (varience == 'v7') { // 12300 energy 
        return;
	}

    return res == OK;
}

var spawn_check = function(spawn, theRole, varience, mode, n) {
    var creeps = _.filter(Game.creeps, (creep) => creep.memory.role == theRole && creep.memory.v == varience && creep.memory.spawn == spawn); 

    if (creeps.length < n) {  
        return do_spawn(spawn, theRole, varience, mode);
    }
    return false;
}

var spawnBusy = function (spawn) {
    if (Game.spawns[spawn].spawning) {return true;}
    return (Game.spawns[spawn].room.energyAvailable < 300);
}

var auto_respawn = function(){
    var name;

    for (var spawn in Memory.spawns) {  
        if (spawnBusy(spawn)) {continue;}

        // essentials
        if (spawn_check(spawn, 'harvester', 'v0', 0, 1)) {return;}
        else if (spawn_check(spawn, 'builder', 'v0', 0, 1)) {return;}
        else if (spawn_check(spawn, 'repairer', 'v0', 0, 1)) {return;}
        else if (spawn_check(spawn, 'runner', 'v0', 0, 1)) {return;}
        else if (spawn_check(spawn, 'defender', 'v0', 0, 1)) {return;}  

        // looters
        else if (spawn_check(spawn, 'harvester', 'v0', 1, 1)) {return;} 
        else if (spawn_check(spawn, 'defender', 'v0', 1, 2)) {return;} 

        // raiders
        else if (spawn_check(spawn, 'defender', 'v0', 2, 3)) {return;} 
        
        // megas 
        else if (spawn_check(spawn, 'runner', 'v1', 0, 1)) {return;} 
        else if (spawn_check(spawn, 'builder', 'v1', 0, 1)) {return;}   
        else if (spawn_check(spawn, 'harvester', 'v1', 0, 1)) {return;} 
        else if (spawn_check(spawn, 'defender', 'v1', 0, 1)) {return;} 

        // claimer
        else if (Memory.spawnClaimer && spawn_check(spawn, 'claimer', 'v0', 0, 1)) {return;}  

        // megas v2 
        else if (spawn_check(spawn, 'runner', 'v2', 0, 1)) {return;}   
        else if (spawn_check(spawn, 'harvester', 'v2', 0, 1)) {return;} 
        else if (spawn_check(spawn, 'defender', 'v2', 0, 1)) {return;} 

        // megas v3
        else if (spawn_check(spawn, 'runner', 'v3', 0, 1)) {return;}  

        // megas v4
        else if (spawn_check(spawn, 'runner', 'v4', 0, 1)) {return;}  

        // megas v5
        else if (spawn_check(spawn, 'runner', 'v5', 0, 1)) {return;}  

        // megas v6
        else if (spawn_check(spawn, 'runner', 'v6', 0, 1)) {return;}  
	}
}

module.exports = {
    run: function(){
        run_role();
        auto_respawn();
	}
}