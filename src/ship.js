/** @format */

/**
 * @param {number} length - Length of the ship
 * @param {array} coords - An array of coordinate arrays e.g [[0,0], [0,1]]
 */
const Ship = (length, coords) => {
	let hitState = {};

	if (!length) {
		throw new Error("No length specified");
	} else if (length > 5) {
		throw new Error("Ship cannot be longer than 5 units");
	} else if (length < 1) {
		throw new Error("Ship cannot be shorter than 1 unit");
	} else {
		for (let i = 0; i < length; i++) {
			// Initialize hitState for each unit of the ship
			// Coordinate based hit state, so they can be referenced later. e.g. hitstate["0-0"] = false;
			let row = coords[i][0];
			let col = coords[i][1];
			hitState[`${row}-${col}`] = false;
		}
	}
	/**
	 *
	 * @param {array} location - Index location array of the unit that was hit
	 */
	function hit(location) {
		if (!Array.isArray(location)) {
			throw new Error("Location must be an array");
		} else if (!location.length) {
			throw new Error("Location must contain coordinates");
		} else {
			let row = location[0];
			let col = location[1];
			// If the hitState is false, change it to true after hit.
			if (!hitState[`${row}-${col}`]) {
				let key = `${row}-${col}`;
				hitState[key] = true;
			}
		}
	}

	/** Check if all of the hitState values are true on each key. */
	function isSunk() {
		return Object.keys(hitState).every((key) => hitState[key]);
	}
	return { length, hit, isSunk, coords };
};

module.exports = Ship;
