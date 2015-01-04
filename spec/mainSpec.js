console.log('HERE')
var JSTicTacToe = JSTicTacToe || {};

require(["boardSpec", "gameSpec", "aiSpec"], function(boardSpec, gameSpec, aiSpec){
  // JSTicTacToe.Board = Board;
  // JSTicTacToe.Game = Game;
  // JSTicTacToe.AIPlayer = AIPlayer;
  boardSpec();
  gameSpec();
  aiSpec();
});