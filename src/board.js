'use strict';

var JSTicTacToe = JSTicTacToe || {};

define([], function() {
  return JSTicTacToe.Board = function(game){
    this.game = game;
    this.moves = [];
    this.size = 3;
    this.positionsAmount = Math.pow(this.size, 2);
    this.possiblePositions = setPossiblePositions(this.positionsAmount);
    this.firstPosition;
    this.humanLastMove;
    this.aiLastMove;


    this.addMove = function(position, mark){
      var move = {};
      move['position'] = position;
      move['mark'] = mark;

      if (this.isPristine()) this.firstPosition = position;

      this.moves.push(move);
      this._updateLastMoves(move);
    };

    this._updateLastMoves = function(move){
      if ( this.game.ai.mark === move.mark ){
        this.aiLastMove = move;
      } else {
        this.humanLastMove = move;
      }
    };

    this.getMark = function(position){
      var playerMove = this.moves.find(function(move){
        return move.position === position;
      });
      if (playerMove){
        return playerMove.mark;
      }
    };

    this.available = function(){
      var available = this.possiblePositions.filter(function(position){
        return !this.takenPositions().hasElement(position);
      }.bind(this));
      return available;
    };

    this.positionType = function(position){
      var remainder = position % 2;
      if (position === 4){
        return "center";
      } else if (remainder === 0){
        return "corner";
      } else {
        return "edge";
      };
    };

    this.availableOfType = function(positionType){
      var available = this.available(),
          availableOfType = available.filter(function(position){
            return this.positionType(position) === positionType;
          }.bind(this));
      return availableOfType;
    };

    this.isPositionEmpty = function(position) {
      return this.available().hasElement(position);
    };

    this.availableOnAGivenLine = function(line){
      var available = line.filter(function(position){
        return this.isPositionEmpty(position);
      }.bind(this));
      return available;
    };

    this.singlePlayerLine = function(line, howMany, mark){
      var takenOnALine = line.filter(function(position){
        return !this.isPositionEmpty(position);
      }.bind(this));
      if (takenOnALine.length === howMany){
        var marks = takenOnALine.map(function(position){
          return this.getMark(position);
        }.bind(this));    
        return marks.allDefinedValuesSame() && marks[0] === mark;
      }
      return false;
    }

    this.singleFullLine = function(){
      var fullLines = this.game.winningCombinations.filter(function(combination){
        return this.availableOnAGivenLine(combination).length === 0;
      }.bind(this));
      return fullLines.length === 1 && this.takenPositions().length === this.size;
    }

    this.singleMarkLines = function(mark, howMany){ 
      var lines = this.game.winningCombinations.filter(function(combination){
        return this.singlePlayerLine(combination, howMany, mark);
      }.bind(this));
      return lines;
    }  

    this.center = function(){
      return this.possiblePositions.find(function(position){
        return this.positionType(position) === 'center';
      }.bind(this));
    }

    this.lastPositionFor = function(mark){
      var position,
          movesReverse = this.moves.slice().reverse(),
          playerMove = movesReverse.find(function(move){
            return move.mark === mark;
          });
      if (playerMove){
        position = playerMove.position;
      }
      return position;
    };

    this.oppositePosition = function(position){
      var reverseOrder = this.possiblePositions.slice().reverse();
      return reverseOrder[position];
    };

    this.adjacentPositions = function(position){
      var positions;
      switch ( this.positionType(position)){
        case 'corner':
          if ( position < this.center()){
            positions = [this.possiblePositions[0] + 1, position + this.size];
          } else {
            positions = [this.possiblePositions.lastElement() - 1, position - this.size];
          }
          break;
        case 'edge':
          if ((position - 1) === this.possiblePositions[0] || (position + 1) === this.possiblePositions.lastElement()){
            positions = [position + 1, position - 1];
          } else {
            positions = [position - this.size, position + this.size]
          }
          break;
      }
      return positions;
    };

    this.takenPositions = function(){
      var taken = this.moves.map(function(move){
        return move.position;
      });
      return taken;
    };

    this.updateBoardView = function(){
      this.moves.forEach(function(move){
        var selector = 'td[data-position='+ move.position +']',
            text = move.mark;
        $(selector).text(text).addClass('occupied');
      });
    };

    this.updateUI = function(){
      JSTicTacToe.status.text(this.game.status);
      if (this.game.winner.player){
        JSTicTacToe.winner.text(uiFriendlyPlayer(this.game.winner.player));
        JSTicTacToe.gameStatus.hide();
        JSTicTacToe.notice.show();
      }
      if (!this.game.isActive()){
        $('td').addClass('occupied');
        // JSTicTacToe.emptyGridPositions.off();
      }
    };

    this.findIntersections = function(lines){
      var intersections = [];
      for ( var i = 0; i < lines.length - 1; i++ ){
        var intersection = JSTicTacToe.Helper.commonValues(lines[i], lines[i+1])[0];
        if (intersection !== undefined){
          intersections.push(intersection);
        }
      }
      if (lines.length === this.size){
        intersections.push(JSTicTacToe.Helper.commonValues(lines[0], lines.lastElement())[0]);
      };
      return intersections;
    }; // TODO: refactor?

    this.findFork = function(mark){
      var position,
          lines = this.singleMarkLines(mark, 1);
      if (lines.length > 0){
        var intersections = this.findIntersections(lines),
            potentialPositions = intersections.filter(function(position){
              return this.isPositionEmpty(position);
            }.bind(this)),
            position = JSTicTacToe.Helper.randomElement(potentialPositions);
      }   
      return position;
    }; // find an empty intersection of singleMarkedLines for given mark

    this.isPristine = function(){
      return this.moves.length === 0;
    };

    this.movesSoFar = function(){
      return this.moves.length;
    };

    this.cornerOrCenter = function(){
      var center = this.center(),
          corner = JSTicTacToe.Helper.randomElement(this.availableOfType('corner'));
      return JSTicTacToe.Helper.randomElement([corner, center]);
    }

    this.randomOpenCorner = function(){
      var corners = this.availableOfType('corner');
      return JSTicTacToe.Helper.randomElement(corners);
    }

    function uiFriendlyPlayer(player){
      var friendly = player === 'ai' ? 'computer' : 'you';
      return friendly;
    }

    function setPossiblePositions(amount){
      var positions = [];
      for (var i = 0; i < amount; i++) {
        positions.push(i);
      };
      return positions;
    }
  };
});