// JavaScript source code 

module.exports = {
	run: function() {
        var target;
		var tower = Game.getObjectById('5f0890983513bc4000713369');

        if(tower) { 
            target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(target) {
                tower.attack(target);
                return;
            }

            target = tower.room.find(FIND_MY_STRUCTURES, {filter: (structure) => structure.hits < structure.hitsMax}); 
            if(target.length) {
                tower.repair(target[0]);
                return;
            }

            target = tower.room.find(FIND_STRUCTURES, {filter: (structure) => structure.hits < structure.hitsMax}); 
            if(target.length) {
                tower.repair(target[0]);
                return;
            }
        } 
	}
}