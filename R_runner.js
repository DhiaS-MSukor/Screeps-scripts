// JavaScript source code
function move(creep, target, range = 1) {
	const distance = creep.pos.getRangeTo(target);
	return creep.moveTo(target, {
		visualizePathStyle: { stroke: "#ff00ff" },
		range: range,
		ignoreRoads: true,
		reusePath: distance + 1,
	});
}

var doTransfer = function (targets, creep, res = RESOURCE_ENERGY) {
	if (targets) {
		var result = creep.transfer(targets, res);
		if (result == ERR_NOT_IN_RANGE) {
			move(creep, targets);
			return true;
		}
		return result == OK;
	}
	return false;
};

var doWithdraw = function (creep, targets, res = RESOURCE_ENERGY) {
	if (targets) {
		if (creep.withdraw(targets, res) == ERR_NOT_IN_RANGE) {
			move(creep, targets);
			return true;
		}
	}
	return false;
};

var withdrawAll = function (creep, targets) {
	if (targets && targets.store) {
		res = Object.keys(targets.store).filter((x) => x != RESOURCE_ENERGY && targets.store[x] != 0);
		if (res.length) {
			return doWithdraw(creep, targets, res[0]);
		} else if (targets.store[RESOURCE_ENERGY] > 0) {
			return doWithdraw(creep, targets, RESOURCE_ENERGY);
		}
	}
	return false;
};

