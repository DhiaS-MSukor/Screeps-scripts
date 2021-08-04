// JavaScript source code
Creep.prototype.runnerMove = function (target, range = 1) {
	const distance = this.pos.getRangeTo(target);
	const ops = Math.max(Math.min((Game.cpu.limit - Game.cpu.getUsed()) * 100, 2000), 1);
	return this.moveTo(target, {
		visualizePathStyle: { stroke: "#ff00ff" },
		range: range,
		maxOps: ops,
		reusePath: Math.floor(Math.random() * distance * 2) + 1,
	});
};

Creep.prototype.runnerTransfer = function (targets, res = RESOURCE_ENERGY) {
	if (targets) {
		var result = this.transfer(targets, res);
		if (result == ERR_NOT_IN_RANGE) {
			this.runnerMove(targets);
			return true;
		}
		return result == OK;
	}
	return false;
};

Creep.prototype.doWithdraw = function (targets, res = RESOURCE_ENERGY) {
	if (targets) {
		if (this.withdraw(targets, res) == ERR_NOT_IN_RANGE) {
			this.runnerMove(targets);
			return true;
		}
	}
	return false;
};

Creep.prototype.withdrawAll = function (targets) {
	if (targets && targets.store) {
		res = Object.keys(targets.store).filter((x) => x != RESOURCE_ENERGY && targets.store[x] != 0);
		if (res.length) {
			return this.doWithdraw(targets, res[0]);
		} else if (targets.store[RESOURCE_ENERGY] > 0) {
			return this.doWithdraw(targets, RESOURCE_ENERGY);
		}
	}
	return false;
};

Creep.prototype.transferStructureTarget = function (type, minCap = 0, res = RESOURCE_ENERGY, sortByRes = false) {
	if (sortByRes) {
		const items = this.room
			.myFind(FIND_STRUCTURES, {
				filter: (targets) => {
					return targets.structureType == type && targets.store.getFreeCapacity(res) > minCap;
				},
			})
			.sort((a, b) => a.store.getUsedCapacity(res) > b.store.getUsedCapacity(res));
		if (items.length > 0) {
			return items[0];
		} else {
			return;
		}
	}
	return this.pos.myFindClosestByRange(FIND_STRUCTURES, {
		filter: (targets) => {
			return targets.structureType == type && targets.store.getFreeCapacity(res) > minCap;
		},
	});
};

Creep.prototype.transferCreepTarget = function (role) {
	const nearestEmpty = this.pos.myFindClosestByRange(FIND_MY_CREEPS, {
		filter: (targets) => {
			return targets.memory.role == role && targets.store.getUsedCapacity(RESOURCE_ENERGY) == 0;
		},
	});
	if (nearestEmpty) {
		return nearestEmpty;
	}

	const near = this.pos
		.findInRange(FIND_MY_CREEPS, 1, {
			filter: (targets) => {
				return targets.memory.role == role && targets.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
			},
		})
		.sort((a, b) => b.store.getFreeCapacity() - a.store.getFreeCapacity());
	if (near.length > 0) {
		return near[0];
	}

	return this.pos.myFindClosestByRange(FIND_MY_CREEPS, {
		filter: (targets) => {
			return targets.memory.role == role && targets.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
		},
	});
};

Creep.prototype.withdrawFromContainer = function () {
	if (this.store.getFreeCapacity() > 350) {
		let targets = this.pos.myFindClosestByRange(FIND_STRUCTURES, {
			filter: (target) =>
				target.structureType == STRUCTURE_CONTAINER &&
				target.store.getFreeCapacity(RESOURCE_ENERGY) == 0 &&
				target.store.getUsedCapacity(RESOURCE_ENERGY) > 0,
		});

		if (targets && this.doWithdraw(targets)) {
			return true;
		}
	}

	let targets = this.pos.myFindClosestByRange(FIND_STRUCTURES, {
		filter: (target) => target.structureType == STRUCTURE_CONTAINER && target.store.getUsedCapacity(RESOURCE_ENERGY) > this.store.getFreeCapacity(),
	});

	if (targets && this.doWithdraw(targets)) {
		return true;
	}

	targets = this.pos
		.findInRange(FIND_STRUCTURES, 5, {
			filter: (target) => target.structureType == STRUCTURE_CONTAINER && target.store.getUsedCapacity(RESOURCE_ENERGY) > 0,
		})
		.sort((a, b) => b.store.getUsedCapacity(RESOURCE_ENERGY) - a.store.getUsedCapacity(RESOURCE_ENERGY));

	if (targets.length > 0 && this.doWithdraw(targets[0])) {
		return true;
	}

	targets = this.pos.myFindClosestByRange(FIND_STRUCTURES, {
		filter: (target) => target.structureType == STRUCTURE_CONTAINER && target.store.getUsedCapacity(RESOURCE_ENERGY) > 0,
	});

	if (targets && this.doWithdraw(targets)) {
		return true;
	}
	return false;
};

