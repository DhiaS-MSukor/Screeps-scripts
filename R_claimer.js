// JavaScript source code
Creep.prototype.doClaimer = function (target) {
	if (this.getActiveBodyparts(CLAIM) == 0) {
		this.suicide();
		return;
	}

	if (this.claimController(target) != OK) {
		if (this.reserveController(target) != OK) {
			if (this.attackController(target) != OK) {
				this.moveTo(target, { visualizePathStyle: { stroke: "#ff0000" }, maxOps: (Game.cpu.limit - Game.cpu.getUsed()) * 100, range: 1 });
			}
		}
	}
};

module.exports = {
	/** @param {Creep} creep **/
	run: function (creep) {
		if (Game.rooms[Memory.roomTarget]) {
			if (creep.room.name != Memory.roomTarget) {
				const pos = creep.exitToRoom(Memory.roomTarget);
				if (pos) {
					const distance = creep.pos.getRangeTo(pos);
					creep.moveTo(pos, {
						visualizePathStyle: { stroke: "#ff0000" },
						maxOps: (Game.cpu.limit - Game.cpu.getUsed()) * 100,
						reusePath: Math.floor(Math.random() * distance * 10) + 10,
					});
				}
			} else {
				creep.doClaimer(Game.rooms[Memory.roomTarget].controller);
			}
		}
	},
};
