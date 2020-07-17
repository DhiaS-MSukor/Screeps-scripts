// JavaScript source code
module.exports = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var target;

        target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(target) {
            if (creep.attack(target) != OK) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ff0f0f'}}); 
			} 
        }
	}
};
