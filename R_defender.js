// JavaScript source code
var goToRoom = function (creep, target) {
    var routes = Game.map.findRoute(creep.room, target);

    if (routes.length) {
        creep.moveTo(creep.pos.findClosestByRange(routes[0].exit), {visualizePathStyle: {stroke: '#ff0000'}});
	} 
}

module.exports = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var target;

        if (creep.memory.v == 1 && creep.room.name != Memory.roomTarget) {
            goToRoom(creep, Memory.roomTarget)
            return;
		}
        if (creep.memory.v == 2 && creep.room.name != Memory.raidTarget) {
            goToRoom(creep, Memory.roomTarget)
            return;
		}

        target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(target) {
            if (creep.attack(target) != OK) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000'}}); 
                return;
			} 
        }

        target = creep.room.controller;
        if (target){
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000'}}); 
                return;
		}
	}
};
