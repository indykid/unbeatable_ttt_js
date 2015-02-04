'use strict';

var JSTicTacToe = JSTicTacToe || {};

define([], function() {

  JSTicTacToe.AIPlayer = function(board, firstPlayer){

    this.mark = (firstPlayer == 'ai') ? 'x' : 'o';
    this.humansMark = (this.mark == 'x') ? 'o' : 'x';
    this.board = board;
    this.strategy;
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
          position = this._findPosition();
      // console.log(position)
      board.addMove(position, this.mark);
      board.game.checkAndUpdateGameState();//???
      board.updateBoardView();//UI
      board.updateUI();//UI
    };// unsure how to test this or if necessary


    // this is super hacky but shortcircuits the unnecessary calls (vs commented function above)

    // **********************
    // this.findPosition = function(){
    //   var position;
    //   (position = this.winningPosition()) !== undefined || (position = this.threatPosition()) !== undefined || (position = this.strategicPosition()) !== undefined || (position = this.basicStrategy()); 
    //   return position;
    // };

    this._findPosition = function(){
      var position;
      // console.log(this.board.moves.length)
      // if first move findStrategy
      if (this.strategyPlay === undefined){
        console.log('no strategy')
        this._findStrategy();
      }
      // console.log(this.strategyPlay())
      // console.log(this._commonSenseStrategy())
      // console.log(this.basicStrategy())
      // (position = this._commonSenseStrategy()) !== undefined || (position = this.strategyPlay()) !== undefined || (position = this.basicStrategy());

      var positions = [this._commonSenseStrategy(), this.strategyPlay(), this.basicStrategy()];
      position = positions.find(function(p){
        return p !== undefined;
      });
      return position;
      
    };//not sure how to test such thing

    this._findStrategy = function(){
      switch (this.mark) {
        case 'x':
          this.strategy = 'firstPlayer';
          this.strategyPlay = this._firstPlayerStrategy;
          break;
        case 'o':
          this.strategy = 'secondPlayer';
          this.strategyPlay = this._secondPlayerStrategy;
          break;
      }
    };

    this._firstPlayerStrategy = function(){
      var board = this.board,
          movesSoFar = board.movesSoFar(),
          position;
      switch (movesSoFar) {
        case 0:
          position = board.cornerOrCenter();
          break;
        case 2:
          position = this._workoutSecondMoveAsFirstPlayer();
          break;
        case 4:
          position = board.findFork(this.mark);
          break;
      }
      return position;
    };

    this._workoutSecondMoveAsFirstPlayer = function(){
      var position,
          board = this.board,
      // if both moves on the board are a corner and center
      // play the empty corner on that line
          humansLastPosition = board.lastPositionFor(this.humansMark),
          aiLastPosition = board.lastPositionFor(this.mark),
          humansPositionType = board.positionType(humansLastPosition),
          aiPositionType = board.positionType(aiLastPosition),
          playedTypes = [humansPositionType, aiPositionType],
          onlyCornerAndCenterSoFar = (playedTypes.hasElement('center') && playedTypes.hasElement('corner'));

      if ( onlyCornerAndCenterSoFar ) {
        var diagonal = board.game.winningCombinations.find(function(combination){
          return board.availableOnAGivenLine(combination).length === 1;
        });
        position = board.availableOnAGivenLine(diagonal)[0];
      } else {
        // otherwise: human must have played an edge position
        // if played center first :
          // play any corner
        // if corner was first 
          // play corner on the other side from human's last move
        switch ( aiPositionType ) {
          case 'center':
            var corners = board.availableOfType('corner');
            position = Helper.randomElement(corners);
            break;
          case 'corner':
            // play corner which is not opposite to the first move and is not adjacent to humansLastMove
            var adjacentToLastMove = board.adjacentPositions(humansLastPosition),
                oppositeToFirstMove = board.oppositePosition(aiLastPosition),
                suitableCorners = board.availableOfType('corner').filter(function(corner){
              return corner !== oppositeToFirstMove && !adjacentToLastMove.hasElement(corner);
            });
            position = Helper.randomElement(suitableCorners);
            break;
        }
      }
      return position;
    };// REFACTORRRRRRRR!

    this._secondPlayerStrategy = function(){
      var position,
          board = this.board,
          movesSoFar = board.movesSoFar(),
          firstPositionType = board.positionType(board.firstPosition);

      if ( firstPositionType === 'center' && movesSoFar <= 3 || board.singleFullLine() && firstPositionType === 'edge') {
        position = board.randomOpenCorner();
      } else {

        switch (movesSoFar) {
          case 1:
            position = board.center();
            break;
          case 3:
            position = this._workoutSecondMoveAsSecondPlayer(firstPositionType);
            break;
        }
      }
      return position;
    };

    this._workoutSecondMoveAsSecondPlayer = function(firstPositionType){
      var position,
          board = this.board;

      switch ( firstPositionType ) {
        case 'edge':
          var adjacentToFirstMove = board.adjacentPositions(board.firstPosition),
            humansLines = board.singleMarkLines(this.humansMark, 1),
            lines = humansLines.filter(function(line){
              return Helper.commonValues(line, adjacentToFirstMove).length > 0;
            });
            position = board.findIntersections(lines)[0];
          break;

        case 'corner':
          if ( board.singleFullLine() ) {
            var edges = board.availableOfType('edge');
            position = Helper.randomElement(edges);
          } else {
            var oppositeToFirstMove = board.oppositePosition(board.firstPosition);
            var adjacentToLastMove = board.adjacentPositions(board.humanLastMove.position);
            position = adjacentToLastMove.find(function(move){
              return board.positionType(move) === 'corner' && move !== oppositeToFirstMove;
            });
          }
          break;
      }
      return position;
    };

    this._commonSenseStrategy = function(){
      var position;
      (position = this.winningPosition()) !== undefined || (position = this.threatPosition()) !== undefined;
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
  };

  return JSTicTacToe.AIPlayer;
});