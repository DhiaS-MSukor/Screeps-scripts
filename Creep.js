// JavaScript source code

Object.defineProperty(Creep.prototype, "role", {
	get: function () {
		return this.memory.role;
	},
	set: function (newValue) {
		this.memory.role = newValue;
	},
	enumerable: false,
	configurable: true,
});

Object.defineProperty(Creep.prototype, "mode", {
	get: function () {
		return this.memory.mode;
	},
	set: function (newValue) {
		this.memory.mode = newValue;
	},
	enumerable: false,
	configurable: true,
});

Object.defineProperty(Creep.prototype, "working", {
	get: function () {
		if (_.isUndefined(this.memory.working)) {
			this.memory.working = true;
		}
		return this.memory.working;
	},
	set: function (newValue) {
		this.memory.working = newValue;
	},
	enumerable: false,
	configurable: true,
});

Object.defineProperty(Creep.prototype, "task", {
	get: function () {
		if (_.isUndefined(this.memory.task)) {
			this.memory.task = 0;
		}
		return this.memory.task;
	},
	set: function (newValue) {
		this.memory.task = newValue;
	},
	enumerable: false,
	configurable: true,
});
