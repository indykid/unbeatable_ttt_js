'use strict';

var JSTicTacToe = JSTicTacToe || {};

define(["../src/board", "../src/game", "../src/ai", "../src/helper"], function (Board, Game, AIPlayer, Helper) {
  JSTicTacToe.helper = new Helper();
  JSTicTacToe.helper.bootstrapArray();
  JSTicTacToe.Board = Board;
  JSTicTacToe.AIPlayer = AIPlayer;
  JSTicTacToe.Game = Game;

  describe('Game', function(){
    var game;
    beforeEach(function(){
      game = new Game('human');
    });

    it('has an empty board at the start', function(){
      expect(game.board).not.toBeUndefined();
      expect(game.board.moves).toEqual([]);
    });

    describe('#winnerMark', function(){
      describe('context: human won on a ...', function(){
        describe('fist diagonal', function(){
          it('returns x mark', function(){
            game.board.seed([0, 6, 4, 5, 8]);
            expect(game.winnerMark()).toEqual('x')
          });
        });
        describe('second diagonal', function(){
          it('returns x mark', function(){
            game.board.seed([2, 3, 4, 5, 6]);
            expect(game.winnerMark()).toEqual('x')
          });
        });
        describe('row', function(){
          it('returns x mark', function(){
            game.board.seed([0, 4, 1, 5, 2]);
            expect(game.winnerMark()).toEqual('x')
          });
        });
        describe('column', function(){
          it('returns x mark', function(){
            game.board.seed([0, 4, 3, 5, 6]);
            expect(game.winnerMark()).toEqual('x')
          });
        });
      });

      describe('context: AI won on a ...', function(){
        describe('first diagonal', function(){
          it('returns o mark', function(){
            game.board.seed([6, 0, 5, 4, 1, 8]);
            expect(game.winnerMark()).toEqual('o')
          });
        });
        describe('second diagonal', function(){
          it('returns o mark', function(){
            game.board.seed([3, 2, 5, 4, 7, 6]);
            expect(game.winnerMark()).toEqual('o')
          });
        });
        describe('row', function(){
          it('returns o mark', function(){
            game.board.seed([4, 0, 5, 1, 7, 2]);
            expect(game.winnerMark()).toEqual('o')
          });
        });
        describe('column', function(){
          it('returns o mark', function(){
            game.board.seed([4, 0, 5, 3, 7, 6]);
            expect(game.winnerMark()).toEqual('o')
          });
        });
      });

      describe('context: no one won', function(){
        it('returns false', function(){
          game.board.seed([2, 3, 1]);
          expect(game.winnerMark()).toBeUndefined();
        });

        it('returns false', function(){
          game.board.seed([3, 0, 4]);
          expect(game.winnerMark()).toBeUndefined();
        });

        it('returns false', function(){
          game.board.seed([6, 0, 8]);
          expect(game.winnerMark()).toBeUndefined();
        });

        it('returns false', function(){
          game.board.seed([0, 1, 3]);
          expect(game.winnerMark()).toBeUndefined();
        });
      });
    });

    describe('#isActive', function(){
      describe('context: game is not won and still has available moves', function(){
        it('returns true', function(){
          game.board.seed([0, 1, 5, 3, 6, 7]);
          game.checkAndUpdateGameState();
          expect(game.isActive()).toBe(true)
        });
      });
      describe('context: game is won and still has available moves', function(){
        it('returns false', function(){
          game.board.seed([0, 1, 4, 2, 8]);
          game.checkAndUpdateGameState();
          expect(game.isActive()).toBe(false)
        });
      });
      describe('context: game is not won, but no available moves', function(){
        it('returns false', function(){
          game.board.seed([0, 4, 8, 5, 3, 6, 2, 1, 7]);
          game.checkAndUpdateGameState();
          expect(game.isActive()).toBe(false);
        });
      });
    });
  });
});