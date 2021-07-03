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

Object.defineProperty(Source.prototype, "assignedHarvester", {
	configurable: true,
	get: function () {
		if (!_.isUndefined(this.memory?.assignedHarvester)) {
			return this.memory.assignedHarvester;
		}
		return undefined;
	},
	set: function (value) {
		if (!_.isUndefined(this.memory?.assignedHarvester)) {
			this.memory.assignedHarvester = value;
		}
	},
});

Object.defineProperty(Source.prototype, "isHarvesterAlive", {
	configurable: true,
	enumerable: false,
	get: function () {
		return this.assignedHarvester in Game.creeps;
	},
});
