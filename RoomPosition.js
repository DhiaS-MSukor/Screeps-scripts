function getWhitelist() {
	//----return your whiteList here-------------------
	return Memory.whiteList || [];
}

let originFind = RoomPosition.prototype.findClosestByRange;
RoomPosition.prototype.myFindClosestByRange = function (type, opts) {
	const types = [FIND_HOSTILE_CREEPS, FIND_HOSTILE_CONSTRUCTION_SITES, FIND_HOSTILE_POWER_CREEPS, FIND_HOSTILE_SPAWNS, FIND_HOSTILE_STRUCTURES];
	if (types.includes(type) && opts && "filter" in opts && opts.filter.constructor && opts.filter.call && opts.filter.apply) {
		const func = opts.filter;
		opts.filter = (o) => !getWhitelist().includes(o.owner.username) && func.apply(o);
	}
	return originFind.call(this, type, opts);
};
