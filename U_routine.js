// JavaScript source code

var r_harvester = require('R_harvester');
var r_builder = require('R_builder');
var u_spawner = require('U_spawner');

var creeps = ['H1',
              'B1','B2','B3','B4','B5','B6','B7','B8','B9','B10'];

module.exports = {
  run: function() {
  	  for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            r_harvester.run(creep);
        }
        else if(creep.memory.role == 'builder') {
            r_builder.run(creep);
        }
      }

      for (var name in creeps){
        if (!creeps.includes(name)) {
            if (name.startsWith('H')){
                u_spawner.run(name, 'harvester');
			}
            else if (name.startsWith('B')){
                u_spawner.run(name, 'builder');
			}
		}
	  }
  }
};