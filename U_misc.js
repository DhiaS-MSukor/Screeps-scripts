// JavaScript source code

var clean_mem = function(){
    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            break;
        }
    }
}

var gen_pixel = function(){
    if(Game.cpu.bucket > 9000) {
        Game.cpu.generatePixel();
    }
}

module.exports = {
    run: function(){
        clean_mem();
        gen_pixel();
	}
}