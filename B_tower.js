// JavaScript source code 

var doRole = function (tower) {
    if (tower) {
        if (tower.store[RESOURCE_ENERGY] == 0) { return; }

        var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS,
            {
                filter: (creep) => creep.getActiveBodyparts(HEAL) > 0
            });
        if (target) {
            tower.attack(target);
            return;
        }
        var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS,
            {
                filter: (creep) => creep.getActiveBodyparts(ATTACK) > 0
                    || creep.getActiveBodyparts(RANGED_ATTACK) > 0
            });
        if (target) {
            tower.attack(target);
            return;
        }
        var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if (target) {
            tower.attack(target);
            return;
        }

        if (tower.store.getUsedCapacity() > 100) {
            target = tower.room.find(FIND_STRUCTURES, { filter: (structure) => structure.hits < structure.hitsMax }).sort((a, b) => a.hits - b.hits);
            if (target.length) {
                tower.repair(target[0]);
                return;
            }
        }
    }
}

module.exports = {
    run: function () {
        try {
            for (var name in Memory.towers) {
                doRole(Game.getObjectById(Memory.towers[name]));
            }
        } catch (e) { }
    },
    fx: function (tower) {
        doRole(tower);
    }
}