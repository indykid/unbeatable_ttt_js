'use strict';

var JSTicTacToe = {};

// BOARD********************************

JSTicTacToe.Board = function(){

  this.allPositions = [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ];
  this.moves = {};
  this.size = 3;
  this.cellCount = Math.pow(this.size, 2);

  this.addMove = function(position, player){
    this.moves[position] = player;
  }

  this.getPlayer = function(position){
    return this.moves[position];
  }

  this.taken = function(){
    var moves = Object.keys(this.moves).map(function(move){
      return parseInt(move);
    });
    return moves;
  }

  this.available = function(){
    var taken = this.taken();
    var available = this.allPositions.filter(function(position){
      return !taken.hasElement(position);
    });
    return available.ascending();
  }

  this.playerMoves = function(player){
    var taken = this.taken(),
        allMoves = this.moves,
        playerMoves = taken.filter(function(position){
          return allMoves[position] == player;
        });
    return playerMoves.ascending();
  }

  this.cellType = function(position){
    var remainder = position % 2;
    if (position == 4){
      return "center";
    } 
    else if (remainder != 0){
      return "corner";
    } 
    else {
      return "edge";
    };
  };

};


// GAME********************************

JSTicTacToe.Game = function(){
  this.board = new JSTicTacToe.Board();

  this.addToBoard = function(position, player){
    this.board.addMove(position, player);
  }

  this.isFinished = function(){
    var hasNoAvailableMoves = ( this.board.available().length < 1 );
    return ( this.isWon() || hasNoAvailableMoves );
  }

  this.isWon = function(){
    return ( checkRowsAndColumns(this.board) || checkDiagonals(this.board) );    
  }

  // private
  function checkDiagonals(board){
    return ( checkFirstDiagonalForWin(board) || checkSecondDiagonalForWin(board) );
  }

  function checkRowsAndColumns(board){
    for (var i = 0; i < board.size; i ++){
      if ( checkColumnForWin(i, board) || checkRowForWin(i, board) ) {
        return true;
      };
    }
    return false;
  }

  function checkRowForWin(rowNumber, board) {
    var startIndex = rowNumber * board.size,
        endIndex = startIndex + (board.size - 1),
        rowValues = [];
    if ( winImpossible(startIndex, endIndex, board) ) return false;
    rowValues = getValues(board, startIndex, endIndex, 1);
    return compareValuesForWin(board, rowValues);
  };

  function checkColumnForWin(columnNumber, board){
    var columnValues = [],
        startIndex = columnNumber,
        endIndex = startIndex + (board.size * (board.size - 1));
    if ( winImpossible(startIndex, endIndex, board) ) return false;
    columnValues = getValues(board, startIndex, endIndex, board.size);
    return compareValuesForWin(board, columnValues);
  };

  function checkFirstDiagonalForWin(board) {
    var diagonalValues = [],
        startIndex = 0,
        endIndex = board.cellCount - 1;
    if ( winImpossible(startIndex, endIndex, board) ) return false;
    diagonalValues = getValues(board, startIndex, endIndex, (board.size + 1));
    return compareValuesForWin(board, diagonalValues);
  };

  function checkSecondDiagonalForWin(board) {
    var startIndex = board.size - 1,
        endIndex = board.cellCount - board.size,
        diagonalValues = [];
    if ( winImpossible(startIndex, endIndex, board) ) return false;
    diagonalValues = getValues(board, startIndex, endIndex, (board.size - 1));
    return compareValuesForWin(board, diagonalValues);
  };

  function winImpossible(start, end, board){
    var anyEmptyCells = ( isCellEmpty(start, board) || isCellEmpty(end, board) ),
        twoCellsAreSame = (board.moves[start] != board.moves[end]);
    return anyEmptyCells || twoCellsAreSame; 
  }

  function isCellEmpty(cell, board) {
    return board.available().hasElement(cell);
  };

  function getValues(board, start, end, increment ){
    var values = [];
    for ( var i = start; i <= end; i+= increment) {
      if (board.moves[i] != undefined){
        values.push(board.moves[i]);
      }
    }
    return values;
  }

  function compareValuesForWin(board, values){
    return (values.allValuesSame() && values.length == board.size);
  }
}




// ARRAY HELPERS***********************
Array.prototype.hasElement = function(value){
  'use strict';
  return (this.indexOf(value) != -1) ? true : false;
}

Array.prototype.ascending = function(){
  return this.sort(function(a, b){
    return a - b;
  });
}

Array.prototype.allValuesSame = function(){
  for (var i = 1; i < this.length; i++) {
    if ( this[i] !== this[0] ){
      return false;
    }
  };
  return true;
}


// validations:
// game is still active, can't play otherwise
// cell not occupied
// correct turn
// correct player value
// correct position
