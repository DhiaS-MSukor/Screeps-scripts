var r_harvester = require('R_harvester');
var r_builder = require('R_builder');

var spawns = 'Boopy1';

module.exports.loop = function () {

    //for(var name in Game.rooms) {
    //    console.log('Room "'+name+'" has '+Game.rooms[name].energyAvailable+' energy');
    //}

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