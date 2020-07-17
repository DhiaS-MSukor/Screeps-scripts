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
    else if (theRole == 'claimer') {
        Game.spawns[spawn].spawnCreep([CLAIM, MOVE], theRole + Game.time, {memory: {role: theRole}});
	}
    else if (theRole == 'harvesterV2') {
        Game.spawns[spawn].spawnCreep([WORK, CARRY, MOVE, MOVE, MOVE], theRole + Game.time, {memory: {role: theRole}});
	}
    else if (theRole == 'defender') {
        Game.spawns[spawn].spawnCreep([ATTACK, ATTACK, MOVE, MOVE], theRole + Game.time, {memory: {role: theRole}});
	}
}

var auto_respawn = function(){
    var name;

    var harvester = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester'); 

    if (!harvester.length) { 
        do_spawn('Boopy1', 'harvester'); 
        return;
    }

    var builder = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder'); 

    if (!builder.length) {
        do_spawn('Boopy1', 'builder'); 
        return;
    }

    var repairer = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer'); 

    if (!repairer.length) {
        do_spawn('Boopy1', 'repairer'); 
        return;
    }

    var runner = _.filter(Game.creeps, (creep) => creep.memory.role == 'runner'); 

    if (!runner.length) {
        do_spawn('Boopy1', 'runner'); 
        return;
    } 

    //============
    if (harvester.length < 3) {
        do_spawn('Boopy1', 'harvester'); 
        return;
    }
    if (builder.length < 3) {
        do_spawn('Boopy1', 'builder'); 
        return;
    }
    if (repairer.length < 1) {
        do_spawn('Boopy1', 'repairer'); 
        return;
    }
    if (runner.length < 2) {
        do_spawn('Boopy1', 'runner'); 
        return;
    } 

    //==========
    var defender = _.filter(Game.creeps, (creep) => creep.memory.role == 'defender'); 
    if (harvesterV2.length < 1) {
        do_spawn('Boopy1', 'defender'); 
        return;
    } 

    var harvesterV2 = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvesterV2'); 
    if (harvesterV2.length < 5) {
        do_spawn('Boopy1', 'harvesterV2'); 
        return;
    } 

    var claimer = _.filter(Game.creeps, (creep) => creep.memory.role == 'claimer'); 
    if (!claimer.length) {
        do_spawn('Boopy1', 'claimer'); 
        return;
    } 
}

module.exports = {
    run: function(){
        run_role();
        auto_respawn();
	}
}