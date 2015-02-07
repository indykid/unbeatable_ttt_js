'use strict';

var JSTicTacToe = JSTicTacToe || {};

define([], function() {

  JSTicTacToe.UI = function(){
    var board;

    this.setupUI = function(){
      this._setElements();
      this._setFirstPlayerListener();
      this._setListenerOnCells();
    };

    this.updateUI = function(){
      this._updateBoardView();
      this._updateSidebar();
    };

    this.showWrongTurnMessage = function(){
      alert('Easy tiger, not your turn');
    };

    this.showGameOver = function(){
      alert('Game over');
    };

    this.showCellTakenMessage = function(){
      alert('This cell is occupied, please try another one');
    };

    this._setElements = function(){
      this.grid           = $('#grid');
      this.emptyGridCells = $('td:not(.inactive)');
      this.gridCells      = $('td');
      this.newGameButton  = $('#newGame');
      this.selectPlayer   = $('#selectPlayer');
      this.playerChoices  = $('.playerChoice');
      this.notice         = $('#notice');
      this.gameStatus     = $('#gameStatus');
      this.status         = $('#status');
      this.winner         = $('#winner');
    };

    this._setFirstPlayerListener = function(){
      var ui = this;
      this.playerChoices.on('click', function(){
        var firstPlayer = $(this).data('player');
        ui._startGame(firstPlayer);
      });
    };

    this._startGame = function(firstPlayer){
      JSTicTacToe.game = new JSTicTacToe.Game(firstPlayer);
      board = JSTicTacToe.game.board;
      this._prepareUI();
      JSTicTacToe.game._aiMoveIfCorrectTurnAndActive();
    };

    this._setListenerOnCells = function(){
      this.emptyGridCells.on('click', function(){
        var cell = $(this).data('cell');
        JSTicTacToe.game.play(cell);
      });
    };

    this._prepareUI = function(){
      this.selectPlayer.hide();
      this.gameStatus.show();
      this.newGameButton.css('display', 'block');
      this.grid.show();
      this.updateUI();
    };

    this._updateBoardView = function(){
      board.moves.forEach(function(move){
        var cell = 'td[data-cell='+ move.cell +']',
            mark = move.mark;
        $(cell).text(mark).addClass('inactive');
      });
      this._removeHoverFromCellsIfGameOver();
    };

    this._updateSidebar = function(){
      this.status.text(JSTicTacToe.game.status);
      this._updateWinnerIfGameIsWon();
    };

    this._removeHoverFromCellsIfGameOver = function(){
      if (!JSTicTacToe.game.isActive()){
        this.gridCells.addClass('inactive');
      }
    };

    this._updateWinnerIfGameIsWon = function(){
      if (JSTicTacToe.game.isWon()){
        this.winner.text(winningPlayer());
        this.gameStatus.hide();
        this.notice.show();
      }
    };

    /*******************
      private functions
    ********************/

    function winningPlayer(){
      return uiFriendlyPlayer(gameWinner());
    }

    function uiFriendlyPlayer(player){
      return player === 'ai' ? 'computer' : 'you';
    }

    function gameWinner(){
      return JSTicTacToe.game.winner.player;
    }
  };

  return JSTicTacToe.UI;
});