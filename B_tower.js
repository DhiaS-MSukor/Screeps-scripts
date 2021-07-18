// JavaScript source code

StructureTower.prototype.doRole = function () {
	if (this.store[RESOURCE_ENERGY] < 10) {
		return;
	}

	var target = this.pos.myFindClosestByRange(FIND_HOSTILE_CREEPS, {
		filter: (creep) => creep.getActiveBodyparts(HEAL) > 0,
	});
	if (target) {
		this.attack(target);
		return;
	}
	var target = this.pos.myFindClosestByRange(FIND_HOSTILE_CREEPS, {
		filter: (creep) => creep.getActiveBodyparts(ATTACK) > 0 || creep.getActiveBodyparts(RANGED_ATTACK) > 0,
	});
	if (target) {
		this.attack(target);
		return;
	}
	var target = this.pos.myFindClosestByRange(FIND_HOSTILE_CREEPS);
	if (target) {
		this.attack(target);
		return;
	}

	var target = this.pos.myFindClosestByRange(FIND_MY_CREEPS, { filter: (creep) => creep.hits < creep.hitsMax });
	if (target) {
		this.heal(target);
		return;
	}

	if (this.store.getUsedCapacity(RESOURCE_ENERGY) > 509) {
		target = this.room
			.myFind(FIND_STRUCTURES, {
				filter: (structure) => structure.hits < structure.hitsMax,
			})
			.sort((a, b) => a.hits - b.hits);
		if (target.length) {
			this.repair(target[0]);
			return;
		}
	}
};

module.exports = {
	fx: function (tower) {
		tower.doRole();
	},
};
