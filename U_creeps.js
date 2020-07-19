// JavaScript source code
var r_harvester = require('R_harvester');
var r_builder = require('R_builder');
var r_repairer = require('R_repairer');
var r_runner = require('R_runner'); 
var r_claimer = require('R_claimer'); 
var r_harvesterV2 = require('R_harvesterV2'); 
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
        else if(creep.memory.role == 'harvesterV2') {
            r_harvesterV2.run(creep);
        } 
        else if(creep.memory.role == 'defender') {
            r_defender.run(creep);
        }
    }
}

var do_spawn = function(spawn, theRole) {
    if (theRole == 'harvester') {
        Game.spawns[spawn].spawnCreep([WORK, WORK, CARRY, MOVE], theRole + Game.time, {memory: {role: theRole}});
	}
    else if (theRole == 'builder') {
        Game.spawns[spawn].spawnCreep([WORK, WORK, CARRY, MOVE], theRole + Game.time, {memory: {role: theRole}});
	}
    else if (theRole == 'repairer') {
        Game.spawns[spawn].spawnCreep([WORK, CARRY, MOVE, MOVE, MOVE], theRole + Game.time, {memory: {role: theRole}});
	}
    else if (theRole == 'runner') {
        Game.spawns[spawn].spawnCreep([CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], theRole + Game.time, {memory: {role: theRole}});
	}
    else if (theRole == 'harvesterV2') {
        Game.spawns[spawn].spawnCreep([WORK, CARRY, MOVE, MOVE, MOVE], theRole + Game.time, {memory: {role: theRole}});
	}
    else if (theRole == 'defender') {
        Game.spawns[spawn].spawnCreep([ATTACK, ATTACK, MOVE, MOVE, TOUGH, TOUGH, TOUGH, TOUGH], theRole + Game.time, {memory: {role: theRole}});
	}
    else if (theRole == 'claimer') {
        Game.spawns[spawn].spawnCreep([CLAIM, MOVE], theRole + Game.time, {memory: {role: theRole}});
	}
}

var spawn_check = function(spawn, theRole, n) {
    var creeps = _.filter(Game.creeps, (creep) => creep.memory.role == theRole); 

    if (creeps.length < n) { 
        do_spawn(spawn, theRole); 
        return true;
    }
    return false;
}

var auto_respawn = function(){
    var name;
    var spawn = Memory.mainSpawn;

    if (spawn_check(spawn, 'harvester', 1)) {return;}
    else if (spawn_check(spawn, 'builder', 1)) {return;}
    else if (spawn_check(spawn, 'repairer', 1)) {return;}
    else if (spawn_check(spawn, 'runner', 1)) {return;}

    else if (spawn_check(spawn, 'harvester', 3)) {return;} 
    else if (spawn_check(spawn, 'builder', 3)) {return;} 
    else if (spawn_check(spawn, 'repairer', 1)) {return;} 
    else if (spawn_check(spawn, 'runner', 2)) {return;}  

    else if (spawn_check(spawn, 'defender', 1)) {return;}  
    else if (spawn_check(spawn, 'harvesterV2', 20)) {return;}  
    else if (spawn_check(spawn, 'claimer', 1)) {return;}   
}

module.exports = {
    run: function(){
        run_role();
        auto_respawn();
	}
}