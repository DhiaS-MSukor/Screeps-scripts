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
		} else if (!Memory.avoidRoom.includes(this.name)) {
			Memory.avoidRoom.push(this.name);
			return this.name;
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
				(this.memory.controllerPerformance.avg * 999 + (progress - this.memory.controllerPerformance.prev)) / 1000;
			this.memory.controllerPerformance.prev = progress;
		} else {
			this.memory.controllerPerformance = { prev: this.controller.progress, avg: 0 };
		}
		return this.memory.controllerPerformance;
	}
	return null;
};
