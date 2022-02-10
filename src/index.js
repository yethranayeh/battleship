/** @format */

import "./reset.css";
import "./style.css";
import PubSub from "pubsub-js";
import App from "./App";
import DOM from "./DOM";
const Player = require("./player");
const Ship = require("./ship");
const Board = require("./gameboard");

// Service worker
// if ("serviceWorker" in navigator) {
// 	window.addEventListener("load", () => {
// 		navigator.serviceWorker
// 			.register("./sw.js")
// 			.then((registration) => {
// 				// service worker registered
// 			})
// 			.catch((err) => {
// 				// registration unsuccessful
// 			});
// 	});
// } else {
// 	console.log(`Service worker is not supported in this browser.`);
// }

const Events = {
	gameStarted: "gameStarted",
	mouseOver: "mouseOver",
	mouseOut: "mouseOut",
	shipPlaced: "shipPlaced",
	playerAttacked: "playerAttacked",
	computerAttacked: "computerAttacked",
	shipHit: "shipHit",
	miss: "miss",
	nextTurn: "nextTurn",
	turnSwitched: "turnSwitched",
	gameOver: "gameOver"
};

/**
 * Initializes certain DOM elements so they can be referenced as its attributes
 * e.g. DOM.orientationForm
 */
DOM.init();

// Start: Player
const player = Player();
App.players.push(player.name);
player.board = Board();
player.board.DOM = DOM.initBoard(player.board.board, document.querySelector("#player-board"));
// End: Player

// Start: Computer
const computer = Player(null, true);
computer.minResponseTime = 350;
computer.maxResponseTime = 650;
App.players.push(computer.name);
computer.board = Board();

for (let length of computer.shipLengths) {
	let ship = Ship(length, computer.getRandomCoords(length));
	computer.board.addShip(ship);
}
computer.board.DOM = DOM.initBoard(computer.board.board, document.querySelector("#computer-board"));
// End: Computer

// Event listeners and publishing
DOM.btnRestart.addEventListener("click", () => {
	// Refresh the page
	location.reload();
});

DOM.orientationForm.addEventListener("change", function (e) {
	PubSub.publish(Events.orientationChanged, e.target.value);
});

player.board.DOM.querySelectorAll(".square").forEach((square) => {
	square.addEventListener("mouseover", (e) => {
		PubSub.publish(Events.mouseOver, e.target);
	});
	square.addEventListener("mouseout", (e) => {
		PubSub.publish(Events.mouseOut, e.target);
	});
	square.addEventListener("click", (e) => {
		// The square is only highlighted if it is valid.
		if (e.target.classList.contains("highlight")) {
			PubSub.publish(Events.shipPlaced, e.target);
		}
	});
});

computer.board.DOM.querySelectorAll(".square").forEach((square) => {
	square.addEventListener("click", (e) => {
		// App.currentTurn() !== player.name does not really makes sense, since it should be the player's turn for them to play
		// But, the way the logic is built works the opposite way, so I'm leaving it as is for now
		if (App.currentTurn() !== player.name) {
			PubSub.publish(Events.playerAttacked, e.target);
		}
	});
});

// Event subscriptions
PubSub.subscribe(Events.mouseOver, (topic, square) => {
	let row = Number(square.getAttribute("data-row"));
	let col = Number(square.getAttribute("data-col"));
	const startPoint = [row, col];

	let dataDirection = DOM.shipOrientation() === "horizontal" ? "data-col" : "data-row";
	let directionStart = Number(square.getAttribute(dataDirection));
	let shipLength = player.board.nextShipLength();
	const shipArea = player.board.newShipCoords(startPoint, shipLength, DOM.shipOrientation());

	const areaIsOccupied = () => shipArea.some((coords) => player.board.isOccupied(coords) === true);

	if (directionStart + shipLength > 10 || areaIsOccupied()) {
		square.classList.add("invalid");
	} else {
		DOM.highlightArea(shipArea, player.board.DOM);
	}
});

PubSub.subscribe(Events.mouseOut, (topic, square) => {
	let row = Number(square.getAttribute("data-row"));
	let col = Number(square.getAttribute("data-col"));
	const startPoint = [row, col];

	let dataDirection = DOM.shipOrientation() === "horizontal" ? "data-col" : "data-row";
	let directionStart = Number(square.getAttribute(dataDirection));
	let shipLength = player.board.nextShipLength();
	const shipArea = player.board.newShipCoords(startPoint, shipLength, DOM.shipOrientation());

	const areaIsOccupied = () => shipArea.some((coords) => player.board.isOccupied(coords) === true);

	if (directionStart + shipLength > 10 || areaIsOccupied()) {
		square.classList.remove("invalid");
	} else {
		DOM.removeHighlight(shipArea, player.board.DOM);
	}
});

