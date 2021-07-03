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

Creep.prototype.harvesterTransfer = function (targets, res = RESOURCE_ENERGY) {
	if (targets.length > 0) {
		var result = this.transfer(targets[0], res);
		if (result == ERR_NOT_IN_RANGE) {
			this.moveTo(targets[0], {
				visualizePathStyle: { stroke: "#00ff00" },
				maxOps: 100,
				reusePath: 4,
				range: 1,
			});
			return true;
		}
		return result == OK;
	}

	return false;
};

Creep.prototype.doHarvest = function () {
	if (this.getActiveBodyparts(WORK) == 0 || (this.body.filter((i) => i.type == WORK).length < 5 && this.room.energyAvailable > 600)) {
		this.suicide();
		return;
	}
	if (this.fatigue > 0) {
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
			targets = this.pos.findClosestByRange(FIND_MINERALS);
			var harv = this.harvest(targets);
			if (harv != OK) {
				this.moveTo(targets, { visualizePathStyle: { stroke: "#00ff00" }, range: 1 });
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
			res = _.filter(Object.keys(this.store), (res) => res != RESOURCE_ENERGY && this.store[res] != 0);
			this.harvesterTransfer(targets, res[0]);
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
				this.moveTo(this.assignedSource, { visualizePathStyle: { stroke: "#00ff00" }, maxOps: 100, range: 1 });
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
