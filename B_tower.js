// JavaScript source code 

var doRole = function(tower) {
    if (tower) { 
        if (tower.store[RESOURCE_ENERGY] == 0) {return;}

        var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS, 
                     {filter: (target) => ([HEAL, CLAIM, RANGED_ATTACK, ATTACK, WORK].some((val) => target.body.includes(val)))});
        if(target) {
            tower.attack(target);
            return;
        } 

        target = tower.room.find(FIND_STRUCTURES, {filter: (structure) => structure.hits < structure.hitsMax}).sort((a,b) => a.hits - b.hits);
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