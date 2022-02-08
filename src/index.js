/** @format */

import "./reset.css";
import "./style.css";
import PubSub from "pubsub-js";
import DOM from "./DOM";
const Player = require("./player");
const Ship = require("./ship");
const Board = require("./gameboard");

const Events = {
	gameStarted: "gameStarted",
	shipPlaced: "shipPlaced",
	playerClicked: "playerClicked",
	shipHit: "shipHit",
	miss: "miss",
	gameOver: "gameOver",
	mouseOver: "mouseOver",
	mouseOut: "mouseOut"
};

/**
 * Initializes certain DOM elements so they can be referenced as its attributes
 * e.g. DOM.orientationForm
 */
DOM.init();

// Start: Development code
const player = Player("Bob");
player.board = Board();
player.board.DOM = DOM.initBoard(player.board.board, document.querySelector("#player-board"));

const computer = Player(null, true);
computer.board = Board();

for (let length of computer.shipLengths) {
	let ship = Ship(length, computer.getRandomCoords(length));
	computer.board.addShip(ship);
}
computer.board.DOM = DOM.initBoard(computer.board.board, document.querySelector("#computer-board"));
// End: Development code

// Event listeners and publishing
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
		PubSub.publish(Events.playerClicked, e.target);
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

	let areaIsOccupied = shipArea.some((coords) => player.board.isOccupied(coords) === true);

	if (directionStart + shipLength > 10 || areaIsOccupied) {
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

	let areaIsOccupied = shipArea.some((coords) => player.board.isOccupied(coords) === true);

	if (directionStart + shipLength > 10 || areaIsOccupied) {
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
	player.board.addShip(ship);

	DOM.removeHighlight(shipCoords, player.board.DOM);
	DOM.addShip(shipCoords, player.board.DOM);
	if (!player.board.nextShipLength()) {
		PubSub.publish(Events.gameStarted);
	}
});

PubSub.subscribe(Events.gameStarted, function () {
	console.warn("Game started!");
	PubSub.subscribe(Events.playerClicked, (topic, square) => {
		const squareCoords = [square.getAttribute("data-row"), square.getAttribute("data-col")];
		// If clicked square is a ship
		if (typeof computer.board.board[squareCoords[0]][squareCoords[1]] === "object") {
			if (!square.classList.contains("hit")) {
				square.classList.add("hit");
				player.attack(computer, squareCoords);
			}
		} else {
			// If clicked square is not a ship but also not clicked before, add miss class
			if (!square.classList.contains("miss")) {
				square.classList.add("miss");
				player.attack(computer, squareCoords);
			}
		}
	});

	PubSub.subscribe(Events.shipHit, (topic, ship) => {
		console.info("Ship hit!");
		console.log("Sunk?", ship.isSunk());
	});

	PubSub.subscribe(Events.miss, (topic, square) => {
		console.log("Missed at", square);
	});

	PubSub.unsubscribe(Events.mouseOver);
	PubSub.unsubscribe(Events.mouseOut);
	PubSub.unsubscribe(Events.shipPlaced);
});

PubSub.subscribe(Events.gameOver, (topic, boardContainer) => {
	boardContainer.classList.add("no-click");
});
