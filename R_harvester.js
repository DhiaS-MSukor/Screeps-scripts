Object.defineProperty(Creep.prototype, "assignedSource", {
	configurable: true,
	get: function () {
		if (!_.isUndefined(this.memory.assignedSource)) {
			return Game.getObjectById(this.memory.assignedSource);
		}
		return undefined;
	},
	set: function (value) {
		if ("id" in value) {
			this.memory.assignedSource = value.id;
		}
	},
});

Object.defineProperty(Creep.prototype, "checkedRooms", {
	configurable: true,
	get: function () {
		if (!_.isUndefined(this.memory.checkedRooms) && Array.isArray(this.memory.checkedRooms)) {
			return this.memory.checkedRooms;
		}
		this.memory.checkedRooms = [];
		return [];
	},
});

Creep.prototype.addCheckedRoom = function () {
	if (!this.checkedRooms.includes(this.room.name)) {
		this.checkedRooms.push(this.room.name);
	}
};

Creep.prototype.minerToRoom = function (target) {
	const pos = this.exitToRoom(target);
	if (pos) {
		const ops = Math.max(Math.min((Game.cpu.tickLimit - Game.cpu.getUsed()) * 10, 2000), 1); 
		this.moveTo(pos, {
			visualizePathStyle: { stroke: "#00ff00" },
			maxOps: ops,
			reusePath: 10000,
		});
	}
};

Creep.prototype.harvesterTransfer = function (targets, res = RESOURCE_ENERGY) {
	if (targets.length > 0) {
		var result = this.transfer(targets[0], res);
		if (result == ERR_NOT_IN_RANGE) {
			const ops = Math.max(Math.min((Game.cpu.tickLimit - Game.cpu.getUsed()) * 50, 2000), 1);
			const distance = this.pos.getRangeTo(targets[0]);
			this.moveTo(targets[0], {
				visualizePathStyle: { stroke: "#00ff00" },
				maxOps: ops,
				reusePath: Math.floor(Math.random() * distance) + distance + 1,
				range: 1,
			});
			return true;
		}
		return result == OK;
	}

	return false;
};
Creep.prototype.doMining = function () {
	var targets = this.pos.myFindClosestByRange(FIND_MINERALS, {
		filter: (mineral) =>
			mineral.mineralAmount > 0 &&
			mineral.pos.lookFor(LOOK_STRUCTURES).some((structure) => structure.structureType == STRUCTURE_EXTRACTOR && structure.my),
	});
	if (this.room.name == this.origin && targets) {
		var harv = this.harvest(targets);
		if (harv != OK) {
			const ops = Math.max(Math.min((Game.cpu.tickLimit - Game.cpu.getUsed()) * 90, 2000), 1);
			this.moveTo(targets, { visualizePathStyle: { stroke: "#00ff00" }, maxOps: ops, range: 1 });
			return;
		}
		targets = this.pos.findInRange(FIND_STRUCTURES, 1, {
			filter: { structureType: STRUCTURE_TERMINAL },
		});
		if (targets.length == 0) {
			targets = this.pos.findInRange(FIND_STRUCTURES, 1, {
				filter: { structureType: STRUCTURE_CONTAINER },
			});
		}
		res = Object.keys(this.store).filter((res) => res != RESOURCE_ENERGY && this.store[res] != 0);
		this.harvesterTransfer(targets, res[0]);
	} else {
		const distanceToOrigin = Game.map.getRoomLinearDistance(this.room.name, this.origin);
		if (this.ticksToLive < distanceToOrigin * 75 || (this.hits < this.hitsMax && this.store.getUsedCapacity() > 0)) {
			this.minerToRoom(this.origin);
			this.working = false;
			return;
		}

		if (this.assignedSource) {
			var harv = this.harvest(this.assignedSource);
			if (harv != OK) {
				this.moveTo(targets, { visualizePathStyle: { stroke: "#00ff00" }, maxOps: (Game.cpu.tickLimit - Game.cpu.getUsed()) * 90, range: 1 });
				return;
			}
		} else {
			if (Memory.deposits && Memory.deposits.length > 0) {
				for (const key in Memory.deposits) {
					if (Object.hasOwnProperty.call(Memory.deposits, key)) {
						const deposit = Game.getObjectById(Memory.deposits[key]);
						if (deposit && deposit.lastCooldown < 100) {
							this.assignedSource = deposit;
						} else {
							Memory.deposits = Memory.deposits.splice(key);
						}
					}
				}
			} else {
				Memory.deposits = [];
			}
		}

		targets = this.pos.myFindClosestByRange(FIND_DEPOSITS, { filter: (i) => i.cooldown <= this.ticksToLive && i.lastCooldown < 100 });

		if (targets) {
			if (Array.isArray(Memory.deposits) && !Memory.deposits.includes(targets.id)) {
				Memory.deposits.push(targets.id);
			} else {
				Memory.deposits = [targets.id];
			}

			var harv = this.harvest(targets);
			if (harv != OK) {
				this.moveTo(targets, { visualizePathStyle: { stroke: "#00ff00" }, maxOps: (Game.cpu.tickLimit - Game.cpu.getUsed()) * 50, range: 1 });
				return;
			}
		} else if (this.room.isHighway()) {
			this.addCheckedRoom();

			const exits = Game.map.describeExits(this.room.name);
			for (const direction in exits) {
				if (Object.hasOwnProperty.call(exits, direction)) {
					const roomName = exits[direction];
					if (!this.room.isAvoid(roomName) && !this.checkedRooms.includes(roomName)) {
						this.minerToRoom(roomName);
						return;
					}
				}
			}
			for (const direction in exits) {
				if (Object.hasOwnProperty.call(exits, direction)) {
					const roomName = exits[direction];
					const distance = Game.map.getRoomLinearDistance(roomName, this.origin);
					if (distance > distanceToOrigin && this.room.isHighway(roomName)) {
						this.minerToRoom(roomName);
						return;
					}
				}
			}
			for (const direction in exits) {
				if (Object.hasOwnProperty.call(exits, direction)) {
					const roomName = exits[direction];
					const distance = Game.map.getRoomLinearDistance(roomName, this.origin);
					if (!this.room.isAvoid(roomName) && distance > distanceToOrigin) {
						this.minerToRoom(roomName);
						return;
					}
				}
			}
		} else {
			this.addCheckedRoom();

			const highway = this.room.getClosestHighway();
			this.minerToRoom(highway);
		}
	}
};