Creep.prototype.addEnergyToRoom = function () {
	const target = this.pos.myFindClosestByRange(FIND_STRUCTURES, {
		filter: (targets) => {
			return (
				(targets.structureType == STRUCTURE_SPAWN || targets.structureType == STRUCTURE_EXTENSION) &&
				targets.store.getFreeCapacity(RESOURCE_ENERGY) > 0
			);
		},
	});
	return this.runnerTransfer(target);
};

Creep.prototype.doRunner = function () {
	if (this.getActiveBodyparts(CARRY) == 0 || (this.body.length < 20 && this.room.energyAvailable > Math.max(700, (this.body.length + 8) * 50))) {
		this.suicide();
		return;
	}

	var targets;
	var res;

	if (this.working && this.store.getUsedCapacity() == 0) {
		this.working = false;
		this.say("harvest");
	}
	if (!this.working && (this.store.getUsedCapacity(RESOURCE_ENERGY) > 49 || this.store.getFreeCapacity() == 0)) {
		this.working = true;
		this.task = (this.task + 1) % 3;
		this.say("pass");
	}

	const enemy = this.pos.myFindClosestByRange(FIND_HOSTILE_CREEPS);
	if (this.working) {
		res = _.filter(Object.keys(this.store), (res) => res != RESOURCE_ENERGY && this.store[res] != 0);
		if (res.length) {
			const toTransfer = res[0];
			targets = this.transferStructureTarget(STRUCTURE_TERMINAL, 0, toTransfer);
			if (!targets) {
				targets = this.transferStructureTarget(STRUCTURE_CONTAINER, this.store[toTransfer], toTransfer);
			}

			if (this.runnerTransfer(targets, res[0])) {
				return;
			}
		}

		if (this.store[RESOURCE_ENERGY] != 0) {
			if (enemy) {
				if (this.room.energyAvailable < SPAWN_ENERGY_CAPACITY && this.addEnergyToRoom()) {
					return;
				}
				if (this.runnerTransfer(this.transferStructureTarget(STRUCTURE_TOWER, 0, RESOURCE_ENERGY, true))) {
					return;
				}
			}

			if (this.task == 1) {
				if (this.addEnergyToRoom()) {
					return;
				}
				if (Memory.roomTarget == this.room.name) {
					if (this.runnerTransfer(this.transferCreepTarget("builder"))) {
						return;
					}
				}

				if (this.runnerTransfer(this.transferStructureTarget(STRUCTURE_TOWER, 0, RESOURCE_ENERGY, true))) {
					return;
				}
				if (this.runnerTransfer(this.transferStructureTarget(STRUCTURE_TERMINAL))) {
					return;
				}

				if (this.runnerTransfer(this.transferCreepTarget("builder"))) {
					return;
				}
			} else if (this.task == 2) {
				if (this.room.energyAvailable < SPAWN_ENERGY_CAPACITY && this.addEnergyToRoom()) {
					return;
				}
				if (this.store.getFreeCapacity() == 0 && this.runnerTransfer(this.transferStructureTarget(STRUCTURE_TERMINAL))) {
					return;
				}

				if (Memory.roomTarget == this.room.name) {
					if (this.runnerTransfer(this.transferCreepTarget("builder"))) {
						return;
					}
				}
				if (this.addEnergyToRoom()) {
					return;
				}
				if (this.runnerTransfer(this.transferStructureTarget(STRUCTURE_TERMINAL))) {
					return;
				}

				if (this.runnerTransfer(this.transferCreepTarget("builder"))) {
					return;
				}

				if (this.runnerTransfer(this.transferStructureTarget(STRUCTURE_TOWER, 0, RESOURCE_ENERGY, true))) {
					return;
				}
			} else {
				if (this.room.energyAvailable < SPAWN_ENERGY_CAPACITY && this.addEnergyToRoom()) {
					return;
				}
				if (this.runnerTransfer(this.transferStructureTarget(STRUCTURE_TOWER, 0, RESOURCE_ENERGY, true))) {
					return;
				}
				if (Memory.roomTarget == this.room.name) {
					if (this.runnerTransfer(this.transferCreepTarget("builder"))) {
						return;
					}
				}
				if (this.addEnergyToRoom()) {
					return;
				}

				if (this.runnerTransfer(this.transferCreepTarget("builder"))) {
					return;
				}

				if (this.runnerTransfer(this.transferStructureTarget(STRUCTURE_TERMINAL))) {
					return;
				}
			}
		}
	}

	if (enemy && this.withdrawFromContainer()) {
		return;
	}

	targets = this.pos.findInRange(FIND_DROPPED_RESOURCES, 2);
	if (targets.length > 0) {
		if (this.pickup(targets[0]) == ERR_NOT_IN_RANGE) {
			this.runnerMove(targets[0], 0);
			return;
		}
	}

	res = Object.keys(this.store).filter((res) => res != RESOURCE_ENERGY && this.store[res] != 0);
	if (this.task == 1 && this.store.getFreeCapacity() > 350 && res.length == 0) {
		let minerals = this.room.myFind(FIND_MINERALS, { filter: (target) => target.mineralAmount == 0 });
		targets = this.pos.myFindClosestByRange(FIND_STRUCTURES, {
			filter: (targets) =>
				targets.structureType != STRUCTURE_TERMINAL &&
				targets.store &&
				targets.store.getUsedCapacity() > targets.store.getUsedCapacity(RESOURCE_ENERGY) &&
				(targets.store.getUsedCapacity() - targets.store.getUsedCapacity(RESOURCE_ENERGY) > this.store.getFreeCapacity() ||
					minerals.some((mineral) => targets.store.getUsedCapacity(mineral.mineralType) > 0) ||
					targets.hits < targets.hitsMax / 2),
		});
		if (targets) {
			res = _.filter(Object.keys(targets.store), (res) => res != RESOURCE_ENERGY && targets.store[res] != 0);
			if (this.doWithdraw(targets, res[0])) {
				return;
			}
		}
	} else if (res.length > 0 && this.store.getFreeCapacity() == 0) {
		this.drop(res[0]);
	}
	targets = this.pos.myFindClosestByRange(FIND_TOMBSTONES, {
		filter: (targets) => targets.store.getUsedCapacity() != 0,
	});
	if (this.withdrawAll(targets)) {
		return;
	}

	targets = this.pos.myFindClosestByRange(FIND_RUINS, {
		filter: (targets) => targets.store.getUsedCapacity() != 0,
	});
	if (this.withdrawAll(targets)) {
		return;
	}

	if (this.withdrawFromContainer()) {
		return;
	}

	if (this.room.terminal) {
		if (enemy && this.doWithdraw(this.room.terminal)) {
			return;
		}

		targets = this.pos.myFindClosestByRange(FIND_STRUCTURES, {
			filter: (targets) =>
				targets.structureType != STRUCTURE_TERMINAL &&
				targets.store &&
				(targets.store.getUsedCapacity() > targets.store.getUsedCapacity(RESOURCE_ENERGY) ||
					(targets.store.getUsedCapacity(RESOURCE_ENERGY) == null && targets.store.getUsedCapacity() > 0)),
		});
		if (targets) {
			res = _.filter(Object.keys(targets.store), (res) => res != RESOURCE_ENERGY && targets.store[res] != 0);
			if (this.doWithdraw(targets, res[0])) {
				return;
			}
		}
	}

	if ((this.task + 1) % 3 != 1 && this.store.getUsedCapacity() > 0) {
		this.working = true;
		this.task = (this.task + 1) % 3;
		this.say("pass");
	}
};

module.exports = {
	/** @param {Creep} creep **/
	run: function (creep) {
		creep.doRunner();
	},
};
