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
	gameOver: "gameOver"
};

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
computer.carrier = Ship(5, [
	[0, 2],
	[0, 3],
	[0, 4],
	[0, 5],
	[0, 6]
]);
computer.battleship = Ship(4, [
	[6, 0],
	[7, 0],
	[8, 0],
	[9, 0]
]);
computer.cruiser = Ship(3, [
	[3, 6],
	[4, 6],
	[5, 6]
]);
computer.submarine = Ship(3, [
	[3, 0],
	[3, 1],
	[3, 2]
]);
computer.destroyer = Ship(2, [
	[8, 8],
	[8, 9]
]);
computer.board = Board();
computer.board.addShip(computer.carrier);
computer.board.addShip(computer.battleship);
computer.board.addShip(computer.cruiser);
computer.board.addShip(computer.submarine);
computer.board.addShip(computer.destroyer);
computer.board.DOM = DOM.initBoard(computer.board.board, document.querySelector("#computer-board"));
// End: Development code

// Event listeners and publishing
computer.board.DOM.querySelectorAll(".square").forEach((square) => {
	square.addEventListener("click", (e) => {
		PubSub.publish(Events.playerClicked, e.target);
	});
});

// Event subscriptions
PubSub.subscribe(Events.playerClicked, (topic, square) => {
	const squareCoords = [square.getAttribute("data-row"), square.getAttribute("data-col")];
	if (square.classList.contains("ship")) {
		if (!square.classList.contains("hit")) {
			square.classList.add("hit");
			player.attack(computer, squareCoords);
		}
	} else {
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
