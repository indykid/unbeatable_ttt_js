console.log('HERE')
var JSTicTacToe = JSTicTacToe || {};
require(["SpecHelper", "boardSpec", "gameSpec", "aiSpec"], function(SpecHelper, boardSpec, gameSpec, aiSpec){
  // JSTicTacToe.Board = Board;
  // JSTicTacToe.Game = Game;
  // JSTicTacToe.AIPlayer = AIPlayer;
  boardSpec();
  gameSpec();
  aiSpec();
});