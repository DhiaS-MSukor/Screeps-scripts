var b_tower = require('B_tower');
var b_spawn = require('B_spawn');

module.exports = {
    run: function () {
        b_tower.run();
        b_spawn.run();
    }
}