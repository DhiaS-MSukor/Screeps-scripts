// JavaScript source code
var goToRoom = function (creep, target) {
    var routes = Game.map.findRoute(creep.room, target);

    if (routes.length) {
        creep.moveTo(creep.pos.findClosestByRange(routes[0].exit), {visualizePathStyle: {stroke: '#ff0000'}});
	} 
}

var doTask = function(creep, target) {
    if (creep.memory.role == 'ranger') {
        return creep.rangedAttack(target);
	}
    else if (creep.memory.role == 'healer') {
        var res = creep.heal(target);
        if (res == ERR_NOT_IN_RANGE) {
            creep.rangedHeal(target);
            return res;
		}
        return res;
	} 
    else if (creep.memory.role == 'troll') {
        creep.heal(creep);
        return ERR_NOT_IN_RANGE;
	}
    return creep.attack(target); 
}

var doRole = function(creep, target) {
    if (doTask(creep, target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000'}}); 
        return;
	} 
}

module.exports = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var target;

        if (creep.memory.role == 'healer') {
            target = creep.pos.findClosestByRange(FIND_MY_CREEPS, {filter: (targets) => {return (targets.hits < targets.hitsMax)}});
            if (target) { doRole(creep, target); return;} 
	    } 
        else {
            target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, 
                     {filter: (target) => (target.body.some((val) => [HEAL, CLAIM, RANGED_ATTACK, ATTACK, WORK].includes(val)))});
            if (target) { doRole(creep, target); return;}

            target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {filter: (targets) => {return (targets.hits > 0)}});
            if(target) { doRole(creep, target); return;}
		} 

        if (creep.memory.mode == 1 && creep.room.name != Memory.roomTarget) {
            goToRoom(creep, Memory.roomTarget)
            return;
		}
        else if (creep.memory.mode == 2 && creep.room.name != Memory.raidTarget) {
            goToRoom(creep, Memory.raidTarget)
            return;
		}

        target = creep.room.controller;
        if (target){
            creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000'}}); 
                return;
		}
	}
};