Creep.prototype.doHarvest = function () {
	if (
		this.getActiveBodyparts(WORK) == 0 ||
		(this.mode != 1 &&
			this.body.filter((i) => i.type == WORK).length < 5 &&
			Game.rooms[this.origin].energyAvailable > Math.max(600, (this.body.length + 2) * 75))
	) {
		this.suicide();
		return;
	}

	var targets;

	if (this.working && this.store.getFreeCapacity() == 0) {
		this.working = false;
		this.say("transfer");
	}
	if (!this.working && this.store.getUsedCapacity() == 0) {
		this.working = true;
		this.say("working");
	}

	if (this.working) {
		if (this.mode == 1) {
			this.doMining();
			return;
		}

		if (!this.assignedSource) {
			targets = this.room.myFind(FIND_SOURCES);
			for (const key in targets) {
				if (Object.hasOwnProperty.call(targets, key)) {
					const target = targets[key];
					if (!target.isHarvesterAlive) {
						target.assignedHarvesterName = this.name;
						this.assignedSource = target;
						break;
					}
				}
			}
		} else {
			var harv = this.harvest(this.assignedSource);
			if (harv == ERR_NOT_IN_RANGE) {
				this.moveTo(this.assignedSource, {
					visualizePathStyle: { stroke: "#00ff00" },
					maxOps: (Game.cpu.tickLimit - Game.cpu.getUsed()) * 50,
					range: 1,
				});
			} else if (harv == ERR_NOT_ENOUGH_RESOURCES) {
				this.working = false;
				this.say("!_!");
			}
		}
		if (this.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
			targets = this.pos.findInRange(FIND_STRUCTURES, 1, {
				filter: (structure) => structure.store && structure.store.getFreeCapacity() > 0,
			});
			this.harvesterTransfer(targets);
		}
	} else {
		if (this.room.name != this.origin) {
			this.minerToRoom(this.origin);
			return;
		}

		if (this.mode == 1) {
			targets = this.pos.myFindClosestByRange(FIND_STRUCTURES, {
				filter: (structure) =>
					(structure.structureType == STRUCTURE_TERMINAL || structure.structureType == STRUCTURE_CONTAINER) && structure.store.getFreeCapacity() > 0,
			});
			res = Object.keys(this.store).filter((res) => res != RESOURCE_ENERGY && this.store[res] != 0);
			this.harvesterTransfer([targets], res[0]);
			return;
		}

		targets = this.pos.myFindClosestByRange(FIND_STRUCTURES, {
			filter: (structure) =>
				(structure.structureType == STRUCTURE_CONTAINER ||
					structure.structureType == STRUCTURE_EXTENSION ||
					structure.structureType == STRUCTURE_SPAWN) &&
				structure.store.getFreeCapacity() > 0,
		});
		if (this.harvesterTransfer([targets])) {
			return;
		}

		if (this.store.getFreeCapacity() > 0) {
			this.working = true;
			this.say("working");
		}
	}
};

module.exports = {
	/** @param {Creep} creep **/
	run: function (creep) {
		creep.doHarvest();
	},
};
