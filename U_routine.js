// JavaScript source code

var r_harvester = require('R_harvester');
var r_builder = require('R_builder');
var u_spawner = require('U_spawner');

var creeps = ['H1',
              'B1','B2','B3','B4','B5','B6','B7','B8','B9','B10'];

module.exports = {
  run: function() {
      for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
      }

  	  for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            r_harvester.run(creep);
        }
        else if(creep.memory.role == 'builder') {
            r_builder.run(creep);
        }
      }

      for (var i in creeps){
        var name = creeps[i];
      console.log(name);
        if (!(name in Game.creeps)) {
            if (name.startsWith('H')){
                Game.spawns['Boopy1'].spawnCreep([WORK, CARRY, MOVE], name, { memory: {role: 'harvester'} });
			}
            else if (name.startsWith('B')){
                Game.spawns['Boopy1'].spawnCreep([WORK, CARRY, MOVE], name, { memory: {role: 'builder'} });
			}
		}
	  }

      if(Game.cpu.bucket > 9000) {
        Game.cpu.generatePixel();
      }
  }
};