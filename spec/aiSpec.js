'use strict';

var JSTicTacToe = JSTicTacToe || {};

define(["../src/board", "../src/game", "../src/ai"], function(Board, Game, AIPlayer) { 

  JSTicTacToe.Board = Board;
  JSTicTacToe.AIPlayer = AIPlayer;
  JSTicTacToe.Game = Game;

  describe('AIPlayer', function(){
    var game;
    beforeEach(function(){
      game = new Game('human');
    });

    it('has been assigned a mark', function(){
      expect(game.ai.mark).toBeDefined();
    });

    it("knows opponent's mark", function(){
      expect(game.ai.opponentMark).toBeDefined();
    });

    describe('#winningPosition', function(){
      describe('context: there is a potential win on a:', function(){
        it('row, returns a winning position 3', function(){
          game.addToBoard(0, 'x');
          game.addToBoard(4, 'o');
          game.addToBoard(8, 'x');
          game.addToBoard(5, 'o');
          game.addToBoard(7, 'x');
          expect(game.ai.winningPosition(game)).toEqual(3);
        });

        it('first diagonal, returns a winning position 4', function(){
          game.addToBoard(6, 'x');
          game.addToBoard(0, 'o');
          game.addToBoard(3, 'x');
          game.addToBoard(8, 'o');
          game.addToBoard(2, 'x');
          expect(game.ai.winningPosition(game)).toEqual(4);
        });

        it('first diagonal, returns a winning position 0', function(){
          game.addToBoard(6, 'x');
          game.addToBoard(4, 'o');
          game.addToBoard(3, 'x');
          game.addToBoard(8, 'o');
          game.addToBoard(2, 'x');
          expect(game.ai.winningPosition(game)).toEqual(0);
        });

        it('second diagonal, returns a winning position 2', function(){
          game.addToBoard(0, 'x');
          game.addToBoard(4, 'o');
          game.addToBoard(1, 'x');
          game.addToBoard(6, 'o');
          game.addToBoard(8, 'x');
          expect(game.ai.winningPosition(game)).toEqual(2);
        });

        it('column, returns a winning position 3', function(){
          game.addToBoard(0, 'x');
          game.addToBoard(2, 'o');
          game.addToBoard(4, 'x');
          game.addToBoard(8, 'o');
          game.addToBoard(6, 'x');
          expect(game.ai.winningPosition(game)).toEqual(5);
        });
        
      });

      describe('context: no winning move', function(){
        it('returns undefined', function(){
          game.addToBoard(0, 'x');
          game.addToBoard(2, 'o');
          game.addToBoard(5, 'x');
          expect(game.ai.winningPosition(game)).toBeUndefined();
        });

        it('returns undefined', function(){
          game.addToBoard(0, 'x');
          game.addToBoard(2, 'o');
          game.addToBoard(4, 'x');
          expect(game.ai.winningPosition(game)).toBeUndefined();
        });

      });
    });

    describe('#threatPosition', function(){
      describe('context: there is a threat on a:', function(){
        it('first diagonal, returns threat position 0', function(){
          game.addToBoard(4, 'x');
          game.addToBoard(6, 'o');
          game.addToBoard(8, 'x');
          expect(game.ai.threatPosition(game)).toEqual(0);
        });

        it('second diagonal, returns threat position 5', function(){
          game.addToBoard(2, 'x');
          game.addToBoard(4, 'o');
          game.addToBoard(8, 'x');
          expect(game.ai.threatPosition(game)).toEqual(5);
        });

        it('row, returns threat position 2', function(){
          game.addToBoard(0, 'x');
          game.addToBoard(4, 'o');
          game.addToBoard(1, 'x');
          expect(game.ai.threatPosition(game)).toEqual(2);
        });

        it('column, returns threat position 1', function(){
          game.addToBoard(4, 'x');
          game.addToBoard(5, 'o');
          game.addToBoard(7, 'x');
          expect(game.ai.threatPosition(game)).toEqual(1);
        });

        it('column, returns threat position 2', function(){
          game.addToBoard(5, 'x');
          game.addToBoard(4, 'o');
          game.addToBoard(8, 'x');
          expect(game.ai.threatPosition(game)).toEqual(2);
        });
      });

      describe('context: no threat', function(){
        it('returns undefined', function(){
          game.addToBoard(0, 'x');
          game.addToBoard(2, 'o');
          game.addToBoard(5, 'x');
          expect(game.ai.threatPosition()).toBeUndefined();
        });
        it('returns undefined', function(){
          game.addToBoard(0, 'x');
          game.addToBoard(4, 'o');
          game.addToBoard(5, 'x');
          expect(game.ai.threatPosition()).toBeUndefined();
        });
      });
    });
  });
});