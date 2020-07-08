var r_harvester = require('R_harvester');
var r_builder = require('R_builder');
var r_repairer = require('R_repairer');

var creeps = ['H1','H2','H3',
              'B1','B2','B3','B4','B5',
              'R1'];

var clean_mem = function(){
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
}

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
                Game.spawns['Boopy1'].spawnCreep([WORK, CARRY, CARRY, MOVE], 
                name, { memory: {role: 'repairer'} });
			}
		}
	}
}

var gen_pixel = function(){
    if(Game.cpu.bucket > 9000) {
        Game.cpu.generatePixel();
    }
}

module.exports.loop = function () {
	clean_mem();
    run_role();
  	auto_respawn();
    gen_pixel();
}