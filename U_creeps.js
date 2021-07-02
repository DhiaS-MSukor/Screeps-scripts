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
