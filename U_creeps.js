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
        else if(creep.memory.role == 'claimer') {
            r_claimer.run(creep);
        } 
        else if(creep.memory.role == 'defender') {
            r_defender.run(creep);
        } 
    }
}

var do_spawn = function(spawn, theRole, varience) {
    var name = theRole + varience + Game.time;
    var mem = {memory: {role: theRole, v: varience, spawn: spawn}};

    if (varience == 'v0') {
        if (theRole == 'harvester') {
            Game.spawns[spawn].spawnCreep([WORK, WORK, CARRY, MOVE], name, mem);
        }
        else if (theRole == 'builder') {
            Game.spawns[spawn].spawnCreep([WORK, WORK, CARRY, MOVE], name, mem);
        }
        else if (theRole == 'repairer') {
            Game.spawns[spawn].spawnCreep([WORK, MOVE, CARRY, MOVE], name, mem);
        }
        else if (theRole == 'runner') {
            Game.spawns[spawn].spawnCreep([CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], name, mem);
        } 
        else if (theRole == 'defender') {
            Game.spawns[spawn].spawnCreep([TOUGH, ATTACK, ATTACK, ATTACK, MOVE], name, mem);
        }
        else if (theRole == 'claimer') {
            Game.spawns[spawn].spawnCreep([CLAIM, MOVE], name, mem);
        } 
	}
    else if (varience == 'v1') {
        if (theRole == 'harvester') {
            Game.spawns[spawn].spawnCreep([WORK, MOVE, CARRY, MOVE], name, mem);
        }
        else if (theRole == 'defender') {
            Game.spawns[spawn].spawnCreep([ATTACK, MOVE, ATTACK, MOVE], name, mem);
        }
        else if (theRole == 'runner') {
            Game.spawns[spawn].spawnCreep([CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], name, mem);
        } 
    }
    else if (varience == 'v2') { 
        if (theRole == 'defender') {
            Game.spawns[spawn].spawnCreep([ATTACK, MOVE, ATTACK, MOVE], name, mem);
        }
        else if (theRole == 'runner') {
            Game.spawns[spawn].spawnCreep([CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], name, mem);
        } 
    }
}

var spawn_check = function(spawn, theRole, varience, n) {
    var creeps = _.filter(Game.creeps, (creep) => creep.memory.role == theRole && creep.memory.v == varience); 

    if (creeps.length < n) { 
        do_spawn(spawn, theRole, varience); 
        return true;
    }
    return false;
}

var auto_respawn = function(){
    var name;

    for (var spawn in Memory.spawns) { 
        Console.log(spawn);
        if (Game.spawns[spawn].store[RESOURCE_ENERGY] < 300 || Game.spawns[spawn].spawning) {return;}

        if (spawn_check(spawn, 'harvester', 'v0', 1)) {return;}
        else if (spawn_check(spawn, 'builder', 'v0', 1)) {return;}
        else if (spawn_check(spawn, 'repairer', 'v0', 1)) {return;}
        else if (spawn_check(spawn, 'runner', 'v0', 1)) {return;}

        else if (spawn_check(spawn, 'harvester', 'v0', 3)) {return;} 
        else if (spawn_check(spawn, 'builder', 'v0', 5)) {return;} 
        else if (spawn_check(spawn, 'repairer', 'v0', 1)) {return;} 
        else if (spawn_check(spawn, 'runner', 'v1', 1)) {return;}  
        else if (spawn_check(spawn, 'runner', 'v2', 1)) {return;}  
        else if (spawn_check(spawn, 'runner', 'v0', 3)) {return;}  

        else if (spawn_check(spawn, 'defender', 'v0', 1)) {return;}  

        else if (spawn_check(spawn, 'defender', 'v1', 1)) {return;} 
        else if (spawn_check(spawn, 'defender', 'v2', 1)) {return;} 
        else if (spawn_check(spawn, 'harvester', 'v1', 10)) {return;}  
        else if (Memory.spawnClaimer && spawn_check(spawn, 'claimer', 'v0', 1)) {return;}   
        else if (spawn_check(spawn, 'defender', 'v2', 1)) {return;}  
	}
}

module.exports = {
    run: function(){
        run_role();
        auto_respawn();
	}
}