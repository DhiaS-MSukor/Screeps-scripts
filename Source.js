Object.defineProperty(Source.prototype, "memory", {
	configurable: true,
	get: function () {
		if (_.isUndefined(Memory.mySourcesMemory)) {
			Memory.mySourcesMemory = {};
		}
		if (!_.isObject(Memory.mySourcesMemory)) {
			return undefined;
		}
		return (Memory.mySourcesMemory[this.id] = Memory.mySourcesMemory[this.id] || {});
	},
	set: function (value) {
		if (_.isUndefined(Memory.mySourcesMemory)) {
			Memory.mySourcesMemory = {};
		}
		if (_.isObject(Memory.mySourcesMemory)) {
			Memory.mySourcesMemory[this.id] = value;
		}
	},
});

Object.defineProperty(Source.prototype, "assignedHarvesterName", {
	configurable: true,
	get: function () {
		if (!_.isUndefined(this.memory?.assignedHarvesterName)) {
			return this.memory.assignedHarvesterName;
		}
		return undefined;
	},
	set: function (value) {
		if (!_.isUndefined(this.memory?.assignedHarvesterName)) {
			this.memory.assignedHarvesterName = value;
		}
	},
});

Object.defineProperty(Source.prototype, "isHarvesterAlive", {
	configurable: true,
	enumerable: false,
	get: function () {
		return this.assignedHarvesterName in Game.creeps;
	},
});
