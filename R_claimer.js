// JavaScript source code
var doClaim = function(creep, targets) {  
    if (creep.claimController(targets) != OK) {
        if (creep.reserveController(targets) != OK) {
            creep.moveTo(targets, {visualizePathStyle: {stroke: '#ff0000'}}); 
		}  
    } 
}

var goToRoom = function (creep, target) {
    var routes = Game.map.findRoute(creep.room, target);

    if (routes.length) {
        creep.moveTo(creep.pos.findClosestByRange(routes[0].exit), {visualizePathStyle: {stroke: '#ff0000'}});
	} 
}

module.exports = {

    /** @param {Creep} creep **/
    run: function(creep) {  
        if (creep.room.name != Game.spawns[creep.memory.spawn].memory.roomTarget) {
            goToRoom(creep, Game.spawns[creep.memory.spawn].memory.roomTarget)
            return;
		} 

        doClaim(creep, creep.room.controller);
	}
};
