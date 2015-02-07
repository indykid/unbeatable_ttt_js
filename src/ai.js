'use strict';

var JSTicTacToe = JSTicTacToe || {};

define([], function() {

  JSTicTacToe.AIPlayer = function(board, firstPlayer){
    var Helper = JSTicTacToe.helper;

    this.mark = (firstPlayer == 'ai') ? 'x' : 'o';
    this.humansMark = (this.mark == 'x') ? 'o' : 'x';

    this.move = function(){
      var cell = this._findCell();
      board.addMove(cell, this.mark);
    };

    this._winningCell = function(){
      var winLine = board.singleMarkLines(this.mark, (board.size - 1))[0];

      if (winLine){
        return board.availableAmong(winLine)[0];
      }
    };

    this._threatCell = function(){
      var threatLine = board.singleMarkLines(this.humansMark, (board.size - 1))[0];

      if (threatLine){
        return board.availableAmong(threatLine)[0];
      }
    };

    this._findCell = function(){
      if ( this.strategyPlay === undefined ) this._findStrategy();
      return bestCell();
    };

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

    this._commonSenseStrategy = function(){
      var cell;

      (cell = this._winningCell()) !== undefined || (cell = this._threatCell()) !== undefined;
      return cell;
    };// shortcircuit

    this._basicStrategy = function(){
      var aiLines   = board.singleMarkLines(this.mark, 1),
          line      = Helper.anyFrom(aiLines) || Helper.anyFrom(board.emptyLines());

      if (line){
        return Helper.anyFrom(board.availableAmong(line));
      } else {
        return Helper.anyFrom(board.available);
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
      if ( board.firstCellCenterOrColumnFull() ) {
        return board.anyFreeCorner();
      } else {
        return this._dependsOnMovesSoFar();
      }
    };

    this._secondMoveAsFirstPlayer = function(){
      if ( board.onlyCornerAndCenterSoFar() ) {
        return board.fillInLine();
      } else {
        return this._dependsOnAiFirstMove();
      }
    };

    this._dependsOnAiFirstMove = function(){
      switch ( board.firstCellType() ) {
        case 'center':
          return board.anyFreeCorner();
        case 'corner':
          return board.cornerOppositeToHumansMove();
      }
    };

    this._dependsOnMovesSoFar = function(){
      switch ( board.movesSoFar() ) {
        case 1:
          return board.center();
        case 3:
          return this._dependsOnHumansFirstMove();
      }
    };

    this._dependsOnHumansFirstMove = function(){
      switch ( board.firstCellType() ) {
        case 'edge':
          return board.cornerBetweenHumansMoves(this.humansMark);
        case 'corner':
          return this._dependsOnHumansLastMove();
      }
    };

    this._dependsOnHumansLastMove = function(){
      if ( board.singleFullLine() ) {
        return Helper.anyFrom(board.availableOfType('edge'));
      } else {
        return board.cornerOnTheSameSideAsHumansMove();
      }
    };

    var bestCell = function(){
      var cell;
      // shortcircuiting unnecessary calls to all methods, hacky...
      (cell = this._commonSenseStrategy()) !== undefined || (cell = this.strategyPlay()) !== undefined || (cell = this._basicStrategy());
      return cell;
    }.bind(this);
  };

  return JSTicTacToe.AIPlayer;
});