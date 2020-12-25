// JavaScript source code

var clean_mem = function(){
    try{
        for(var name in Memory.creeps) {
            if(!Game.creeps[name]) {
                delete Memory.creeps[name];
                return;
            }
        } 
    }catch(err){}
}

var gen_pixel = function(){
    try{
        if(Game.cpu.bucket > 5000) {
            Game.cpu.generatePixel();
        } 
    }catch(err){}
}

module.exports = {
    run: function(){
        clean_mem();
        gen_pixel();
	}
}