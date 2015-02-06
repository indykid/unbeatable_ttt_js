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
      ui.playerChoices.on('click', function(){
        var firstPlayer = $(this).data('player');
        startGame(firstPlayer);
        ui._prepareUI();
      });
    };

    this._setListenerOnCells = function(){
      var ui = this;
      ui.emptyGridCells.on('click', function(){
        humanPlayIfGameActive($(this));
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

    function startGame(firstPlayer){
      JSTicTacToe.game = new JSTicTacToe.Game(firstPlayer);
      board = JSTicTacToe.game.board;

      if (firstPlayer == 'ai'){
        JSTicTacToe.game.ai.play();
      }
    }

    function humanPlayIfGameActive(clickedCell){
      if (JSTicTacToe.game.isActive()){
        playCellIfEmpty(clickedCell);
      } else {
        showGameOver();
      }
    }

    function playCellIfEmpty(clickedCell){
      var cell = clickedCell.data('cell');

      if (board.isCellEmpty(cell)){
        JSTicTacToe.game.humanPlay(cell);
      } else {
        showCellTakenMessage();
      }
    }

    function showGameOver(){
      alert('Game over');
    }

    function showCellTakenMessage(){
      alert('This cell is occupied, please try another one');
    }

    function winningPlayer(){
      return uiFriendlyPlayer(gameWinner());
    };

    function uiFriendlyPlayer(player){
      return player === 'ai' ? 'computer' : 'you';
    };

    function gameWinner(){
      return JSTicTacToe.game.winner.player;
    }
  };

  return JSTicTacToe.UI;
});