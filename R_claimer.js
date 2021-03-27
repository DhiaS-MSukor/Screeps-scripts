// JavaScript source code
var doClaim = function (creep, targets) {
    if (creep.claimController(targets) != OK) {
        if (creep.reserveController(targets) != OK) {
            creep.moveTo(targets, { visualizePathStyle: { stroke: '#ff0000' } });
        }
    }
}

var goToRoom = function (creep, target) {
    // var routes = Game.map.findRoute(creep.room, target);

    if (routes.length) {
    }
    creep.moveToGame.maps[target].controller, { visualizePathStyle: { stroke: '#ff0000' } });
}

module.exports = {

    /** @param {Creep} creep **/
    run: function (creep) {
        try {
            if (creep.room.name != Memory.roomTarget) {
                goToRoom(creep, Memory.roomTarget)
                return;
            }
            doClaim(creep, creep.room.controller);
        } catch (e) { }
    }
};
