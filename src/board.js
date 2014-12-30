'use strict';

var JSTicTacToe = JSTicTacToe || {};

// ================================================
// BOARD:
// ================================================

JSTicTacToe.Board = function(game){

  
  // this.diagonals = [];
  // this.rows = [];
  // this.columns = [];
  this.game = game;
  this.moves = {};
  this.movesInOrder = [];
  this.size = 3;
  this.positionsAmount = Math.pow(this.size, 2);
  this.possiblePositions = setPossiblePositions(this.positionsAmount);

  this.addMove = function(position, player){
    this.moves[position] = player;
    var move = {};
    move[position] = player;
    this.movesInOrder.push(move);
  }


  this.getPlayer = function(position){
    return this.moves[position];
  }

  this.takenPositions = function(){
    return this.movesInOrder.map(function(move){
      return parseInt(Object.keys(move)[0]);
    }).ascending();
  }

  this.available = function(){
    var available = this.possiblePositions.filter(function(position){
      return this.getPlayer(position) === undefined;
    }.bind(this));
    return available.ascending();
  }

  this.positionType = function(position){
    var remainder = position % 2;
    if (position == 4){
      return "center";
    } 
    else if (remainder == 0){
      return "corner";
    } 
    else {
      return "edge";
    };
  };

  this.isPositionEmpty = function(position) {
    // might need to extract cell validation check
    if (this.possiblePositions.hasElement(position)){
      return this.getPlayer(position) === undefined;
    }
    // return this.available().hasElement(position);
  };

  this.availableOnAGivenLine = function(line){
    var available = line.filter(function(position){
      return this.getPlayer(position) === undefined;
    }.bind(this));
    return available.ascending();
  }

  this.takenOnAGivenLine = function(line){
    var taken = line.filter(function(position){
      return this.getPlayer(position) != undefined;
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
        return this.getPlayer(position);
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
          return this.getPlayer(position) != undefined;
        }.bind(this));
        var linePlayer = this.moves[takenPosition];
        return linePlayer != undefined && linePlayer == player
      }
    }.bind(this));
    return playerLines;
  } // needs refactor at some point

  this.corners = function(){
    return this.possiblePositions.filter(function(position){
      return this.positionType(position) == 'corner';
    }.bind(this)).ascending();
  }

  this.center = function(){
    return this.possiblePositions.find(function(position){
      return this.positionType(position) == 'center';
    }.bind(this));
  }

  this.lastPositionFor = function(player){
    var position,
        movesReverse = this.movesInOrder.slice().reverse();

    movesReverse.find(function(move){
      position = parseInt(Object.keys(move)[0]);
      return move[position] == player;
    });
    return position;
  }


  function setPossiblePositions(amount){
    var positions = [];
    for (var i = 0; i < amount; i++) {
      positions.push(i);
    };
    return positions;
  }

  

};


