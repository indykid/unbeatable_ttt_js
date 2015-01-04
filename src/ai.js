'use strict';

var JSTicTacToe = JSTicTacToe || {};

(function(){
  return JSTicTacToe.AIPlayer = function(game, firstPlayer){
  this.mark = (firstPlayer == 'ai') ? 'x' : 'o';
  this.opponentMark = (this.mark == 'x') ? 'o' : 'x';
  this.game = game;
  this.mainStrategy;
  
  this.winningPosition = function(){
    var board = this.game.board,
        winLines = board.singleMarkLines(this.mark, (board.size - 1));
    if (winLines.length > 0){
      console.log('in winningPosition')
      return board.availableOnAGivenLine(winLines[0])[0];
    }
    return false;
  }

  this.threatPosition = function(){
    var board = this.game.board,
        threatLines = board.singleMarkLines(this.opponentMark, (board.size - 1));
    if (threatLines.length > 0){
      console.log('in threatPosition')
      return board.availableOnAGivenLine(threatLines[0])[0];
    }
    return false;
  }

  this.play = function(){
    // GAME ACTIVE CHECK? in here or prior to calling the method
    var position,
        board = this.game.board; // REVIEW
    if (board.moves.length === 0){
      // position = board.center();
      // position = randomElement(board.corners(board.available()))
      position = cornerOrCenter(board);
      // console.log('in first move IF')
    } else if (typeof(position = this.winningPosition()) === 'number'){
      // position = this.winningPosition();
      // console.log('in winning position IF')
    } else if (typeof(position = this.threatPosition()) === 'number'){
      // position = this.threatPosition();
      // console.log('in threatPosition IF')
    } else if (typeof(position = this.strategicPosition()) === 'number'){
      // position = this.strategicPosition();
      // console.log('in strategicPosition IF')
    } else {
      position = this.basicStrategy();
      // console.log('in basicStrategy IF')
    } // CRIME AGAINST JS, MUST REVIEW: this is really hacky, but otherwise I am calling functions twice, need to do something about it

      // potentially redundant validation for non-occupancy if moves are only picked from available ones anyway:
    // if ( board.isPositionEmpty(position)){

      this.game.addToBoard(position, this.mark);
      this.game.updateBoardView(this.game);
      this.game.checkAndUpdateGameState();
      this.game.updateUI();
      console.log(board.takenPositions())
    // } else {
    //   // ?
    //   console.log('POSITION WAS OCCUPIED');
    //   // if ( this.game.isActive()){
    //     this.play();
    //   // }
    // }  
  }

  this.strategicPosition = function(){
    if (this.mainStrategy === undefined){
      pickAIStrategy(this);
    }
    var position,
        movesSoFar = this.game.board.moves.length;

    switch (this.mainStrategy){
      case 'cornerAsFirst':
      // console.log('inside strategicPosition/cornerAsFirst')

        position = this.cornerAsFirst(movesSoFar);
        break;
      case 'centerAsFirst':
      
        position = this.centerAsFirst(movesSoFar);
        break;
      case 'cornerAsSecond':
        position = this.cornerAsSecond(movesSoFar);
        
        // console.log(position)
        break;
      case 'centerAsSecond':
      
        position = this.centerAsSecond(movesSoFar);
        break;
      case 'edgeAsSecond':
      // console.log('inside strategicPosition/edgeAsSecond')
        position = this.edgeAsSecond(movesSoFar);
        break;
    }
    return position;
  }

  function pickAIStrategy(ai){
    if ( ai.mark === 'x'){
      pickAIStrategyAsFirst(ai)
    } else {
      pickAIStrategyAsSecond(ai);
    }
  } //REVIEW: not sure... need to check

  function pickAIStrategyAsFirst(ai){
    var board = ai.game.board,
        myLastPosition = board.lastPositionFor(ai.mark),
        myLastPositionType = board.positionType(myLastPosition);

    switch (myLastPositionType){
      case 'corner':
        ai.mainStrategy = 'cornerAsFirst';
        break;
      case 'center':
        ai.mainStrategy = 'centerAsFirst';
        break;
    }
  }

  function pickAIStrategyAsSecond(ai){ 
    var board = ai.game.board,
        opponentsLastPosition = board.lastPositionFor(ai.opponentMark),
        lastPositionType = board.positionType(opponentsLastPosition);
    
    switch (lastPositionType){
      case 'corner':
        ai.mainStrategy = 'cornerAsSecond';
        break;
      case 'center':
        ai.mainStrategy = 'centerAsSecond';
        break;
      case 'edge':
        ai.mainStrategy = 'edgeAsSecond';
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
      console.log('in cornerAsSecond case 2, 3 moves');
        var fullLine = this.game.winningCombinations.find(function(combination){
          return board.availableOnAGivenLine(combination).length === 0;
        });
        
        // if there's a full diagonal
        if (fullLine !== undefined){
          // play any edge
          var edges = board.available().filter(function(position){
            return board.positionType(position) === 'edge';
          });
          position = randomElement(edges);
        } else {
          
          // opponent must have played opposite edge to its first move (x1)
          // cannot play the corner opposite x1, and need to play corner cell on the same side as the opponent's last move
          // ie corner which is adjacent to opponentsLastPosition but itself is not the opposite to his first move.
          var oppositeToFirstMove = board.oppositePosition(board.moves[0].position);
          var adjacentToLastMove = board.adjacentPositions(opponentsLastPosition);
          position = adjacentToLastMove.find(function(move){
            return board.positionType(move) === 'corner' && move !== oppositeToFirstMove;
          });
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
        console.log('in centerAsSecond case 1 (1 move)');
        position = randomElement(this.game.board.corners(board.available()));
        break;

      case 3:
        console.log('in centerAsSecond case 2 (3 moves)')
        if ( opponentsLastPosition === board.oppositePosition(board.lastPositionFor(this.mark)) ){
          position = randomElement(this.game.board.corners(board.available()));
        }
        break;
    }
    return position;
  }

  this.edgeAsSecond = function(movesSoFar){
    var position,
        board = this.game.board,
        opponentsLastPosition = board.lastPositionFor(this.opponentMark),
        opponentsFirstPosition = board.moves[0].position;
    // console.log('opponentsFirstPosition', opponentsFirstPosition)
    switch (movesSoFar){
      case 1:
        console.log('in edgeAsSecond case 1, 1move');
        position = this.game.board.center(); 
        break;

      case 3:
      console.log('in edgeAsSecond case 2, 3 move');
      // in the rare case that x2 is opposite to x1, play any corner
        if( opponentsLastPosition === board.oppositePosition(opponentsFirstPosition)){
          position = randomElement(board.corners(board.available()));
        } else {
          // play corner adjacent to x1 and on the same side as x2
          var adjacentToFirstMove = board.adjacentPositions(opponentsFirstPosition);
          var opponentsLines = board.singleMarkLines(this.opponentMark, 1);
          var lines = opponentsLines.filter(function(line){
            return commonValues(line, adjacentToFirstMove).length > 0;
          });
          position = commonValues(lines[0], lines.lastElement())[0];
        }
        break;
    }
    return position;
  }

  this.cornerAsFirst = function(movesSoFar){
    var position,
        board = this.game.board,
        opponentsLastPosition = board.lastPositionFor(this.opponentMark);
    switch (movesSoFar){
      case 2:
      console.log('in cornerAsFirst, case 1, 2 moves')
        var lastPositionType = board.positionType(opponentsLastPosition);
        var oppositeToFirstMove = board.oppositePosition(board.moves[0].position);
        
        if (lastPositionType === 'center'){
          position = oppositeToFirstMove;
        } else {
          // console.log('in cornerAsFirst case 2, human didnt play center')

          // play corner which is not opposite to the first move and is on adjacent to opponentsLastMove
          var adjacentToLastMove = board.adjacentPositions(opponentsLastPosition);
          var corners = board.corners(board.available()).filter(function(corner){
            return corner !== oppositeToFirstMove && !adjacentToLastMove.hasElement(corner);
          });
          position = randomElement(corners);      
        }
        break;

      case 4:
        console.log('in cornerAsFirst, case 2, 4 moves')
        // would only end up here if human didn't block with center
          // play on an empty intersection of ai-only lines?
        var lines = board.singleMarkLines(this.mark, 1);
        var positions = [];
        for (var i = 0; i < lines.length - 1; i++){
          positions.push(commonValues(lines[i], lines[i+1])[0]);
        }
        positions.push(commonValues(lines[i], lines.lastElement())[0]);
        position = randomElement(positions.filter(function(position){
          return board.isPositionEmpty(position);
        }));
        break;
    }
    return position
  }

  this.centerAsFirst = function(movesSoFar){
    var board = this.game.board,
        position,
        opponentsLastPosition = board.lastPositionFor(this.opponentMark);
    switch (movesSoFar){
      case 2:
      console.log('in centerAsFirst, case 1, 2 moves')
        var lastPositionType = board.positionType(opponentsLastPosition);
        if (lastPositionType === 'edge'){
          position = randomElement(board.corners(board.available()));
        } else {
          position = board.oppositePosition(opponentsLastPosition);
        }
        break;

      case 4:
      console.log('in centerAsFirst, case 2, 4 moves')
        var lines = board.singleMarkLines(this.mark, 1).map(function(line){
          return board.availableOnAGivenLine(line);
        });
        var positions = [];
        for (var i = 0; i < lines.length - 1; i++){
          positions.push(commonValues(lines[i], lines[i+1])[0]);
        }
        positions.push(commonValues(lines[i], lines.lastElement())[0]);
        position = randomElement(positions);
        break;
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
        aiOnlyLines = board.singleMarkLines(this.mark, 1),
        emptyLines = this.game.winningCombinations.filter(function(combination){
          return board.availableOnAGivenLine(combination).length === board.size;
        });
    console.log('in basicStrategy')

    if (aiOnlyLines.length > 0){
      // find available position:
      line = randomElement(aiOnlyLines);
    } else if (emptyLines.length > 0){
      // find empty line:
      line = randomElement(emptyLines);
    } 

    if (line !== undefined){
      available = board.availableOnAGivenLine(line);
      position = randomElement(available);
    } else {
      // find available pick a random
      position = randomElement(board.available());
    }
    return position;
  }

  function cornerOrCenter(board){
    var center = board.center(),
        corner = randomElement(board.corners(board.possiblePositions));
    return randomElement([corner, center]);
  }
}
}());
