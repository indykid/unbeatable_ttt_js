'use strict';

var JSTicTacToe = {};

// BOARD********************************

JSTicTacToe.Board = function(){

  this.allPositions = [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ];
  // this.diagonals = [];
  // this.rows = [];
  // this.columns = [];
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
    var available = this.allPositions.filter(function(position){
      return this.moves[position] === undefined;
    }.bind(this));
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

  this.isCellEmpty = function(cell) {
    // might need to extract cell validation check
    if (this.allPositions.hasElement(cell)){
      return this.moves[cell] === undefined;
    }
    // return this.available().hasElement(cell);
  };

  // this.addDiagonal = function(diagonal){
  //   this.diagonals.push(diagonal);
  // }

  // this.addRow = function(row){
  //   this.rows.push(row);
  // }

  // this.addColumn = function(column){
  //   this.columns.push(column);
  // }

};


// GAME********************************

JSTicTacToe.Game = function(){
  this.board = new JSTicTacToe.Board();
  this.ai = new JSTicTacToe.AIPlayer(this);
  this.winningCombinations = [];
  
  this.winningCombinations = setWinningCombinations(this.board);

  this.addToBoard = function(position, player){
    this.board.addMove(position, player);
  }

  this.isFinished = function(){
    var hasNoAvailableMoves = ( this.board.available().length < 1 );
    return ( this.isWon() || hasNoAvailableMoves );
  }

  this.isWon = function(){
    var sameValueLines = this.winningCombinations.find(function(combo){
      var lineValues = getLineValues(this.board, combo);
      return lineValues.allDefinedValuesSame();
    }.bind(this));
    if (sameValueLines !== undefined && sameValueLines.length > 0){
      // ? this.winnerMark = this.board.moves[sameValueLines[0]];
      return true;
    }
    return false;
  }

  // private

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
        endIndex = board.cellCount - 1,
        increment = board.size + 1,
        firstDiagonal = [];

    firstDiagonal = setLine(startIndex, endIndex, increment);
    // board.addDiagonal(firstDiagonal);
    addWinningCombo(firstDiagonal, combinations);
  }

  function setSecondDiagonal(board, combinations){
    var startIndex = board.size - 1,
        endIndex = board.cellCount - board.size,
        increment = board.size - 1,
        secondDiagonal = [];

    secondDiagonal = setLine(startIndex, endIndex, increment);
    // board.addDiagonal(secondDiagonal);
    addWinningCombo(secondDiagonal, combinations);
  }

  function setRow(rowNumber, board, combinations){
    var startIndex = rowNumber * board.size,
        endIndex = startIndex + (board.size - 1),
        increment = 1,
        row = [];
    row = setLine(startIndex, endIndex, increment);
    addWinningCombo(row, combinations);
    // board.addRow(row);
  }

  function setColumn(columnNumber, board, combinations){
    var column = [],
        startIndex = columnNumber,
        endIndex = startIndex + (board.size * (board.size - 1)),
        increment = board.size;

    column = setLine(startIndex, endIndex, increment);
    addWinningCombo(column, combinations);
    // board.addColumn(column)
  }

  function setLine(start, end, increment){
    var line = [];
    for (var i = start; i <= end; i+=increment) {
      line.push(i);
    };
    return line;
  }

  function addWinningCombo(combo, combinations){
    combinations.push(combo);
  }

  function getLineValues(board, positions){
    var lineValues = [];
    positions.forEach(function(position){
      lineValues.push(board.moves[position]);
    });
    return lineValues;
  }

  // function compareValuesAreSame(board, values, howMany){
  //   return (values.allDefinedValuesSame() && values.length == board.size);
  // }

  // validations:
  // game is still active, can't play otherwise
  // cell not occupied
  // correct turn
  // correct player value
  // correct position
}

