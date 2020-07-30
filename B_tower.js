// JavaScript source code 

var doRole = function(tower) {
    if (tower) { 
        if (tower.store[RESOURCE_ENERGY] == 0) {return;}

        var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(target) {
            tower.attack(target);
            return;
        }

        var target = tower.room.find(FIND_MY_STRUCTURES, {filter: (structure) => structure.hits < structure.hitsMax}); 
        target = target.sort(function(a,b){a.hits - b.hits});
        if(target.length) {
            tower.repair(target[0]);
            return;
        }

        target = tower.room.find(FIND_STRUCTURES, {filter: (structure) => structure.hits < structure.hitsMax}); 
        target = target.sort(function(a,b){a.hits - b.hits});
        console.log(target[0].hits + ' ' + target[1].hits);
        if(target.length) {
            tower.repair(target[0]);
            return;
        }
    } 
}

module.exports = {
	run: function() {
        for (var name in Memory.towers) {
            doRole(Game.getObjectById(Memory.towers[name]));  
		}
	}
}