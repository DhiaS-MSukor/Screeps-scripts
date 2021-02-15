var b_tower = require('B_tower');
var b_spawn = require('B_spawn');

module.exports = {
    run: function () {
        for (var structure in Game.structures){
            switch (structure.structureType) {
                case STRUCTURE_TOWER:
                    b_tower.fx(structure)
                    break;
                
                case STRUCTURE_SPAWN:
                    b_spawn.fx(structure);
                    break;
                default:
                    break;
            }
        } 
    }
}