// JavaScript source code
var r_harvester = require('R_harvester');
var r_builder = require('R_builder');
var r_repairer = require('R_repairer');
var r_runner = require('R_runner');

// ordered low to high priority
var creeps = ['H1', 
              'B1', 
              'r1',
              'R1', 
              'H2', 'H3', 
              'B2', 'B3', 
              'r2', 'r3', 
              //'R2', 'R3', 
              'B4', 'B5', 
              'B6', 
              'H4', 'H5', 
              ];// 5H 6B 3R 3r

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

var auto_respawn = function(){
    var name;

    for (var i in creeps){
        name = creeps[i]; 

        if (!(name in Game.creeps)) {
            if (name.startsWith('H')){
                Game.spawns['Boopy1'].spawnCreep([WORK, WORK, CARRY, MOVE], 
                name, { memory: {role: 'harvester'} });
			}
            else if (name.startsWith('B')){
                Game.spawns['Boopy1'].spawnCreep([WORK, WORK, CARRY, MOVE], 
                name, { memory: {role: 'builder'} });
			}
            else if (name.startsWith('R')){
                Game.spawns['Boopy1'].spawnCreep([WORK, CARRY, MOVE, MOVE, MOVE], 
                name, { memory: {role: 'repairer'} });
			}
            else if (name.startsWith('r')){
                Game.spawns['Boopy1'].spawnCreep([CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], 
                name, { memory: {role: 'runner'} });
			}

            break;
		}
	}
}

module.exports = {
    run: function(){
        run_role();
        auto_respawn();
	}
}