/** @format */

export { DOM as default };

const DOM = {
	init: function () {
		this.orientationForm = document.querySelector(".ship-orientation");
	},
	/**
	 *
	 * @param {array} board Board to be rendered
	 */
	initBoard: function (board, container) {
		for (let row = 0; row < board.length; row++) {
			for (let col = 0; col < board[row].length; col++) {
				let square = document.createElement("div");
				square.classList.add("square");
				if (board[row][col] === -1) {
					square.classList.add("miss");
				} else if (typeof board[row][col] === "object") {
					square.classList.add("ship"); // development - computer ships are visible
					// if (container.id === "player-board") square.classList.add("ship"); // production - computer ships are hidden
				}
				square.setAttribute("data-row", row);
				square.setAttribute("data-col", col);
				container.appendChild(square);
			}
		}
		return container;
	},
	highlightArea: function (shipArea, container) {
		for (let i = 0; i < shipArea.length; i++) {
			let square = container.querySelector(`[data-row="${shipArea[i][0]}"][data-col="${shipArea[i][1]}"]`);
			square.classList.add("highlight");
		}
	},
	removeHighlight: function (shipArea, container) {
		for (let i = 0; i < shipArea.length; i++) {
			let square = container.querySelector(`[data-row="${shipArea[i][0]}"][data-col="${shipArea[i][1]}"]`);
			square.classList.remove("highlight");
		}
	},
	addShip: function (shipArea, container) {
		for (let i = 0; i < shipArea.length; i++) {
			let square = container.querySelector(`[data-row="${shipArea[i][0]}"][data-col="${shipArea[i][1]}"]`);
			square.classList.add("ship");
		}
	},
	shipOrientation: function () {
		return this.orientationForm.querySelector("input:checked").value;
	}
};
