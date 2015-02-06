'use strict';

var JSTicTacToe = JSTicTacToe || {};

require(["jquery", "board", "game", "ai", "helper", 'ui'], function($, Board, Game, AIPlayer, Helper, UI) {
  JSTicTacToe.Board = Board;
  JSTicTacToe.Game = Game;
  JSTicTacToe.AIPlayer = AIPlayer;
  JSTicTacToe.helper = new Helper();

  $(function(){

  /*=========================================
    SETTING UP ARRAY EXTENSIONS:           */
    JSTicTacToe.helper.bootstrapArray();

  /*=========================================
    SETTING UP UI:                        */
    JSTicTacToe.ui = new UI();
    JSTicTacToe.ui.setElements();

  /*=========================================
    EVENT LISTENERS:                     */
    JSTicTacToe.ui.setFirstPlayerListener();
    JSTicTacToe.ui.setListenerOnCells();
  });
});


// JSTicTacToe.grid = $('#grid');
// JSTicTacToe.emptyGridPositions = $('td:not(.occupied)');
// JSTicTacToe.newGameButton = $('#newGame');
// JSTicTacToe.selectPlayer = $('#selectPlayer');
// JSTicTacToe.firstPlayer = $('.firstPlayer');
// JSTicTacToe.notice = $('#notice');
// JSTicTacToe.gameStatus = $('#gameStatus');
// JSTicTacToe.status = $('#status');
// JSTicTacToe.winner = $('#winner');



// JSTicTacToe.firstPlayer.on('click', function(){
//   var firstPlayer = $(this).data('player');
//   JSTicTacToe.selectPlayer.hide(); //
//   JSTicTacToe.game = new JSTicTacToe.Game(firstPlayer);
//   JSTicTacToe.game.board.updateui(); //
//   JSTicTacToe.grid.show(); //
//   JSTicTacToe.gameStatus.show();//
//   JSTicTacToe.newGameButton.css('display', 'block');//
//   if (firstPlayer == 'ai'){
//     JSTicTacToe.game.ai.play();
//   }
// });

// JSTicTacToe.emptyGridPositions.on('click', function(){
//   if (JSTicTacToe.game.isActive()){
//     var position = $(this).data('cell');
//     if (JSTicTacToe.game.board.isCellEmpty(position)){
//       JSTicTacToe.game.humanPlay(position);
//     } else {
//       alert('this cell is occupied, please try another one');
//     }
//   } else {
//     alert('game over');
//   }
// });

