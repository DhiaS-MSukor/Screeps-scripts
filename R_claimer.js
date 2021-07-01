// JavaScript source code
Creep.prototype.doClaim = function (targets) {
	if (this.getActiveBodyparts(CLAIM) == 0) {
		this.suicide();
		return;
	}

	if (this.claimController(targets) != OK) {
		if (this.reserveController(targets) != OK) {
			if (this.attackController(targets) != OK) {
				this.moveTo(targets, { visualizePathStyle: { stroke: "#ff0000" }, maxOps: 100, range: 1 });
			}
		}
	}
};

module.exports = {
	/** @param {Creep} creep **/
	run: function (creep) {
		if (Game.rooms[Memory.roomTarget]) {
			creep.doClaim(Game.rooms[Memory.roomTarget].controller);
		}
	},
};
