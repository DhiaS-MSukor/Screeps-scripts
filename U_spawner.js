/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('U_spawner');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
  run: function(name, s_role){ 
      if (s_role == 'harvester') {
        Game.spawns['Boopy1'].spawnCreep([WORK, CARRY, MOVE], name, { memory: {role: s_role} });
	  }
      else if (s_role == 'builder') {
        Game.spawns['Boopy1'].spawnCreep([WORK, CARRY, MOVE], name, { memory: {role: s_role} });
	  }
  }
};