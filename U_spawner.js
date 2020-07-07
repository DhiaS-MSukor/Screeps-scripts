/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('U_spawner');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
  
};

Game.spawns['Boopy1'].spawnCreep([WORK, CARRY, MOVE], 'H1', { memory: {role: 'harvester'} });
Game.spawns['Boopy1'].spawnCreep([WORK, CARRY, MOVE], 'B1', { memory: {role: 'builder'} });
Game.spawns['Boopy1'].spawnCreep([WORK, CARRY, MOVE], 'B2', { memory: {role: 'builder'} });
Game.spawns['Boopy1'].spawnCreep([WORK, CARRY, MOVE], 'B3', { memory: {role: 'builder'} });