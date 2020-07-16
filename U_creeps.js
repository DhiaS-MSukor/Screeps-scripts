// JavaScript source code
var r_harvester = require('R_harvester');
var r_builder = require('R_builder');
var r_repairer = require('R_repairer');
var r_runner = require('R_runner'); 

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
    if (harvester.length < 4) {
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
}

module.exports = {
    run: function(){
        run_role();
        auto_respawn();
	}
}