var u_creeps = require('U_creeps');
var u_misc = require('U_misc');
var u_building = require('U_building');

module.exports.loop = function () {
    try {
        u_misc.run();
        u_creeps.run();
        u_building.run();
    } catch (e) { }
} 