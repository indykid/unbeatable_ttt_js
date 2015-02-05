"use strict";

define(["../src/board", "../src/game", "../src/ai"], function(Board, Game, AIPlayer) {

  describe('AIPlayer', function(){
    var game,
        board,
        ai;

    beforeEach(function(){
      game = new Game('human');
      ai = game.ai;
      board = game.board;
    });

    it('has been assigned a mark', function(){
      expect(ai.mark).toBeDefined();
    });

    it("knows opponent's mark", function(){
      expect(ai.humansMark).toBeDefined();
    });

    describe('#_winningCell', function(){
      describe('context: there is a potential win on a:', function(){
        it('row, returns a winning cell', function(){
          board.seed([0, 4, 8, 5, 7]);
          expect(ai._winningCell(game)).toEqual(3);
        });

        it('first diagonal, returns a winning cell', function(){
          board.seed([6, 4, 3, 8, 2]);
          expect(ai._winningCell(game)).toEqual(0);
        });

        it('second diagonal, returns a winning cell', function(){
          board.seed([0, 4, 1, 6, 8]);
          expect(ai._winningCell(game)).toEqual(2);
        });

        it('column, returns a winning cell', function(){
          board.seed([0, 2, 4, 8, 6]);
          expect(ai._winningCell(game)).toEqual(5);
        });

      });

      describe('context: no winning move', function(){
        it('returns undefined', function(){
          board.seed([0, 2, 5]);
          expect(ai._winningCell(game)).toBeUndefined();
        });

        it('returns undefined', function(){
          board.seed([0, 2, 4]);
          expect(ai._winningCell(game)).toBeUndefined();
        });

      });
    });

    describe('#threatCell', function(){
      describe('context: there is a threat on a:', function(){
        it('first diagonal, returns threat cell', function(){
          board.seed([4, 6, 8]);
          expect(ai._threatCell(game)).toEqual(0);
        });

        it('second diagonal, returns threat cell', function(){
          board.seed([2, 4, 8]);
          expect(ai._threatCell(game)).toEqual(5);
        });

        it('row, returns threat cell', function(){
          board.seed([0, 4, 1]);
          expect(ai._threatCell(game)).toEqual(2);
        });

        it('column, returns threat cell', function(){
          board.seed([4, 5, 7]);
          expect(ai._threatCell(game)).toEqual(1);
        });
      });

      describe('context: no threat', function(){
        it('returns undefined', function(){
          board.seed([0, 2, 5]);
          expect(ai._threatCell()).toBeUndefined();
        });
      });
    });

    describe('#_findStrategy', function(){
      describe('context: human plays first', function(){
        it('assigns correct strategy', function(){
          ai._findStrategy();
          expect(ai.strategy).toEqual('secondPlayer');
        });
      });

      describe('context: ai plays first', function(){
        it('assigns correct strategy', function(){
          game = new Game('ai');
          ai = game.ai;
          ai._findStrategy();
          expect(ai.strategy).toEqual('firstPlayer');
        });
      });
    });// not entirely sure about this one

    describe('_strategyAsFirst', function(){
      beforeEach(function(){
        game = new Game('ai');
        ai = game.ai;
        board = game.board;
      });

      describe('context: first move', function(){
        it('returns corner or center cell', function(){
          var cell = ai._strategyAsFirst();
          expect(['corner', 'center']).toContain(board.cellType(cell));
        });
      });

      describe('context: second move', function(){
        describe('context: ai played corner, human played center', function(){
          it('returns corner on the same diagonal as existing moves', function(){
            board.seed([2, 4]);
            expect(ai._strategyAsFirst()).toEqual(6);
          });
        });

        describe('context: ai played center, human played corner', function(){
          it('returns corner on the same diagonal as existing moves', function(){
            board.seed([4, 6]);
            expect(ai._strategyAsFirst()).toEqual(2);
          });
        });

        describe('context: human played edge', function(){
          describe('context: first move was center', function(){
            it('returns any available corner cell', function(){
              board.seed([4, 1]);
              expect([0, 2, 6, 8]).toContain(ai._strategyAsFirst());
            });
          });

          describe('context: first move was corner', function(){
            it("returns play corner away from human's last move", function(){
              board.seed([2, 1]);
              expect(ai._strategyAsFirst()).toEqual(8);
            });
          });
        });
      });

      describe('context: third move', function(){
        describe('context: human never played center', function(){
          it('returns a cell that creates a fork', function(){
            board.seed([0, 1, 6, 3]);
            expect([4, 8]).toContain(ai._strategyAsFirst());
          });
        });
      });
    });

    describe('_strategyAsSecond', function(){
      describe('context: ai first move', function(){
        describe('context: center is available', function(){
          describe('human played edge', function(){
            it('returns center', function(){
              board.addMove(1,'x');
              expect(ai._strategyAsSecond()).toEqual(4);
            });
          });
          describe('human played corner', function(){
            it('returns center', function(){
              board.seed([2]);
              expect(ai._strategyAsSecond()).toEqual(4);
            });
          });
        });

        describe('context: center is unavailable', function(){
          it('returns random corner', function(){
            board.seed([4]);
            expect([0, 2, 6, 8]).toContain(ai._strategyAsSecond());
          });
        });
      });

      describe('context: second move', function(){
        describe("context: human's first move was center", function(){
          it('returns random open corner', function(){
            board.seed([4, 2, 6]);
            expect([0, 8]).toContain(ai._strategyAsSecond());
          });
        });

        describe("context: human's first move was corner", function(){
          describe('context: taken moves form a full line', function(){
            it('returns a random edge', function(){
              board.seed([2, 4, 6]);
              expect([1, 3, 5, 7]).toContain(ai._strategyAsSecond());
            });
          });

          describe("human's second move is an edge, on the side away from human's first", function(){
            it("returns a corner on the same side as human's move", function(){
              board.seed([2, 4, 7]);
              expect(ai._strategyAsSecond()).toEqual(8);
            });
          });
        });

        describe("context: human's first move was edge", function(){
          describe('context: taken moves form a full line', function(){
            it('returns random open corner', function(){
              board.seed([1, 4, 7]);
              expect([0, 2, 6, 8]).toContain(ai._strategyAsSecond());
            });
          });

          describe('context: human played non-opposite edge', function(){
            it("returns a corner cell between human's moves", function(){
              board.seed([5, 4, 7]);
              expect(ai._strategyAsSecond()).toEqual(8);
            });
          });

          describe('context: human played non-adjacent corner to their first move', function(){
            it("returns a corner cell between human's moves", function(){
              board.seed([5, 4, 6]);
              expect(ai._strategyAsSecond()).toEqual(8);
            });
          });
        });
      });
    });

    describe('_basicStrategy', function(){
      describe('context: ai only lines are present', function(){
        it('returns a cell on ai only line', function(){
          board.seed([0, 4, 5]);
          expect([3, 8]).not.toContain(ai._basicStrategy());
        });
      });

      describe('context: empty lines are present and ai only lines are present', function(){
        it('returns a cell on ai only line', function(){
          board.seed([0, 1, 2]);
          expect([4, 7]).toContain(ai._basicStrategy());
        });
      });

      describe('context: no ai only lines, but empty lines are present', function(){
        it('returns a cell on an empty line', function(){
          board.seed([1, 2, 4, 7, 8]);
          expect([5]).not.toContain(ai._basicStrategy());
        });
      });

      describe('context: no ai only lines and no empty lines', function(){
        it('returns any empty cell', function(){
          board.seed([1, 4, 6, 3, 5]);
          expect(board.available()).toContain(ai._basicStrategy());
        });
      });
    });

    describe('_commonSenseStrategy', function(){
      describe('context: winning cell available', function(){
        describe('context: threat block cell is also available', function(){
          it('returns winning cell', function(){
            board.seed([2, 4, 3, 7, 5]);
            expect(ai._commonSenseStrategy()).toEqual(1);
          });
        });
      });

      describe('context: winning cell unavailable', function(){
        describe('context: threat block cell is available', function(){
          it('returns threat blocking cell', function(){
            board.seed([4, 0, 2]);
            expect(ai._commonSenseStrategy()).toEqual(6);
          });
        });

        describe('context: no threat cell available', function(){
          it('returns undefined', function(){
            board.seed([4, 0, 8]);
            expect(ai._commonSenseStrategy()).toBeUndefined();
          });
        });
      });
    });
  });
});