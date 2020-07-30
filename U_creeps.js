// JavaScript source code
var r_harvester = require('R_harvester');
var r_builder = require('R_builder');
var r_repairer = require('R_repairer');
var r_runner = require('R_runner'); 
var r_claimer = require('R_claimer');  
var r_defender = require('R_defender'); 

var run_role = function(){
    var creep;

    for(var name in Game.creeps) {
        creep = Game.creeps[name];

        if(creep.memory.role == 'harvester') {
            r_harvester.run(creep);
        }
        else if(creep.memory.role == 'builder') {
            r_builder.run(creep);
        }
        else if(creep.memory.role == 'repairer') {
            r_repairer.run(creep);
        }
        else if(creep.memory.role == 'runner') {
            r_runner.run(creep);
        }
        else if(['defender', 'healer', 'ranger', 'tank'].includes(creep.memory.role)) {
            r_defender.run(creep);
        } 
        else if(creep.memory.role == 'claimer') {
            r_claimer.run(creep);
        } 
    }
}

var do_spawn = function(spawn, theRole, varience, mode) {
    var name = theRole + varience + Game.time;
    var mem = {memory: {role: theRole, v: varience, spawn: spawn, mode: mode, task: 0}};
    var res = -2;

    if (varience == 'v0') { // 300 energy
        if (theRole == 'harvester') {
            res = Game.spawns[spawn].spawnCreep([WORK, WORK, CARRY, MOVE], name, mem);
        }
        else if (theRole == 'builder') {
            res = Game.spawns[spawn].spawnCreep([CARRY, MOVE, WORK, CARRY, MOVE], name, mem);
        }
        else if (theRole == 'repairer') {
            res = Game.spawns[spawn].spawnCreep([WORK, MOVE, CARRY, MOVE], name, mem);
        }
        else if (theRole == 'runner') {
            res = Game.spawns[spawn].spawnCreep([CARRY, CARRY, CARRY, MOVE, MOVE, MOVE], name, mem);
        } 
        else if (theRole == 'defender') {
            res = Game.spawns[spawn].spawnCreep([ATTACK, MOVE, ATTACK, MOVE], name, mem);
        }
        else if (theRole == 'healer') {
            res = Game.spawns[spawn].spawnCreep([HEAL, MOVE], name, mem);
        }
        else if (theRole == 'ranger') {
            res = Game.spawns[spawn].spawnCreep([TOUGH,MOVE,MOVE,RANGED_ATTACK], name, mem);
        }
	}
    else if (varience == 'v1') { // 550 energy
        if (theRole == 'harvester') {
            res = Game.spawns[spawn].spawnCreep([WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE], name, mem);
        }
        else if (theRole == 'builder') {
            res = Game.spawns[spawn].spawnCreep([MOVE, CARRY, MOVE, WORK, MOVE, WORK, MOVE, CARRY, MOVE], name, mem);
        }
        else if (theRole == 'defender') {
            res = Game.spawns[spawn].spawnCreep(new Array(8).fill(MOVE,0,4).fill(ATTACK,4), name, mem);
        }
        else if (theRole == 'runner') {
            res = Game.spawns[spawn].spawnCreep(new Array(10).fill(CARRY,0,5).fill(MOVE,5), name, mem);
        } 
        else if (theRole == 'ranger') {
            res = Game.spawns[spawn].spawnCreep([MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK], name, mem);
        }
        else if (theRole == 'healer') {
            res = Game.spawns[spawn].spawnCreep([HEAL, HEAL, MOVE], name, mem);
        }
    }
    else if (varience == 'v2') { // 800 energy
        if (theRole == 'defender') {
            res = Game.spawns[spawn].spawnCreep(new Array(11).fill(MOVE,0,5).fill(ATTACK,5).concat([MOVE]), name, mem);
        }
        else if (theRole == 'runner') {
            res = Game.spawns[spawn].spawnCreep(new Array(16).fill(CARRY,0,8).fill(MOVE,8), name, mem);
        } 
        else if (theRole == 'harvester') {
            res = Game.spawns[spawn].spawnCreep(new Array(7).fill(WORK).concat([CARRY, MOVE]), name, mem);
        }
        else if (theRole == 'builder') {
            res = Game.spawns[spawn].spawnCreep(new Array(13).fill(CARRY,0,3).fill(WORK,3,6).fill(MOVE,6), name, mem);
        }
        else if (theRole == 'ranger') {
            res = Game.spawns[spawn].spawnCreep(new Array(8).fill(MOVE,0,4).fill(RANGED_ATTACK,4), name, mem);
        }
        else if (theRole == 'healer') {
            res = Game.spawns[spawn].spawnCreep([HEAL, HEAL, HEAL, MOVE], name, mem);
        }
        else if (theRole == 'claimer') {
            res = Game.spawns[spawn].spawnCreep([CLAIM, MOVE], name, mem);
        } 
    }
    else if (varience == 'v3') { // 1300 energy
        if (theRole == 'runner') {
            res = Game.spawns[spawn].spawnCreep(new Array(26).fill(CARRY,0,13).fill(MOVE,13), name, mem);
        }
        else if (theRole == 'harvester') {
            res = Game.spawns[spawn].spawnCreep(new Array(12).fill(WORK).concat([CARRY, MOVE]), name, mem);
        }
        else if (theRole == 'builder') {
            res = Game.spawns[spawn].spawnCreep(new Array(21).fill(CARRY,0,5).fill(WORK,5,10).fill(MOVE,10), name, mem);
        }
        else if (theRole == 'defender') {
            res = Game.spawns[spawn].spawnCreep(new Array(20).fill(MOVE,0,10).fill(ATTACK,10), name, mem);
        }
        else if (theRole == 'ranger') {
            res = Game.spawns[spawn].spawnCreep(new Array(12).fill(MOVE,0,6).fill(RANGED_ATTACK,6), name, mem);
        }
        else if (theRole == 'healer') {
            res = Game.spawns[spawn].spawnCreep(new Array(8).fill(MOVE,0,4).fill(HEAL,4), name, mem);
        }
        else if (theRole == 'claimer') {
            res = Game.spawns[spawn].spawnCreep([MOVE,MOVE,CLAIM,CLAIM], name, mem);
        } 
	}
    else if (varience == 'v4') { // 1800 energy
        if (theRole == 'runner') {
            res = Game.spawns[spawn].spawnCreep(new Array(36).fill(CARRY,0,18).fill(MOVE,18), name, mem);
        }
        else if (theRole == 'harvester') {
            res = Game.spawns[spawn].spawnCreep(new Array(17).fill(WORK).concat([CARRY, MOVE]), name, mem);
        }
        else if (theRole == 'builder') {
            res = Game.spawns[spawn].spawnCreep(new Array(29).fill(CARRY,0,7).fill(WORK,7,14).fill(MOVE,14), name, mem);
        }
        else if (theRole == 'defender') {
            res = Game.spawns[spawn].spawnCreep(new Array(26).fill(MOVE,0,13).fill(ATTACK,13).concat([MOVE, MOVE]), name, mem);
        }
        else if (theRole == 'ranger') {
            res = Game.spawns[spawn].spawnCreep(new Array(18).fill(MOVE,0,9).fill(RANGED_ATTACK,9), name, mem);
        }
        else if (theRole == 'healer') {
            res = Game.spawns[spawn].spawnCreep(new Array(12).fill(MOVE,0,6).fill(HEAL,6), name, mem);
        }
	}
    else if (varience == 'v5') { // 2300 energy
        if (theRole == 'runner') {
            res = Game.spawns[spawn].spawnCreep(new Array(46).fill(CARRY,0,23).fill(MOVE,23), name, mem);
        }
        else if (theRole == 'harvester') {
            res = Game.spawns[spawn].spawnCreep(new Array(22).fill(WORK).concat([CARRY, MOVE]), name, mem);
        }
        else if (theRole == 'builder') {
            res = Game.spawns[spawn].spawnCreep(new Array(37).fill(CARRY,0,9).fill(WORK,9,18).fill(MOVE,18), name, mem);
        }
        else if (theRole == 'defender') {
            res = Game.spawns[spawn].spawnCreep(new Array(34).fill(MOVE,0,17).fill(ATTACK,17).concat([MOVE]), name, mem);
        }
        else if (theRole == 'ranger') {
            res = Game.spawns[spawn].spawnCreep(new Array(22).fill(MOVE,0,11).fill(RANGED_ATTACK,11), name, mem);
        }
        else if (theRole == 'healer') {
            res = Game.spawns[spawn].spawnCreep(new Array(14).fill(MOVE,0,7).fill(HEAL,7), name, mem);
        }
        else if (theRole == 'claimer') {
            res = Game.spawns[spawn].spawnCreep([MOVE,MOVE,MOVE,CLAIM,CLAIM,CLAIM], name, mem);
        } 
	}
    else if (varience == 'v6') { // 5300 energy
        if (theRole == 'runner') {
            res = Game.spawns[spawn].spawnCreep(new Array(50).fill(CARRY,0,25).fill(MOVE,25), name, mem);
        }
        else if (theRole == 'harvester') {
            res = Game.spawns[spawn].spawnCreep(new Array(47).fill(WORK).concat([CARRY, CARRY, MOVE]), name, mem);
        }
        else if (theRole == 'builder') {
            res = Game.spawns[spawn].spawnCreep(new Array(50).fill(CARRY,0,12).fill(WORK,12,25).fill(MOVE,25), name, mem);
        }
        else if (theRole == 'defender') {
            res = Game.spawns[spawn].spawnCreep(new Array(50).fill(MOVE,0,25).fill(ATTACK,25), name, mem);
        }
        else if (theRole == 'ranger') {
            res = Game.spawns[spawn].spawnCreep(new Array(50).fill(MOVE,0,25).fill(RANGED_ATTACK,25), name, mem);
        }
        else if (theRole == 'healer') {
            res = Game.spawns[spawn].spawnCreep(new Array(36).fill(MOVE,0,18).fill(HEAL,18), name, mem);
        }
        else if (theRole == 'claimer') {
            res = Game.spawns[spawn].spawnCreep(new Array(16).fill(CLAIM,0,8).fill(MOVE,8), name, mem);
        } 
	}
    else if (varience == 'v7') { // 12300 energy 
        if (theRole == 'healer') {
            res = Game.spawns[spawn].spawnCreep(new Array(50).fill(MOVE,0,25).fill(HEAL,25), name, mem);
        }
        else if (theRole == 'claimer') {
            res = Game.spawns[spawn].spawnCreep(new Array(38).fill(CLAIM,0,19).fill(MOVE,19), name, mem);
        } 
	} 

    return res == OK;
}

