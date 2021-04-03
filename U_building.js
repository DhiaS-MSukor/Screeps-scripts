var b_tower = require('B_tower');
var b_spawn = require('B_spawn');
var b_terminal = require('B_terminal');

module.exports = {
    run: function () {
        for (var element in Game.structures) {
            var structure = Game.structures[element];
            switch (structure.structureType) {
                case STRUCTURE_TOWER:
                    b_tower.fx(Game.getObjectById(element));
                    break;

                case STRUCTURE_SPAWN:
                    b_spawn.fx(Game.getObjectById(element).name);
                    break;
                case STRUCTURE_TERMINAL:
                    b_terminal.fx(Game.getObjectById(element));
                    break;
                default:
                    break;
            }
        }
    }
}