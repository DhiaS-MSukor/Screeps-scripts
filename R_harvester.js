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
		const distance = this.pos.getRangeTo(pos);
		this.moveTo(pos, {
			visualizePathStyle: { stroke: "#00ff00" },
			maxOps: Math.min(2000, (Game.cpu.tickLimit - Game.cpu.getUsed()) * 100),
			reusePath: Math.floor(Math.random() * distance * 10) + 10,
		});
	}
};

Creep.prototype.harvesterTransfer = function (targets, res = RESOURCE_ENERGY) {
	if (targets.length > 0) {
		var result = this.transfer(targets[0], res);
		if (result == ERR_NOT_IN_RANGE) {
			this.moveTo(targets[0], {
				visualizePathStyle: { stroke: "#00ff00" },
				maxOps: (Game.cpu.limit - Game.cpu.getUsed()) * 100,
				reusePath: 4,
				range: 1,
			});
			return true;
		}
		return result == OK;
	}

	return false;
};
Creep.prototype.doMining = function () {
	var targets = this.pos.findClosestByRange(FIND_MINERALS, {
		filter: (mineral) =>
			mineral.mineralAmount > 0 &&
			mineral.pos.lookFor(LOOK_STRUCTURES).some((structure) => structure.structureType == STRUCTURE_EXTRACTOR && structure.my),
	});
	if (this.room.name == this.origin && targets) {
		var harv = this.harvest(targets);
		if (harv != OK) {
			this.moveTo(targets, { visualizePathStyle: { stroke: "#00ff00" }, maxOps: (Game.cpu.limit - Game.cpu.getUsed()) * 100, range: 1 });
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
		if (this.ticksToLive < distanceToOrigin * 50 || (this.hits < this.hitsMax && this.store.getUsedCapacity() > 0)) {
			this.minerToRoom(this.origin);
			this.working = false;
			this.say("transfer");
		}

		if (this.assignedSource) {
			var harv = this.harvest(this.assignedSource);
			if (harv != OK) {
				this.moveTo(targets, { visualizePathStyle: { stroke: "#00ff00" }, maxOps: (Game.cpu.limit - Game.cpu.getUsed()) * 100, range: 1 });
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

		targets = this.pos.findClosestByRange(FIND_DEPOSITS, { filter: (i) => i.cooldown <= this.ticksToLive && i.lastCooldown < 100 });

		if (targets) {
			var harv = this.harvest(targets);
			if (harv != OK) {
				this.moveTo(targets, { visualizePathStyle: { stroke: "#00ff00" }, maxOps: (Game.cpu.limit - Game.cpu.getUsed()) * 100, range: 1 });
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
			targets = this.room.find(FIND_SOURCES);
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
					maxOps: (Game.cpu.limit - Game.cpu.getUsed()) * 100,
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
			const closestHighway = this.room.getClosestHighway(this.origin);
			const highwayExits = Game.map.describeExits(closestHighway);

			if (this.room.isHighway() && !Object.values(highwayExits).includes(this.room.name)) {
				this.minerToRoom(closestHighway);
			} else {
				this.minerToRoom(this.origin);
			}
			return;
		}

		if (this.mode == 1) {
			targets = this.pos.findClosestByRange(FIND_STRUCTURES, {
				filter: (structure) => {
					return structure.structureType == STRUCTURE_TERMINAL && structure.store.getFreeCapacity() > 0;
				},
			});
			if (!targets) {
				targets = this.pos.findClosestByRange(FIND_STRUCTURES, {
					filter: (structure) => {
						return structure.structureType == STRUCTURE_CONTAINER && structure.store.getFreeCapacity() > 0;
					},
				});
			}
			res = _.filter(Object.keys(this.store), (res) => res != RESOURCE_ENERGY && this.store[res] != 0);
			this.harvesterTransfer([targets], res[0]);
			return;
		}

		targets = this.pos.findClosestByRange(FIND_STRUCTURES, {
			filter: { structureType: STRUCTURE_CONTAINER },
		});
		if (this.harvesterTransfer([targets])) {
			return;
		}

		targets = this.room.find(FIND_STRUCTURES, {
			filter: (structure) => {
				return structure.structureType == STRUCTURE_SPAWN && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
			},
		});
		if (this.harvesterTransfer(targets)) {
			return;
		}

		if (this.store.getFreeCapacity() > 0) {
			this.working = true;
			this.say("working");
		}

		targets = this.room.find(FIND_STRUCTURES, {
			filter: { structureType: STRUCTURE_SPAWN },
		});
		if (this.harvesterTransfer(targets)) {
			return;
		}
	}
};

module.exports = {
	/** @param {Creep} creep **/
	run: function (creep) {
		creep.doHarvest();
	},
};
