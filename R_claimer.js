// JavaScript source code
var doClaim = function(creep, targets) { 
    if(creep.attackController(targets[0]) != OK) {
        if (creep.claimController(targets[0]) != OK) {
            if (creep.reserveController(targets[0]) != OK) {
                creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ff0000'}}); 
			}  
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
        if (!Memory.validTarget) {return;}

        if (creep.room.name != Memory.roomTarget) {
            goToRoom(creep, Memory.roomTarget)
            return;
		} 

        doClaim(creep, creep,room.controller);
	}
};
