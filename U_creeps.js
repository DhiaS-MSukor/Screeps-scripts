// JavaScript source code
var r_harvester = require('R_harvester');
var r_builder = require('R_builder');
var r_repairer = require('R_repairer');

var creeps = ['H1','H2','H3',
              'B1','B2','B3','B4','B5','B6','B7','B8','B9','B10',
              'R1', 'R2', 'R3'];

var run_role = function(){
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            r_harvester.run(creep);
        }
        else if(creep.memory.role == 'builder') {
            r_builder.run(creep);
        }
        else if(creep.memory.role == 'repairer') {
            r_repairer.run(creep);
        }
    }
}

var auto_respawn = function(){
    for (var i in creeps){
        var name = creeps[i]; 

        if (!(name in Game.creeps)) {
            if (name.startsWith('H')){
                Game.spawns['Boopy1'].spawnCreep([WORK, CARRY, CARRY, MOVE], 
                name, { memory: {role: 'harvester'} });
			}
            else if (name.startsWith('B')){
                Game.spawns['Boopy1'].spawnCreep([WORK, WORK, CARRY, MOVE], 
                name, { memory: {role: 'builder'} });
			}
            else if (name.startsWith('R')){
                Game.spawns['Boopy1'].spawnCreep([WORK, CARRY, MOVE, MOVE], 
                name, { memory: {role: 'repairer'} });
			}
		}
	}
}

module.exports = {
    run: function(){
        run_role();
        auto_respawn();
	}
}