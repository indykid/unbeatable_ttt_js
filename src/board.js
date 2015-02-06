'use strict';

var JSTicTacToe = JSTicTacToe || {};

define([], function() {
  JSTicTacToe.Board = function(){
    var Helper = JSTicTacToe.helper;
    // this.game = game;
    this.moves = [];
    this.size = 3;
    this.cellsAmount = Math.pow(this.size, 2);
    this.possibleCells = setPossibleCells(this.cellsAmount);
    this.winningCombos = setWinningCombos(this);
    this.firstCell;
    this.humansLastCell;
    this.aiLastCell;
    this.ai; // gets assigned later

    this.addMove = function(cell, mark){
      var move = {};
      move['cell'] = cell;
      move['mark'] = mark;

      if (this.isPristine()) this.firstCell = cell;

      this.moves.push(move);
      this._updateLastMoves(move);
    };

    this._updateLastMoves = function(move){
      if ( this.ai.mark === move.mark ){
        this.aiLastCell = move.cell;
      } else {
        this.humansLastCell = move.cell;
      }
    };

    this.getMark = function(cell){
      var playerMove = this.moves.find(function(move){
        return move.cell === cell;
      });
      if (playerMove){
        return playerMove.mark;
      }
    };

    this.available = function(){
      var available = this.possibleCells.filter(function(cell){
        return !this.takenCells().includes(cell);
      }.bind(this));
      return available;
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

    this.availableOfType = function(cellType){
      var available = this.available(),
          availableOfType = available.filter(function(cell){
            return this.cellType(cell) === cellType;
          }.bind(this));
      return availableOfType;
    };

    this.isCellEmpty = function(cell) {
      return this.available().includes(cell);
    };

    this.availableOnALine = function(line){
      var available = line.filter(function(cell){
        return this.isCellEmpty(cell);
      }.bind(this));
      return available;
    };

    this.singlePlayerLine = function(line, howMany, mark){
      var takenOnALine = line.filter(function(cell){
        return !this.isCellEmpty(cell);
      }.bind(this));
      if (takenOnALine.length === howMany){
        var marks = takenOnALine.map(function(cell){
          return this.getMark(cell);
        }.bind(this));
        return marks.allDefinedValuesSame() && marks[0] === mark;
      }
      return false;
    };

    this.singleFullLine = function(){
      var fullLines = this.winningCombos.filter(function(combination){
        return this.availableOnALine(combination).length === 0;
      }.bind(this));
      return fullLines.length === 1 && this.takenCells().length === this.size;
    };

    this.singleMarkLines = function(mark, howMany){
      var lines = this.winningCombos.filter(function(combination){
        return this.singlePlayerLine(combination, howMany, mark);
      }.bind(this));
      return lines;
    };

    this.emptyLines = function(){
      return  this.winningCombos.filter(function(combination){
                return this.availableOnALine(combination).length === this.size;
              }.bind(this));
    };

    this.center = function(){
      return  this.possibleCells.find(function(cell){
                return this.cellType(cell) === 'center';
              }.bind(this));
    }

    this.oppositeCell = function(cell){
      var reverseOrder = this.possibleCells.slice().reverse();
      return reverseOrder[cell];
    };

    this.adjacentCells = function(cell){
      var cells;
      switch ( this.cellType(cell)){
        case 'corner':
          if ( cell < this.center()){
            cells = [this.possibleCells[0] + 1, cell + this.size];
          } else {
            cells = [this.possibleCells.lastElement() - 1, cell - this.size];
          }
          break;
        case 'edge':
          if ((cell - 1) === this.possibleCells[0] || (cell + 1) === this.possibleCells.lastElement()){
            cells = [cell + 1, cell - 1];
          } else {
            cells = [cell - this.size, cell + this.size]
          }
          break;
      }
      return cells;
    };

    this.takenCells = function(){
      var taken = this.moves.map(function(move){
        return move.cell;
      });
      return taken;
    };

    this.lineWithOneFreeCell = function(){
      return  this.winningCombos.find(function(combo){
                return this.availableOnALine(combo).length === 1;
              }.bind(this));
    };

    this.seed = function(cells){
      cells.forEach(function(cell, i){
        var mark = i % 2 === 0 ? 'x' : 'o';
        this.addMove(cell, mark);
      }.bind(this));
    };

    this.findIntersections = function(lines){
      var intersections = [];
      for ( var i = 0; i < lines.length - 1; i++ ){
        var intersection = Helper.commonValues(lines[i], lines[i+1])[0];
        if (intersection !== undefined){
          intersections.push(intersection);
        }
      }
      if (lines.length === this.size){
        intersections.push(Helper.commonValues(lines[0], lines.lastElement())[0]);
      };
      return intersections;
    }; // TODO: refactor?

    this.findFork = function(mark){
      var lines = this.singleMarkLines(mark, 1);
      if (lines.length > 0){
        var intersections   = this.findIntersections(lines),
            potentialCells  = intersections.filter(function(cell){
              return this.isCellEmpty(cell);
            }.bind(this));
        return Helper.anyFrom(potentialCells);
      }
    }; // find an empty intersection of singleMarkedLines for given mark

    this.isPristine = function(){
      return this.moves.length === 0;
    };

    this.movesSoFar = function(){
      return this.moves.length;
    };

    this.cornerOrCenter = function(){
      var center = this.center(),
          corner = Helper.anyFrom(this.availableOfType('corner'));
      return Helper.anyFrom([corner, center]);
    };

    this.anyFreeCorner = function(){
      var corners = this.availableOfType('corner');
      return Helper.anyFrom(corners);
    };

    this.firstCellType = function(){
      return this.cellType(this.firstCell);
    };

/***********************
  one-off use functions
*************************/
    this.findNonOppositeCorner = function(cells){
      var opposite = this.oppositeCell(this.firstCell),
          cell     = cells.find(function(cell){
            return this.cellType(cell) === 'corner' && cell !== opposite;
          }.bind(this));
      return cell;
    };

    this.onlyCornerAndCenterSoFar = function(){
      var humansCellType  = this.cellType(this.humansLastCell),
          aiCellType      = this.cellType(this.aiLastCell),
          playedTypes     = [humansCellType, aiCellType];
      return playedTypes.includes('center') && playedTypes.includes('corner');
    };

    this.fillInLine = function(){
      var line = this.lineWithOneFreeCell();
      return this.availableOnALine(line)[0];
    };

    this.cornerOppositeToHumansMove = function(){
      var adjacents   = this.adjacentCells(this.humansLastCell),
          opposite    = this.oppositeCell(this.aiLastCell),
          aptCorners  = this.availableOfType('corner').filter(function(corner){
            return corner !== opposite && !adjacents.includes(corner);
          });
      return Helper.anyFrom(aptCorners);
    };

    this.firstCellCenterOrColumnFull = function(){
      return this.singleFullColumn() || this.firstCellCenterFirstOrSecondMove();
    };

    this.firstCellCenterFirstOrSecondMove = function(){
      return this.firstCellType() === 'center' && this.movesSoFar() <= 3;
    };

    this.singleFullColumn = function(){
      return this.singleFullLine() && this.firstCellType() === 'edge';
    };

    this.cornerBetweenHumansMoves = function(humansMark){
      var adjacents   = this.adjacentCells(this.firstCell),
          humansLines = this.singleMarkLines(humansMark, 1),
          lines       = humansLines.filter(function(line){
            return Helper.commonValues(line, adjacents).length > 0;
          });
      return this.findIntersections(lines)[0];
    };

    this.cornerOnTheSameSideAsHumansMove = function(){
      var adjacents = this.adjacentCells(this.humansLastCell);
      return this.findNonOppositeCorner(adjacents);
    };

    /****************
    private functions
    *****************/

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
      var startIndex = 0,
          endIndex = board.cellsAmount - 1,
          increment = board.size + 1,
          firstDiagonal = [];

      firstDiagonal = setLine(startIndex, endIndex, increment);
      addWinningCombination(firstDiagonal, combos);
    }

    function setSecondDiagonal(board, combos){
      var startIndex = board.size - 1,
          endIndex = board.cellsAmount - board.size,
          increment = board.size - 1,
          secondDiagonal = setLine(startIndex, endIndex, increment);
      addWinningCombination(secondDiagonal, combos);
    }

    function setRow(rowNumber, board, combos){
      var startIndex = rowNumber * board.size,
          endIndex = startIndex + (board.size - 1),
          increment = 1,
          row = setLine(startIndex, endIndex, increment);
      addWinningCombination(row, combos);
    }

    function setColumn(columnNumber, board, combos){
      var startIndex = columnNumber,
          endIndex = startIndex + (board.size * (board.size - 1)),
          increment = board.size,
          column = setLine(startIndex, endIndex, increment);
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