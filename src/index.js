/** @format */

import "./reset.css";
import "./style.css";
import PubSub from "pubsub-js";
import DOM from "./DOM";
const Player = require("./player");
const Ship = require("./ship");
const Board = require("./gameboard");

const Events = {
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
player.carrier = Ship(5, [
	[2, 2],
	[3, 2],
	[4, 2],
	[5, 2],
	[6, 2]
]);
player.battleship = Ship(4, [
	[3, 4],
	[3, 5],
	[3, 6],
	[3, 7]
]);
player.cruiser = Ship(3, [
	[7, 8],
	[8, 8],
	[9, 8]
]);
player.submarine = Ship(3, [
	[6, 0],
	[7, 0],
	[8, 0]
]);
player.destroyer = Ship(2, [
	[1, 7],
	[1, 8]
]);
player.board = Board();
player.board.addShip(player.carrier);
player.board.addShip(player.battleship);
player.board.addShip(player.cruiser);
player.board.addShip(player.submarine);
player.board.addShip(player.destroyer);
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
});

computer.board.DOM.querySelectorAll(".square").forEach((square) => {
	square.addEventListener("click", (e) => {
		PubSub.publish(Events.playerClicked, e.target);
	});
});

// Event subscriptions
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

PubSub.subscribe(Events.gameOver, (topic, boardContainer) => {
	boardContainer.classList.add("no-click");
});

PubSub.subscribe(Events.mouseOver, (topic, square) => {
	let row = Number(square.getAttribute("data-row"));
	let col = Number(square.getAttribute("data-col"));
	let dataDirection = DOM.shipOrientation() === "horizontal" ? "data-col" : "data-row";
	if (square.getAttribute(dataDirection) > 5) {
		square.classList.add("invalid");
	} else {
		const startPoint = [row, col];
		const shipArea = DOM.shipArea(startPoint, DOM.shipOrientation(), 5);
		DOM.highlightArea(shipArea, player.board.DOM);
	}
});

PubSub.subscribe(Events.mouseOut, (topic, square) => {
	let row = Number(square.getAttribute("data-row"));
	let col = Number(square.getAttribute("data-col"));
	let dataDirection = DOM.shipOrientation() === "horizontal" ? "data-col" : "data-row";
	if (square.getAttribute(dataDirection) > 5) {
		square.classList.remove("invalid");
	} else {
		const startPoint = [row, col];
		const shipArea = DOM.shipArea(startPoint, DOM.shipOrientation(), 5);
		DOM.removeHighlight(shipArea, player.board.DOM);
	}
});
