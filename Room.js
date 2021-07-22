Room.prototype.isHighway = function (room) {
	const parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(room || this.name);
	return parsed[1] % 10 === 0 || parsed[2] % 10 === 0;
};

function closestNumber(n, m) {
	// find the quotient
	let q = parseInt(n / m);

	// 1st possible closest number
	let n1 = m * q;

	// 2nd possible closest number
	let n2 = n * m > 0 ? m * (q + 1) : m * (q - 1);

	// if true, then n1 is the
	// required closest number
	if (Math.abs(n - n1) < Math.abs(n - n2)) return n1;

	// else n2 is the required
	// closest number
	return n2;
}

Room.prototype.getClosestHighway = function (room) {
	const parsed = /^([WE])([0-9]+)([NS])([0-9]+)$/.exec(room || this.name);

	const d1 = parsed[2] % 10 > 5 ? 10 - (parsed[2] % 10) : parsed[2] % 10;
	const d2 = parsed[4] % 10 > 5 ? 10 - (parsed[4] % 10) : parsed[4] % 10;

	if (d1 > d2) {
		const h = closestNumber(parsed[4], 10);
		return `${parsed[1]}${parsed[2]}${parsed[3]}${h}`;
	}
	const h = closestNumber(parsed[2], 10);
	return `${parsed[1]}${h}${parsed[3]}${parsed[4]}`;
};

Room.prototype.isAvoid = function (room) {
	return Memory.avoidRoom && Array.isArray(Memory.avoidRoom) && room && Memory.avoidRoom.includes(room);
};

Room.prototype.avoidThis = function (room) {
	if (Memory.avoidRoom && Array.isArray(Memory.avoidRoom)) {
		if (room && !Memory.avoidRoom.includes(room)) {
			Memory.avoidRoom.push(room);
			return room;
		}
	} else {
		Memory.avoidRoom = [];
	}
};

Room.prototype.getControllerPerformance = function () {
	if (this.controller && this.controller.my) {
		if (this.memory.controllerPerformance && "prev" in this.memory.controllerPerformance && "avg" in this.memory.controllerPerformance) {
			const progress = this.controller.progress;
			this.memory.controllerPerformance.avg =
				(this.memory.controllerPerformance.avg * (CREEP_LIFE_TIME - 1) + (progress - this.memory.controllerPerformance.prev)) / CREEP_LIFE_TIME;
			this.memory.controllerPerformance.prev = progress;
		} else {
			this.memory.controllerPerformance = { prev: this.controller.progress, avg: 0 };
		}
		return this.memory.controllerPerformance;
	}
	return null;
};

function getWhitelist() {
	//----return your whiteList here-------------------
	return Memory.whiteList || [];
}

//------module code------------

let originFind = Room.prototype.find;
Room.prototype.myFind = function (type, opts) {
	let result = originFind.call(this, type, opts);
	if (
		type === FIND_HOSTILE_CREEPS ||
		type === FIND_HOSTILE_CONSTRUCTION_SITES ||
		type === FIND_HOSTILE_POWER_CREEPS ||
		type === FIND_HOSTILE_SPAWNS ||
		type === FIND_HOSTILE_STRUCTURES
	) {
		result = result.filter((o) => !getWhitelist().includes(o.owner.username));
	}
	return result;
};

let originLookForAt = Room.prototype.lookForAt;

function isFriend(o) {
	return getWhitelist().includes(o.owner.username) && !o.my;
}

function isHostile(o) {
	return !getWhitelist().includes(o.owner.username) && !o.my;
}

Room.prototype.myLookForAt = function (type, firstArg, secondArg) {
	if (type === "LOOK_FRIEND") {
		let result = originLookForAt.call(this, LOOKCREEPS, firstArg, secondArg);
		result = result.filter(isFriend);
		return result;
	} else if (type === "LOOK_HOSTILE") {
		let result = originLookForAt.call(this, LOOKCREEPS, firstArg, secondArg);
		result = result.filter(isHostile);
		return result;
	} else {
		return originLookForAt.call(this, type, firstArg, secondArg);
	}
};
let originLookForAtArea = Room.prototype.lookForAtArea;

function solveArea(result, asArray, o) {
	if (!asArray) {
		for (let i in result) {
			let temp = result[i];
			for (let j in temp) {
				let tmp = temp[j];
				if (tmp) {
					tmp = tmp.filter((o) => getWhitelist().includes(o.owner.username) && !o.my);
				}
				if (tmp.length === 0) {
					temp[i] = undefined;
				} else {
					temp[i] = tmp;
				}
			}
		}
	} else {
		result = result.filter((o) => getWhitelist().includes(o.creep.owner.username) && !o.creep.my);
	}
	return result;
}

Room.prototype.myLookForAtArea = function (type, top, left, bottom, right, asArray) {
	if (type === "LOOK_FRIEND") {
		let result = originLookForAtArea.call(this, LOOK_CREEPS, top, left, bottom, right, asArray);
		result = solveArea(result, asArray, isFriend);
		return result;
	} else if (type === "LOOK_HOSTILE") {
		let result = originLookForAtArea.call(this, LOOK_CREEPS, top, left, bottom, right, asArray);
		result = solveArea(result, asArray, isHostile);
		return result;
	} else {
		return originLookForAtArea.call(this, type, top, left, bottom, right, asArray);
	}
};
