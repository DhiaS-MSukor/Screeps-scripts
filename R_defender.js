// JavaScript source code
module.exports = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var target;

        if (creep.memory.raid && creep.room.name != Memory.raidLocation) {
            goToRoom(creep, Memory.raidLocation)
            return;
		}

        target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(target) {
            if (creep.attack(target) != OK) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0000'}}); 
			} 
        }
	}
};
