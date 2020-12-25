
module.exports = {
    run: function () {
        for (var name in Memory.towers) {
            doRole(Game.getObjectById(Memory.towers[name]));
        }
    },
    getBuild:function(){}
}