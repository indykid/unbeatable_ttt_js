'use strict';

var JSTicTacToe = {};

// BOARD***************
JSTicTacToe.Board = function(){

  this.allPositions = [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ];
  this.moves = {};

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