// JavaScript source code
Creep.prototype.doClaimer = function (target) {
	if (this.getActiveBodyparts(CLAIM) == 0) {
		this.suicide();
		return;
	}

	if (this.claimController(target) != OK) {
		if (this.reserveController(target) != OK) {
			if (this.attackController(target) != OK) {
				const distance = this.pos.getRangeTo(target);
				const ops = Math.max(Math.min((Game.cpu.limit - Game.cpu.getUsed()) * 100, 2000), 1);
				this.moveTo(target, {
					visualizePathStyle: { stroke: "#ff0000" },
					maxOps: ops,
					range: 1,
					reusePath: Math.floor(Math.random() * distance) + distance + 1,
				});
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
						reusePath: Math.floor(Math.random() * distance * 10) + 10,
					});
				}
			} else {
				creep.doClaimer(Game.rooms[Memory.roomTarget].controller);
			}
		}
	},
};
