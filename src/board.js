'use strict';

var JSTicTacToe = JSTicTacToe || {};

define([], function() {
  JSTicTacToe.Board = function(size){
    var Helper      = JSTicTacToe.helper,
        DEFAULTSIZE = 3;
    this.moves = [];
    this.size = size !== undefined ? size : DEFAULTSIZE;
    this.cellsAmount = Math.pow(this.size, 2);
    this.possibleCells = setPossibleCells(this.cellsAmount);
    this.winningCombos = setWinningCombos(this);
    this.available = this.possibleCells.slice();
    this.taken = [];
    // these get assigned later:
    // this.firstCell;
    // this.humansLastCell;
    // this.aiLastCell;
    // this.ai;

    this.addMove = function(cell, mark){
      var move = {};
      move['cell'] = cell;
      move['mark'] = mark;
      this._updateItself(move);
    };

    this.getMark = function(cell){
      var playerMove = this.moves.find(function(move){
        return move.cell === cell;
      });
      if (playerMove){
        return playerMove.mark;
      }
    };

    this.cellType = function(cell){
      var remainder = cell % 2;
      if (cell === 4){
        return "center";
      } else if (remainder === 0){
        return "corner";
      } else {
        return "edge";
      }
    };

    this.isCellEmpty = function(cell) {
      return this.available.includes(cell);
    };

    this.availableAmong = function(cells){
      return  cells.filter(function(cell){
                return this.isCellEmpty(cell);
              }.bind(this));
    };

    this.availableOfType = function(cellType){
      return  this.available.filter(function(cell){
                return this.cellType(cell) === cellType;
              }.bind(this));
    };

    this.singlePlayerCells = function(cells, howMany, mark){
      var takenOnALine = this._takenAmong(cells);
      if (takenOnALine.length === howMany){
        var marks = this._getMarksFor(takenOnALine);
        return marks[0] === mark && marks.allDefinedValuesSame();
      }
      return false;
    };

    this.singleFullLine = function(){
      var fullLines = this.winningCombos.filter(function(combination){
        return this.availableAmong(combination).length === 0;
      }.bind(this));
      return fullLines.length === 1 && this.taken.length === this.size;
    };

    this.singleMarkLines = function(mark, howMany){
      return  this.winningCombos.filter(function(combination){
                return this.singlePlayerCells(combination, howMany, mark);
              }.bind(this));
    };

    this.center = function(){
      return  this.possibleCells.find(function(cell){
                return this.cellType(cell) === 'center';
              }.bind(this));
    };

    this.oppositeCell = function(cell){
      if (this.cellType(cell) !== 'center'){
        return this.possibleCells.slice().reverse()[cell];
      }
    };

    this.adjacentCells = function(cell){
      switch ( this.cellType(cell)){
        case 'corner':
          return this._adjacentForCorner(cell);
        case 'edge':
          return this._adjacentForEdge(cell);
      }
    };

    this.findIntersections = function(lines){
      var intersections = [];
      for ( var i = 0; i < lines.length - 1; i++ ){
        var intersection = Helper.common(lines[i], lines[i+1])[0];
        if (intersection !== undefined){
          intersections.push(intersection);
        }
      }
      if (lines.length === this.size){
        intersections.push(Helper.common(lines[0], lines.last())[0]);
      };
      return intersections;
    };

    this.findFork = function(mark){
      var lines = this.singleMarkLines(mark, 1);
      if (lines.length > 0){
        var intersections   = this.findIntersections(lines),
            potentialCells  = intersections.filter(function(cell){
              return this.isCellEmpty(cell);
            }.bind(this));
        return Helper.anyFrom(potentialCells);
      }
    };

    this.anyFreeCorner = function(){
      var corners = this.availableOfType('corner');
      return Helper.anyFrom(corners);
    };

    this.seed = function(cells){
      cells.forEach(function(cell, i){
        var mark = i % 2 === 0 ? 'x' : 'o';
        this.addMove(cell, mark);
      }.bind(this));
    };

    this.movesSoFar = function(){
      return this.moves.length;
    };//*

    this.firstCellType = function(){
      return this.cellType(this.firstCell);
    };//*

    this._isPristine = function(){
      return this.moves.length === 0;
    };

    this._updateItself = function(move){
      this._checkToSetFirstCell(move);
      this._updateMoves(move);
      this._updateLastMoves(move);
      this._updateAvailable(move);
      this._updateTaken(move);
    };

    this.winningLine = function(){
      var aiOnlyLine    = this.singleMarkLines(this.ai.mark, this.size)[0],
          humanOnlyLine = this.singleMarkLines(this.ai.humansMark, this.size)[0];
      if (aiOnlyLine) return aiOnlyLine;
      if (humanOnlyLine) return humanOnlyLine;
    };//*

    this.winnerMark = function(){
      var winningLine = this.winningLine();
      if (winningLine !== undefined){
        return this.getMark(winningLine[0]);
      }
    };

    /***********************************************
    functions with very specific context, used in ai
    ************************************************/

    this.fillInLine = function(){
      var line = this._lineWithOneFreeCell();
      return this.availableAmong(line)[0];
    };

    this.cornerOrCenter = function(){
      var center = this.center(),
          corner = Helper.anyFrom(this.availableOfType('corner'));
      return Helper.anyFrom([corner, center]);
    };//*

    this.emptyLines = function(){
      return  this.winningCombos.filter(function(combo){
                return this.availableAmong(combo).length === this.size;
              }.bind(this));
    };//*

    this.findNonOppositeCorner = function(cells){
      var opposite = this.oppositeCell(this.firstCell),
          cell     = cells.find(function(cell){
            return this.cellType(cell) === 'corner' && cell !== opposite;
          }.bind(this));
      return cell;
    };//*

    this.onlyCornerAndCenterSoFar = function(){
      var humansCellType  = this.cellType(this.humansLastCell),
          aiCellType      = this.cellType(this.aiLastCell),
          playedTypes     = [humansCellType, aiCellType];
      return playedTypes.includes('center') && playedTypes.includes('corner');
    };//*

    this.cornerOppositeToHumansMove = function(){
      var adjacents   = this.adjacentCells(this.humansLastCell),
          opposite    = this.oppositeCell(this.aiLastCell),
          aptCorners  = this.availableOfType('corner').filter(function(corner){
            return corner !== opposite && !adjacents.includes(corner);
          });
      return Helper.anyFrom(aptCorners);
    };//*

    this.firstCellCenterOrColumnFull = function(){
      return this.singleFullColumn() || this.firstCellCenterFirstOrSecondMove();
    };//*

    this.firstCellCenterFirstOrSecondMove = function(){
      return this.firstCellType() === 'center' && this.movesSoFar() <= 3;
    };//*

    this.singleFullColumn = function(){
      return this.singleFullLine() && this.firstCellType() === 'edge';
    };//*

    this.cornerBetweenHumansMoves = function(humansMark){
      var adjacents   = this.adjacentCells(this.firstCell),
          humansLines = this.singleMarkLines(humansMark, 1),
          lines       = humansLines.filter(function(line){
                          return Helper.common(line, adjacents).length > 0;
                        });
      return this.findIntersections(lines)[0];
    };//*

    this.cornerOnTheSameSideAsHumansMove = function(){
      var adjacents = this.adjacentCells(this.humansLastCell);
      return this.findNonOppositeCorner(adjacents);
    };//*

    /******************************************************
    untested, only used in methods which are tested though
    *******************************************************/

    this._takenAmong = function(cells){
      return  cells.filter(function(cell){
                return !this.isCellEmpty(cell);
              }.bind(this));
    };

    this._getMarksFor = function(cells){
      return  cells.map(function(cell){
                return this.getMark(cell);
              }.bind(this));
    };

    this._adjacentForCorner = function(cell){
      if ( cell < this.center()){
        return [this.possibleCells[0] + 1, cell + this.size];
      } else {
        return [this.possibleCells.last() - 1, cell - this.size];
      }
    };

    this._adjacentForEdge = function(cell){
      if ((cell - 1) === this.possibleCells[0] || (cell + 1) === this.possibleCells.last()){
        return [cell + 1, cell - 1];
      } else {
        return [cell - this.size, cell + this.size];
      }
    };

    this._lineWithOneFreeCell = function(){
      return  this.winningCombos.find(function(combo){
                return this.availableAmong(combo).length === 1;
              }.bind(this));
    };

    this._updateLastMoves = function(move){
      if ( this.ai.mark === move.mark ){
        this.aiLastCell = move.cell;
      } else {
        this.humansLastCell = move.cell;
      }
    };

    this._checkToSetFirstCell = function(move){
      if ( this._isPristine() ) this.firstCell = move.cell;
    };

    this._updateMoves = function(move){
      this.moves.push(move);
    };

    this._updateAvailable = function(move){
      var index = this.available.indexOf(move.cell);
      this.available.splice(index, 1);
    };

    this._updateTaken = function(move){
      this.taken.push(move.cell);
    };

    /****************************************************
    private functions needed for some initial board setup
    *****************************************************/

    function setPossibleCells(amount){
      var cells = [];
      for (var i = 0; i < amount; i++) {
        cells.push(i);
      }
      return cells;
    }

    function setWinningCombos(board){
      var winningCombos = [];
      setDiagonals(board, winningCombos);
      for (var i = 0; i < board.size; i++) {
        setColumn(i, board, winningCombos);
        setRow(i, board, winningCombos);
      }
      return winningCombos;
    }

    function setDiagonals(board, combos){
      setFirstDiagonal(board, combos);
      setSecondDiagonal(board, combos);
    }

    function setFirstDiagonal(board, combos){
      var startIndex    = 0,
          endIndex      = board.cellsAmount - 1,
          increment     = board.size + 1,
          firstDiagonal = setLine(startIndex, endIndex, increment);
      addWinningCombination(firstDiagonal, combos);
    }

    function setSecondDiagonal(board, combos){
      var startIndex     = board.size - 1,
          endIndex       = board.cellsAmount - board.size,
          increment      = board.size - 1,
          secondDiagonal = setLine(startIndex, endIndex, increment);
      addWinningCombination(secondDiagonal, combos);
    }

    function setRow(rowNumber, board, combos){
      var startIndex = rowNumber * board.size,
          endIndex   = startIndex + (board.size - 1),
          increment  = 1,
          row        = setLine(startIndex, endIndex, increment);
      addWinningCombination(row, combos);
    }

    function setColumn(columnNumber, board, combos){
      var startIndex = columnNumber,
          endIndex   = startIndex + (board.size * (board.size - 1)),
          increment  = board.size,
          column     = setLine(startIndex, endIndex, increment);
      addWinningCombination(column, combos);
    }

    function setLine(start, end, increment){
      var line = [];
      for (var i = start; i <= end; i+=increment) {
        line.push(i);
      }
      return line;
    }

    function addWinningCombination(combination, combos){
      combos.push(combination);
    }
  };

  return JSTicTacToe.Board;
});