var u_creeps = require('U_creeps');
var u_misc = require('U_misc');

module.exports.loop = function () {
	u_misc.run();
    u_creeps.run();
}