var b_tower = require('B_tower');
var b_spawn = require('B_spawn');

module.exports = {
    run: function () {
        for (var element in Game.structures){
            var structure = Game.structures[element];
            switch (structure.structureType) {
                case STRUCTURE_TOWER:Game.getObjectById
                    b_tower.fx(Game.getObjectById(element));
                    break;
                
                case STRUCTURE_SPAWN:
                    b_spawn.fx(Game.getObjectById(element));
                    break;
                default:
                    break;
            }
        } 
    }
}