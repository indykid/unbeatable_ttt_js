'use strict';

var JSTicTacToe = JSTicTacToe || {};

define([], function() {

  JSTicTacToe.Game = function(firstPlayer){

    this.board = new JSTicTacToe.Board();
    this.ai = new JSTicTacToe.AIPlayer(this.board, firstPlayer);
    this.board.ai = this.ai;
    this.winner = { player: undefined, mark: undefined };
    this.status = 'active'; // other states: won, drawn

    this.isActive = function(){
      return this.status === 'active';
    };

    this.isWon = function(){
      return this.winner.player !== undefined;
    };

    this.checkAndUpdateGameState = function(){
      var winnerMark = this.board.winnerMark();
      if (winnerMark){
        this._updateAsWon(winnerMark);
      } else if (this._isDrawn()){
        this._updateAsDrawn();
      }
    };

    this.play = function(cell){
      this._humanMoveIfValid(cell);
      this._aiMoveIfCorrectTurnAndActive();
    };//*

    this._isPlayerTurn = function(mark){
      var movesSoFar = this.board.moves.length;
      switch (mark){
        case 'x':
          return isOddMove(movesSoFar);
        case 'o':
          return !isOddMove(movesSoFar);
      }
    };

    /***************************************/

    this._setWinner = function(winner, mark){
      this.winner['player'] = winner;
      this.winner['mark'] = mark;
    };//*

    this._humanMoveIfValid = function(cell){
      this._humanMoveIfActiveCheck(cell);
    };//*

    this._humanMoveIfActiveCheck = function(cell){
      if (this.isActive()){
        this._humanMoveIfCellEmptyCheck(cell);
      } else {
        JSTicTacToe.ui.showGameOver();
      }
    };//*

    this._humanMoveIfCellEmptyCheck = function(cell){
      if (this.board.isCellEmpty(cell)){
        this._humanMoveIfCorrectTurnCheck(cell);
      } else {
        JSTicTacToe.ui.showCellTakenMessage();
      }
    };//*

    this._humanMoveIfCorrectTurnCheck = function(cell){
      var mark = this.ai.humansMark;
      if (this._isPlayerTurn(mark)){
        this.board.addMove(cell, mark);
        this.checkAndUpdateGameState();
        JSTicTacToe.ui.updateUI();
      } else {
        JSTicTacToe.ui.showWrongTurnMessage();
      }
    };//*

    this._aiMoveIfCorrectTurnAndActive = function(){
      if (this.isActive() && this._isPlayerTurn(this.ai.mark)){
        this.ai.move();
        this.checkAndUpdateGameState();
        JSTicTacToe.ui.updateUI();
      }
    };//*

    /**********************************************
    untested, but only used inside tested functions
    ***********************************************/

    this._isDrawn = function(){
      return this.board.available.length < 1 && !this.isWon();
    };

    this._updateAsWon = function(winnerMark){
      var winningPlayer = findWinner(winnerMark, this.ai.mark);
      this._setWinner(winningPlayer, winnerMark);
      this.status = 'won';
    };

    this._updateAsDrawn = function(){
      this.status = 'drawn';
    };

    function findWinner(mark, aiMark){
      var winner = mark === aiMark ? 'ai' : 'human';
      return winner;
    }

    function isOddMove(movesSoFar){
      return movesSoFar % 2 === 0;
    }
  };

  return JSTicTacToe.Game;
});