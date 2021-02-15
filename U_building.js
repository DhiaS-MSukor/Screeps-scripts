var b_tower = require('B_tower');
var b_spawn = require('B_spawn');

module.exports = {
    run: function () {
        for (var structure in Game.structures){
            switch (element.structureType) {
                case STRUCTURE_TOWER:
                    b_tower.fx(element)
                    break;
            
                default:
                    break;
            }
        }
        b_tower.run();
        b_spawn.run();
    }
}