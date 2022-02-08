/** @format */

export { App as default };

const App = {
	players: [],
	turn: 0,
	currentTurn: function () {
		return this.players[this.turn];
	},
	switchTurn: function () {
		this.turn = this.turn === 0 ? 1 : 0;
	}
};
