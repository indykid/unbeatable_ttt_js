'use strict';

var JSTicTacToe = JSTicTacToe || {};

define([], function() {

  return JSTicTacToe.Game = function(firstPlayer){

    this.board = new JSTicTacToe.Board(this);
    this.ai = new JSTicTacToe.AIPlayer(this.board, firstPlayer);
    this.winner = { player: undefined, mark: undefined };
    this.status = 'active'; // other states: won, drawn

    this.isActive = function(){
      return ( !this.isWon() && !this.isDrawn() );
    };

    this.isWon = function(){
      return this.winner.player !== undefined;
    };

    this.isDrawn = function(){
      return this.board.available().length < 1 && !this.isWon();
    };

    this.checkAndUpdateGameState = function(){
      var winnerMark = this.winnerMark();
      if (winnerMark){
        var winner = findWinner(winnerMark, this.ai.mark);
        this.setWinner(winner, winnerMark);
        this.status = 'won';
      } else if ( this.isDrawn() ){
        this.status = 'drawn';
      }
    }

    this.winnerMark = function(){
      var singlePlayerFullLine = this.board.winningCombos.find(function(combo){
        return this.board.singlePlayerLine(combo, this.board.size, this.ai.humansMark) || this.board.singlePlayerLine(combo, this.board.size, this.ai.mark);
      }.bind(this));
      if (singlePlayerFullLine !== undefined){
        return this.board.getMark(singlePlayerFullLine[0]);
      }
    };

    this.isPlayerTurn = function(mark){
      var movesSoFar = this.board.moves.length;
      if ( (isOddMove(movesSoFar) && mark === 'x') || (!isOddMove(movesSoFar) && mark === 'o') ){
        return true;
      }
      return false;
    }

    this.humanPlay = function(cell){
      if (this.isPlayerTurn(this.ai.humansMark)){
        this.board.addMove(cell, this.ai.humansMark);
        this.checkAndUpdateGameState();
        JSTicTacToe.ui.updateUI();
      } else {
        alert('easy tiger, not your turn');
      }
      if (this.isActive() && this.isPlayerTurn(this.ai.mark)){
        this.ai.play();
      }
    };

    this.setWinner = function(winner, mark){
      this.winner['player'] = winner;
      this.winner['mark'] = mark;
    }

    function findWinner(mark, aiMark){
      var winner = mark === aiMark ? 'ai' : 'human';
      return winner;
    }

    function isOddMove(movesSoFar){
      return movesSoFar % 2 === 0;
    }

  }
});