var spawn_check = function(spawn, theRole, mode, n) {
    var creeps = _.filter(Game.creeps, (creep) => creep.memory.role == theRole && creep.memory.mode == mode && creep.memory.spawn == spawn); 

    if (creeps.length < n) {  
        if (do_spawn(spawn, theRole, 'v7', mode)) {return true;} 
        else if (do_spawn(spawn, theRole, 'v6', mode)) {return true;} 
        else if (do_spawn(spawn, theRole, 'v5', mode)) {return true;} 
        else if (do_spawn(spawn, theRole, 'v4', mode)) {return true;} 
        else if (do_spawn(spawn, theRole, 'v3', mode)) {return true;} 
        else if (do_spawn(spawn, theRole, 'v2', mode)) {return true;} 
        else if (do_spawn(spawn, theRole, 'v1', mode)) {return true;} 
        else if (do_spawn(spawn, theRole, 'v0', mode)) {return true;} 
    }
    return false;
}

var spawnBusy = function (spawn) {
    if (Game.spawns[spawn].spawning) {return true;}
    return (Game.spawns[spawn].room.energyAvailable < 300);
}

var auto_respawn = function(){
    var name;

    for (var spawn in Memory.spawns) {  
        if (spawnBusy(spawn)) {continue;}

        // first spawn
        // essentials
        if (spawn_check(spawn, 'harvester', 0, 1)) {return;}
        else if (spawn_check(spawn, 'builder', 0, 1)) {return;}
        else if (spawn_check(spawn, 'runner', 0, 1)) {return;}
        else if (spawn_check(spawn, 'repairer', 0, 1)) {return;}

        // local ranger
        else if (spawn_check(spawn, 'ranger', 0, 1)) {return;}  

        // looters
        else if (spawn_check(spawn, 'harvester', 1, 1)) {return;} 
        else if (spawn_check(spawn, 'defender', 1, 1)) {return;} 

        // local healer and defender
        else if (spawn_check(spawn, 'healer', 0, 1)) {return;}  
        else if (spawn_check(spawn, 'defender', 0, 1)) {return;}  

        // raiders
        else if (spawn_check(spawn, 'defender', 2, 1)) {return;} 

        // spawn to num
        // essentials
        else if (spawn_check(spawn, 'harvester', 0, 2)) {return;}
        //else if (spawn_check(spawn, 'builder', 0, 2)) {return;}
        else if (spawn_check(spawn, 'runner', 0, 2)) {return;}
        //else if (spawn_check(spawn, 'repairer', 0, 1)) {return;}

        // local defender
        //else if (spawn_check(spawn, 'defender', 0, 3)) {return;}  

        // looters
        // else if (spawn_check(spawn, 'harvester', 1, 1)) {return;} 
        // else if (spawn_check(spawn, 'defender', 1, 1)) {return;} 

        // raiders
        // else if (spawn_check(spawn, 'defender', 2, 1)) {return;} 
        
        // claimer
        else if (Memory.spawnClaimer && spawn_check(spawn, 'claimer', 0, 1)) {return;}  
	}
}

module.exports = {
    run: function(){
        run_role();
        auto_respawn();
	}
}