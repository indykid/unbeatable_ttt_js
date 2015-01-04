'use strict';

var JSTicTacToe = JSTicTacToe || {};

define(["./game","./ai"], function(Game, AIPlayer) {
  // console.log(AIPlayer)
  return JSTicTacToe.Board = function(game){
    this.game = game;
    this.moves = [];
    this.size = 3;
    this.positionsAmount = Math.pow(this.size, 2);
    this.possiblePositions = setPossiblePositions(this.positionsAmount);
    this.addMove = function(position, mark){
      var move = {};
      move['position'] = position;
      move['mark'] = mark;
      this.moves.push(move);
    }

    this.getMark = function(position){
      var playerMove = this.moves.find(function(move){
        return move.position === position;
      });
      if (playerMove){
        return playerMove.mark;
      }
    }

    this.takenPositions = function(){
      var taken = this.moves.map(function(move){
        return move.position
      });
      return taken;
    } //REVIEW: is not used outside of class, but relies on an interface function...

    this.available = function(){
      var available = this.possiblePositions.filter(function(position){
        return !this.takenPositions().hasElement(position);
      }.bind(this));
      return available;
    }

    this.positionType = function(position){
      var remainder = position % 2;
      if (position === 4){
        return "center";
      } 
      else if (remainder === 0){
        return "corner";
      } else {
        return "edge";
      };
    };

    this.isPositionEmpty = function(position) {
      return this.available().hasElement(position);
    };

    this.availableOnAGivenLine = function(line){
      var available = line.filter(function(position){
        return this.isPositionEmpty(position);
      }.bind(this));
      return available;
    }

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
    } //REVIEW: too big, confusing...? used once outside of class in Game

    this.singleMarkLines = function(mark, howMany){ 
      var lines = this.game.winningCombinations.filter(function(combination){
        return this.singlePlayerLine(combination, howMany, mark);
      }.bind(this));
      return lines;
    }  

    this.corners = function(fromMoves){
      return fromMoves.filter(function(position){
        return this.positionType(position) === 'corner';
      }.bind(this));
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
    }

    this.oppositePosition = function(position){
      var reverseOrder = this.possiblePositions.slice().reverse();
      return reverseOrder[position];
    }

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









// ================================================
// DEFINITELY WILL NEED:
// ================================================
// validations:

// ================================================
// DONE
// ================================================
// game is still active, can't play otherwise
// cell not occupied check
// correct turn

// ================================================
// MAY BE?
// ================================================

// clear event listener on cells if someone won the game?
// possible player value
// possible position
// may be i should draw grid from JS instead of just showing it...


// declare draw when no possible wins even if empty cells remain?

// hardcoded version... might be better?:

// this.adjacentPositions = function(position){
//   var positions;
//   switch (position){
//     case 0:
//       positions = [1, 3]
//       break;
//     case 1:
//       positions = [0, 2]
//       break;
//     case 2:
//       positions = [1, 5]
//       break;
//     case 3:
//       break;
//     case 4:
//       break;
//     case 5:
//       break;
//     case 6:
//       break;
//     case 7:
//       break;
//     case 8:
//       break;
//   }
// }

// 2, 4, 3, 1, 7, 0, 8, 5, 6
