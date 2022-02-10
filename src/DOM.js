/** @format */

export { DOM as default };

const DOM = {
	init: function () {
		this.navbar = document.querySelector("nav");
		this.btnRestart = document.querySelector("#restart");
		this.orientationForm = document.querySelector(".ship-orientation");
		this.infoContainer = document.querySelector(".info-container");
		this.displayPreGameInfo();
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
	},
	hideOrientationForm: function () {
		this.orientationForm.classList.add("d-none");
	},
	displayPreGameInfo: function () {
		this.infoContainer.innerHTML = "";

		const directive = (function () {
			let directive = document.createElement("div");
			directive.classList.add("directive");
			let icon = document.createElement("i");
			icon.classList.add("fas", "fa-info-circle");

			let instruction = document.createElement("p");
			instruction.textContent = "Place your ships on the board";
			directive.appendChild(icon);
			directive.appendChild(instruction);
			return directive;
		})();

		const info = (function () {
			let info = document.createElement("ul");
			info.classList.add("fa-ul");

			const rules = [
				"Ships can be arranged either horizontally or vertically",
				"Ships cannot overlap",
				"There are 5 total ships with lengths of 5, 4, 3, 3 and 2",
				"First one to sink all ship units wins!"
			];
			for (let rule of rules) {
				let li = document.createElement("li");

				let span = document.createElement("span");
				span.classList.add("fa-li");

				let icon = document.createElement("i");
				icon.classList.add("fas", "fa-chevron-right");

				let text = document.createElement("span");
				text.textContent = rule;

				span.appendChild(icon);
				li.appendChild(span);
				li.appendChild(text);
				info.appendChild(li);
			}
			return info;
		})();

		this.infoContainer.appendChild(directive);
		this.infoContainer.appendChild(info);
	},
	displayGameInfo: function (currentTurn) {
		this.infoContainer.innerHTML = "";

		let paragraph = document.createElement("p");
		paragraph.textContent = `It's ${currentTurn}'s turn`;
		this.infoContainer.appendChild(paragraph);
	},
	makeBoardUnavailable: function (container) {
		container.classList.add("unavailable");
	},
	makeBoardAvailable: function (container) {
		container.classList.remove("unavailable");
	}
};
