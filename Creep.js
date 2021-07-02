// JavaScript source code

Object.defineProperty(Creep.prototype, "role", {
	get: function () {
		return this.memory.role;
	},
	set: function (val) {
		this.memory.role = val;
	},
	enumerable: false,
	configurable: true,
});

Object.defineProperty(Creep.prototype, "mode", {
	get: function () {
		return this.memory.mode;
	},
	set: function (val) {
		this.memory.mode = val;
	},
	enumerable: false,
	configurable: true,
});

Object.defineProperty(Creep.prototype, "working", {
	get: function () {
		if (!this.memory.working) {
			this.memory.working = false;
		}
		return this.memory.working;
	},
	set: function (val) {
		this.memory.working = val;
	},
	enumerable: false,
	configurable: true,
});

Object.defineProperty(Creep.prototype, "task", {
	get: function () {
		return this.memory.task;
	},
	set: function (val) {
		this.memory.task = val;
	},
	enumerable: false,
	configurable: true,
});
