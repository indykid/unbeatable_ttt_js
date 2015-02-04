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

    // describe('#addToBoard', function(){
    //   it('adds moves to the board', function(){
    //     game.board.addMove(0, 'x');
    //     expect(game.board.moves).toEqual([{ cell:0, mark: 'x'}])
    //   });
    // });

    describe('#winnerMark', function(){
      describe('context: human won on a ...', function(){
        describe('fist diagonal', function(){
          it('returns x mark', function(){
            game.board.addMove(0, 'x');
            game.board.addMove(6, 'o');
            game.board.addMove(4, 'x');
            game.board.addMove(5, 'o');
            game.board.addMove(8, 'x');
            expect(game.winnerMark()).toEqual('x')
          });
        });
        describe('second diagonal', function(){
          it('returns x mark', function(){
            game.board.addMove(2, 'x');
            game.board.addMove(3, 'o');
            game.board.addMove(4, 'x');
            game.board.addMove(5, 'o');
            game.board.addMove(6, 'x');
            expect(game.winnerMark()).toEqual('x')
          });
        });
        describe('row', function(){
          it('returns x mark', function(){
            game.board.addMove(0, 'x');
            game.board.addMove(4, 'o');
            game.board.addMove(1, 'x');
            game.board.addMove(5, 'o');
            game.board.addMove(2, 'x');
            expect(game.winnerMark()).toEqual('x')
          });
        });
        describe('column', function(){
          it('returns x mark', function(){
            game.board.addMove(0, 'x');
            game.board.addMove(4, 'o');
            game.board.addMove(3, 'x');
            game.board.addMove(5, 'o');
            game.board.addMove(6, 'x');
            expect(game.winnerMark()).toEqual('x')
          });
        });
      });

      describe('context: AI won on a ...', function(){
        describe('first diagonal', function(){
          it('returns o mark', function(){
            game.board.addMove(6, 'x');
            game.board.addMove(0, 'o');
            game.board.addMove(5, 'x');
            game.board.addMove(4, 'o');
            game.board.addMove(1, 'x');
            game.board.addMove(8, 'o');
            expect(game.winnerMark()).toEqual('o')
          });
        });
        describe('second diagonal', function(){
          it('returns o mark', function(){
            game.board.addMove(3, 'x');
            game.board.addMove(2, 'o');
            game.board.addMove(5, 'x');
            game.board.addMove(4, 'o');
            game.board.addMove(7, 'x');
            game.board.addMove(6, 'o');
            expect(game.winnerMark()).toEqual('o')
          });
        });
        describe('row', function(){
          it('returns o mark', function(){
            game.board.addMove(4, 'x');
            game.board.addMove(0, 'o');
            game.board.addMove(5, 'x');
            game.board.addMove(1, 'o');
            game.board.addMove(7, 'x');
            game.board.addMove(2, 'o');
            expect(game.winnerMark()).toEqual('o')
          });
        });
        describe('column', function(){
          it('returns o mark', function(){
            game.board.addMove(4, 'x');
            game.board.addMove(0, 'o');
            game.board.addMove(5, 'x');
            game.board.addMove(3, 'o');
            game.board.addMove(7, 'x');
            game.board.addMove(6, 'o');
            expect(game.winnerMark()).toEqual('o')
          });
        });
      });

      describe('context: no one won', function(){
        it('returns false', function(){
          game.board.addMove(2, 'x');
          game.board.addMove(3, 'o');
          game.board.addMove(1, 'x')
          expect(game.winnerMark()).toBeUndefined();
        });

        it('returns false', function(){
          game.board.addMove(3, 'x');
          game.board.addMove(0, 'o');
          game.board.addMove(4, 'x')
          expect(game.winnerMark()).toBeUndefined();
        });

        it('returns false', function(){
          game.board.addMove(6, 'x');
          game.board.addMove(0, 'o');
          game.board.addMove(8, 'x')
          expect(game.winnerMark()).toBeUndefined();
        });

        it('returns false', function(){
          game.board.addMove(0, 'x');
          game.board.addMove(1, 'o');
          game.board.addMove(3, 'x')
          expect(game.winnerMark()).toBeUndefined();
        });
      });
    });

    describe('#isActive', function(){
      describe('context: game is not won and still has available moves', function(){
        it('returns true', function(){
          game.board.addMove(0, 'x');
          game.board.addMove(1, 'o');
          game.checkAndUpdateGameState();
          expect(game.isActive()).toBe(true);
        });
        it('returns true', function(){
          game.board.addMove(0, 'x');
          game.board.addMove(1, 'o');
          game.board.addMove(5, 'x');
          game.board.addMove(3, 'o');
          game.board.addMove(6, 'x');
          game.board.addMove(7, 'o');
          game.checkAndUpdateGameState();
          expect(game.isActive()).toBe(true)
        });
      });
      describe('context: game is won and still has available moves', function(){
        it('returns false', function(){
          game.board.addMove(0, 'x');
          game.board.addMove(1, 'o');
          game.board.addMove(4, 'x');
          game.board.addMove(2, 'o');
          game.board.addMove(8, 'x');
          game.checkAndUpdateGameState();
          expect(game.isActive()).toBe(false)
        });
      });
      describe('context: game is not won, but no available moves', function(){
        it('returns false', function(){
          game.board.addMove(0, 'x');
          game.board.addMove(4, 'o');
          game.board.addMove(8, 'x');
          game.board.addMove(5, 'o');
          game.board.addMove(3, 'x');
          game.board.addMove(6, 'o');
          game.board.addMove(2, 'x');
          game.board.addMove(1, 'o');
          game.board.addMove(7, 'x');
          game.checkAndUpdateGameState();
          expect(game.isActive()).toBe(false);
        });
      });
    });
  });
});