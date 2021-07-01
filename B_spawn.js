StructureSpawn.prototype.getMul = function (baseCost, baseCount, penalty = 0) {
	const e = this.room.energyAvailable - penalty;
	const i = Math.floor(e / baseCost);
	const m = Math.min(Math.floor(50 / baseCount), i);
	return Math.max(1, m);
};

StructureSpawn.prototype.do_spawn = function (theRole, mode) {
	const name = theRole + (Game.time % 1000) + "" + Math.floor(Math.random() * 10);
	const mem = { memory: { role: theRole, spawn: this.name, mode: mode, task: 0 } };
	var res = -2;

	if (theRole == "repairer") {
		const base = BODYPART_COST[MOVE] * 3 + BODYPART_COST[CARRY] * 2 + BODYPART_COST[WORK];
		const mul = this.getMul(base, 6);
		const body = new Array(mul * 6)
			.fill(WORK, 0, mul)
			.fill(CARRY, mul, mul * 3)
			.fill(MOVE, mul * 3);
		res = this.spawnCreep(body, name, mem);
		if (res != OK) {
			res = this.spawnCreep([WORK, MOVE, CARRY, MOVE], name, mem);
		}
	} else if (theRole == "runner") {
		const base = BODYPART_COST[MOVE] + BODYPART_COST[CARRY];
		const mul = this.getMul(base, 2);
		const body = new Array(mul * 2).fill(CARRY, 0, mul).fill(MOVE, mul);
		res = this.spawnCreep(body, name, mem);
	} else if (theRole == "builder") {
		const base = BODYPART_COST[MOVE] * 3 + BODYPART_COST[CARRY] + BODYPART_COST[WORK] * 2;
		const mul = this.getMul(base, 6);
		const body = new Array(mul * 6)
			.fill(WORK, 0, mul * 2)
			.fill(CARRY, mul * 2, mul * 3)
			.fill(MOVE, mul * 3);
		res = this.spawnCreep(body, name, mem);
		if (res != OK) {
			res = this.spawnCreep([WORK, MOVE, CARRY, MOVE], name, mem);
		}
	} else if (theRole == "defender") {
		const base = BODYPART_COST[MOVE] + BODYPART_COST[TOUGH] + BODYPART_COST[ATTACK];
		const mul = this.getMul(base, 3);
		const body = new Array(mul * 3)
			.fill(TOUGH, 0, mul)
			.fill(MOVE, mul, mul * 2)
			.fill(ATTACK, mul * 2);
		res = this.spawnCreep(body, name, mem);
	} else if (theRole == "healer") {
		const base = BODYPART_COST[MOVE] + BODYPART_COST[HEAL];
		const mul = this.getMul(base, 2);
		const body = new Array(mul * 2).fill(MOVE, 0, mul).fill(HEAL, mul);
		res = this.spawnCreep(body, name, mem);
	} else if (theRole == "ranger") {
		const base = BODYPART_COST[MOVE] + BODYPART_COST[RANGED_ATTACK];
		const mul = this.getMul(base, 2);
		const body = new Array(mul * 2).fill(MOVE, 0, mul).fill(RANGED_ATTACK, mul);
		res = this.spawnCreep(body, name, mem);
	} else if (theRole == "claimer") {
		const base = BODYPART_COST[MOVE] + BODYPART_COST[CLAIM];
		const mul = this.getMul(base, 2);
		const body = new Array(mul * 2).fill(MOVE, 0, mul).fill(CLAIM, mul);
		res = this.spawnCreep(body, name, mem);
	} else if (theRole == "harvester") {
		const base = BODYPART_COST[WORK];
		const p = BODYPART_COST[MOVE] + BODYPART_COST[CARRY];
		const w = this.getMul(base, 2, p);
		const c = Math.ceil((w * HARVEST_POWER) / CARRY_CAPACITY);
		const body = new Array(w + c)
			.fill(WORK, 0, w)
			.fill(CARRY, w, w + c)
			.concat([MOVE]);
		res = this.spawnCreep(body, name, mem);
	} else if (theRole == "troll") {
		const base = BODYPART_COST[MOVE] + BODYPART_COST[HEAL] + BODYPART_COST[ATTACK];
		const mul = this.getMul(base, 2);
		const body = new Array(mul * 3)
			.fill(MOVE, 0, mul)
			.fill(ATTACK, mul, mul + mul)
			.fill(HEAL, mul + mul);
		res = this.spawnCreep(body, name, mem);
	}

	return res == OK;
};

StructureSpawn.prototype.spawn_check = function (theRole, mode, n) {
	var creeps = _.filter(Game.creeps, (creep) => {
		return creep.memory.role == theRole && creep.memory.mode == mode && creep.memory.spawn == this.name;
	});

	return creeps.length < n && do_spawn(this, theRole, mode);
};

StructureSpawn.prototype.auto_respawn = function () {
	if (this.room.energyAvailable < 100) {
		return;
	}
	// first spawn
	// essentials
	if (this.spawn_check("harvester", 0, 1)) {
		return;
	} else if (this.spawn_check("builder", 0, 1)) {
		return;
	} else if (this.spawn_check("runner", 0, 1)) {
		return;
	} else if (this.spawn_check("repairer", 0, 1)) {
		return;
	}

	// spawn to num
	// essentials
	else if (this.spawn_check("harvester", 0, this.room.find(FIND_SOURCES).length)) {
		return;
	} else if (
		this.spawn_check(
			"harvester",
			1,
			this.room.find(FIND_MY_STRUCTURES, {
				filter: {
					structureType: STRUCTURE_EXTRACTOR,
				},
			}).length
		)
	) {
		return;
	}
	// else if (spawn_check(spawn, 'builder', 0, Memory.spawns[spawn].builder)) { return; }
	// else if (spawn_check(spawn, 'runner', 0, Memory.spawns[spawn].runner)) { return; }
	//else if (spawn_check(spawn, 'repairer', 0, 1)) {return;}

	// local healer and defender
	else if (this.spawn_check("ranger", 0, 1)) {
		return;
	}
	//else if (spawn_check(spawn, 'healer', 0, 1)) {return;}
	// else if (spawn_check(spawn, 'defender', 0, 1)) {return;}

	// looters
	//else if (spawn_check(spawn, 'harvester', 1, 1)) { return; }
	// else if (spawn_check(spawn, 'defender', 1, 1)) {return;}

	// claimer
	else if (Memory.roomTarget != "false" && this.spawn_check("ranger", 1, 1)) {
		return;
	} else if (
		Memory.roomTarget != "false" &&
		!(Game.rooms[Memory.roomTarget] && Game.rooms[Memory.roomTarget].controller.my) &&
		this.spawn_check("claimer", 0, 1)
	) {
		return;
	} else if (Memory.roomTarget != "false" && this.spawn_check("builder", 1, 3)) {
		return;
	}

	// raiders
	else if (Memory.raidTarget != "false" && this.spawn_check("ranger", 2, 1)) {
		return;
	} else if (Memory.raidTarget != "false" && this.spawn_check("defender", 2, 1)) {
		return;
	}
};

module.exports = {
	fx: function (spawn) {
		spawn.auto_respawn();
	},
};
