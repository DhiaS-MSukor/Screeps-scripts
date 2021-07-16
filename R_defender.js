// JavaScript source code
Creep.prototype.knightToRoom = function (target) {
	const pos = this.exitToRoom(target);
	if (pos) {
		const distance = this.pos.getRangeTo(pos);
		this.moveTo(pos, {
			visualizePathStyle: { stroke: "#ff0000" },
			maxOps: (Game.cpu.limit - Game.cpu.getUsed()) * 100,
			reusePath: Math.floor(Math.random() * distance * 10) + 10,
		});
	}
};

Creep.prototype.doKnightAction = function (target) {
	if (this.role == "ranger") {
		const res = this.rangedAttack(target);
		if (res == ERR_NOT_IN_RANGE) {
			return this.moveTo(target, {
				visualizePathStyle: { stroke: "#ff0000" },
				range: 3,
				ignoreCreeps: true,
				maxOps: (Game.cpu.limit - Game.cpu.getUsed()) * 100,
			});
		}
		const rampart = this.pos.findInRange(FIND_STRUCTURES, 1, { filter: { structureType: STRUCTURE_RAMPART } });
		if (rampart.length > 0) {
			return this.moveTo(rampart[0], {
				visualizePathStyle: { stroke: "#ff0000" },
				ignoreCreeps: true,
				maxOps: (Game.cpu.limit - Game.cpu.getUsed()) * 100,
			});
		}
		return res;
	} else if (this.role == "healer") {
		var res = this.heal(target);
		if (res == ERR_NOT_IN_RANGE) {
			this.rangedHeal(target);
			return res;
		}
		return res;
	} else if (this.role == "troll") {
		this.heal(this);
		return ERR_NOT_IN_RANGE;
	}
	return this.attack(target);
};

Creep.prototype.doKnightRole = function (target) {
	if (this.doKnightAction(target) == ERR_NOT_IN_RANGE) {
		this.moveTo(target, {
			visualizePathStyle: { stroke: "#ff0000" },
			range: 1,
			maxOps: (Game.cpu.limit - Game.cpu.getUsed()) * 100,
		});
		return;
	}
};

Creep.prototype.doKnight = function () {
	var target;

	if (this.role == "healer") {
		target = this.pos.findClosestByRange(FIND_MY_CREEPS, {
			filter: (targets) => targets.hits < targets.hitsMax,
		});
		if (target) {
			this.doKnightRole(target);
			return;
		}
	} else {
		target = this.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
		if (target) {
			this.doKnightRole(target);
			return;
		}

		if (this.room.controller && this.room.controller.my) {
			target = this.pos.findClosestByRange(FIND_RUINS, { filter: (targets) => targets.store.getUsedCapacity(RESOURCE_ENERGY) > 0 });
			if (!target) {
				target = this.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, { filter: (struct) => !struct.store });
				if (!target) {
					target = this.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, { filter: (struct) => struct.store && struct.store.getUsedCapacity() == 0 });
				}
				if (!target) {
					target = this.room
						.find(FIND_HOSTILE_STRUCTURES, { filter: (struct) => struct.store && struct.store.getUsedCapacity(RESOURCE_ENERGY) > 0 })
						.sort((a, b) => a.store.getUsedCapacity(RESOURCE_ENERGY) - b.store.getUsedCapacity(RESOURCE_ENERGY));
					if (target.length > 0) {
						target = target[0];
					}
				}
				if (!target) {
					target = this.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);
				}

				this.doKnightRole(target);
				return;
			}
		} else {
			target = this.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES);
			this.doKnightRole(target);
			return;
		}
	}

	if (this.mode == 1 && Memory.roomTarget != "false" && this.room.name != Memory.roomTarget) {
		this.knightToRoom(Memory.roomTarget);
		return;
	} else if (this.mode == 2 && Memory.raidTarget != "false" && this.room.name != Memory.raidTarget) {
		this.knightToRoom(Memory.raidTarget);
		return;
	}

	target = this.room.controller;
	if (target) {
		this.moveTo(target, {
			visualizePathStyle: { stroke: "#ff0000" },
			range: 10,
			maxOps: (Game.cpu.limit - Game.cpu.getUsed()) * 100,
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
			maxOps: (Game.cpu.limit - Game.cpu.getUsed()) * 100,
			reusePath: Math.floor(Math.random() * 90) + 10,
		});
		return;
	}
};

module.exports = {
	/** @param {Creep} creep **/
	run: function (creep) {
		creep.doKnight();
	},
};
