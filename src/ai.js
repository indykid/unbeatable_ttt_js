'use strict';

var JSTicTacToe = JSTicTacToe || {};

define([], function() {

  JSTicTacToe.AIPlayer = function(board, firstPlayer){
    var Helper = JSTicTacToe.Helper;
    this.mark = (firstPlayer == 'ai') ? 'x' : 'o';
    this.humansMark = (this.mark == 'x') ? 'o' : 'x';
    this.board = board;
    this.strategy;
    
    this.winningCell = function(){
      var board = this.board,
          winLines = board.singleMarkLines(this.mark, (board.size - 1));
      if (winLines.length > 0){
        return board.availableOnAGivenLine(winLines[0])[0];
      }
    };

    this.threatCell = function(){
      var board = this.board,
          threatLines = board.singleMarkLines(this.humansMark, (board.size - 1));
      if (threatLines.length > 0){
        return board.availableOnAGivenLine(threatLines[0])[0];
      }
    };

    this.play = function(){
      var board = this.board,
          cell = this._findCell();
      board.addMove(cell, this.mark);
      board.game.checkAndUpdateGameState();//???
      board.updateBoardView();//UI
      board.updateUI();//UI
    };// unsure how to test this or if necessary


    this._findCell = function(){
      var cell;
      // assign strategy if not set
      if (this.strategyPlay === undefined){
        this._findStrategy();
      }
      // var cells = [this._commonSenseStrategy(), this.strategyPlay(), this.basicStrategy()];
      // cell = cells.find(function(p){
      //   return p !== undefined;
      // });

      // this is super hacky but shortcircuits the unnecessary calls (vs commented function above)
      (cell = this._commonSenseStrategy()) !== undefined || (cell = this.strategyPlay()) !== undefined || (cell = this.basicStrategy()); 

      return cell;
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
          cell;
      switch (movesSoFar) {
        case 0:
          cell = board.cornerOrCenter();
          break;
        case 2:
          cell = this._workoutSecondMoveAsFirstPlayer();
          break;
        case 4:
          cell = board.findFork(this.mark);
          break;
      }
      return cell;
    };

    this._workoutSecondMoveAsFirstPlayer = function(){
      var cell,
          board = this.board,
      // if both moves on the board are a corner and center
      // play the empty corner on that line
          humansCellType = board.cellType(board.humanLast),
          aiCellType = board.cellType(board.aiLast),
          playedTypes = [humansCellType, aiCellType],
          onlyCornerAndCenterSoFar = (playedTypes.hasElement('center') && playedTypes.hasElement('corner'));

      if ( onlyCornerAndCenterSoFar ) {
        var diagonal = board.winningCombos.find(function(combination){
          return board.availableOnAGivenLine(combination).length === 1;
        });
        cell = board.availableOnAGivenLine(diagonal)[0];
      } else {
        // otherwise: human must have played an edge cell
        // if played center first :
          // play any corner
        // if corner was first 
          // play corner on the other side from human's last move
        switch ( aiCellType ) {
          case 'center':
            var corners = board.availableOfType('corner');
            cell = Helper.randomElement(corners);
            break;
          case 'corner':
            // play corner which is not opposite to the first move and is not adjacent to humansLastMove
            var adjacentToLastMove = board.adjacentCells(board.humanLast),
                oppositeToFirstMove = board.oppositeCell(board.aiLast),
                suitableCorners = board.availableOfType('corner').filter(function(corner){
              return corner !== oppositeToFirstMove && !adjacentToLastMove.hasElement(corner);
            });
            cell = Helper.randomElement(suitableCorners);
            break;
        }
      }
      return cell;
    };// REFACTORRRRRRRR!

    this._secondPlayerStrategy = function(){
      var cell,
          board = this.board,
          movesSoFar = board.movesSoFar(),
          firstCellType = board.cellType(board.firstCell);

      if ( firstCellType === 'center' && movesSoFar <= 3 || board.singleFullLine() && firstCellType === 'edge') {
        cell = board.randomOpenCorner();
      } else {

        switch (movesSoFar) {
          case 1:
            cell = board.center();
            break;
          case 3:
            cell = this._workoutSecondMoveAsSecondPlayer(firstCellType);
            break;
        }
      }
      return cell;
    };

    this._workoutSecondMoveAsSecondPlayer = function(firstCellType){
      var cell,
          board = this.board;

      switch ( firstCellType ) {
        case 'edge':
          var adjacentToFirstMove = board.adjacentCells(board.firstCell),
            humansLines = board.singleMarkLines(this.humansMark, 1),
            lines = humansLines.filter(function(line){
              return Helper.commonValues(line, adjacentToFirstMove).length > 0;
            });
            cell = board.findIntersections(lines)[0];
          break;

        case 'corner':
          if ( board.singleFullLine() ) {
            var edges = board.availableOfType('edge');
            cell = Helper.randomElement(edges);
          } else {
            var oppositeToFirstMove = board.oppositeCell(board.firstcell);
            var adjacentToLastMove = board.adjacentCells(board.humanLastMove.cell);
            cell = adjacentToLastMove.find(function(move){
              return board.cellType(move) === 'corner' && move !== oppositeToFirstMove;
            });
          }
          break;
      }
      return cell;
    };

    this._commonSenseStrategy = function(){
      var cell;
      (cell = this.winningCell()) !== undefined || (cell = this.threatCell()) !== undefined;
      return cell;
    };

    this.basicStrategy = function(){
      // fallback if there are no strategic moves to be made
      // find line where i already have 1 move
      // if none then find an empty line and play there
      // if none of the above, just take any available cell
      var cell,
          line,
          available,
          board = this.board,
          aiOnlyLines = board.singleMarkLines(this.mark, 1),
          emptyLines = board.winningCombos.filter(function(combination){
            return board.availableOnAGivenLine(combination).length === board.size;
          });
      if (aiOnlyLines.length > 0){
        line = Helper.randomElement(aiOnlyLines);
      } else if (emptyLines.length > 0){
        line = Helper.randomElement(emptyLines);
      }

      if (line !== undefined){
        // find available cell on the line:
        available = board.availableOnAGivenLine(line);
        cell = Helper.randomElement(available);
      } else {
        // find available and pick a random
        cell = Helper.randomElement(board.available());
      }
      return cell;
    };
  };

  return JSTicTacToe.AIPlayer;
});