// ================================================
// GAME:
// ================================================
JSTicTacToe.Game = function(firstPlayer){
  this.board = new JSTicTacToe.Board(this);
  this.ai = new JSTicTacToe.AIPlayer(this, firstPlayer);
  this.winningCombinations = setWinningCombinations(this.board);

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

  this.canMove = function(player){
    var moveCount = this.board.movesInOrder.length;
    if ( (isOddMove(moveCount) && player == 'x') || (!isOddMove(moveCount) && player == 'o') ){
      return true;
    }
    return false;
  }

  this.humanPlay = function(position){
    if (this.canMove(this.ai.opponentMark)){
      this.addToBoard(position, this.ai.opponentMark);
      this.updateBoardView(this);
      console.log('added to human', position)
    } else {
      console.log('no can do');
    }
    this.ai.play();
  }

  this.isFirstEverMove = function(){
    return this.board.movesInOrder.length == 0;
  }

  this.updateBoardView = function(game){
    console.log('taken', this.board.takenPositions())
    // console.log(this.board.movesInOrder);
    this.board.takenPositions().forEach(function(position){
      // console.log(this)
      $('td').each(function(index){
        var $this = $(this);
        if ($this.data('position') == position){
          var text = game.board.movesInOrder.find(function(move){
              return (parseInt(Object.keys(move)[0]) == position);
          })[position];
          $this.text(text);        }
      });
    });
  }

  function isOddMove(movesSoFar){
    return movesSoFar % 2 == 0;
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
        endIndex = board.positionsAmount - 1,
        increment = board.size + 1,
        firstDiagonal = [];

    firstDiagonal = setLine(startIndex, endIndex, increment);
    // board.addDiagonal(firstDiagonal);
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


// ================================================
// AI-PLAYER:
// ================================================

JSTicTacToe.AIPlayer = function(game, firstPlayer){
  this.mark = (firstPlayer == 'ai') ? 'x' : 'o';
  this.opponentMark = (this.mark == 'x') ? 'o' : 'x';
  this.game = game;
  this.mainStrategy;
  
  this.winningPosition = function(){
    var board = this.game.board,
        winLines = board.singlePlayerLinesForPlayer(this.mark, (board.size - 1));
    if (winLines.length > 0){
      return board.availableOnAGivenLine(winLines[0])[0];
    }
    return false;
  }

  this.threatPosition = function(){
    var board = this.game.board,
        threatLines = board.singlePlayerLinesForPlayer(this.opponentMark, (board.size - 1));
    if (threatLines.length > 0){
      return board.availableOnAGivenLine(threatLines[0])[0];
    }
    return false;
  }

  this.play = function(){
    if ( this.game.canMove(this.mark)){
      var position;

      if (this.game.isFirstEverMove()){
        position = this.firstMove();
        console.log('in first move IF')
      } else if (typeof this.winningPosition() == 'number'){
        position = this.winningPosition();
        console.log('in winning position IF')
      } else if (typeof this.threatPosition() == 'number'){
        position = this.threatPosition();
        console.log('in threatPosition IF')
      } else if (typeof this.strategicPosition() == 'number'){
        position = this.strategicPosition();
        console.log('in strategicPosition IF')
      } else {
        position = this.basicStrategy();
        console.log('in basicStrategy IF')
      } // calling functions twice, need to do something about it

      // if (typeof position == 'number'){
        this.game.addToBoard(position, this.mark);
        this.game.updateBoardView(this.game);
      // }
      
    } else {
      console.log('ai, hold fire')
    }    
  }

  this.firstMove = function(){
    var board = this.game.board,
        center = board.center(),
        corner = randomElement(board.corners());
    return randomElement([corner, center]);
  }

  this.strategicPosition = function(){
    if (this.mainStrategy == undefined){
      this.pickAIStrategy();
    }
    // if (this.mainStrategy != undefined){
    var position,
        movesSoFar = this.game.board.movesInOrder.length;

    switch (this.mainStrategy){
      case 'cornerAsFirst':
        position = this.cornerAsFirst(movesSoFar);
        break;
      case 'centerAsFirst':
        position = this.centerAsFirst(movesSoFar);
        break;
      case 'cornerAsSecond':
        position = this.cornerAsSecond(movesSoFar);
        // console.log('inside strategicPosition/cornerAsSecond')
        // console.log(position)
        break;
      case 'centerAsSecond':
        position = this.centerAsSecond(movesSoFar);
        break;
      case 'edgeAsSecond':
        position = this.edgeAsSecond(movesSoFar);
        break;
    }
    return position;
  }
  // switch (movesSoFar){
  //   case 1:


  //     // check opponents last move
  //     // if they played corner, 
  //     // this.mainStrategy = 'cornerAsSecond'
  //     // cornerAsSecond(movesSoFar)

  //     // play center
  //     // if they played center, play corner
  //     // otherwise, play center
  //     break;

  // switch (movesSoFar){
  //   case 2:
  //     // what did you play, ownLastMove
  //     // this.strategy
  //     this.strategicPosition();
  //     break;

  //   case 4:
  //     var aiLastMoveType = this.aiLastMoveType();
  //     switch ( aiLastMoveType ){
  //       case 'center':
  //         // code
  //         break;
  //       case 'corner':
  //         // code
  //         break;
  //     }
  //     break;

  // }

  this.pickAIStrategy = function(){
    if ( this.mark == 'x'){
      this.pickAIStrategyAsFirst()
    } else {
      this.pickAIStrategyAsSecond();
    }
  }

  this.pickAIStrategyAsFirst = function(){
    var board = this.game.board,
        myLastPosition = board.lastPositionFor(this.mark),
        myLastPositionType = board.positionType(myLastPosition);

    switch (myLastPositionType){
      case 'corner':
        this.mainStrategy = 'cornerAsFirst';
        break;
      case 'center':
        this.mainStrategy = 'centerAsFirst';
        break;
    }
  }

  this.pickAIStrategyAsSecond = function(){ 
    var board = this.game.board,
        opponentsLastPosition = board.lastPositionFor(this.opponentMark),
        lastPositionType = board.positionType(opponentsLastPosition);
    
    switch (lastPositionType){
      case 'corner':
        this.mainStrategy = 'cornerAsSecond';
        break;
      case 'center':
        this.mainStrategy = 'centerAsSecond';
        break;
      case 'edge':
        this.mainStrategy = 'edgeAsSecond';
        break;
    }
  }

  this.cornerAsSecond = function(movesSoFar){
    var position;
    switch (movesSoFar){
      case 1:
        console.log('in cornerAsSecond');
        console.log(movesSoFar)
        position = this.game.board.center();

        break;

      case 3:
        
        break;

      case 5:

        break;
    }
    return position;
  }

  this.centerAsSecond = function(movesSoFar){
    console.log('in centerAsSecond')
    switch (movesSoFar){
      case 1:
        
        break;

      case 3:
        
        break;

      case 5:

        break;
    }
  }

  this.edgeAsSecond = function(movesSoFar){
    console.log('in edgeAsSecond')
    switch (movesSoFar){
      case 1:
        
        break;

      case 3:
        
        break;

      case 5:

        break;
    }
  }

  this.cornerAsFirst = function(movesSoFar){
    console.log('in cornerAsFirst')
    switch (movesSoFar){
      case 2:
        
        break;

      case 4:
        
        break;

      case 6:

        break;
    }
  }

  this.centerAsFirst = function(movesSoFar){
    console.log('in centerAsFirst')
    switch (movesSoFar){
      case 2:
        
        break;

      case 4:
        
        break;

      case 6:

        break;
    }
  }



  this.basicStrategy = function(){

  }

  // this.firstPlayerStrategy = function(){
    
    
  //   // console.log(position)
  //   // this.game.addMove()
  //   // play in the corner or center

  //   // corner
  // }


  // this.strategicPlay = function(){
  //   // is this game's first move?
  //   // yes:
  //   // play corner or centre


  //   // no:
  //   // what did human play?
  //   // center: play corner
  //   // corner: play center

  // }
  


}



// ================================================
// ARRAY EXTENSIONS:
// ================================================

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

// ================================================
// HELPERS:
// ================================================

function randomize(data){
  return data.sort(function(){
    return 0.5 - Math.random();
  });
}

function randomElement(data){
  var myArray = randomize(data);
  var index = Math.floor(Math.random() * myArray.length);
  return myArray[index];
}

// ================================================
// DEFINITELY WILL NEED:
// ================================================
// validations:
// game is still active, can't play otherwise
// cell not occupied
// correct turn
// correct player value
// correct position




// ================================================
// MAY BE?
// ================================================


// BOARD===========================================
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
// BOARD===========================================


// UNNECESSARY?

// this.playerMoves = function(player){
//   var taken = this.taken(),
//       allMoves = this.moves,
//       playerMoves = taken.filter(function(position){
//         return allMoves[position] == player;
//       });
//   return playerMoves.ascending();
// }

// describe('#playerMoves', function(){
//   it('returns moves for a given player', function(){
//     board.addMove(5, 'x');
//     board.addMove(7, 'o');
//     board.addMove(0, 'x');
//     board.addMove(4, 'o');
//     expect(board.playerMoves('x')).toEqual([0, 5]);
//     expect(board.playerMoves('o')).toEqual([4, 7]);

//   });
// });


// this.taken = function(){
//   var moves = Object.keys(this.moves).map(function(move){
//     return parseInt(move);
//   });
//   return moves;
// }
