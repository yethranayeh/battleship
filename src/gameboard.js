/** @format */

const Board = function () {
	// 10x10 board
	const board = [
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	];

	const ships = [];

	/**
	 *
	 * @param {object} ship - Ship object
	 */
	function addShip(ship) {
		if (ships.length === 5) {
			throw new Error("You can't add more than 5 ships");
		} else {
			for (let i = 0; i < ship.coords.length; i++) {
				let row = ship.coords[i][0];
				let col = ship.coords[i][1];
				if (board[row][col] !== 0) {
					throw new Error("Ship cannot be placed on top of another ship");
				} else {
					board[row][col] = ship;
				}
			}
			ships.push(ship);
		}
	}

	/**
	 *
	 * @param {array} coords - Array of row and column coordinates
	 * @returns {boolean}
	 */
	function isOccupied(coords) {
		let row = coords[0];
		let col = coords[1];
		if (typeof board[row][col] === "object") {
			return true;
		}
		return false;
	}

	/**
	 *
	 * @param {array} coords - Array of row and column coordinates that will be attacked
	 */
	function receiveAttack(coords) {
		/**
		 * When enabled, mocks PubSub.publish() that is normally available in global scope in index.js
		 * Since unit tests are run in isolation, PubSub is not imported, therefore PubSub.publish() is not available
		 * @namespace PubSub
		 */
		// const PubSub = { publish: () => {} };

		let row = coords[0];
		let col = coords[1];
		let ship = board[row][col];
		if (typeof ship === "object") {
			ship.hit([row, col]);
			PubSub.publish("shipHit", ship);
		} else if (ship === 0) {
			board[row][col] = -1;
			PubSub.publish("miss", coords);
		}

		if (ships.every((ship) => ship.isSunk())) {
			/**
			 * @this {node} - Player().board.DOM
			 */
			PubSub.publish("gameOver", this.DOM);
		}
	}
	return { board, addShip, receiveAttack, isOccupied };
};

module.exports = Board;
