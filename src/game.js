'use strict';

var JSTicTacToe = JSTicTacToe || {};

define([], function() {

  return JSTicTacToe.Game = function(firstPlayer){
    this.board = new JSTicTacToe.Board(this);
    this.ai = new JSTicTacToe.AIPlayer(this, firstPlayer);
    this.winningCombinations = setWinningCombinations(this.board);
    this.winner = { player: undefined, mark: undefined };
    this.status = 'active'; // other states: won, drawn

    this.addToBoard = function(position, mark){
      this.board.addMove(position, mark);
    }

    this.isActive = function(){
      return ( !this.isWon() && !this.isDrawn() );
    }

    this.isWon = function(){
      return this.winner.player !== undefined;
    }

    this.isDrawn = function(){
      return this.board.available().length < 1 && !this.isWon();
    }

    this.winnerMark = function(){
      var singlePlayerFullLine = this.winningCombinations.find(function(combination){
        return this.board.singlePlayerLine(combination, this.board.size, this.ai.opponentMark) || this.board.singlePlayerLine(combination, this.board.size, this.ai.mark);
      }.bind(this));
      if (singlePlayerFullLine!==undefined){
        return this.board.getMark(singlePlayerFullLine[0]);
      }   
    } //REVIEW?

    this.setWinner = function(winner, mark){
      this.winner['player'] = winner;
      this.winner['mark'] = mark;
    }
    
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

    this.isPlayerTurn = function(mark){
      var movesSoFar = this.board.moves.length;
      if ( (isOddMove(movesSoFar) && mark === 'x') || (!isOddMove(movesSoFar) && mark === 'o') ){
        return true;
      }
      return false;
    }

    this.humanPlay = function(position){
      if (this.isPlayerTurn(this.ai.opponentMark)){
        this.addToBoard(position, this.ai.opponentMark);
        // console.log('added to human', position);
        this.checkAndUpdateGameState();
        this.board.updateBoardView();
        this.board.updateUI();
      } else {
        alert('easy tiger, not your turn');
      }
      if (this.isActive() && this.isPlayerTurn(this.ai.mark)){
        this.ai.play();
      } 
    }

    function findWinner(mark, aiMark){
      var winner = mark === aiMark ? 'ai' : 'human';
      return winner;
    } 

    function isOddMove(movesSoFar){
      return movesSoFar % 2 === 0;
    }

    function setWinningCombinations(board){
      var winningCombinations = [];
      setDiagonals(board, winningCombinations);
      for (var i = 0; i < board.size; i++) {
        setColumn(i, board, winningCombinations);
        setRow(i, board, winningCombinations);
      };
      return winningCombinations;
    }

    function setDiagonals(board, combinations){
      setFirstDiagonal(board, combinations);
      setSecondDiagonal(board, combinations);
    }

    function setFirstDiagonal(board, combinations){
      var startIndex = 0,
          endIndex = board.positionsAmount - 1,
          increment = board.size + 1,
          firstDiagonal = [];

      firstDiagonal = setLine(startIndex, endIndex, increment);
      addWinningCombination(firstDiagonal, combinations);
    }

    function setSecondDiagonal(board, combinations){
      var startIndex = board.size - 1,
          endIndex = board.positionsAmount - board.size,
          increment = board.size - 1,
          secondDiagonal = [];

      secondDiagonal = setLine(startIndex, endIndex, increment);
      // board.addDiagonal(secondDiagonal);
      addWinningCombination(secondDiagonal, combinations);
    }

    function setRow(rowNumber, board, combinations){
      var startIndex = rowNumber * board.size,
          endIndex = startIndex + (board.size - 1),
          increment = 1,
          row = [];
      row = setLine(startIndex, endIndex, increment);
      addWinningCombination(row, combinations);
      // board.addRow(row);
    }

    function setColumn(columnNumber, board, combinations){
      var column = [],
          startIndex = columnNumber,
          endIndex = startIndex + (board.size * (board.size - 1)),
          increment = board.size;

      column = setLine(startIndex, endIndex, increment);
      addWinningCombination(column, combinations);
      // board.addColumn(column)
    }

    function setLine(start, end, increment){
      var line = [];
      for (var i = start; i <= end; i+=increment) {
        line.push(i);
      };
      return line;
    }

    function addWinningCombination(combination, combinations){
      combinations.push(combination);
    }
  }
});