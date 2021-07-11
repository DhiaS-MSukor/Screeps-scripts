Object.defineProperty(Source.prototype, "memory", {
	configurable: true,
	get: function () {
		if (_.isUndefined(this.room.memory)) {
			this.room.memory = {};
		}
		if (!_.isObject(this.room.memory)) {
			return undefined;
		}
		return (this.room.memory[this.id] = this.room.memory[this.id] || {});
	},
	set: function (value) {
		if (_.isUndefined(this.room.memory)) {
			this.room.memory = {};
		}
		if (_.isObject(this.room.memory)) {
			this.room.memory[this.id] = value;
		}
	},
});

Object.defineProperty(Source.prototype, "assignedHarvesterName", {
	configurable: true,
	get: function () {
		if (!_.isUndefined(this.memory.assignedHarvesterName)) {
			return this.memory.assignedHarvesterName;
		}
		return undefined;
	},
	set: function (value) {
		if (!_.isUndefined(this.memory)) {
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
