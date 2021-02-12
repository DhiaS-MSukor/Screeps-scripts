// JavaScript source code

var clean_mem = function () {
    try {
        for (var name in Memory.creeps) {
            if (!Game.creeps[name]) {
                delete Memory.creeps[name];
                return;
            }
        }
    } catch (err) { }
}

var gen_pixel = function () {
    if (Game.cpu.bucket > 5000) {
        Game.cpu.generatePixel();
    }
     
}

module.exports = {
    run: function () {
        gen_pixel();
        try {
            clean_mem();
        } catch (e) { }
    }
}