function transferStructureTarget(creep, type, minCap = 0, res = RESOURCE_ENERGY, sortByRes = false) {
	if (sortByRes) {
		const items = creep.room
			.find(FIND_STRUCTURES, {
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
	return creep.pos.findClosestByRange(FIND_STRUCTURES, {
		filter: (targets) => {
			return targets.structureType == type && targets.store.getFreeCapacity(res) > minCap;
		},
	});
}

var transferCreepTarget = function (creep, role) {
	return creep.pos.findClosestByRange(FIND_MY_CREEPS, {
		filter: (targets) => {
			return targets.memory.role == role && targets.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
		},
	});
};

var doTask = function (creep) {
	if (creep.getActiveBodyparts(CARRY) == 0 || (creep.body.filter((i) => i.type == CARRY).length < 4 && creep.room.energyAvailable > 400)) {
		creep.suicide();
		return;
	}

	var targets;
	var res;

	if (creep.memory.building && creep.store.getUsedCapacity() == 0) {
		creep.memory.building = false;
		creep.say("harvest");
	}
	if (!creep.memory.building && (creep.store.getUsedCapacity(RESOURCE_ENERGY) > 49 || creep.store.getFreeCapacity() == 0)) {
		creep.memory.building = true;
		creep.memory.task = (creep.memory.task + 1) % 3;
		creep.say("pass");
	}

	if (creep.memory.building) {
		res = _.filter(Object.keys(creep.store), (res) => res != RESOURCE_ENERGY && creep.store[res] != 0);
		if (res.length) {
			targets = transferStructureTarget(creep, STRUCTURE_TERMINAL, 0, res[0]);
			if (!targets) {
				targets = transferStructureTarget(creep, STRUCTURE_CONTAINER, 0, res[0]);
			}

			if (doTransfer(targets, creep, res[0])) {
				return;
			}
		}

		if (creep.store[RESOURCE_ENERGY] != 0) {
			const enemy = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
			if (enemy) {
				if (doTransfer(transferStructureTarget(creep, STRUCTURE_SPAWN), creep)) {
					return;
				}
				if (doTransfer(transferStructureTarget(creep, STRUCTURE_TOWER, 10, RESOURCE_ENERGY, true), creep)) {
					return;
				}
			}

			if (creep.memory.task == 1) {
				if (doTransfer(transferStructureTarget(creep, STRUCTURE_SPAWN), creep)) {
					return;
				}
				if (doTransfer(transferStructureTarget(creep, STRUCTURE_EXTENSION), creep)) {
					return;
				}
				if (doTransfer(transferStructureTarget(creep, STRUCTURE_TOWER, 10, RESOURCE_ENERGY, true), creep)) {
					return;
				}
				if (doTransfer(transferStructureTarget(creep, STRUCTURE_TERMINAL), creep)) {
					return;
				}

				targets = transferCreepTarget(creep, "builder");
				if (targets) {
					if (doTransfer(targets, creep)) {
						return;
					}
				}
			} else if (creep.memory.task == 2) {
				if (doTransfer(transferStructureTarget(creep, STRUCTURE_SPAWN), creep)) {
					return;
				}
				if (doTransfer(transferStructureTarget(creep, STRUCTURE_TERMINAL), creep)) {
					return;
				}
				if (doTransfer(transferStructureTarget(creep, STRUCTURE_EXTENSION), creep)) {
					return;
				}
				if (doTransfer(transferStructureTarget(creep, STRUCTURE_TOWER, 10, RESOURCE_ENERGY, true), creep)) {
					return;
				}

				targets = transferCreepTarget(creep, "builder");
				if (targets) {
					if (doTransfer(targets, creep)) {
						return;
					}
				}
			} else {
				if (doTransfer(transferStructureTarget(creep, STRUCTURE_SPAWN), creep)) {
					return;
				}
				if (doTransfer(transferStructureTarget(creep, STRUCTURE_TOWER, 10, RESOURCE_ENERGY, true), creep)) {
					return;
				}
				if (doTransfer(transferStructureTarget(creep, STRUCTURE_EXTENSION), creep)) {
					return;
				}
				if (doTransfer(transferStructureTarget(creep, STRUCTURE_TERMINAL), creep)) {
					return;
				}

				targets = transferCreepTarget(creep, "builder");
				if (targets) {
					if (doTransfer(targets, creep)) {
						return;
					}
				}
			}
		}
	}

	targets = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 2);
	if (targets.length > 0) {
		if (creep.pickup(targets[0]) == ERR_NOT_IN_RANGE) {
			move(creep, targets[0], 0);
			return;
		}
	}

	res = _.filter(Object.keys(creep.store), (res) => res != RESOURCE_ENERGY && creep.store[res] != 0);
	if (creep.memory.task == 1 && !res.length > 0) {
		targets = creep.pos.findClosestByRange(FIND_STRUCTURES, {
			filter: (targets) =>
				targets.structureType != STRUCTURE_TERMINAL &&
				targets.store &&
				(targets.store.getUsedCapacity() > targets.store.getUsedCapacity(RESOURCE_ENERGY) ||
					(targets.store.getUsedCapacity(RESOURCE_ENERGY) == null && targets.store.getUsedCapacity() > 0)),
		});
		if (targets) {
			res = _.filter(Object.keys(targets.store), (res) => res != RESOURCE_ENERGY && targets.store[res] != 0);
			if (doWithdraw(creep, targets, res[0])) {
				return;
			}
		}
	} else if (res.length > 0 && creep.store.getFreeCapacity() == 0) {
		creep.drop(res[0]);
	}
	targets = creep.pos.findClosestByRange(FIND_TOMBSTONES, {
		filter: (targets) => targets.store.getUsedCapacity() != 0,
	});
	if (withdrawAll(creep, targets)) {
		return;
	}

	targets = creep.pos.findClosestByRange(FIND_RUINS, {
		filter: (targets) => targets.store.getUsedCapacity() != 0,
	});
	if (withdrawAll(creep, targets)) {
		return;
	}

	targets = creep.room
		.find(FIND_STRUCTURES, { filter: (target) => target.structureType == STRUCTURE_CONTAINER && target.store.getUsedCapacity(RESOURCE_ENERGY) > 0 })
		.sort((a, b) => a.store.getUsedCapacity(RESOURCE_ENERGY) - b.store.getUsedCapacity(RESOURCE_ENERGY));
	if (doWithdraw(creep, targets)) {
		return;
	}

	if (creep.room.terminal) {
		targets = creep.pos.findClosestByRange(FIND_STRUCTURES, {
			filter: (targets) =>
				targets.structureType != STRUCTURE_TERMINAL &&
				targets.store &&
				(targets.store.getUsedCapacity() > targets.store.getUsedCapacity(RESOURCE_ENERGY) ||
					(targets.store.getUsedCapacity(RESOURCE_ENERGY) == null && targets.store.getUsedCapacity() > 0)),
		});
		if (targets) {
			res = _.filter(Object.keys(targets.store), (res) => res != RESOURCE_ENERGY && targets.store[res] != 0);
			if (doWithdraw(creep, targets, res[0])) {
				return;
			}
		}
	}
	// if ((creep.memory.task + 1) % 3 != 1 && creep.store.getUsedCapacity() > 0) {
	if ((creep.memory.task + 1) % 3 != 1 && creep.store.getUsedCapacity() > 0) {
		creep.memory.building = true;
		creep.memory.task = (creep.memory.task + 1) % 3;
		creep.say("pass");
	}
};

module.exports = {
	/** @param {Creep} creep **/
	run: function (creep) {
		doTask(creep);
	},
};
