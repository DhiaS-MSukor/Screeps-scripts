Object.defineProperty(Room.prototype, "isHighway", {
	configurable: true,
	enumerable: false,
	get: function () {
		const parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(this.name);
		return parsed[1] % 10 === 0 || parsed[2] % 10 === 0;
	},
});

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

Room.prototype.getClosestHighway = function () {
	if (this.isHighway) {
		return this.name;
	}

	const parsed = /^([WE])([0-9]+)([NS])([0-9]+)$/.exec(this.name);

	const d1 = parsed[2] % 10 > 5 ? 10 - (parsed[2] % 10) : parsed[2] % 10;
	const d2 = parsed[4] % 10 > 5 ? 10 - (parsed[4] % 10) : parsed[4] % 10;

	if (d1 > d2) {
		const h = closestNumber(parsed[4], 10);
		return `${parsed[1]}${parsed[2]}${parsed[3]}${h}`;
	}
	const h = closestNumber(parsed[2], 10);
	return `${parsed[1]}${h}${parsed[3]}${parsed[4]}`;
};
