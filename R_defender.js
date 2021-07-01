// JavaScript source code
Creep.prototype.goToRoom = function (target) {
	if (Game.rooms[target]) {
		this.moveTo(Game.rooms[target].controller, {
			visualizePathStyle: { stroke: "#ff0000" },
			range: 1,
			reusePath: Math.floor(Math.random() * 90) + 10,
		});
	} else if (target != "false") {
		this.moveTo(new RoomPosition(25, 25, target), {
			visualizePathStyle: { stroke: "#ff0000" },
			range: 1,
			reusePath: Math.floor(Math.random() * 90) + 10,
		});
	}
	return;
};

Creep.prototype.doAction = function (target) {
	if (this.memory.role == "ranger") {
		const res = this.rangedAttack(target);
		if (res == ERR_NOT_IN_RANGE) {
			return this.moveTo(target, {
				visualizePathStyle: { stroke: "#ff0000" },
				range: 3,
				ignoreCreeps: true,
			});
		}
		const rampart = this.pos.findInRange(FIND_STRUCTURES, 1, { filter: { structureType: STRUCTURE_RAMPART } });
		if (rampart.length > 0) {
			return this.moveTo(rampart[0], {
				visualizePathStyle: { stroke: "#ff0000" },
				ignoreCreeps: true,
				maxOps: 100,
			});
		}
		return res;
	} else if (this.memory.role == "healer") {
		var res = this.heal(target);
		if (res == ERR_NOT_IN_RANGE) {
			this.rangedHeal(target);
			return res;
		}
		return res;
	} else if (this.memory.role == "troll") {
		this.heal(this);
		return ERR_NOT_IN_RANGE;
	}
	return this.attack(target);
};

Creep.prototype.doRole = function (target) {
	if (this.doAction(target) == ERR_NOT_IN_RANGE) {
		this.moveTo(target, {
			visualizePathStyle: { stroke: "#ff0000" },
			range: 1,
		});
		return;
	}
};

Creep.prototype.doTask = function () {
	var target;

	if (this.memory.role == "healer") {
		target = this.pos.findClosestByRange(FIND_MY_CREEPS, {
			filter: (targets) => targets.hits < targets.hitsMax,
		});
		if (target) {
			this.doRole(target);
			return;
		}
	} else {
		var all = this.room.find(FIND_HOSTILE_CREEPS).concat(this.room.find(FIND_HOSTILE_STRUCTURES));
		target = this.pos.findClosestByRange(all);
		if (target) {
			this.doRole(target);
			return;
		}

		// target = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_INVADER_CORE } });
		// if (target) { doRole(creep, target); return; }

		// target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
		// if (target) { doRole(creep, target); return; }

		// target = creep.pos.findClosestByRange(FIND_HOSTILE_SPAWNS, { filter: (targets) => targets.hits > 0 });
		// if (target) { doRole(creep, target); return; }

		// target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, { filter: (targets) => targets.hits > 0 });
		// if (target) { doRole(creep, target); return; }
	}

	if (this.memory.mode == 1 && Memory.roomTarget != "false" && this.room.name != Memory.roomTarget) {
		this.goToRoom(Memory.roomTarget);
		return;
	} else if (this.memory.mode == 2 && Memory.raidTarget != "false" && this.room.name != Memory.raidTarget) {
		this.goToRoom(Memory.raidTarget);
		return;
	}

	target = this.room.controller;
	if (target) {
		this.moveTo(target, {
			visualizePathStyle: { stroke: "#ff0000" },
			range: 1,
			reusePath: Math.floor(Math.random() * 90) + 10,
		});
		return;
	}

	target = this.room.find(FIND_STRUCTURES, {
		filter: { structureType: STRUCTURE_KEEPER_LAIR },
	});
	target = target.sort((a, b) => a.ticksToSpawn - b.ticksToSpawn);
	if (target.length > 0) {
		this.moveTo(target[0], {
			visualizePathStyle: { stroke: "#ff0000" },
			range: 1,
			reusePath: Math.floor(Math.random() * 90) + 10,
		});
		return;
	}
};

module.exports = {
	/** @param {Creep} creep **/
	run: function (creep) {
		doTask(creep);
	},
};
