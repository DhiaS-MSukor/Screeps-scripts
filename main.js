var u_creeps = require('U_creeps');
var u_misc = require('U_misc');
var b_tower = require('B_tower');

module.exports.loop = function () { 
	u_misc.run();
    u_creeps.run();
    b_tower.run();
} 