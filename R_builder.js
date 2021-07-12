Creep.prototype.builderMove = function (target, range = 3) {
	if (target) {
		const distance = this.pos.getRangeTo(target);
		return this.moveTo(target, {
			visualizePathStyle: { stroke: "#0000ff" },
			range: range,
			maxOps: (Game.cpu.tickLimit - Game.cpu.getUsed()) * 100,
			reusePath: Math.floor(Math.random() * distance * 10) + distance,
		});
	}
};

Creep.prototype.doBuild = function (target) {
	if (target) {
		let res = this.build(target);
		if (res == ERR_NOT_IN_RANGE) {
			this.builderMove(target, 3);
		}
		return true;
	}
	return false;
};

Creep.prototype.doBuilder = function () {
	if (
		this.getActiveBodyparts(WORK) == 0 ||
		(this.body.length < 48 && Game.rooms[this.origin].energyAvailable > Math.max(700, ((this.body.length + 12) * 400) / 6))
	) {
		this.suicide();
		return;
	}
	if (this.store.getFreeCapacity() > 0) {
		let targets = this.pos.findInRange(FIND_DROPPED_RESOURCES, 2, {
			filter: { resourceType: RESOURCE_ENERGY },
		});
		if (targets.length > 0) {
			if (this.pickup(targets[0]) == ERR_NOT_IN_RANGE) {
				this.builderMove(targets[0], 1);
			}
		}
		targets = this.pos.findInRange(FIND_TOMBSTONES, 2, {
			filter: (targets) => targets.store.getUsedCapacity(RESOURCE_ENERGY) > 0,
		});
		if (targets.length > 0) {
			if (this.withdraw(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				this.builderMove(targets[0], 1);
			}
		}
	}

	if (this.working && this.store[RESOURCE_ENERGY] == 0) {
		this.working = false;
		this.say("harvest");
	}
	if (!this.working && this.store.getFreeCapacity() < HARVEST_POWER * this.getActiveBodyparts(WORK)) {
		this.working = true;
		this.say("build");
	}

	if (this.working && this.store[RESOURCE_ENERGY] > 0) {
		if (this.mode == 1 && this.room.name != Memory.roomTarget) {
			if (Game.rooms[Memory.roomTarget]) {
				this.builderMove(Game.rooms[Memory.roomTarget].controller, 1);
				return;
			}
		} else if (
			this.mode != 1 &&
			this.room.name != (Game.spawns[this.memory.spawn] && Game.spawns[this.memory.spawn].room.name) &&
			this.room.name != this.origin
		) {
			this.builderMove(Game.spawns[this.memory.spawn] || (Game.rooms[this.origin] && Game.rooms[this.origin].terminal), 1);
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
				this.builderMove(this.room.controller);
			}
			return;
		}
	}

	let sources = this.pos.findInRange(FIND_STRUCTURES, 10, {
		filter: (structure) => structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > this.store.getFreeCapacity(),
	});
	if (sources.length > 0) {
		if (this.withdraw(sources[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
			this.builderMove(sources[0], 1);
		}
		return;
	}

	sources = this.room.find(FIND_SOURCES_ACTIVE);
	if (sources.length) {
		var target = sources[sources.length - 1];
		if (this.harvest(target) == ERR_NOT_IN_RANGE) {
			if (this.builderMove(target, 1) != ERR_NO_PATH) {
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
			this.builderMove(sources, 1);
			return;
		}
	}
};

module.exports = {
	/** @param {Creep} creep **/
	run: function (creep) {
		creep.doBuilder();
	},
};
