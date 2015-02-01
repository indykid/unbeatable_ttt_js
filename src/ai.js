'use strict';

var JSTicTacToe = JSTicTacToe || {};

define([], function() {

  JSTicTacToe.AIPlayer = function(board, firstPlayer){

    this.mark = (firstPlayer == 'ai') ? 'x' : 'o';
    this.humansMark = (this.mark == 'x') ? 'o' : 'x';
    this.board = board;
    this.mainStrategy;
    var Helper = JSTicTacToe.Helper;
    
    this.winningPosition = function(){
      var board = this.board,
          winLines = board.singleMarkLines(this.mark, (board.size - 1));
      if (winLines.length > 0){
        return board.availableOnAGivenLine(winLines[0])[0];
      }
    };

    this.threatPosition = function(){
      var board = this.board,
          threatLines = board.singleMarkLines(this.humansMark, (board.size - 1));
      if (threatLines.length > 0){
        return board.availableOnAGivenLine(threatLines[0])[0];
      }
    };

    this.play = function(){
      var board = this.board,
          position = this.findPosition();
      // console.log(position)
      board.addMove(position, this.mark);
      board.game.checkAndUpdateGameState();//???
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

    // play function:

    //  do i have a strategy
    //  how may moves have been made
    //  first move: corner or center
    // 
    // 

    this.strategicPosition = function(){
      var position,
          movesSoFar = this.board.moves.length;
      
      if (this.mainStrategy === undefined){
        this._pickAIStrategy();
      }

      if (movesSoFar === 0){
        position = cornerOrCenter(this.board);
      } else {
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
            position = this.edgeAsSecond(movesSoFar);
            break;
        }
      }
      // console.log('strategicPosition: ', position);
      return position;
    };

  // playing first strategy
    // play center or corner


  // playing second strategy:

    // play center if free
    // otherwise play corner


    // full-line?

    this.cornerAsSecond = function(movesSoFar){
      var position,
          board = this.board,
          humansLastPosition = board.lastPositionFor(this.humansMark);
      switch (movesSoFar){
        case 1:
          position = this.board.center();
          break;
        case 3:
          if (board.singleFullLine()){
            // if there's a full diagonal play any edge
            var edges = board.available().filter(function(position){
              return board.positionType(position) === 'edge';
            });
            position = JSTicTacToe.Helper.randomElement(edges);
          } else {
            // opponent must have played opposite edge to its first move (x1), otherwise threat block would preempt this condition 
            // cannot play the corner opposite x1, and need to play corner cell on the same side as the opponent's last move
            // ie corner which is adjacent to humansLastPosition but itself is not the opposite to his first move.
            var oppositeToFirstMove = board.oppositePosition(board.moves[0].position);
            var adjacentToLastMove = board.adjacentPositions(humansLastPosition);
            position = adjacentToLastMove.find(function(move){
              return board.positionType(move) === 'corner' && move !== oppositeToFirstMove;
            });
          }
          break;
      }
      return position;
    };

    this.centerAsSecond = function(movesSoFar){
      var position;
      // first move is corner
      // next move after that will always be threatblock due to symmetry of the board, unless human played on the same diagonal as thier first move, in which case we still play a corner
      if (movesSoFar < 4){
        position = JSTicTacToe.Helper.randomElement(this.board.availableOfType('corner'));
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
          if ( board.singleFullLine() ){
            position = Helper.randomElement(board.availableOfType('corner'));
          } else {
            // this will suffice only if they played non-opposite edge, or non-adjacent corner to x1
            // need to play an adjacent corner to x1 on the same side as their last move (x2)
            var humansFirstPosition = board.moves[0].position,
                adjacentToFirstMove = board.adjacentPositions(humansFirstPosition),
                humansLines = board.singleMarkLines(this.humansMark, 1),
                lines = humansLines.filter(function(line){
                  return Helper.commonValues(line, adjacentToFirstMove).length > 0;
                });
                position = board.findIntersections(lines)[0]
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
          var humansLastPosition = board.lastPositionFor(this.humansMark),
              lastPositionType = board.positionType(humansLastPosition),
              oppositeToFirstMove = board.oppositePosition(board.moves[0].position);
          
          if (lastPositionType === 'center'){
            position = oppositeToFirstMove;
          } else {
            // play corner which is not opposite to the first move and is not adjacent to opponentsLastMove
            var adjacentToLastMove = board.adjacentPositions(humansLastPosition);
            var corners = board.availableOfType('corner').filter(function(corner){
              return corner !== oppositeToFirstMove && !adjacentToLastMove.hasElement(corner);
            });
            position = Helper.randomElement(corners);
          }
          break;
        case 4:
          // would only end up here if human didn't block with center at any point
            // play on an empty intersection of ai-only lines (makes a fork)
          var lines = board.singleMarkLines(this.mark, 1),
              intersections = board.findIntersections(lines),
              potentialPositions = intersections.filter(function(position){
                return board.isPositionEmpty(position);
              });
          // for (var i = 0; i < lines.length - 1; i++){
          //   positions.push(Helper.commonValues(lines[i], lines[i+1])[0]);
          // }
          // positions.push(Helper.commonValues(lines[0], lines.lastElement())[0]);
          position = Helper.randomElement(potentialPositions);
          break;
      }
      return position;
    };

    this.centerAsFirst = function(movesSoFar){
      var board = this.board,
          position;
      switch (movesSoFar){
        case 2:
          var humansLastPosition = board.lastPositionFor(this.humansMark);
          var lastPositionType = board.positionType(humansLastPosition);
          if (lastPositionType === 'edge'){
            position = Helper.randomElement(board.availableOfType('corner'));
          } else {
            position = board.oppositePosition(humansLastPosition);
          }
          break;
        case 4:
          var lines = board.singleMarkLines(this.mark, 1),
              intersections = board.findIntersections(lines),
              potentialPositions = intersections.filter(function(position){
                return board.isPositionEmpty(position);
              });
          // for (var i = 0; i < lines.length - 1; i++){
          //   positions.push(Helper.commonValues(lines[i], lines[i+1])[0]);
          // }
          // positions.push(Helper.commonValues(lines[0], lines.lastElement())[0]);
          // console.log('positions', positions)
          position = Helper.randomElement(potentialPositions);
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
          emptyLines = board.game.winningCombinations.filter(function(combination){
            return board.availableOnAGivenLine(combination).length === board.size;
          });
      if (aiOnlyLines.length > 0){
        line = Helper.randomElement(aiOnlyLines);
      } else if (emptyLines.length > 0){
        line = Helper.randomElement(emptyLines);
      }

      if (line !== undefined){
        // find available position on the line:
        available = board.availableOnAGivenLine(line);
        position = Helper.randomElement(available);
      } else {
        // find available and pick a random
        position = Helper.randomElement(board.available());
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
          humansLastPosition = board.lastPositionFor(ai.humansMark),
          lastPositionType = board.positionType(humansLastPosition);
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
          corner = Helper.randomElement(board.availableOfType('corner'));
      return Helper.randomElement([corner, center]);
    }
  };

  return JSTicTacToe.AIPlayer;
});