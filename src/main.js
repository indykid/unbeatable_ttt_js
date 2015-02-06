'use strict';

var JSTicTacToe = JSTicTacToe || {};

require(["jquery", "board", "game", "ai", "helper", 'ui'], function($, Board, Game, AIPlayer, Helper, UI) {
  JSTicTacToe.Board = Board;
  JSTicTacToe.Game = Game;
  JSTicTacToe.AIPlayer = AIPlayer;

  $(function(){
    JSTicTacToe.ui = new UI();
    JSTicTacToe.helper = new Helper();
    JSTicTacToe.helper.bootstrapArray();
    JSTicTacToe.ui.setupUI();
  });
});