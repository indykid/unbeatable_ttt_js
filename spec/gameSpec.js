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

    it('has a board', function(){
      expect(game.board).toBeDefined();
    });

    it('has an AI player', function(){
      expect(game.ai).toBeDefined();
    });

    it('has status of active to begin with', function(){
      expect(game.status).toEqual('active');
    });

    it('no winner at a start', function(){
      expect(game.winner.player).toBeUndefined();
      expect(game.winner.mark).toBeUndefined();
    });

    describe('#checkAndUpdateGameState', function(){
      describe('context: no winner yet, moves are available', function(){
        it('updates its winner and status correctly', function(){
          game.board.seed([0, 2]);
          game.checkAndUpdateGameState();
          expect(game.status).toEqual('active');
          expect(game.winner.player).toBeUndefined();
        });
      });

      describe('there is a winner', function(){
        it('updates its winner and status correctly', function(){
          game.board.seed([0, 1, 4, 2]);
          game.checkAndUpdateGameState();
          expect(game.status).toEqual('active');
          expect(game.winner.player).toBeUndefined();

          game.board.addMove(8, 'x');
          game.checkAndUpdateGameState();
          expect(game.status).toEqual('won');
          expect(game.winner.player).toEqual('human');
        });
      });

      describe('no winner and no moves left', function(){
        it('updates its winner and status correctly', function(){
          game.board.seed([0, 4, 8, 5, 3, 6, 2, 1]);
          game.checkAndUpdateGameState();
          expect(game.status).toEqual('active');
          expect(game.winner.player).toBeUndefined();

          game.board.addMove(7, 'x');
          game.checkAndUpdateGameState();
          expect(game.status).toEqual('drawn');
          expect(game.winner.player).toBeUndefined();
        });
      });

      describe('context: there is a winner, and still and there are empty cells available', function(){
        it('updates its winner and status correctly', function(){
          game.board.seed([0, 1, 4, 2]);
          game.checkAndUpdateGameState();
          expect(game.status).toEqual('active');
          expect(game.winner.player).toBeUndefined();

          game.board.addMove(8, 'x');
          game.checkAndUpdateGameState();
          expect(game.status).toEqual('won');
          expect(game.winner.player).toEqual('human');
        });
      });
    });

    describe('_isPlayerTurn', function(){
      it("returns true if it is given player's turn ", function(){
        expect(game._isPlayerTurn('x')).toBe(true);
        game.board.addMove(0, 'x');
        expect(game._isPlayerTurn('x')).toBe(false);
        expect(game._isPlayerTurn('o')).toBe(true);
      });
    });
  });
});