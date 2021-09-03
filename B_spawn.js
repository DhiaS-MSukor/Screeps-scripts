StructureSpawn.prototype.getMul = function (baseCost, baseCount, penalty = 0) {
	const e = this.room.energyAvailable - penalty;
	const i = Math.floor(e / baseCost);
	const m = Math.min(Math.floor(50 / baseCount), i);
	return Math.max(1, m);
};

StructureSpawn.prototype.do_spawn = function (theRole, mode) {
	const name = theRole + (Game.time % 1000) * 10 + Math.floor(Math.random() * 10);
	const mem = { memory: { role: theRole, origin: this.room.name, mode: mode, task: 0 } };
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
		const mul = Math.min(20, this.getMul(base, 2));
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
		const base = BODYPART_COST[MOVE] * 2 + BODYPART_COST[TOUGH] + BODYPART_COST[ATTACK];
		const mul = this.getMul(base, 4);
		const body = new Array(mul * 4)
			.fill(TOUGH, 0, mul)
			.fill(MOVE, mul, mul * 3)
			.fill(ATTACK, mul * 3);
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
		const base = BODYPART_COST[MOVE] + BODYPART_COST[WORK];
		const p = BODYPART_COST[MOVE] + BODYPART_COST[CARRY];
		const tw = this.getMul(base, 2, p);
		const w = mode == 1 ? tw : Math.min(6, tw);
		const body = new Array(w * 2).fill(WORK, 0, w).fill(MOVE, w).concat([MOVE, CARRY]);
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
		return creep.role == theRole && creep.mode == mode && (creep.memory.spawn == this.name || creep.memory.origin == this.room.name);
	});

	return creeps.length < n && this.do_spawn(theRole, mode);
};

StructureSpawn.prototype.auto_respawn = function () {
	if (this.room.energyAvailable < 100 || this.spawning != null) {
		return;
	}

	// first spawn
	// essentials
	if (this.spawn_check("harvester", 0, 1) || this.spawn_check("builder", 0, 1) || this.spawn_check("runner", 0, 1)) {
		return;
	}
	if (this.room.myFind(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_TOWER } }).length < 2 && this.spawn_check("repairer", 0, 1)) {
		return;
	}

	// spawn to num
	// essentials
	const sourcesLen = this.room.myFind(FIND_SOURCES).length;
	if (this.spawn_check("harvester", 0, sourcesLen)) {
		return;
	}
	if (
		this.spawn_check(
			"harvester",
			1,
			this.room.myFind(FIND_MY_STRUCTURES, {
				filter: {
					structureType: STRUCTURE_EXTRACTOR,
				},
			}).length
		)
	) {
		return;
	}
	if (this.room.energyCapacityAvailable == this.room.energyAvailable) {
		if (this.spawn_check("runner", 0, sourcesLen)) {
			return;
		}
	}

	// local healer and defender
	if (this.room.myFind(FIND_HOSTILE_CREEPS).length > 0) {
		if (this.spawn_check("ranger", 0, 1) || this.spawn_check("defender", 0, 1) || this.spawn_check("healer", 0, 1)) {
			return;
		}
	}

	if (this.room.energyCapacityAvailable == this.room.energyAvailable || this.room.energyAvailable >= 3200) { 
		if (Memory.roomTarget != "false") {
			if (this.spawn_check("builder", 1, 1)) {
				return;
			}
			if (!(Game.rooms[Memory.roomTarget] && Game.rooms[Memory.roomTarget].controller.my) && this.spawn_check("claimer", 0, 1)) {
				return;
			}
		}
		// raiders
		if (Memory.raidTarget != "false") {
			if (this.spawn_check("ranger", 2, 1) || this.spawn_check("defender", 2, 1) || this.spawn_check("healer", 2, 1)) {
				return;
			}
		}
	}
};

module.exports = {
	fx: function (spawn) {
		spawn.auto_respawn();
	},
};
