<!-- @format -->

# Battleship

_Battleship_ is web implementation of the traditional two-player strategy game.

# How to Play

- The player places 5 ships on their board.
  - The ships available to the player have the following unit sizes: 5, 4, 3, 3, 2
- After the player places their ships on the board, they take turns with computer to attack each other.
- The goal is to sink all of the opponent's ships before they sink yours.

# App Limitations

- In its current state, page needs to be refreshed to start a new game
- Computer attack is deliberately slowed down to respond after **0.35** - **0.8** seconds to make it seem more natural instead of getting an _instant_ attack after player plays their turn.
  - The times are defined as `minResponseTime` and `maxResponseTime` attribute of `computer` object, which can be changed in the `index.js`.

# Credits

- Logo: <a href="https://www.vectorstock.com/royalty-free-vector/old-frigate-ship-vector-30378686">Vector image by VectorStock / artshock</a>
