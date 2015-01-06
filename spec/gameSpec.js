'use strict';

var JSTicTacToe = JSTicTacToe || {};

define(["../src/board", "../src/game", "../src/ai", "../src/helper"], function (Board, Game, AIPlayer, Helper) { 
  JSTicTacToe.Helper = new Helper();
  JSTicTacToe.Helper.bootstrapArray();
  JSTicTacToe.Board = Board;
  JSTicTacToe.AIPlayer = AIPlayer;
  JSTicTacToe.Game = Game;
  
  describe('Game', function(){
    var game;
    beforeEach(function(){
      game = new JSTicTacToe.Game('human');
    });

    it('has an empty board at the start', function(){
      expect(game.board).not.toBeUndefined();
      expect(game.board.moves).toEqual([]);
    });

    describe('#addToBoard', function(){
      it('adds moves to the board', function(){
        game.addToBoard(0, 'x');
        expect(game.board.moves).toEqual([{ position:0, mark: 'x'}])
      });
    });

    describe('#winnerMark', function(){
      describe('context: human won on a ...', function(){
        describe('fist diagonal', function(){
          it('returns x mark', function(){
            game.addToBoard(0, 'x');
            game.addToBoard(6, 'o');
            game.addToBoard(4, 'x');
            game.addToBoard(5, 'o');
            game.addToBoard(8, 'x');
            expect(game.winnerMark()).toEqual('x')
          });
        });
        describe('second diagonal', function(){
          it('returns x mark', function(){
            game.addToBoard(2, 'x');
            game.addToBoard(3, 'o');
            game.addToBoard(4, 'x');
            game.addToBoard(5, 'o');
            game.addToBoard(6, 'x');
            expect(game.winnerMark()).toEqual('x')
          });
        });
        describe('row', function(){
          it('returns x mark', function(){
            game.addToBoard(0, 'x');
            game.addToBoard(4, 'o');
            game.addToBoard(1, 'x');
            game.addToBoard(5, 'o');
            game.addToBoard(2, 'x');
            expect(game.winnerMark()).toEqual('x')
          });
        });
        describe('column', function(){
          it('returns x mark', function(){
            game.addToBoard(0, 'x');
            game.addToBoard(4, 'o');
            game.addToBoard(3, 'x');
            game.addToBoard(5, 'o');
            game.addToBoard(6, 'x');
            expect(game.winnerMark()).toEqual('x')
          });
        });
      });

      describe('context: AI won on a ...', function(){
        describe('first diagonal', function(){
          it('returns o mark', function(){
            game.addToBoard(6, 'x');
            game.addToBoard(0, 'o');
            game.addToBoard(5, 'x');
            game.addToBoard(4, 'o');
            game.addToBoard(1, 'x');
            game.addToBoard(8, 'o');
            expect(game.winnerMark()).toEqual('o')
          });
        });
        describe('second diagonal', function(){
          it('returns o mark', function(){
            game.addToBoard(3, 'x');
            game.addToBoard(2, 'o');
            game.addToBoard(5, 'x');
            game.addToBoard(4, 'o');
            game.addToBoard(7, 'x');
            game.addToBoard(6, 'o');
            expect(game.winnerMark()).toEqual('o')
          });
        });
        describe('row', function(){
          it('returns o mark', function(){
            game.addToBoard(4, 'x');
            game.addToBoard(0, 'o');
            game.addToBoard(5, 'x');
            game.addToBoard(1, 'o');
            game.addToBoard(7, 'x');
            game.addToBoard(2, 'o');
            expect(game.winnerMark()).toEqual('o')
          });
        });
        describe('column', function(){
          it('returns o mark', function(){
            game.addToBoard(4, 'x');
            game.addToBoard(0, 'o');
            game.addToBoard(5, 'x');
            game.addToBoard(3, 'o');
            game.addToBoard(7, 'x');
            game.addToBoard(6, 'o');
            expect(game.winnerMark()).toEqual('o')
          });
        });
      });

      describe('context: no one won', function(){
        it('returns false', function(){
          game.addToBoard(2, 'x');
          game.addToBoard(3, 'o');
          game.addToBoard(1, 'x')
          expect(game.winnerMark()).toBeUndefined();
        });

        it('returns false', function(){
          game.addToBoard(3, 'x');
          game.addToBoard(0, 'o');
          game.addToBoard(4, 'x')
          expect(game.winnerMark()).toBeUndefined();
        });

        it('returns false', function(){
          game.addToBoard(6, 'x');
          game.addToBoard(0, 'o');
          game.addToBoard(8, 'x')
          expect(game.winnerMark()).toBeUndefined();
        });

        it('returns false', function(){
          game.addToBoard(0, 'x');
          game.addToBoard(1, 'o');
          game.addToBoard(3, 'x')
          expect(game.winnerMark()).toBeUndefined();
        });
      });
    });

    describe('#isActive', function(){
      describe('context: game is not won and still has available moves', function(){
        it('returns true', function(){
          game.addToBoard(0, 'x');
          game.addToBoard(1, 'o');
          game.checkAndUpdateGameState();
          expect(game.isActive()).toBe(true);
        });
        it('returns true', function(){
          game.addToBoard(0, 'x');
          game.addToBoard(1, 'o');
          game.addToBoard(5, 'x');
          game.addToBoard(3, 'o');
          game.addToBoard(6, 'x');
          game.addToBoard(7, 'o');
          game.checkAndUpdateGameState();
          expect(game.isActive()).toBe(true)
        });
      });
      describe('context: game is won and still has available moves', function(){
        it('returns false', function(){
          game.addToBoard(0, 'x');
          game.addToBoard(1, 'o');
          game.addToBoard(4, 'x');
          game.addToBoard(2, 'o');
          game.addToBoard(8, 'x');
          game.checkAndUpdateGameState();
          expect(game.isActive()).toBe(false)
        });
      });
      describe('context: game is not won, but no available moves', function(){
        it('returns false', function(){
          game.addToBoard(0, 'x');
          game.addToBoard(4, 'o');
          game.addToBoard(8, 'x');
          game.addToBoard(5, 'o');
          game.addToBoard(3, 'x');
          game.addToBoard(6, 'o');
          game.addToBoard(2, 'x');
          game.addToBoard(1, 'o');
          game.addToBoard(7, 'x');
          game.checkAndUpdateGameState();
          expect(game.isActive()).toBe(false);
        });
      });
    });
  });
});