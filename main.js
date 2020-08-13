var u_creeps = require('U_creeps');
var u_misc = require('U_misc');
var b_tower = require('B_tower');
var f_helper = require('F_helper');

module.exports.loop = function () {
	u_misc.run();
    u_creeps.run();
    b_tower.run();
    f_helper.a();
    f_helper.b();
} 