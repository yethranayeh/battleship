/** @format */

export { DOM as default };

const DOM = {
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
					square.classList.add("ship");
				}
				square.setAttribute("data-row", row);
				square.setAttribute("data-col", col);
				container.appendChild(square);
			}
		}
		return container;
	}
};
