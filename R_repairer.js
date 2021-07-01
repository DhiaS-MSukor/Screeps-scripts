Creep.prototype.  doMove =function ( target, range = 3) {
	if (target) {
		const distance = this.pos.getRangeTo(target);
		return this.moveTo(target, {
			visualizePathStyle: { stroke: "#ffff00" },
			range: range,
			reusePath: Math.floor(Math.random() * distance * 10) + distance,
		});
	}
}

Creep.prototype. doRepair = function ( targets) {
	if (targets) {
		if (targets.length) {
			if (this.repair(targets[0]) == ERR_NOT_IN_RANGE) {
				this.doMove( targets[0]);
			}
			return true;
		} else {
			if (this.repair(targets) == ERR_NOT_IN_RANGE) {
				this.doMove( targets);
			}
			return true;
		}
	}
	return false;
};

Creep.prototype.doTask = function () {
	if (this.getActiveBodyparts(WORK) == 0) {
		this.suicide();
		return;
	}

	var targets;

	if (this.memory.building && this.store[RESOURCE_ENERGY] == 0) {
		this.memory.building = false;
		this.say("harvest");
	}
	if (!this.memory.building && this.store.getFreeCapacity() < HARVEST_POWER * this.getActiveBodyparts(WORK)) {
		this.memory.building = true;
		this.memory.task = (this.memory.task + 1) % 3;
		this.say("repair");
	}

	if (this.memory.building && this.store[RESOURCE_ENERGY] > 0) { 
		targets = this.pos.findClosestByRange(FIND_STRUCTURES, {
			filter: (structure) => {
				return structure.hits < structure.hitsMax && (structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_ROAD);
			},
		});
		if (this.doRepair( targets)) {
			return;
		}

		targets = this.pos.findClosestByRange(FIND_MY_STRUCTURES, {
			filter: (structure) => {
				return structure.hits < structure.hitsMax;
			},
		});
		if (this.doRepair( targets)) {
			return;
		}

		targets = this.pos.findClosestByRange(FIND_STRUCTURES, {
			filter: (structure) => {
				return structure.hits < structure.hitsMax && structure.structureType == STRUCTURE_RAMPART;
			},
		});
		if (this.doRepair( targets)) {
			return;
		}

		targets = this.pos.findClosestByRange(FIND_STRUCTURES, {
			filter: (structure) => {
				return structure.hits < structure.hitsMax;
			},
		});
		if (targets && this.doRepair( targets)) {
			return;
		}

		if (this.room.controller) {
			if (this.upgradeController(this.room.controller) == ERR_NOT_IN_RANGE) {
				this.doMove( this.room.controller);
			}
		}
	} else {
		targets = this.pos.findClosestByRange(FIND_STRUCTURES, {
			filter: (structure) => {
				return structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > this.store.getFreeCapacity();
			},
		});
		if (targets) {
			if (this.withdraw(targets, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
				this.doMove( targets, 1);
				return;
			}
		}

		var t = this.room.find(FIND_SOURCES_ACTIVE);
		if (t.length) {
			targets = t[t.length - 1];
			if (this.harvest(targets) != OK) {
				this.doMove( targets, 1);
			}
		}
	}
};

module.exports = {
	/** @param {Creep} this **/
	run: function (this) {
		this.doTask();
	},
};
