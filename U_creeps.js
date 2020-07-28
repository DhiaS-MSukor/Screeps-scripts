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

var do_spawn = function(spawn, theRole, varience) {
    var name = theRole + varience + Game.time;
    var mem = {memory: {role: theRole, v: varience, spawn: spawn}};
    var res;

    if (varience == 'v0') {
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
            res = Game.spawns[spawn].spawnCreep([TOUGH, ATTACK, ATTACK, ATTACK, MOVE], name, mem);
        }
        else if (theRole == 'claimer') {
            res = Game.spawns[spawn].spawnCreep([CLAIM, MOVE], name, mem);
        } 
	}
    else if (varience == 'v1') {
        if (theRole == 'harvester') {
            res = Game.spawns[spawn].spawnCreep([WORK, MOVE, CARRY, MOVE], name, mem);
        }
        else if (theRole == 'builder') {
            res = Game.spawns[spawn].spawnCreep([WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE], name, mem);
        }
        else if (theRole == 'defender') {
            res = Game.spawns[spawn].spawnCreep([ATTACK, MOVE, ATTACK, MOVE], name, mem);
        }
        else if (theRole == 'runner') {
            res = Game.spawns[spawn].spawnCreep([CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], name, mem);
        } 
    }
    else if (varience == 'v2') { 
        if (theRole == 'defender') {
            res = Game.spawns[spawn].spawnCreep([ATTACK, MOVE, ATTACK, MOVE], name, mem);
        }
        else if (theRole == 'runner') {
            res = Game.spawns[spawn].spawnCreep([CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], name, mem);
        } 
        else if (theRole == 'harvester') {
            res = Game.spawns[spawn].spawnCreep([WORK, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, MOVE], name, mem);
        }
    }

    return res == OK;
}

var spawn_check = function(spawn, theRole, varience, n) {
    var creeps = _.filter(Game.creeps, (creep) => creep.memory.role == theRole && creep.memory.v == varience && creep.memory.spawn == spawn); 

    if (creeps.length < n) {  
        return do_spawn(spawn, theRole, varience);
    }
    return false;
}

var spawnBusy = function (spawn) {
    if (Game.spawns[spawn].spawning) {return true;}
    return (Game.spawns[spawn].store[RESOURCE_ENERGY] < 300);
}

var auto_respawn = function(){
    var name;

    for (var spawn in Memory.spawns) {  
        if (spawnBusy(spawn)) {continue;}

        // essentials
        if (spawn_check(spawn, 'harvester', 'v0', 1)) {return;}
        else if (spawn_check(spawn, 'builder', 'v0', 1)) {return;}
        else if (spawn_check(spawn, 'repairer', 'v0', 1)) {return;}
        else if (spawn_check(spawn, 'runner', 'v0', 1)) {return;}

        // additions
        else if (spawn_check(spawn, 'runner', 'v1', 1)) {return;}  
        else if (spawn_check(spawn, 'runner', 'v2', 1)) {return;}  
        else if (spawn_check(spawn, 'defender', 'v0', 1)) {return;}  

        // looters
        else if (spawn_check(spawn, 'harvester', 'v1', 1)) {return;} 
        else if (spawn_check(spawn, 'defender', 'v1', 1)) {return;} 

        // raiders
        else if (spawn_check(spawn, 'defender', 'v2', 1)) {return;} 
        
        // megas
        else if (spawn_check(spawn, 'builder', 'v1', 1)) {return;}   
        else if (spawn_check(spawn, 'harvester', 'v2', 1)) {return;} 

        // claimer
        else if (Memory.spawnClaimer && spawn_check(spawn, 'claimer', 'v0', 1)) {return;}  
	}
}

module.exports = {
    run: function(){
        run_role();
        auto_respawn();
	}
}