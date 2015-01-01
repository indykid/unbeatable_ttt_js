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
    var playerMove = this.movesInOrder.find(function(move){
      return this.positionOfMove(move) == position;
    }.bind(this));    
    if (playerMove){
      return playerMove[position];
    }
    // return this.moves[position]; - using old data structure
  }

  this.takenPositions = function(){
    return this.movesInOrder.map(function(move){
      return this.positionOfMove(move);
    }.bind(this)).ascending();
  }

  this.available = function(){
    var available = this.possiblePositions.filter(function(position){
      return !this.takenPositions().hasElement(position);
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
    return this.available().hasElement(position);
  };

  this.availableOnAGivenLine = function(line){
    var available = line.filter(function(position){
      return this.isPositionEmpty(position);
    }.bind(this));
    return available.ascending();
  }

  this.takenOnAGivenLine = function(line){
    var taken = line.filter(function(position){
      return this.getPlayer(position) != undefined;
    }.bind(this));
    return taken.ascending();
  }  

  this.isLineFilledWith = function(howMany, line){
    var taken = this.takenOnAGivenLine(line);
    return taken.length == howMany;
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

  this.corners = function(fromMoves){
    return fromMoves.filter(function(position){
      return this.positionType(position) == 'corner';
    }.bind(this)).ascending();
  }

  this.center = function(){
    return this.possiblePositions.find(function(position){
      return this.positionType(position) == 'center';
    }.bind(this));
  }

  this.cornerOrCenter = function(fromMoves){
    var center = this.center(),
        corner = randomElement(this.corners(fromMoves));
    return randomElement([corner, center]);
  }

  this.lastPositionFor = function(player){
    var position,
        movesReverse = this.movesInOrder.slice().reverse();

    movesReverse.find(function(move){
      position = this.positionOfMove(move);
      return move[position] == player;
    }.bind(this));
    return position;
  }

  this.oppositePosition = function(position){
    var reverseOrder = this.possiblePositions.slice().reverse();
    return reverseOrder[position];
  }

  this.adjacentPositions = function(position){
    var positions;
    switch ( this.positionType(position)){
      case 'corner':
        if ( position < this.center()){
          positions = [this.possiblePositions[0] + 1, position + this.size];
        } else {
          positions = [this.possiblePositions.lastElement() - 1, position - this.size];
        }
        break;
      case 'edge':
        if ((position - 1) == this.possiblePositions[0] || (position + 1) == this.possiblePositions.lastElement()){
          positions = [position + 1, position - 1];
        } else {
          positions = [position - this.size, position + this.size]
        }
        break;
    }
    return positions.ascending();
  }

  this.positionOfMove = function(move){
    return parseInt(Object.keys(move)[0]);
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
  this.firstPlayer = firstPlayer;
  this.winner = {player:undefined, mark: undefined};
  this.status = 'active'; // other states: won, drawn

  this.addToBoard = function(position, player){
    this.board.addMove(position, player);
  }

  this.isActive = function(){
    return ( !this.isWon() && !this.isDrawn() );
  }

  this.isDrawn = function(){
    return this.board.available().length < 1 && !this.isWon();
  }

  this.winnerMark = function(){
    var singlePlayerFullLine = this.winningCombinations.find(function(combination){
      return this.board.isLineFilledWith(this.board.size, combination) && this.board.singlePlayerLine(combination, this.board.size);
    }.bind(this));
    if (singlePlayerFullLine!=undefined){
      return this.board.getPlayer(singlePlayerFullLine[0]);
    }
    
  } // returns winner's Mark, if there's one

  this.findWinner = function(mark){
    var winner = mark == this.ai.mark ? 'ai' : 'human';
    return winner;
  }

  this.setWinner = function(winner, mark){
    this.winner['player'] = winner;
    this.winner['mark'] = mark;
  }

  this.isWon = function(){
    // var board = this.board;
    // var singlePlayerFullLine = this.winningCombinations.find(function(combination){
    //   return board.singlePlayerLine(combination, board.size);
    // });
    // // ? this.winnerMark = board.moves[singlePlayerFullLine[0]];
    // return singlePlayerFullLine != undefined;
    return this.winner.player != undefined;
  }

  this.checkAndUpdateGameState = function(){
    var winnerMark = this.winnerMark();
    if (winnerMark){
      var winner = this.findWinner(winnerMark);
      this.setWinner(winner, winnerMark);
      this.status = 'won';
    } else if ( this.isDrawn() ){
      this.status = 'draw';
    }
  }

  this.isPlayerTurn = function(player){
    var moveCount = this.board.movesInOrder.length;
    if ( (isOddMove(moveCount) && player == 'x') || (!isOddMove(moveCount) && player == 'o') ){
      return true;
    }
    return false;
  }

  this.humanPlay = function(position){
    // if (this.board.isPositionEmpty(position)){      
      
    if (this.isPlayerTurn(this.ai.opponentMark)){
      this.addToBoard(position, this.ai.opponentMark);
      // console.log('added to human', position);
      this.checkAndUpdateGameState();
      this.updateBoardView(this);
      this.updateUI();
    } else {
      alert('easy tiger, not your turn');
    }

    if (this.isActive() && this.isPlayerTurn(this.ai.mark)){
      // not sure if necessary to check the turn here or inside ai.play...
      this.ai.play();
    } 
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
              return (game.board.positionOfMove(move) == position);
          })[position];
          $this.text(text);        }
      });
    });
  }

  this.updateUI = function(){
    // update any on screen messages, like game status, won drawn, active..., or who is winner
    var status = $('#status'),
        winner = $('#winner'),
        notice = $('#notice');
    status.text(this.status);
    if (this.winner.player){
      winner.text(uiFriendlyPlayer(this.winner.player));
      notice.show();
    }
  }

  function markToPlayer(mark, game){
    return game.ai.mark == mark ? 'ai' :'human'
  }

  function uiFriendlyPlayer(player){
    var friendly = player == 'ai' ? 'computer' : 'you';
    console.log(friendly)
    return friendly;
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
    // game active check? 
    var position,
        board = this.game.board;
    if (this.game.isFirstEverMove()){
      position = board.cornerOrCenter(board.possiblePositions);
      console.log('in first move IF')
    } else if (typeof(position = this.winningPosition()) == 'number'){
      // position = this.winningPosition();
      console.log('in winning position IF')
    } else if (typeof(position = this.threatPosition()) == 'number'){
      // position = this.threatPosition();
      console.log('in threatPosition IF')
    } else if (typeof(position = this.strategicPosition()) == 'number'){
      // position = this.strategicPosition();
      console.log('in strategicPosition IF')
    } else {
      position = this.basicStrategy();
      console.log('in basicStrategy IF')
    } // calling functions twice, need to do something about it

      // potentially redundant validation for non-occupancy if moves are only picked from available ones anyway:
    if ( board.isPositionEmpty(position)){
      this.game.addToBoard(position, this.mark);
      this.game.updateBoardView(this.game);
      this.game.checkAndUpdateGameState();
      this.game.updateUI();
    } else {
      console.log('POSITION WAS OCCUPIED');
      if ( this.game.isActive()){
        this.play();
      }
    }  
  }

  this.strategicPosition = function(){
    if (this.mainStrategy == undefined){
      this.pickAIStrategy();
    }
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

    var position,
        board = this.game.board,
        opponentsLastPosition = board.lastPositionFor(this.opponentMark);
    switch (movesSoFar){
      case 1:
        console.log('in cornerAsSecond case 1');
        position = this.game.board.center();
        break;
      case 3:
      console.log('in cornerAsSecond case 3');
        var fullLine = this.game.winningCombinations.find(function(combination){
          return board.isLineFilledWith(board.size, combination);
        });
        // if there's a full diagonal
        if (fullLine != undefined){
          // play any edge
          var edges = board.available().filter(function(position){
            return board.positionType(position) == 'edge';
          });
          position = randomElement(edges);
        } else {
          // should i defend myself
          if (typeof(position = this.threatPosition()) == 'number'){
            // break;
            // return position
          } else {
            // opponent must have played opposite edge to its first move (x1)
            // cannot play the corner opposite x1, and need to play any cell on the same side as the opponent's last move
            var oppositeToFirstMove = board.oppositePosition(board.positionOfMove(board.movesInOrder[0]));
            var adjacentToLastMove = board.adjacentPositions(opponentsLastPosition);
            var lines = board.singlePlayerLinesForPlayer(this.opponentMark, 1);
 
            // console.log(adjacentToLastMove)
            var line = lines.find(function(line){
              return !line.hasElement(oppositeToFirstMove) && (commonValues(line, adjacentToLastMove).length > 0);
            });
            var available = board.availableOnAGivenLine(line);
            position = randomElement(available);
          }
        }
        break;
    }
    return position;
  }

  this.centerAsSecond = function(movesSoFar){
    var board = this.game.board,
        opponentsLastPosition = board.lastPositionFor(this.opponentMark),
        position;

    switch (movesSoFar){
      case 1:
        console.log('in centerAsSecond case 1');
        position = randomElement(this.game.board.corners(board.available()));
        break;

      case 3:
        if ( opponentsLastPosition == board.oppositePosition(board.lastPositionFor(this.mark)) ){
          position = randomElement(this.game.board.corners(board.available()));
        } else {
          position = this.commonSenseStrategy();
        }
        break;
    }
    return position;
  }

  this.edgeAsSecond = function(movesSoFar){
    var position,
        board = this.game.board,
        opponentsLastPosition = board.lastPositionFor(this.opponentMark);
    console.log('in edgeAsSecond')
    switch (movesSoFar){
      case 1:
        console.log('in edgeAsSecond case 1');
        position = this.game.board.center(); 
        break;

      case 3:
        
        break;
    }
    return position;
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
    // beware of playing on adjacent sides (followed by adjacent corner) to his corner defence move
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

  this.commonSenseStrategy = function(){
    var position;
    if (typeof(position = this.winningPosition()) == 'number'){
            // position = this.winningPosition();
    } else if (typeof(position = this.threatPosition()) == 'number'){
      // position = this.threatPosition();
    } else {
      position = this.basicStrategy();
    }
    return position;
  }

  this.basicStrategy = function(){
    // this is a fallback if there are no strategic moves to be made
    // find line where i already have 1 move
    // if none then find an empty line and play there
    // if none of the above, just take any available position
    // note: no need to check if occupied as only picking from empty anyway
    var position,
        line,
        available,
        board = this.game.board,
   
        aiOnlyLines = board.singlePlayerLinesForPlayer(this.mark, 1),
        emptyLines = this.game.winningCombinations.filter(function(combination){
          return board.availableOnAGivenLine(combination).length == board.size;
        });

    // console.log()
    if (aiOnlyLines.length > 0){
      // find available position:
      line = randomElement(aiOnlyLines);
    } else if (emptyLines.length > 0){
      // find empty line:
      line = randomElement(emptyLines);
    } 

    if (line != undefined){
      available = board.availableOnAGivenLine(line);
      position = randomElement(available);
    } else {
      // find available pick a random
      position = randomElement(board.available());
    }
    return position;
  }


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

function commonValues(a, b){
  // console.log(a)
  // console.log(b)
  var result = a.filter(function(n) {
    return b.indexOf(n) != -1;
  });
  return result;
}


// ================================================
// DEFINITELY WILL NEED:
// ================================================
// validations:

  // clear event listener on cells if someone won the game?


// possible player value
// possible position


// i should draw grid from JS instead of just showing it...


// ================================================
// DONE
// ================================================
// game is still active, can't play otherwise
// cell not occupied check
// correct turn

// ================================================
// MAY BE?
// ================================================

// declare draw when no possible wins even if empty cells remain?

// hardcoded version... might be better?:
// this.adjacentPositions = function(position){
//   var positions;
//   switch (position){
//     case 0:
//       positions = [1, 3]
//       break;
//     case 1:
//       positions = [0, 2]
//       break;
//     case 2:
//       positions = [1, 5]
//       break;
//     case 3:
//       break;
//     case 4:
//       break;
//     case 5:
//       break;
//     case 6:
//       break;
//     case 7:
//       break;
//     case 8:
//       break;
//   }
// }

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
