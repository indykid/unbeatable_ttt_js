'use strict';

var JSTicTacToe = {};

// BOARD********************************
// BOARD********************************
// BOARD********************************

JSTicTacToe.Board = function(game){

  
  // this.diagonals = [];
  // this.rows = [];
  // this.columns = [];
  this.game = game;
  this.moves = {};
  this.size = 3;
  this.cellAmount = Math.pow(this.size, 2);
  this.allPositions = setPossiblePositions(this.cellAmount);

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

  this.positionType = function(position){
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

  this.isPositionEmpty = function(position) {
    // might need to extract cell validation check
    if (this.allPositions.hasElement(position)){
      return this.moves[position] === undefined;
    }
    // return this.available().hasElement(position);
  };

  this.availableOnAGivenLine = function(line){
    var available = line.filter(function(position){
      return this.moves[position] === undefined;
    }.bind(this));
    return available.ascending();
  }

  this.takenOnAGivenLine = function(line){
    var taken = line.filter(function(position){
      return this.moves[position] != undefined;
    }.bind(this));
    return taken.ascending();
  }  

  this.isLineFull = function(line){
    var taken = this.takenOnAGivenLine(line);
    return taken.length == this.size;
  }

  this.singlePlayerLine = function(line, howMany){
    var taken = this.takenOnAGivenLine(line);
    // console.log(howMany)
    if (taken.length == howMany){
      var moves = taken.map(function(position){
        return this.moves[position];
      }.bind(this));    
      return moves.allDefinedValuesSame();
    }
    return false;
  }

  this.singlePlayerLinesForPlayer = function(player, howMany){
    var playerLines = this.game.winningCombinations.filter(function(combination){
      if (this.singlePlayerLine(combination, howMany)){
        var linePlayer;
        var takenPosition = combination.find(function(position){
          return this.moves[position] != undefined;
        }.bind(this));
        var linePlayer = this.moves[takenPosition];
        return linePlayer != undefined && linePlayer == player
      }
    }.bind(this));
    return playerLines;
  }

  // var moves = [];
  // var playerMoves = this.playerMoves(player);
  // combination.forEach(function(position){
  //   if (playerMoves)
  // }); 
  // return 

  this.getPositionPlayers = function(positions){
    var positionPlayers = [];
    positions.forEach(function(position){
      positionPlayers.push(this.moves[position]);
    }.bind(this));
    return positionPlayers;
  }

  // isLineEmpty


  // this.addDiagonal = function(diagonal){
  //   this.diagonals.push(diagonal);
  // }

  // this.addRow = function(row){
  //   this.rows.push(row);
  // }

  // this.addColumn = function(column){
  //   this.columns.push(column);
  // }

  function setPossiblePositions(amount){
    var positions = [];
    for (var i = 0; i < amount; i++) {
      positions.push(i);
    };
    return positions;
  }

};


// GAME********************************
// GAME********************************
// GAME********************************

JSTicTacToe.Game = function(){
  this.board = new JSTicTacToe.Board(this);
  this.ai = new JSTicTacToe.AIPlayer(this);
  this.winningCombinations = [];
  
  this.winningCombinations = setWinningCombinations(this.board);
  // console.log(this.winningCombinations)

  this.addToBoard = function(position, player){
    this.board.addMove(position, player);
  }

  this.isFinished = function(){
    var hasNoAvailableMoves = ( this.board.available().length < 1 );
    return ( this.isWon() || hasNoAvailableMoves );
  }

  this.isWon = function(){
    var board = this.board;
    var singlePlayerFullLine = this.winningCombinations.find(function(combination){
      return board.isLineFull(combination) && board.singlePlayerLine(combination, board.size);
    });
    // ? this.winnerMark = board.moves[singlePlayerFullLine[0]];
    return singlePlayerFullLine != undefined;
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
        endIndex = board.cellAmount - 1,
        increment = board.size + 1,
        firstDiagonal = [];

    firstDiagonal = setLine(startIndex, endIndex, increment);
    // board.addDiagonal(firstDiagonal);
    addWinningCombo(firstDiagonal, combinations);
  }

  function setSecondDiagonal(board, combinations){
    var startIndex = board.size - 1,
        endIndex = board.cellAmount - board.size,
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
// AIPlayer********************************
// AIPlayer********************************

JSTicTacToe.AIPlayer = function(game){

  this.mark = 'o';
  this.opponentMark = 'x';
  this.game = game;
  // var winningPosition,
  //     threatPosition;


  this.winningMove = function(){
    var winPosition,
        board = this.game.board,
        winLines = board.singlePlayerLinesForPlayer(this.mark, (board.size - 1));
    if (winLines.length > 0){
      var winLine = winLines[0];
      winLine.forEach(function(position){
        if (board.isPositionEmpty(position)) winPosition = position;
      });
      return winPosition;
    }
    return false;
  }


  this.threatPosition = function(){
    var threatPosition,
        board = this.game.board,
        threatLines = board.singlePlayerLinesForPlayer(this.opponentMark, (board.size - 1));
    if (threatLines.length > 0){
      var threatLine = threatLines[0];
      threatLine.forEach(function(position){
        if (board.isPositionEmpty(position)) threatPosition = position;
      });
      return threatPosition;
    }
    return false;
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


