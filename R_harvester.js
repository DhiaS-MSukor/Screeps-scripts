Creep.prototype.doTransfer = function (targets, res = RESOURCE_ENERGY) {
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

Creep.prototype.doTask = function () {
	if (this.getActiveBodyparts(WORK) == 0 || (this.body.filter((i) => i.type == WORK).length < 5 && this.room.energyAvailable > 600)) {
		this.suicide();
		return;
	}
	if (this.fatigue > 0) {
		return;
	}

	var targets;

	if (this.memory.harvest && this.store.getFreeCapacity() == 0) {
		this.memory.harvest = false;
		this.say("transfer");
	}
	if (!this.memory.harvest && this.store.getUsedCapacity() == 0) {
		this.memory.harvest = true;
		this.say("harvest");
	}

	if (this.memory.harvest) {
		if (this.memory.mode == 1) {
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
			this.doTransfer(targets, res[0]);
			return;
		}

		targets = this.room.find(FIND_SOURCES);
		var harv = this.harvest(targets[0]);
		if (harv == ERR_NOT_IN_RANGE) {
			this.moveTo(targets[0], { visualizePathStyle: { stroke: "#00ff00" }, maxOps: 100, range: 1 });
		} else if (harv == ERR_NOT_ENOUGH_RESOURCES) {
			this.memory.harvest = false;
			this.say("!_!");
		}
		if (this.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
			targets = this.pos.findInRange(FIND_STRUCTURES, 1, {
				filter: (structure) =>
					structure.structureType == STRUCTURE_CONTAINER && structure.store.getFreeCapacity() >= this.store.getUsedCapacity(RESOURCE_ENERGY),
			});
			this.doTransfer(targets);
		}
	} else {
		if (this.memory.mode == 1) {
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
			this.doTransfer([targets], res[0]);
			return;
		}

		targets = this.pos.findClosestByRange(FIND_STRUCTURES, {
			filter: { structureType: STRUCTURE_CONTAINER },
		});
		if (this.doTransfer([targets])) {
			return;
		}

		targets = this.room.find(FIND_STRUCTURES, {
			filter: (structure) => {
				return structure.structureType == STRUCTURE_SPAWN && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
			},
		});
		if (this.doTransfer(targets)) {
			return;
		}

		if (this.store.getFreeCapacity() > 0) {
			this.memory.harvest = true;
			this.say("harvest");
		}

		targets = this.room.find(FIND_STRUCTURES, {
			filter: { structureType: STRUCTURE_SPAWN },
		});
		if (this.doTransfer(targets)) {
			return;
		}
	}
};

module.exports = {
	/** @param {Creep} creep **/
	run: function (creep) {
		doTask(creep);
	},
};
