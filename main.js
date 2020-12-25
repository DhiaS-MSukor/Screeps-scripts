var u_creeps = require('Utility/U_creeps');
var u_misc = require('Utility/U_misc');
var b_tower = require('Building/B_tower');

module.exports.loop = function () { 
	u_misc.run();
    u_creeps.run();
    b_tower.run(); 
} 