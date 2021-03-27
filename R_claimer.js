// JavaScript source code
function doClaim(creep, targets) {
    if (creep.claimController(targets) != OK) {
        if (creep.reserveController(targets) != OK) {
            creep.moveTo(targets, { visualizePathStyle: { stroke: '#ff0000' }, maxOps: 100 });
        }
    }
}

module.exports = {

    /** @param {Creep} creep **/
    run: function (creep) {
        doClaim(creep, Game.rooms[Memory.roomTarget].controller);
    }
};
