function getWhitelist() {
	//----return your whiteList here-------------------
	return Memory.whiteList || [];
}

let originFind = RoomPosition.prototype.findClosestByRange;
RoomPosition.prototype.myFindClosestByRange = function (type, opts) {
	const types = [FIND_HOSTILE_CREEPS, FIND_HOSTILE_CONSTRUCTION_SITES, FIND_HOSTILE_POWER_CREEPS, FIND_HOSTILE_SPAWNS, FIND_HOSTILE_STRUCTURES];
	if (types.includes(type) && "filter" in opts && opts.filter.constructor && opts.filter.call && opts.filter.apply) {
		const func = opts.filter;
		opts.filter = (o) => !getWhitelist().includes(o.owner.username) && func.apply(o);
	} else {
		return originFind.call(this, type, opts);
	}

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
};
