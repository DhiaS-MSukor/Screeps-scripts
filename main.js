var r_harvester = require('R_harvester');
var r_builder = require('R_builder');
var r_repairer = require('R_repairer');
var u_creeps = require('U_creeps');
var u_misc = require('U_misc');

module.exports.loop = function () {
	u_misc.run();
    u_creeps.run();
}