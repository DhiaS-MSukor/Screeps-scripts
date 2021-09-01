// JavaScript source code
Creep.prototype.knightToRoom = function (target) {
	const pos = this.exitToRoom(target);
	if (pos) {
		const ops = Math.max(Math.min((Game.cpu.tickLimit - Game.cpu.getUsed()) * 90, 2000), 1);
		const distance = this.pos.getRangeTo(pos);
		this.moveTo(pos, {
			visualizePathStyle: { stroke: "#ff0000" },
			maxOps: ops,
			reusePath: Math.floor(Math.random() * distance * 10) + 10,
			swampCost: 2,
		});
	}
};

Creep.prototype.doKnightAction = function (target) {
	if (this.role == "ranger") {
		const res = this.rangedAttack(target);
		if (res == ERR_NOT_IN_RANGE) {
			const ops = Math.max(Math.min((Game.cpu.tickLimit - Game.cpu.getUsed()) * 80, 2000), 1);
			return this.moveTo(target, {
				visualizePathStyle: { stroke: "#ff0000" },
				range: 3,
				ignoreCreeps: true,
				maxOps: ops,
			});
		}
		const rampart = this.pos.findInRange(FIND_STRUCTURES, 1, { filter: { structureType: STRUCTURE_RAMPART } });
		if (rampart.length > 0) {
			const ops = Math.max(Math.min((Game.cpu.tickLimit - Game.cpu.getUsed()) * 10, 2000), 1);
			return this.moveTo(rampart[0], {
				visualizePathStyle: { stroke: "#ff0000" },
				ignoreCreeps: true,
				maxOps: ops,
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
		const ops = Math.max(Math.min((Game.cpu.tickLimit - Game.cpu.getUsed()) * 80, 2000), 1);
		this.moveTo(target, {
			visualizePathStyle: { stroke: "#ff0000" },
			range: 1,
			maxOps: ops,
		});
		return;
	}
};

Creep.prototype.doKnight = function () {
	if (this.role == "healer") {
		target = this.pos.myFindClosestByRange(FIND_MY_CREEPS, {
			filter: (targets) => targets.hits < targets.hitsMax,
		});
		if (target) {
			this.doKnightRole(target);
			return true;
		}
	} else {
		target = this.pos.myFindClosestByRange(FIND_HOSTILE_CREEPS);
		if (target) {
			this.doKnightRole(target);
			return true;
		}

		if (this.room.name == Memory.roomTarget) {
			target = this.pos.myFindClosestByRange(FIND_HOSTILE_STRUCTURES, {
				filter: (struct) => struct.structureType == STRUCTURE_INVADER_CORE,
			});
			if (!target) {
				target = this.pos.myFindClosestByRange(FIND_STRUCTURES, {
					filter: (struct) => struct.structureType == STRUCTURE_RAMPART && !struct.my,
				});
			}
			if (target) {
				this.doKnightRole(target);
				return true;
			}

			target = this.pos.myFindClosestByRange(FIND_RUINS, { filter: (targets) => targets.store.getUsedCapacity(RESOURCE_ENERGY) > 0 });
			if (!target) {
				target = this.pos.myFindClosestByRange(FIND_DROPPED_RESOURCES, { filter: { resourceType: RESOURCE_ENERGY } });
			}

			if (!target) {
				target = this.pos.myFindClosestByRange(FIND_HOSTILE_STRUCTURES, {
					filter: (struct) => struct.structureType == STRUCTURE_SPAWN || struct.structureType == STRUCTURE_EXTENSION,
				});
				if (!target) {
					target = this.pos.myFindClosestByRange(FIND_HOSTILE_STRUCTURES, { filter: (struct) => !struct.store });
				}
				if (!target) {
					target = this.pos.myFindClosestByRange(FIND_HOSTILE_STRUCTURES, {
						filter: (struct) => struct.store && struct.store.getUsedCapacity() == 0,
					});
				}
				if (!target) {
					target = this.pos.myFindClosestByRange(FIND_HOSTILE_STRUCTURES, {
						filter: (struct) => struct.store && struct.store.getUsedCapacity(RESOURCE_ENERGY) == 0,
					});
				}
				if (!target) {
					const temp = this.room
						.myFind(FIND_HOSTILE_STRUCTURES, { filter: (struct) => struct.store && struct.store.getUsedCapacity() > 0 })
						.sort((a, b) => a.store.getUsedCapacity(RESOURCE_ENERGY) - b.store.getUsedCapacity(RESOURCE_ENERGY));
					if (temp.length > 0) {
						target = temp[0];
					}
				}
				if (!target) {
					target = this.pos.myFindClosestByRange(FIND_HOSTILE_STRUCTURES);
				}
				if (target) {
					this.doKnightRole(target);
					return true;
				}
			}
		} else {
			target = this.pos.myFindClosestByRange(FIND_HOSTILE_STRUCTURES, {
				filter: (struct) => this.mode == 3 || struct.structureType != STRUCTURE_POWER_BANK,
			});
			if (target) {
				this.doKnightRole(target);
				return true;
			}
		}
	}
	return false;
};

Creep.prototype.moveKnight = function () {
	var target;

	if (this.mode == 1 && Memory.roomTarget != "false" && this.room.name != Memory.roomTarget) {
		this.knightToRoom(Memory.roomTarget);
		return;
	}
	if (this.room.my && this.doKnight()) {
		return;
	}
	if (Memory.raidTarget != "false" && this.room.name != Memory.raidTarget) {
		this.knightToRoom(Memory.raidTarget);
		return;
	}
	if (this.doKnight()) {
		return;
	}

	target = this.room.controller;
	if (target) {
		this.moveTo(target, {
			visualizePathStyle: { stroke: "#ff0000" },
			range: 2,
			maxOps: (Game.cpu.tickLimit - Game.cpu.getUsed()) * 10,
			reusePath: Math.floor(Math.random() * 90) + 10,
		});
		if (this.mode == 0 && this.pos.getRangeTo(this.room.controller) < 5) {
			this.suicide();
		}
		return;
	}

	target = this.room.myFind(FIND_STRUCTURES, {
		filter: { structureType: STRUCTURE_KEEPER_LAIR },
	});
	target = target.sort((a, b) => a.ticksToSpawn - b.ticksToSpawn);
	if (target.length > 0) {
		this.moveTo(target[0], {
			visualizePathStyle: { stroke: "#ff0000" },
			range: 1,
			maxOps: (Game.cpu.tickLimit - Game.cpu.getUsed()) * 10,
			reusePath: Math.floor(Math.random() * 90) + 10,
		});
		return;
	}
};

module.exports = {
	/** @param {Creep} creep **/
	run: function (creep) {
		creep.moveKnight();
	},
};
