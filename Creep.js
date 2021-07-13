// JavaScript source code

Object.defineProperty(Creep.prototype, "role", {
	get: function () {
		return this.memory.role;
	},
	set: function (newValue) {
		this.memory.role = newValue;
	},
	enumerable: false,
	configurable: true,
});

Object.defineProperty(Creep.prototype, "mode", {
	get: function () {
		return this.memory.mode;
	},
	set: function (newValue) {
		this.memory.mode = newValue;
	},
	enumerable: false,
	configurable: true,
});

Object.defineProperty(Creep.prototype, "origin", {
	get: function () {
		return this.memory.origin;
	},
	set: function (newValue) {
		this.memory.origin = newValue;
	},
	enumerable: false,
	configurable: true,
});

Object.defineProperty(Creep.prototype, "working", {
	get: function () {
		if (_.isUndefined(this.memory.working)) {
			this.memory.working = true;
		}
		return this.memory.working;
	},
	set: function (newValue) {
		this.memory.working = newValue;
	},
	enumerable: false,
	configurable: true,
});

Object.defineProperty(Creep.prototype, "task", {
	get: function () {
		if (_.isUndefined(this.memory.task)) {
			this.memory.task = 0;
		}
		return this.memory.task;
	},
	set: function (newValue) {
		this.memory.task = newValue;
	},
	enumerable: false,
	configurable: true,
});

Object.defineProperty(Creep.prototype, "routeToRoom", {
	get: function () {
		if (_.isUndefined(this.memory.routeToRoom)) {
			this.memory.routeToRoom = [];
		}
		return this.memory.routeToRoom;
	},
	set: function (newValue) {
		this.memory.routeToRoom = newValue;
	},
	enumerable: false,
	configurable: true,
});

Object.defineProperty(Creep.prototype, "roomDestination", {
	get: function () {
		if (_.isUndefined(this.memory.roomDestination)) {
			this.memory.roomDestination = false;
		}
		return this.memory.roomDestination;
	},
	set: function (newValue) {
		this.memory.roomDestination = newValue;
	},
	enumerable: false,
	configurable: true,
});

Object.defineProperty(Creep.prototype, "savedExit", {
	get: function () {
		if (this.memory.savedExit && "x" in this.memory.savedExit && "y" in this.memory.savedExit && "roomName" in this.memory.savedExit) {
			return new RoomPosition(this.memory.savedExit.x, this.memory.savedExit.y, this.memory.savedExit.roomName);
		}
		return null;
	},
	set: function (newValue) {
		if (newValue && "x" in newValue && "y" in newValue && "roomName" in newValue) {
			this.memory.savedExit = { x: newValue.x, y: newValue.y, roomName: newValue.roomName };
		}
	},
	enumerable: false,
	configurable: true,
});

Creep.prototype.getRouteToRoom = function (room) {
	const route = Game.map.findRoute(this.room.name, room, {
		routeCallback: (roomName) => {
			const parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(roomName);
			const isHighway = parsed[1] % 10 === 0 || parsed[2] % 10 === 0;
			const isMyRoom = Game.rooms[roomName] && Game.rooms[roomName].controller && Game.rooms[roomName].controller.my;
			const shouldAvoid =
				Game.rooms[roomName] && Game.rooms[roomName].controller && !Game.rooms[roomName].controller.owner && !Game.rooms[roomName].controller.my;
			if (isHighway || isMyRoom) {
				return 1;
			} else if (shouldAvoid) {
				this.room.avoidThis(roomName);
				return Infinity;
			} else {
				return 2.5;
			}
		},
	});

	if (route != ERR_NO_PATH) {
		this.routeToRoom = route;
		this.roomDestination = room;
	}
	return route;
};

Creep.prototype.exitToRoom = function (roomName) {
	if (this.roomDestination == roomName && this.routeToRoom && this.routeToRoom.length > 0) {
		const route = this.routeToRoom;
		if (this.room.name == route[0].room) {
			route.shift();
			this.routeToRoom = route;
		}
		if (this.savedExit && this.savedExit.roomName == this.room.name) {
			return this.savedExit;
		}
		const exit = this.pos.findClosestByPath(route[0].exit);
		this.savedExit = exit;
		return exit;
	} else {
		const route = this.getRouteToRoom(roomName);
		if (route != ERR_NO_PATH) {
			const exit = this.pos.findClosestByPath(route[0].exit);
			return exit;
		}
	}
	return null;
};
