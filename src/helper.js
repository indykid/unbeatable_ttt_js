'use strict';

var JSTicTacToe = JSTicTacToe || {};

define([], function(){
  
  return JSTicTacToe.Helper = function(){
    // ================================================
    // ARRAY EXTENSIONS:
    // ================================================
    this.bootstrapArray = function(){
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
    }

    // ================================================
    // HELPERS:
    // ================================================

    this.randomize = function(data){
      return data.sort(function(){
        return 0.5 - Math.random();
      });
    }

    this.randomElement = function(data){
      var myArray = this.randomize(data);
      var index = Math.floor(Math.random() * myArray.length);
      return myArray[index];
    }
    
    this.commonValues = function(a, b){
      var result = a.filter(function(n) {
        return b.hasElement(n);
      });
      return result;
    }

  }
});