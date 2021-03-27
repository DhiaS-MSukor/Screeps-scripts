// JavaScript source code
function doClaim(creep, targets) {
    if (creep.claimController(targets) != OK) {
        if (creep.reserveController(targets) != OK) {
            creep.moveTo(targets, { visualizePathStyle: { stroke: '#ff0000' } });
        }
    }
}

function goToRoom(creep, target) {
    // var routes = Game.map.findRoute(creep.room, target);
    // if (routes.length) {
    // }
    creep.moveTo(Game.maps[target].controller.pos, { visualizePathStyle: { stroke: '#ff0000' } });
}

module.exports = {

    /** @param {Creep} creep **/
    run: function (creep) {
        doClaim(creep, Game.map[Memory.roomTarget].controller);
    }
};
