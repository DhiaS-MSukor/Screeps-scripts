// JavaScript source code
function goToRoom(creep, target) {
	if (Game.rooms[target]) {
		creep.moveTo(Game.rooms[target].controller, {
			visualizePathStyle: { stroke: "#ff0000" },
			range: 1,
			reusePath: Math.floor(Math.random() * 20) + 5,
		});
	} else if (target != "false") {
		creep.moveTo(new RoomPosition(25, 25, target), {
			visualizePathStyle: { stroke: "#ff0000" },
			range: 1,
			reusePath: Math.floor(Math.random() * 20) + 5,
		});
	}
	return;
}

function doTask1(creep, target) {
	if (creep.memory.role == "ranger") {
		const res = creep.rangedAttack(target);
		if (res == ERR_NOT_IN_RANGE) {
			return creep.moveTo(target, {
				visualizePathStyle: { stroke: "#ff0000" },
				range: 3,
			});
		}
		return res;
	} else if (creep.memory.role == "healer") {
		var res = creep.heal(target);
		if (res == ERR_NOT_IN_RANGE) {
			creep.rangedHeal(target);
			return res;
		}
		return res;
	} else if (creep.memory.role == "troll") {
		creep.heal(creep);
		return ERR_NOT_IN_RANGE;
	}
	return creep.attack(target);
}

function doRole(creep, target) {
	if (doTask1(creep, target) == ERR_NOT_IN_RANGE) {
		creep.moveTo(target, {
			visualizePathStyle: { stroke: "#ff0000" },
			range: 1,
		});
		return;
	}
}

function doTask(creep) {
	var target;

	if (creep.memory.role == "healer") {
		target = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
			filter: (targets) => targets.hits < targets.hitsMax,
		});
		if (target) {
			doRole(creep, target);
			return;
		}
	} else {
		var all = creep.room.find(FIND_HOSTILE_CREEPS).concat(creep.room.find(FIND_HOSTILE_STRUCTURES));
		target = creep.pos.findClosestByRange(all);
		if (target) {
			doRole(creep, target);
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

	if (creep.memory.mode == 1 && Memory.roomTarget != "false" && creep.room.name != Memory.roomTarget) {
		goToRoom(creep, Memory.roomTarget);
		return;
	} else if (creep.memory.mode == 2 && Memory.raidTarget != "false" && creep.room.name != Memory.raidTarget) {
		goToRoom(creep, Memory.raidTarget);
		return;
	}

	target = creep.room.controller;
	if (target) {
		creep.moveTo(target, {
			visualizePathStyle: { stroke: "#ff0000" }, 
			range: 1, 
			reusePath: Math.floor(Math.random() * 90) + 10,
		});
		return;
	}

	target = creep.room.find(FIND_STRUCTURES, {
		filter: { structureType: STRUCTURE_KEEPER_LAIR },
	});
	target = target.sort((a, b) => a.ticksToSpawn - b.ticksToSpawn);
	if (target.length > 0) {
		creep.moveTo(target[0], {
			visualizePathStyle: { stroke: "#ff0000" },
			maxOps: 100,
			range: 1,
		});
		return;
	}
}

module.exports = {
	/** @param {Creep} creep **/
	run: function (creep) {
		doTask(creep);
	},
};
