// JavaScript source code
var doTransfer = function (targets, creep, res = RESOURCE_ENERGY) {
	if (targets) {
		var result = creep.transfer(targets, res);
		if (result == ERR_NOT_IN_RANGE) {
			creep.moveTo(targets, { visualizePathStyle: { stroke: '#ff00ff' } });
			return true;
		}
		return result == OK;
	}
	return false;
}

var doWithdraw = function (creep, targets, res = RESOURCE_ENERGY) {
	if (targets) {
		if (creep.withdraw(targets, res) == ERR_NOT_IN_RANGE) {
			creep.moveTo(targets, { visualizePathStyle: { stroke: '#ff00ff' } });
			return true;
		}
	}
	return false;
}

var withdrawAll = function (creep, targets) {
	if (targets && targets.store) {
		res = _.filter(Object.keys(targets.store), (res) => (targets.store[res] != 0));
		if (res.length) {
			return doWithdraw(creep, targets, res[0]);
		}
	}
	return false;
}

var transferStructureTarget = function (creep, type) {
	return creep.pos.findClosestByRange(FIND_STRUCTURES, {
		filter: (targets) => {
			return (targets.structureType == type &&
				targets.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
		}
	});
}

var transferCreepTarget = function (creep, role) {
	return creep.room.find(FIND_MY_CREEPS, {
		filter: (targets) => {
			return (targets.memory.role == role &&
				targets.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
		}
	}).sort((a, b) => a.store[RESOURCE_ENERGY] - b.store[RESOURCE_ENERGY])[0];
}

var doTask = function (creep) {
	var targets;
	var res;

	if (creep.memory.building && creep.store[RESOURCE_ENERGY] == 0) {
		creep.memory.building = false;
		creep.say('harvest');
	}
	if (!creep.memory.building && creep.store.getUsedCapacity() > 49) {
		creep.memory.building = true;
		creep.memory.task = (creep.memory.task + 1) % 2;
		creep.say('pass');
	}

	if (creep.memory.building) {
		res = _.filter(Object.keys(creep.store), (res) => (res != RESOURCE_ENERGY && creep.store[res] != 0));

		if (res.length) {
			mem = Memory.spawns[creep.memory.spawn];
			if (mem['rescon']) {
				targets = Game.getObjectById(mem.rescon);
			}
			if (!targets) {
				targets = creep.pos.findClosestByRange(STRUCTURE_TERMINAL, {
					filter: (targets) => {
						return targets.store && (targets.store.getFreeCapacity() > 0)
					}
				});
			}
			if (!targets) {
				targets = creep.pos.findClosestByRange(FIND_STRUCTURES, {
					filter: (targets) => { return structureType == STRUCTURE_CONTAINER 
						&& (targets.store.getFreeCapacity() > 0)
					}
				});
			}

			doTransfer(targets, creep, res[0])
			return;
		}

		if (creep.store[RESOURCE_ENERGY] == 0) { return; }

		if (creep.memory.task == 1) {
			if (doTransfer(transferStructureTarget(creep, STRUCTURE_SPAWN), creep)) { return; }
			if (doTransfer(transferStructureTarget(creep, STRUCTURE_EXTENSION), creep)) { return; }
			if (doTransfer(transferStructureTarget(creep, STRUCTURE_TOWER), creep)) { return; }

			targets = transferCreepTarget(creep, 'builder');
			if (targets) {
				if (doTransfer(targets, creep)) { return; }
			}
		}
		else {
			if (doTransfer(transferStructureTarget(creep, STRUCTURE_SPAWN), creep)) { return; }
			if (doTransfer(transferStructureTarget(creep, STRUCTURE_TOWER), creep)) { return; }
			if (doTransfer(transferStructureTarget(creep, STRUCTURE_EXTENSION), creep)) { return; }

			targets = transferCreepTarget(creep, 'builder');
			if (targets) {
				if (doTransfer(targets, creep)) { return; }
			}
		}
	}
	else {
		targets = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES);
		if (targets) {
			if (creep.pickup(targets) == ERR_NOT_IN_RANGE) {
				creep.moveTo(targets, { visualizePathStyle: { stroke: '#ff00ff' } });
				return;
			}
		}

		if (creep.memory.task % 2 == 1) {
			targets = creep.pos.findClosestByRange(FIND_STRUCTURES, {
				filter: (targets) => {
					return targets.structureType == STRUCTURE_CONTAINER
						&& targets.store.getUsedCapacity() > targets.store.getUsedCapacity(RESOURCE_ENERGY)
				}
			});
			if (targets) {
				res = _.filter(Object.keys(targets.store), (res) => (res != RESOURCE_ENERGY && targets.store[res] != 0));
				if (doWithdraw(creep, targets, res[0])) { return; }
			}
		}
		else if (creep.memory.task % 2 == 0) {
			targets = creep.pos.findClosestByRange(FIND_TOMBSTONES, { filter: (targets) => { return (targets.store.getUsedCapacity() != 0) } });
			if (withdrawAll(creep, targets)) { return; }

			targets = creep.pos.findClosestByRange(FIND_RUINS, { filter: (targets) => { return (targets.store.getUsedCapacity() != 0) } });
			if (withdrawAll(creep, targets)) { return; }
		}


		targets = creep.pos.findClosestByRange(FIND_STRUCTURES, {
			filter: (targets) => {
				return (targets.structureType == STRUCTURE_CONTAINER &&
					targets.store[RESOURCE_ENERGY] != 0)
			}
		});
		if (doWithdraw(creep, targets)) { return; }
	}
}

module.exports = {
	/** @param {Creep} creep **/
	run: function (creep) {
		doTask(creep);
		try {
		} catch (e) { }
	}
};