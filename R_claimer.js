// JavaScript source code
Creep.prototype.doClaimer = function (target) {
	if (this.getActiveBodyparts(CLAIM) == 0) {
		this.suicide();
		return;
	}

	if (this.claimController(target) != OK) {
		if (this.reserveController(target) != OK) {
			if (this.attackController(target) != OK) {
				this.moveTo(target, { visualizePathStyle: { stroke: "#ff0000" }, maxOps: 100, range: 1 });
			}
		}
	}
};

module.exports = {
	/** @param {Creep} creep **/
	run: function (creep) {
		if (Game.rooms[Memory.roomTarget]) {
			creep.doClaimer(Game.rooms[Memory.roomTarget].controller);
		}
	},
};
