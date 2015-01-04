'use strict';

var JSTicTacToe = JSTicTacToe || {};
// console.log(require)
require(["./board", "game", "./ai"], function(Board, Game, AIPlayer) {
  
  console.log(Game)
  console.log(AIPlayer)
  // JSTicTacToe.Board = Board;
  // JSTicTacToe.Game = Game;
  // JSTicTacToe.AIPlayer = AIPlayer; 
  console.log(Board)
});

$(function(){
  console.log(JSTicTacToe)
// ================================================
// DOM ELEMENTS:
// ================================================

  JSTicTacToe.grid = $('#grid');
  JSTicTacToe.emptyGridPositions = $('td:not(.occupied)');
  JSTicTacToe.newGameButton = $('#newGame');
  JSTicTacToe.selectPlayer = $('#selectPlayer');
  JSTicTacToe.firstPlayer = $('.firstPlayer');
  JSTicTacToe.notice = $('#notice');
  JSTicTacToe.gameStatus = $('#gameStatus');
  JSTicTacToe.status = $('#status');
  JSTicTacToe.winner = $('#winner');

// ================================================
// VISUAL SETUP:
// ================================================

  JSTicTacToe.grid.hide();
  JSTicTacToe.newGameButton.hide();
  JSTicTacToe.notice.hide();
  JSTicTacToe.gameStatus.hide();

// ================================================
// EVENT LISTENERS:
// ================================================

  JSTicTacToe.firstPlayer.on('click', function(){
    var firstPlayer = $(this).data('player');
    JSTicTacToe.selectPlayer.hide();
    JSTicTacToe.game = new JSTicTacToe.Game(firstPlayer);
    JSTicTacToe.game.updateUI();
    JSTicTacToe.grid.show();
    JSTicTacToe.gameStatus.show();
    JSTicTacToe.newGameButton.show();

    if (firstPlayer == 'ai'){
      JSTicTacToe.game.ai.play();
    } //REVIEW: not sure this check belongs here or better on game initialization within game...
  });

  JSTicTacToe.emptyGridPositions.on('click', function(){
    if (JSTicTacToe.game.isActive()){ 
      var position = $(this).data('position');      
      if (JSTicTacToe.game.board.isPositionEmpty(position)){  
        JSTicTacToe.game.humanPlay(position);
      } else {
        alert('this cell is occupied, please try another one');
      }
    } else {
      alert('game over');
    }
    // REVIEW: not sure game active check belongs here or better within the humanPlay itself...  
  });
});

// ================================================
// ARRAY EXTENSIONS:
// ================================================

Array.prototype.hasElement = function(value){
  'use strict';
  return (this.indexOf(value) !== -1) ? true : false;
}

Array.prototype.ascending = function(){
  return this.sort(function(a, b){
    return a - b;
  });
}

Array.prototype.allDefinedValuesSame = function(){
    for (var i = 1; i < this.length; i++) {
      if ( this[0] === undefined || this[i] !== this[0] ){
        return false;
      }
    };
  return true;
}

Array.prototype.lastElement = function(){
  return this[this.length - 1];
}

if (!Array.prototype.find) {
  Array.prototype.find = function(predicate) {
    if (this == null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}

// ================================================
// HELPERS:
// ================================================

function randomize(data){
  return data.sort(function(){
    return 0.5 - Math.random();
  });
}

function randomElement(data){
  var myArray = randomize(data);
  var index = Math.floor(Math.random() * myArray.length);
  return myArray[index];
}

function commonValues(a, b){
  console.log('a',a)
  console.log('b',b)
  var result = a.filter(function(n) {
    return b.hasElement(n);
  });
  return result;
}