// AIPlayer********************************
JSTicTacToe.AIPlayer = function(game){

  this.mark = 'o';
  this.opponentMark = 'x';
  this.game = game;
  // var winningPosition,
  //     threatPosition;
  var emptyCellOnALine;
  this.winningMove = function(){
    emptyCellOnALine = undefined;
    if (twoInALine(this.mark, this.game.board)){
      return emptyCellOnALine;
    }
    return false;
  }

  this.threatPosition = function(){
    emptyCellOnALine = undefined;
    if (twoInALine(this.opponentMark, this.game.board)){
      return emptyCellOnALine;
    }
    return false;
  }

  function twoInALine(player, board){
    return ( checkDiagonalsForTwo(player, board) || checkRowsAndColumnsForTwo(player, board) );
  }

  function sameCellsInALine(player, board, howMany){
    // all
  }












  function checkDiagonalsForTwo(player, board){
    return ( checkFirstDiagonalForTwo(player, board) || checkSecondDiagonalForTwo(player, board));
  }

  function checkRowsAndColumnsForTwo(player, board){
    for (var i = 0; i < board.size; i++) {
      if ( checkRowForTwo(i, player, board) || checkColumnForTwo(i, player, board) ) return true; 
    };
    return false;
  }

  function checkFirstDiagonalForTwo(player, board){
    var startIndex = 0,
        endIndex = board.cellCount - 1,
        increment = board.size + 1,
        emptyCells = [];
    
    emptyCells = findEmptyCells(startIndex, endIndex, increment, board);
    return checkEmptyCells(emptyCells, startIndex, endIndex, increment, board, player);
  };

  function checkSecondDiagonalForTwo(player, board){
    var startIndex = board.size - 1,
        endIndex = board.cellCount - board.size,
        increment = board.size - 1,
        emptyCells = [];

    emptyCells = findEmptyCells(startIndex, endIndex, increment, board);
    return checkEmptyCells(emptyCells, startIndex, endIndex, increment, board, player);
  }

  function checkRowForTwo(rowNumber, player, board){
    var startIndex = rowNumber * board.size,
        endIndex = startIndex + (board.size - 1),
        increment = 1,
        emptyCells = [];
    emptyCells = findEmptyCells(startIndex, endIndex, increment, board);
    return checkEmptyCells(emptyCells, startIndex, endIndex, increment, board, player);
  }

  function checkColumnForTwo(columnNumber, player, board){
    var emptyCells = [],
        startIndex = columnNumber,
        increment = board.size,
        endIndex = startIndex + (board.size * (board.size - 1));
    emptyCells = findEmptyCells(startIndex, endIndex, increment, board);
    return checkEmptyCells(emptyCells, startIndex, endIndex, increment, board, player);
  }


  function findEmptyCells(start, end, increment, board){
    var emptyCells = [];
    for (var i = start; i <= end; i+= increment) {
      if(board.isCellEmpty(i)) emptyCells.push(i);
    };
    return emptyCells;
  }

  function findEmptyCellsNew(positions, board){

  }

  function checkEmptyCells(emptyCells, start, end, increment, board, player){
    var moves = board.playerMoves(player);
    if ( emptyCells.length == 1 ){
      for ( var i = start; i <= end; i += increment ) {
        if ( i == emptyCells[0]) continue;
        if ( !moves.hasElement(i) ) return false;
      }
      updateEmptyCell(emptyCells[0]);
      return true;
    } 
    return false;
  }

  function updateEmptyCell(position){
    emptyCellOnALine = position;
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

Array.prototype.allDefinedValuesSame = function(){
  // if (this[0] != undefined){
    for (var i = 1; i < this.length; i++) {
      if ( this[0] == undefined || this[i] !== this[0] ){
        return false;
      }
    };
  // } 
  return true;
}

Array.prototype.lastElement = function(){
  return this[this.length - 1];
}

if (!Array.prototype.find) {
  Array.prototype.find = function(predicate) {
    if (this == null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}


