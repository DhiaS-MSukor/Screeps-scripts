Creep.prototype.doMove = function (target, range = 3) {
	if (target) {
		const distance = this.pos.getRangeTo(target);
		return this.moveTo(target, {
			visualizePathStyle: { stroke: "#0000ff" },
			range: range,
			reusePath: Math.floor(Math.random() * distance * 2) + distance,
		});
	}
};

Creep.prototype.doBuild = function (target) {
	if (target) {
		let res = this.build(target);
		if (res == ERR_NOT_IN_RANGE) {
			this.doMove(target, 3);
		}
		return true;
	}
	return false;
};

Creep.prototype.doRole = function () {
	if (this.getActiveBodyparts(WORK) == 0) {
		this.suicide();
		return;
	}
	if (this.store.getFreeCapacity() > 0) {
		let targets = this.pos.findInRange(FIND_DROPPED_RESOURCES, 2, {
			filter: { resourceType: RESOURCE_ENERGY },
		});
		if (targets.length > 0) {
			if (this.pickup(targets[0]) == ERR_NOT_IN_RANGE) {
				this.doMove(targets[0], 1);
				return;
			}
		}
		targets = this.pos.findInRange(FIND_TOMBSTONES, 2, {
			filter: (targets) => targets.store.getUsedCapacity(RESOURCE_ENERGY) > 0,
		});
		if (targets.length > 0) {
			if (this.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				this.doMove(targets[0], 1);
				return;
			}
		}
	}

	if (this.memory.building && this.store[RESOURCE_ENERGY] == 0) {
		this.memory.building = false;
		this.say("harvest");
	}
	if (!this.memory.building && this.store.getFreeCapacity() < HARVEST_POWER * this.getActiveBodyparts(WORK)) {
		this.memory.building = true;
		this.say("build");
	}

	if (this.memory.building && this.store[RESOURCE_ENERGY] > 0) {
		if (this.memory.mode == 1 && this.room.name != Memory.roomTarget) {
			if (Game.rooms[Memory.roomTarget]) {
				this.doMove(Game.rooms[Memory.roomTarget].controller, 1);
				return;
			}
		} else if (this.memory.mode != 1 && this.room.name != Game.spawns[this.memory.spawn].room.name) {
			this.doMove(Game.spawns[this.memory.spawn], 1);
			return;
		}

		if (this.doBuild(this.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES, { filter: { structureType: STRUCTURE_SPAWN } }))) {
			return;
		}

		if (this.doBuild(this.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES, { filter: { structureType: STRUCTURE_TOWER } }))) {
			return;
		}

		if (this.doBuild(this.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES, { filter: { structureType: STRUCTURE_WALL } }))) {
			return;
		}

		if (this.doBuild(this.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES, { filter: { structureType: STRUCTURE_RAMPART } }))) {
			return;
		}

		if (this.doBuild(this.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES))) {
			return;
		}

		if (this.room.controller) {
			if (this.upgradeController(this.room.controller) == ERR_NOT_IN_RANGE) {
				this.doMove(this.room.controller);
			}
			return;
		}
	}

	// let sources = creep.pos.findClosestByRange(FIND_STRUCTURES, {
	// 	filter: (structure) => structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 1000,
	// });
	// if (sources) {
	// 	if (creep.withdraw(sources, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
	// 		move(creep, sources, 1);
	// 		return;
	// 	}
	// }

	sources = this.room.find(FIND_SOURCES_ACTIVE);
	if (sources.length) {
		var target = sources[sources.length - 1];
		if (this.harvest(target) == ERR_NOT_IN_RANGE) {
			if (this.doMove(target, 1) != ERR_NO_PATH) {
				return;
			}
		} else {
			return;
		}
	}
	sources = this.pos.findClosestByRange(FIND_STRUCTURES, {
		filter: (structure) => structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 0,
	});
	if (sources) {
		if (this.withdraw(sources, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
			this.doMove(sources, 1);
			return;
		}
	}
};

module.exports = {
	/** @param {Creep} creep **/
	run: function (creep) {
		creep.doRole();
	},
};
