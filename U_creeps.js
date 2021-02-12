// JavaScript source code
var r_harvester = require('R_harvester');
var r_builder = require('R_builder');
var r_repairer = require('R_repairer');
var r_runner = require('R_runner');
var r_claimer = require('R_claimer');
var r_defender = require('R_defender');

var run_role = function () {
    var creep;
    for (var name in Game.creeps) {
        creep = Game.creeps[name];

        if (creep.memory.role == 'harvester') {
            r_harvester.run(creep);
        }
        else if (creep.memory.role == 'builder') {
            r_builder.run(creep);
        }
        else if (creep.memory.role == 'repairer') {
            r_repairer.run(creep);
        }
        else if (creep.memory.role == 'runner') {
            r_runner.run(creep);
        }
        else if (['defender', 'healer', 'ranger', 'troll'].includes(creep.memory.role)) {
            r_defender.run(creep);
        }
        else if (creep.memory.role == 'claimer') {
            r_claimer.run(creep);
        }
    }
}

module.exports = {
    run: function () {
        run_role(); 
    }
}