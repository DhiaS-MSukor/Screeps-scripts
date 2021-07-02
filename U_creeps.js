// JavaScript source code
var r_harvester = require("R_harvester");
var r_builder = require("R_builder");
var r_repairer = require("R_repairer");
var r_runner = require("R_runner");
var r_claimer = require("R_claimer");
var r_defender = require("R_defender");

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

var run_role = function () {
	var creep;
	for (var name in Game.creeps) {
		creep = Game.creeps[name];

		if (creep.role == "harvester") {
			r_harvester.run(creep);
		} else if (creep.role == "builder") {
			r_builder.run(creep);
		} else if (creep.role == "repairer") {
			r_repairer.run(creep);
		} else if (creep.role == "runner") {
			r_runner.run(creep);
		} else if (["defender", "healer", "ranger", "troll"].includes(creep.role)) {
			r_defender.run(creep);
		} else if (creep.role == "claimer") {
			r_claimer.run(creep);
		}
	}
};

module.exports = {
	run: function () {
		run_role();
	},
};
