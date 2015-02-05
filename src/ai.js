'use strict';

var JSTicTacToe = JSTicTacToe || {};

define([], function() {

  JSTicTacToe.AIPlayer = function(board, firstPlayer){
    var Helper = JSTicTacToe.Helper,
        board  = board;

    this.mark = (firstPlayer == 'ai') ? 'x' : 'o';
    this.humansMark = (this.mark == 'x') ? 'o' : 'x';
    this.board = board;
    this.strategy;

    this.play = function(){
      var cell = this._findCell();
      board.addMove(cell, this.mark);
      board.game.checkAndUpdateGameState();//???
      board.updateBoardView();//UI
      board.updateUI();//UI
    };// unsure how to test this or if necessary
    
    this.winningCell = function(){
      var winLines = board.singleMarkLines(this.mark, (board.size - 1));

      if (winLines.length > 0){
        return board.availableOnAGivenLine(winLines[0])[0];
      }
    };

    this.threatCell = function(){
      var threatLines = board.singleMarkLines(this.humansMark, (board.size - 1));
      if (threatLines.length > 0){
        return board.availableOnAGivenLine(threatLines[0])[0];
      }
    };

    this._findCell = function(){
      if ( this.strategyPlay === undefined ) this._findStrategy();
      return this._bestCell();      
    };

    this._bestCell = function(){
      var cell;
      // this is quite hacky but shortcircuits the unnecessary calls to all methods
      (cell = this._commonSenseStrategy()) !== undefined || (cell = this.strategyPlay()) !== undefined || (cell = this.basicStrategy());
      return cell;
    };
    // alternative to above:
    // var cells = [this._commonSenseStrategy(), this.strategyPlay(), this.basicStrategy()];
    // cell = cells.find(function(p){
    //   return p !== undefined;
    // });

    this._findStrategy = function(){
      switch (this.mark) {
        case 'x':
          this.strategy = 'firstPlayer';
          this.strategyPlay = this._strategyAsFirst;
          break;
        case 'o':
          this.strategy = 'secondPlayer';
          this.strategyPlay = this._strategyAsSecond;
          break;
      }
    };

    this._strategyAsFirst = function(){      
      switch (board.movesSoFar()) {
        case 0:
          return board.cornerOrCenter();
        case 2:
          return this._secondMoveAsFirstPlayer();
        case 4:
          return board.findFork(this.mark);
      }
    };

    this._strategyAsSecond = function(){
      if ( firstCellCenterOrColumnFull() ) {
        return board.randomOpenCorner();
      } else {
        return this._dependsOnMovesSoFar();
      }
    };

    this._secondMoveAsFirstPlayer = function(){
      if ( onlyCornerAndCenterSoFar() ) {
        return fillInDiagonal();
      } else {
        return this._dependsOnAiFirstMove();
      }
    };

    this._dependsOnAiFirstMove = function(){
      switch ( board.firstCellType() ) {
        case 'center':
          return this.board.randomOpenCorner();
        case 'corner':
          return cornerOppositeToHumansMove();
      }
    };// to end up here: human must have played an edge cell

    this._dependsOnMovesSoFar = function(){
      switch ( board.movesSoFar() ) {
        case 1:
          return board.center();
        case 3:
          // return this._secondMoveAsSecondPlayer();
          return this._dependsOnHumansFirstMove();
      }
    };

    this._dependsOnHumansFirstMove = function(){
      switch ( board.firstCellType() ) {
        case 'edge':
          return this._cornerBetweenHumansMoves();

        case 'corner':
          return this._dependsOnHumansLastMove();
      }
    };

    this._dependsOnHumansLastMove = function(){
      if ( board.singleFullLine() ) {
        var edges = board.availableOfType('edge');
        return Helper.randomElement(edges);
      } else {
        return this._cornerOnTheSameSideAsHumansMove();
      }
    };

    this._cornerOnTheSameSideAsHumansMove = function(){
      var opposite  = board.oppositeCell(board.firstCell),
          adjacents = board.adjacentCells(board.humanLast);
      return adjacents.find(function(cell){
        return board.cellType(cell) === 'corner' && cell !== opposite;
      });
    };

    this._cornerBetweenHumansMoves = function(){
      var adjacents   = board.adjacentCells(board.firstCell),
          humansLines = board.singleMarkLines(this.humansMark, 1),
          lines       = humansLines.filter(function(line){
            return Helper.commonValues(line, adjacents).length > 0;
          });
      return board.findIntersections(lines)[0];
    };

    this._commonSenseStrategy = function(){
      var cell;
      (cell = this.winningCell()) !== undefined || (cell = this.threatCell()) !== undefined;
      return cell;
    };// shortcircuiting again

    this.basicStrategy = function(){
      // fallback if there are no strategic moves to be made
      // find line where i already have 1 move
      // if none then find an empty line and play there
      // if none of the above, just take any available cell
      var cell,
          line,
          available,
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

    function onlyCornerAndCenterSoFar(){
      var humansCellType  = board.cellType(board.humanLast),
          aiCellType      = board.cellType(board.aiLast),
          playedTypes     = [humansCellType, aiCellType];
      return playedTypes.includes('center') && playedTypes.includes('corner');
    }

    function fillInDiagonal(){
      var diagonal = board.winningCombos.find(function(combination){
        return board.availableOnAGivenLine(combination).length === 1;
      });
      return board.availableOnAGivenLine(diagonal)[0];
    }

    function cornerOppositeToHumansMove(){
      var adjacents   = board.adjacentCells(board.humanLast),
          opposite    = board.oppositeCell(board.aiLast),
          aptCorners  = board.availableOfType('corner').filter(function(corner){
            return corner !== opposite && !adjacents.includes(corner);
          });
      return Helper.randomElement(aptCorners);
    }

    function firstCellCenterOrColumnFull(){
      var firstCellType   = board.cellType(board.firstCell),
          movesSoFar      = board.movesSoFar();
      return firstCellType === 'center' && movesSoFar <= 3 || board.singleFullLine() && firstCellType === 'edge';
    }
  };

  return JSTicTacToe.AIPlayer;
});