PubSub.subscribe(Events.shipPlaced, (topic, square) => {
	let shipLength = player.board.nextShipLength();
	let direction = DOM.shipOrientation();
	let startPoint = [Number(square.getAttribute("data-row")), Number(square.getAttribute("data-col"))];
	let shipCoords = player.board.newShipCoords(startPoint, shipLength, direction);

	let ship = Ship(shipLength, shipCoords);
	try {
		player.board.addShip(ship);
	} catch (err) {
		console.warn("There was an error while trying to place the ship:\n", err);
	}

	DOM.removeHighlight(shipCoords, player.board.DOM);
	DOM.addShip(shipCoords, player.board.DOM);
	if (!player.board.nextShipLength()) {
		PubSub.publish(Events.gameStarted);
	}
});

PubSub.subscribe(Events.gameStarted, function () {
	DOM.hideOrientationForm();
	DOM.displayGameInfo(App.currentTurn());
	DOM.makeBoardAvailable(computer.board.DOM);
	document.getElementById("computer-board").scrollIntoView({
		behavior: "smooth"
	});
	PubSub.subscribe(Events.playerAttacked, (topic, square) => {
		const squareCoords = [square.getAttribute("data-row"), square.getAttribute("data-col")];
		// If clicked square is a ship
		if (typeof computer.board.board[squareCoords[0]][squareCoords[1]] === "object") {
			if (!square.classList.contains("hit")) {
				square.classList.add("hit");
			}
		} else {
			// If clicked square is not a ship but also not clicked before, add miss class
			if (!square.classList.contains("miss")) {
				square.classList.add("miss");
			}
		}
		player.attack(computer, squareCoords);
		PubSub.publish(Events.turnSwitched);
	});

	PubSub.subscribe(Events.computerAttacked, (topic, square) => {
		const squareCoords = [square.getAttribute("data-row"), square.getAttribute("data-col")];
		// If computer's target square is a ship
		if (typeof player.board.board[squareCoords[0]][squareCoords[1]] === "object") {
			if (!square.classList.contains("hit")) {
				square.classList.add("hit");
			}
		} else {
			// If computer's target square is not a ship but also not targeted before, add miss class
			if (!square.classList.contains("miss")) {
				square.classList.add("miss");
			}
		}
		computer.attack(player, squareCoords);
		PubSub.publish(Events.turnSwitched);
	});

	PubSub.subscribe(Events.shipHit, (topic, ship) => {
		// console.info("Ship hit!");
		// console.log("Sunk?", ship.isSunk());
	});

	PubSub.subscribe(Events.miss, (topic, square) => {
		// console.log("Missed at", square);
	});

	PubSub.subscribe(Events.nextTurn, (topic, data) => {
		App.switchTurn();
	});

	PubSub.subscribe(Events.turnSwitched, function () {
		if (App.currentTurn() === computer.name) {
			let randomCoords = computer.nextAttackCoords();
			let randomSquare = document.querySelector(
				`.square[data-row="${randomCoords[0]}"][data-col="${randomCoords[1]}"]`
			);
			/**
			 * Artificial pause for computer to make its "decision" before attacking.
			 * @param {number} milliseconds
			 * @returns {Promise}
			 */
			const sleep = (milliseconds) => {
				return new Promise((resolve) => setTimeout(resolve, milliseconds));
			};
			function randomInteger(min, max) {
				return Math.floor(Math.random() * (max - min + 1)) + min;
			}
			const attack = async () => {
				await sleep(randomInteger(computer.minResponseTime, computer.maxResponseTime));
				PubSub.publish(Events.computerAttacked, randomSquare);
			};
			attack();
		}
		PubSub.publish(Events.nextTurn);
		DOM.displayGameInfo(App.currentTurn());
	});

	PubSub.publish(Events.nextTurn);

	PubSub.unsubscribe(Events.mouseOver);
	PubSub.unsubscribe(Events.mouseOut);
	PubSub.unsubscribe(Events.shipPlaced);
});

PubSub.subscribe(Events.gameOver, (topic, boardContainer) => {
	const winner = boardContainer === player.board.DOM ? computer.name : player.name;
	// DOM.displayGameResult(winner);
	computer.board.DOM.classList.add("no-click");

	PubSub.unsubscribe(Events.playerAttacked);
	PubSub.unsubscribe(Events.computerAttacked);
	PubSub.unsubscribe(Events.nextTurn);
	PubSub.unsubscribe(Events.turnSwitched);
});
