'use strict';

var JSTicTacToe = JSTicTacToe || {};

define([], function(){

  describe('Board', function(){
    var board;
    beforeEach(function(){
      board = new JSTicTacToe.Board();
      board.ai = new JSTicTacToe.AIPlayer(board, 'human');
    });

    it('is empty at the start', function(){
      expect(board.moves).toEqual([]);
    });

    describe('#addMove', function(){
      it('adds a new move to the board', function(){
        board.addMove(0, 'x');
        expect(board.moves).toEqual([{ cell: 0, mark: 'x' }]);
      });
    });

    describe('#getMark', function(){
      it('returns mark played with in the given cell', function(){
        board.seed([0, 1]);
        expect(board.getMark(0)).toEqual('x');
        expect(board.getMark(1)).toEqual('o');
      });
    });

    describe('#cellType', function(){
      it('returns "corner" cell type if corner is given', function(){
        expect(board.cellType(0)).toEqual('corner');
        expect(board.cellType(8)).toEqual('corner');
      });

      it('returns "center" cell type if center is given', function(){
        expect(board.cellType(4)).toEqual('center');
      });

      it('returns "edge" cell type if edge is given', function(){
        expect(board.cellType(1)).toEqual('edge');
        expect(board.cellType(5)).toEqual('edge');
      });
    });

    describe('#isCellEmpty', function(){
      describe('context: cell is occupied', function(){
        it('returns false', function(){
          board.addMove(0, 'x');
          expect(board.isCellEmpty(0)).toBe(false);
        });
      });
      describe('context: cell is unoccupied', function(){
        it('returns true', function(){
          expect(board.isCellEmpty(0)).toBe(true);
        });
      });
    });

    describe('#availableAmong', function(){
      describe('context: line is empty', function(){
        it('returns all cells of a line', function(){
          expect(board.availableAmong([0, 1, 2]).ascending()).toEqual([0, 1, 2]);
        });
      });

      describe('context: line has one cell occupied', function(){
        it('returns all cells except occupied one', function(){
          board.addMove(4, 'x');
          expect(board.availableAmong([0, 4, 8]).ascending()).toEqual([0, 8]);
        });
      });

      describe('context: line is full', function(){
        it('returns an empty array', function(){
          board.seed([0, 1, 2]);
          expect(board.availableAmong([0, 1, 2])).toEqual([]);
        });
      });
    });

    describe('#availableOfType', function(){
      it('only returns available cells of a given type', function(){
        board.seed([2, 5]);
        expect(board.availableOfType('corner').ascending()).toEqual([0, 6, 8]);
        expect(board.availableOfType('edge').ascending()).toEqual([1, 3, 7]);
        expect(board.availableOfType('center')).toEqual([4]);
      });
      it('return empty array if no available cells of a given type', function(){
        board.seed([4, 2, 5]);
        expect(board.availableOfType('center')).toEqual([]);
      });
    });

    describe('#singlePlayerCells', function(){
      describe('context: only 2 moves on a line, both by the same player', function(){
        it('returns true if asking for 2 of the same', function(){
          board.seed([4, 3, 8]);
          expect(board.singlePlayerCells([0, 4, 8], 2, 'x')).toBe(true);
        });

        it('returns false if asking for 1 of the same', function(){
          board.seed([1, 2, 3, 8]);
          expect(board.singlePlayerCells([2, 5, 8]), 1, 'x').toBe(false);
        });
      });
      describe('context: only 1 move on a line', function(){
        it('returns true when asking for 1 of the same', function(){
          board.seed([4, 3]);
          expect(board.singlePlayerCells([1, 4, 7], 1, 'x')).toBe(true);
          expect(board.singlePlayerCells([0, 3, 6], 1, 'o')).toBe(true);
        });

        it('returns false when asking for 2 of the same', function(){
          board.addMove(5, 'x');
          expect(board.singlePlayerCells([3, 4, 5], 2, 'x')).toBe(false);
        });
      });

      describe('context: 2 moves on a line, by different players', function(){
        it('returns false when asking for 1 of the same', function(){
          board.seed([4, 8, 3]);
          expect(board.singlePlayerCells([0, 4, 8], 1, 'x')).toBe(false);
        });

        it('returns false when asking for 2 of the same', function(){
          board.seed([8, 2, 3, 1]);
          expect(board.singlePlayerCells([2, 5, 8], 2, 'x')).toBe(false);
        });
      });
    });

    describe('#singleFullLine', function(){
      describe('context: only one full line', function(){
        it('returns true', function(){
          board.seed([1, 4, 7]);
          expect(board.singleFullLine()).toBe(true);
        });
      });
      describe('context: one full line and one more half full', function(){
        it('returns false', function(){
          board.seed([1, 4, 7, 3]);
          expect(board.singleFullLine()).toBe(false);
        });
      });
      describe('context: more than one full line', function(){
        it('returns false', function(){
          board.seed([1, 4, 7, 3, 5]);
          expect(board.singleFullLine()).toBe(false);
        });
      });
    });

    describe('#singleMarkLines', function(){
      describe('context: "x" only lines with single cell and "o" only lines with two cells are present', function(){
        describe('context: asking for "x" only lines with single cell occupied', function(){
          it('it returns correct line', function(){
            board.seed([8, 2, 3, 1]);
            expect(board.singleMarkLines('x', 1)).toEqual([[0, 4, 8], [0, 3, 6], [3, 4, 5], [6, 7, 8]]);
          });
        });
        describe('context: asking for "x" only lines with two cells occupied', function(){
          it('it returns empty array', function(){
            board.seed([8, 2, 3, 1]);
            expect(board.singleMarkLines('x', 2)).toEqual([]);
          });
        });

        describe('context: asking for "o" only lines with two cells occupied', function(){
          it('returns correct lines', function(){
            board.seed([8, 2, 3, 1]);
            expect(board.singleMarkLines('o', 2)).toEqual([[0, 1, 2]]);
          });
        });
      });
    });

    describe('#center', function(){
      it('returns correct cell', function(){
        expect(board.center()).toEqual(4);
      });
    });

    describe('#oppositeCell', function(){
      describe('context: when given corner', function(){
        it('returns symmetrically opposite cell', function(){
          expect(board.oppositeCell(6)).toEqual(2);
        });
      });
      describe('context: when given corner', function(){
        it('returns symmetrically opposite cell', function(){
          expect(board.oppositeCell(1)).toEqual(7);
        });
      });
      describe('context: when given center', function(){
        it('returns undefined', function(){
          expect(board.oppositeCell(4)).toBeUndefined();
        });
      });
    });

    describe('#adjacentCells', function(){
      it('returns array with correct cells for a corner or edge cell)', function(){
        expect(board.adjacentCells(0)).toEqual([1, 3]);
        expect(board.adjacentCells(1).ascending()).toEqual([0, 2]);
        expect(board.adjacentCells(2).ascending()).toEqual([1, 5]);
        expect(board.adjacentCells(3).ascending()).toEqual([0, 6]);
        expect(board.adjacentCells(5).ascending()).toEqual([2, 8]);
        expect(board.adjacentCells(6).ascending()).toEqual([3, 7]);
        expect(board.adjacentCells(7).ascending()).toEqual([6, 8]);
        expect(board.adjacentCells(8).ascending()).toEqual([5, 7]);
      });
      it('returns undefined for center', function(){
        expect(board.adjacentCells(4)).toBeUndefined();
      });
    });

    describe('#findIntersections', function(){
      describe('context: given 2 lines', function(){
        it('returns array with intersections', function(){
          var line1 = [0, 1, 2];
          var line2 = [1, 4, 7];
          expect(board.findIntersections([line1, line2])).toEqual([1]);
        });
      });
      describe('context: given 3 lines', function(){
        it('returns array with intersections', function(){
          var line1 = [0, 1, 2];
          var line2 = [1, 4, 7];
          var line3 = [2, 5, 8];
          expect(board.findIntersections([line1, line2, line3])).toEqual([1, 2]);
        });
      });
    });

    describe('#findFork', function(){
      describe('context: fork is available for a given mark', function(){
        it('returns a cell that creates a fork', function(){
          board.seed([2, 0, 8, 5]);
          expect(board.findFork('x')).toEqual(6);
        });
      });
      describe('context: fork is not available for a given mark', function(){
        it('returns undefined', function(){
          board.seed([0, 4, 8, 5, 3, 6]);
          expect(board.findFork('x')).toBeUndefined();
        });
      });
    });

    describe('#_isPristine', function(){
      describe('context: no moves have been made', function(){
        it('returns true', function(){
          expect(board._isPristine()).toBe(true);
        });
      });
      describe('context: moves have been made', function(){
        it('returns false', function(){
          board.addMove(0, 'x');
          expect(board._isPristine()).toBe(false);
        });
      });
    });

    describe('_updateLastMoves', function(){
      it('updates humanLastMove and aiLastMove', function(){
        board.seed([0, 1]);
        expect(board.humansLastCell).toEqual(0);
        expect(board.aiLastCell).toEqual(1);
      });
    });

    describe('#anyFreeCorner', function(){
      it('returns a random open corner', function(){
        board.seed([0, 1]);
        expect([2, 6, 8]).toContain(board.anyFreeCorner())
      });
    });

    describe('#seed', function(){
      it('fills board with given cells', function(){
        board.seed([0, 1, 7, 4]);
        var marks = board._getMarksFor([0, 1, 7, 4]);
        expect(board.taken).toEqual([0, 1, 7, 4]);
        expect(marks).toEqual(['x', 'o', 'x', 'o']);
      });
    });
  });
});