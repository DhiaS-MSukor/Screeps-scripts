// JavaScript source code

var r_harvester = require('R_harvester');
var r_builder = require('R_builder');

module.exports = {
  run: function() {
  	  for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            r_harvester.run(creep);
        }
        if(creep.memory.role == 'builder') {
            r_builder.run(creep);
        }
    }
  }
};