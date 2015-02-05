'use strict';

var JSTicTacToe = JSTicTacToe || {};

define([], function() {

  JSTicTacToe.AIPlayer = function(board, firstPlayer){
    var Helper = JSTicTacToe.Helper;
    this.mark = (firstPlayer == 'ai') ? 'x' : 'o';
    this.humansMark = (this.mark == 'x') ? 'o' : 'x';
    this.board = board;
    this.strategy;

    this.play = function(){
      var board = this.board,
          cell = this._findCell();
      board.addMove(cell, this.mark);
      board.game.checkAndUpdateGameState();//???
      board.updateBoardView();//UI
      board.updateUI();//UI
    };// unsure how to test this or if necessary
    
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
      var board = this.board,
          movesSoFar = board.movesSoFar();
      switch (movesSoFar) {
        case 0:
          return board.cornerOrCenter();
        case 2:
          return this._secondMoveAsFirstPlayer();
        case 4:
          return board.findFork(this.mark);
      }
    };

    this._secondMoveAsFirstPlayer = function(){
      var board = this.board;
      if ( onlyCornerAndCenterSoFar(board) ) { return fillInDiagonal(board) }
      else { return this._dependsOnAiFirstMove() }
    };

    this._dependsOnAiFirstMove = function(){
      var board         = this.board,
          firstCellType = board.cellType(board.firstCell);
      switch ( firstCellType ) {
        case 'center':
          return board.randomOpenCorner();
        case 'corner':
          return nonOppositeNonAdjacentCorner(board);
      }
    };// to end up here: human must have played an edge cell

    this._strategyAsSecond = function(){
      var board         = this.board,
          firstCellType = board.cellType(board.firstCell);

      if ( firstCellCenterOrColumnFull(board) ) { return board.randomOpenCorner(); } 
      else {
        switch ( board.movesSoFar() ) {
          case 1:
            return board.center();
          case 3:
            return this._secondMoveAsSecondPlayer(firstCellType);
        }
      }
    };

    this._secondMoveAsSecondPlayer = function(firstCellType){
      var board = this.board;

      switch ( firstCellType ) {
        case 'edge':
          var adjacentToFirstMove = board.adjacentCells(board.firstCell),
              humansLines = board.singleMarkLines(this.humansMark, 1),
              lines = humansLines.filter(function(line){
                return Helper.commonValues(line, adjacentToFirstMove).length > 0;
              });
          return board.findIntersections(lines)[0];

        case 'corner':
          if ( board.singleFullLine() ) {
            var edges = board.availableOfType('edge');
            return Helper.randomElement(edges);
          } else {
            var oppositeToFirstMove = board.oppositeCell(board.firstCell);
            var adjacentToLastMove = board.adjacentCells(board.humanLast);
            return adjacentToLastMove.find(function(cell){
              return board.cellType(cell) === 'corner' && cell !== oppositeToFirstMove;
            });
          }
      }
      // return cell;
    };

    // function (){

    // }

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

    function onlyCornerAndCenterSoFar(board){
      var humansCellType  = board.cellType(board.humanLast),
          aiCellType      = board.cellType(board.aiLast),
          playedTypes     = [humansCellType, aiCellType];
      return playedTypes.includes('center') && playedTypes.includes('corner');
    }

    function fillInDiagonal(board){
      var diagonal = board.winningCombos.find(function(combination){
        return board.availableOnAGivenLine(combination).length === 1;
      });
      return board.availableOnAGivenLine(diagonal)[0];
    }

    function nonOppositeNonAdjacentCorner(board){
      var adjacents   = board.adjacentCells(board.humanLast),
          opposite    = board.oppositeCell(board.aiLast),
          aptCorners  = board.availableOfType('corner').filter(function(corner){
            return corner !== opposite && !adjacents.includes(corner);
          });
      return Helper.randomElement(aptCorners);
    }

    function firstCellCenterOrColumnFull(board){
      var firstCellType   = board.cellType(board.firstCell),
          movesSoFar      = board.movesSoFar();
      return firstCellType === 'center' && movesSoFar <= 3 || board.singleFullLine() && firstCellType === 'edge';
    }

    // function 
  };

  return JSTicTacToe.AIPlayer;
});