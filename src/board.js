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
    console.log('this.won', this.won())
    console.log('this.fullBoard', this.fullBoard())
    return ( this.won() || this.fullBoard() );
  }

  this.won = function(){
    for (var i = 0; i < this.board.size; i ++){
      if ( checkColumnForWin(i, this.board) || checkRowForWin(i, this.board) ) {
        return true;
      };
    }
    if ( checkFirstDiagonalForWin(this.board) || checkSecondDiagonalForWin(this.board) ) {
      return true;
    }
    return false;
  }

  this.fullBoard = function(){
    console.log(this.board.taken().length)
    return !(this.board.taken().length < 9)
  }

  // private
  function checkRowForWin(rowNumber, board) {
    var movesHash = board.moves,
        entries = [],
        startIndex = rowNumber * board.size,
        endIndex = startIndex + (board.size - 1);
    if ( winExclusionCheck(startIndex, endIndex, board) ){
      return false;
    }
    for ( var i = startIndex; i <= endIndex; i++) {
      if (movesHash[i] != undefined){
        entries.push(movesHash[i]);
      }
    }
    return (entries.allValuesSame() && entries.length == board.size);
  };

  function checkColumnForWin(columnNumber, board){
    var movesHash = board.moves,
        entries = [],
        startIndex = columnNumber,
        endIndex = startIndex + (board.size * (board.size - 1));
    if ( winExclusionCheck(startIndex, endIndex, board) ){
      return false;
    }
    for ( var i = startIndex; i <= endIndex; i += board.size) {
      if (movesHash[i] != undefined){
        entries.push(movesHash[i]);
      }    
    }
    return (entries.allValuesSame() && entries.length == board.size);
  };

  function checkFirstDiagonalForWin(board) {
    var movesHash = board.moves,
        entries = [],
        startIndex = 0,
        endIndex = board.cellCount - 1;
    
    if ( winExclusionCheck(startIndex, endIndex, board) ){
      return false;
    }
    for ( var i = startIndex; i <= endIndex; i += (board.size + 1) ) {
      if (movesHash[i] != undefined){
        entries.push(movesHash[i]);
      }
    }
    return (entries.allValuesSame() && entries.length == board.size);
  };

  function checkSecondDiagonalForWin(board) {
    var startIndex = board.size - 1,
        endIndex = board.cellCount - board.size,
        movesHash = board.moves,
        entries = [];
    
    if ( winExclusionCheck(startIndex, endIndex, board) ){
      return false;
    }
    for ( var i = startIndex; i <= endIndex; i += (board.size - 1) ) {
      if (movesHash[i] != undefined){
        entries.push(movesHash[i]);
      }
    }
      return (entries.allValuesSame() && entries.length == board.size);
  };

  function winExclusionCheck(start, end, board){
    if ( emptyCell(start, board) || emptyCell(end, board) ) {
      return true;
    }
    if ( (board.moves[start] != board.moves[end]) ) {
      return true;
    } 
  }

  function emptyCell(cell, board) {
    return !(board.playerMoves('x').hasElement(cell) || board.playerMoves('o').hasElement(cell));
  };



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
// cell not occupied
// correct turn
// correct player value
// correct position
// game is active