// JavaScript source code
function doClaim(creep, targets) {
    if (creep.getActiveBodyparts(CLAIM) == 0) {
        creep.suicide()
        return
    }

    if (creep.claimController(targets) != OK) {
        if (creep.reserveController(targets) != OK) {
            if (creep.attackController(targets) != OK) {
                creep.moveTo(targets, { visualizePathStyle: { stroke: '#ff0000' }, maxOps: 100, range: 1 });
            }
        }
    }
}

module.exports = {

    /** @param {Creep} creep **/
    run: function (creep) {
        if (Game.rooms[Memory.roomTarget]) {
            doClaim(creep, Game.rooms[Memory.roomTarget].controller);
        }
    }
};
