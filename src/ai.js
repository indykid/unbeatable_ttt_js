'use strict';

var JSTicTacToe = JSTicTacToe || {};

define([], function() {

  JSTicTacToe.AIPlayer = function(board, firstPlayer){

    this.mark = (firstPlayer == 'ai') ? 'x' : 'o';
    this.opponentMark = (this.mark == 'x') ? 'o' : 'x';
    this.board = board;
    this.mainStrategy;
    
    this.winningPosition = function(){
      var board = this.board,
          winLines = board.singleMarkLines(this.mark, (board.size - 1));
      if (winLines.length > 0){
        return board.availableOnAGivenLine(winLines[0])[0];
      }
    };

    this.threatPosition = function(){
      var board = this.board,
          threatLines = board.singleMarkLines(this.opponentMark, (board.size - 1));
      if (threatLines.length > 0){
        return board.availableOnAGivenLine(threatLines[0])[0];
      }
    };

    this.play = function(){
      var board = this.board,
          position = this.findPosition();
      // console.log(position)
      this.game.addToBoard(position, this.mark);//board
      this.game.checkAndUpdateGameState();//???
      board.updateBoardView();//UI
      board.updateUI();//UI
    };

    // this.findPosition = function(){
    //   var positions = [this.winningPosition(), this.threatPosition(), this.strategicPosition(), this.basicStrategy()];
    //   var position = positions.find(function(position){
    //     return position !== undefined;
    //   });
    //   return position;
    // };

    // this is super hacky but shortcircuits the unnecessary calls (vs commented function above)
    this.findPosition = function(){
      var position;
      (position = this.winningPosition()) !== undefined || (position = this.threatPosition()) !== undefined || (position = this.strategicPosition()) !== undefined || (position = this.basicStrategy()); 
      return position;
    };

    this.strategicPosition = function(){
      var position,
          movesSoFar = this.board.moves.length;
      if (this.mainStrategy === undefined){
        this._pickAIStrategy();
      }
      if (movesSoFar === 0){
        position = cornerOrCenter(this.board);
      } else {
        // console.log(this.mainStrategy)

        switch (this.mainStrategy){
          case 'cornerAsFirst':
            position = this.cornerAsFirst(movesSoFar);
            break;
          case 'centerAsFirst':
            position = this.centerAsFirst(movesSoFar);
            break;
          case 'cornerAsSecond':
            position = this.cornerAsSecond(movesSoFar);
            break;
          case 'centerAsSecond':
            position = this.centerAsSecond(movesSoFar);
            break;
          case 'edgeAsSecond':
          // console.log('case: edgeAsSecond')
            position = this.edgeAsSecond(movesSoFar);
            break;
        }
      }
      // console.log('strategicPosition: ', position);
      return position;
    };

    this.cornerAsSecond = function(movesSoFar){
      var position,
          board = this.board,
          opponentsLastPosition = board.lastPositionFor(this.opponentMark);
      switch (movesSoFar){
        case 1:
          position = this.board.center();
          break;
        case 3:
          var fullLine = this.board.game.winningCombinations.find(function(combination){
            return board.availableOnAGivenLine(combination).length === 0;
          });
          
          if (fullLine !== undefined){
            // if there's a full diagonal play any edge
            var edges = board.available().filter(function(position){
              return board.positionType(position) === 'edge';
            });
            position = JSTicTacToe.Helper.randomElement(edges);
          } else {
            // opponent must have played opposite edge to its first move (x1), otherwise threat block would preempt this condition 
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
    };

    this.centerAsSecond = function(movesSoFar){
      var board = this.board,
          opponentsLastPosition = board.lastPositionFor(this.opponentMark),
          position;
      switch (movesSoFar){
        case 1:
          position = JSTicTacToe.Helper.randomElement(this.board.corners(board.available()));
          break;
        case 3:
        // human must have played opposite to its first move, otherwise this move would have been preempted by threatPosition:
          // if ( opponentsLastPosition === board.oppositePosition(board.lastPositionFor(this.mark)) ){
          position = JSTicTacToe.Helper.randomElement(this.board.corners(board.available()));
          // }
          break;
      }
      return position;
    };

    this.edgeAsSecond = function(movesSoFar){
      var position,
          board = this.board;       
      switch (movesSoFar){
        case 1:
          position = this.board.center();
          break;
        case 3:
          var opponentsLastPosition = board.lastPositionFor(this.opponentMark),
              opponentsFirstPosition = board.moves[0].position;
          // if human played opposite to their first move:
          if( opponentsLastPosition === board.oppositePosition(opponentsFirstPosition)){
            position = JSTicTacToe.Helper.randomElement(board.corners(board.available()));
          } else {
            // this will suffice only if they played non-opposite edge, or non-adjacent corner to x1
            // need to play an adjacent corner to x1 on the same side as their last move (x2)
            var adjacentToFirstMove = board.adjacentPositions(opponentsFirstPosition),
                opponentsLines = board.singleMarkLines(this.opponentMark, 1),
                lines = opponentsLines.filter(function(line){
                  return JSTicTacToe.Helper.commonValues(line, adjacentToFirstMove).length > 0;
                });
            position = JSTicTacToe.Helper.commonValues(lines[0], lines.lastElement())[0];
          }
          break;
      }
      return position;
    };

    this.cornerAsFirst = function(movesSoFar){
      var position,
          board = this.board;
      switch (movesSoFar){
        case 2:
          var opponentsLastPosition = board.lastPositionFor(this.opponentMark),
              lastPositionType = board.positionType(opponentsLastPosition),
              oppositeToFirstMove = board.oppositePosition(board.moves[0].position);
          
          if (lastPositionType === 'center'){
            position = oppositeToFirstMove;
          } else {
            // play corner which is not opposite to the first move and is not adjacent to opponentsLastMove
            var adjacentToLastMove = board.adjacentPositions(opponentsLastPosition);
            var corners = board.corners(board.available()).filter(function(corner){
              return corner !== oppositeToFirstMove && !adjacentToLastMove.hasElement(corner);
            });
            position = JSTicTacToe.Helper.randomElement(corners);
          }
          break;
        case 4:
          // would only end up here if human didn't block with center at any point
            // play on an empty intersection of ai-only lines (makes a fork)
          var lines = board.singleMarkLines(this.mark, 1),
              positions = [];
          for (var i = 0; i < lines.length - 1; i++){
            positions.push(JSTicTacToe.Helper.commonValues(lines[i], lines[i+1])[0]);
          }
          positions.push(JSTicTacToe.Helper.commonValues(lines[0], lines.lastElement())[0]);
          position = JSTicTacToe.Helper.randomElement(positions.filter(function(position){
            return board.isPositionEmpty(position);
          }));
          break;
      }
      return position;
    };

    this.centerAsFirst = function(movesSoFar){
      var board = this.board,
          position;
      switch (movesSoFar){
        case 2:
          var opponentsLastPosition = board.lastPositionFor(this.opponentMark);
          var lastPositionType = board.positionType(opponentsLastPosition);
          if (lastPositionType === 'edge'){
            position = JSTicTacToe.Helper.randomElement(board.corners(board.available()));
          } else {
            position = board.oppositePosition(opponentsLastPosition);
          }
          break;
        case 4:
          var positions = [],
              lines = board.singleMarkLines(this.mark, 1);
          console.log('lines',lines)
          for (var i = 0; i < lines.length - 1; i++){
            positions.push(JSTicTacToe.Helper.commonValues(lines[i], lines[i+1])[0]);
          }
          positions.push(JSTicTacToe.Helper.commonValues(lines[0], lines.lastElement())[0]);
          console.log('positions', positions)
          position = JSTicTacToe.Helper.randomElement(positions.filter(function(position){
            return board.isPositionEmpty(position);
          }));
          break;
      }
      return position;
    };

    this.basicStrategy = function(){
      // fallback if there are no strategic moves to be made
      // find line where i already have 1 move
      // if none then find an empty line and play there
      // if none of the above, just take any available position
      var position,
          line,
          available,
          board = this.board,
          aiOnlyLines = board.singleMarkLines(this.mark, 1),
          emptyLines = this.game.winningCombinations.filter(function(combination){
            return board.availableOnAGivenLine(combination).length === board.size;
          });
      if (aiOnlyLines.length > 0){
        line = JSTicTacToe.Helper.randomElement(aiOnlyLines);
      } else if (emptyLines.length > 0){
        line = JSTicTacToe.Helper.randomElement(emptyLines);
      }

      if (line !== undefined){
        // find available position on the line:
        available = board.availableOnAGivenLine(line);
        position = JSTicTacToe.Helper.randomElement(available);
      } else {
        // find available and pick a random
        position = JSTicTacToe.Helper.randomElement(board.available());
      }
      return position;
    };

    this._pickAIStrategy = function(){
      if ( this.mark === 'x'){
        pickAIStrategyAsFirst(this);
      } else {
        pickAIStrategyAsSecond(this);
      }
    };

    function pickAIStrategyAsFirst(ai){
      // console.log(ai)
      var board = ai.board,
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
      var board = ai.board,
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

    function cornerOrCenter(board){
      var center = board.center(),
          corner = JSTicTacToe.Helper.randomElement(board.corners(board.possiblePositions));
      return JSTicTacToe.Helper.randomElement([corner, center]);
    }
  };

  return JSTicTacToe.AIPlayer;
});