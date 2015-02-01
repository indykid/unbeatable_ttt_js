'use strict';

var JSTicTacToe = JSTicTacToe || {};

define([], function(){

  describe('Board', function(){
    var board;
    beforeEach(function(){
      board = new JSTicTacToe.Board();
    });

    it('is empty at the start', function(){
      expect(board.moves).toEqual([]);
    });

    describe('#addMove', function(){
      it('adds a new move to the board', function(){
        board.addMove(0, 'x');
        expect(board.moves).toEqual([{ position: 0, mark: 'x' }]);
      });
    });

    describe('#getMark', function(){
      it('returns mark played with in the given position', function(){
        board.addMove(0, 'x');
        board.addMove(1, 'o');
        expect(board.getMark(0)).toEqual('x');
        expect(board.getMark(1)).toEqual('o');
      });
    });

    describe('#available', function(){
      it('returns only unoccupied positions', function(){
        board.addMove(5, 'x');
        board.addMove(7, 'o');
        board.addMove(0, 'x');
        board.addMove(4, 'o');
        expect(board.available().ascending()).toEqual([1, 2, 3, 6, 8]);
      });
      // it('returns only unoccupied positions', function(){
      //   board.addMove(6, 'x');
      //   board.addMove(3, 'o');
      //   board.addMove(0, 'x');
      //   board.addMove(2, 'o');
      //   expect(board.available().ascending()).toEqual([1, 4, 5, 7, 8]);
      // });
    });

    describe('#takenPositions', function(){
      it('returns only occupied positions', function(){
        board.addMove(5, 'x');
        board.addMove(7, 'o');
        board.addMove(0, 'x');
        board.addMove(4, 'o');
        expect(board.takenPositions()).toEqual([5, 7, 0, 4]);
      });
      // it('returns only occupied positions', function(){
      //   board.addMove(6, 'x');
      //   board.addMove(3, 'o');
      //   board.addMove(0, 'x');
      //   board.addMove(2, 'o');
      //   expect(board.takenPositions()).toEqual([6, 3, 0, 2]);
      // });
    });

    describe('#positionType', function(){
      it('returns "corner" position type if corner is given', function(){
        expect(board.positionType(0)).toEqual('corner');
        expect(board.positionType(8)).toEqual('corner');
      });

      it('returns "center" position type if center is given', function(){
        expect(board.positionType(4)).toEqual('center');
      });

      it('returns "edge" position type if edge is given', function(){
        expect(board.positionType(1)).toEqual('edge');
        expect(board.positionType(5)).toEqual('edge');
      });
    });

    describe('#isPositionEmpty', function(){
      describe('context: cell is occupied', function(){
        it('returns false', function(){
          board.addMove(0, 'x');
          expect(board.isPositionEmpty(0)).toBe(false);
        });
      });
      describe('context: cell is unoccupied', function(){
        it('returns true', function(){
          expect(board.isPositionEmpty(0)).toBe(true);
        });
      })
    });

    describe('#availableOnAGivenLine', function(){
      describe('context: line is empty', function(){
        it('returns all positions of a line', function(){
          expect(board.availableOnAGivenLine([0, 1, 2]).ascending()).toEqual([0, 1, 2]);
        });
      });

      describe('context: line has one position occupied', function(){
        it('returns all positions except occupied one', function(){
          board.addMove(4, 'x');
          expect(board.availableOnAGivenLine([0, 4, 8]).ascending()).toEqual([0, 8]);
        });
      });

      describe('context: line is full', function(){
        it('returns an empty array', function(){
          board.addMove(0, 'x');
          board.addMove(1, 'o');
          board.addMove(2, 'x');
          expect(board.availableOnAGivenLine([0, 1, 2])).toEqual([]);
        });
      });
    });

    describe('#singlePlayerLine', function(){
      describe('context: only 2 moves on a line, both by the same player', function(){
        it('returns true if asking for 2 of the same', function(){
          board.addMove(4, 'x');
          board.addMove(3, 'o');
          board.addMove(8, 'x');
          expect(board.singlePlayerLine([0, 4, 8], 2, 'x')).toBe(true);
        });

        it('returns false if asking for 1 of the same', function(){
          board.addMove(1, 'x');
          board.addMove(2, 'o');
          board.addMove(3, 'x');
          board.addMove(8, 'o');
          expect(board.singlePlayerLine([2, 5, 8]), 1, 'x').toBe(false);
        });
      });
      describe('context: only 1 move on a line', function(){
        it('returns true when asking for 1 of the same', function(){
          board.addMove(4, 'x');
          board.addMove(3, 'o');
          expect(board.singlePlayerLine([1, 4, 7], 1, 'x')).toBe(true);
          expect(board.singlePlayerLine([0, 3, 6], 1, 'o')).toBe(true);
        });

        it('returns false when asking for 2 of the same', function(){
          board.addMove(5, 'x');
          expect(board.singlePlayerLine([3, 4, 5], 2, 'x')).toBe(false);
        });
      });

      describe('context: 2 moves on a line, by different players', function(){
        it('returns false when asking for 1 of the same', function(){
          board.addMove(4, 'x');
          board.addMove(8, 'o');
          board.addMove(3, 'x');
          expect(board.singlePlayerLine([0, 4, 8], 1, 'x')).toBe(false);
        });

        it('returns false when asking for 2 of the same', function(){
          board.addMove(8, 'x');
          board.addMove(2, 'o');
          board.addMove(3, 'x');
          board.addMove(1, 'o');
          expect(board.singlePlayerLine([2, 5, 8], 2, 'x')).toBe(false);
        });
      });
    });

    describe('#singleMarkLines', function(){
      var game;

      beforeEach(function(){
        game = new JSTicTacToe.Game('human');
      });

      describe('context: no two positions in a row belong to player x', function(){
        it('given the moves, for player "x" it returns correct lines when asking for 1 in a line, and no lines when asking for 2', function(){
          game.board.addMove(8, 'x');
          game.board.addMove(2, 'o');
          game.board.addMove(3, 'x');
          game.board.addMove(1, 'o');
          expect(game.board.singleMarkLines('x', 1)).toEqual([[0, 4, 8], [0, 3, 6], [3, 4, 5], [6, 7, 8]]);
          expect(game.board.singleMarkLines('x', 2)).toEqual([]);
        });
        it('given the moves, for player "o" it returns correct lines when asking for 2 or 1 moves in a line', function(){
          game.board.addMove(8, 'x');
          game.board.addMove(2, 'o');
          game.board.addMove(3, 'x');
          game.board.addMove(1, 'o');
          expect(game.board.singleMarkLines('o', 1)).toEqual([[2, 4, 6], [1, 4, 7]]);
          expect(game.board.singleMarkLines('o', 2)).toEqual([[0, 1, 2]]);
        });
      });
    });

    describe('#lastPositionFor', function(){
      it('returns last position for a given player', function(){
        board.addMove(8, 'x');
        board.addMove(2, 'o');
        board.addMove(3, 'x');
        board.addMove(1, 'o');
        expect(board.lastPositionFor('x')).toEqual(3);
        expect(board.lastPositionFor('o')).toEqual(1);
      });
    });

    describe('#oppositePosition', function(){
      it('returns symmetrically opposite position', function(){
        expect(board.oppositePosition(1)).toEqual(7);
        expect(board.oppositePosition(6)).toEqual(2);
        expect(board.oppositePosition(8)).toEqual(0);
        expect(board.oppositePosition(3)).toEqual(5);
      });
    });

    describe('#adjacentPositions', function(){
      it('returns array with correct positions for a given one (does not incl center)', function(){
        expect(board.adjacentPositions(0)).toEqual([1, 3]);
        expect(board.adjacentPositions(1).ascending()).toEqual([0, 2]);
        expect(board.adjacentPositions(2).ascending()).toEqual([1, 5]);
        expect(board.adjacentPositions(3).ascending()).toEqual([0, 6]);
        expect(board.adjacentPositions(6).ascending()).toEqual([3, 7]);
        expect(board.adjacentPositions(7).ascending()).toEqual([6, 8]);
      });
    });

    describe('#corners', function(){
      it('out of all possible positions always returns [0, 2, 6, 8] for 3x3 grid', function(){
        expect(board.corners(board.possiblePositions).ascending()).toEqual([0, 2, 6, 8]);
      });
      it('out of given positions always returns [0, 2, 6, 8] for 3x3 grid', function(){
        expect(board.corners([0, 4, 5, 6]).ascending()).toEqual([0, 6]);
      });
    });
    describe('#center', function(){
      it('always returns 4 for 3x3 grid', function(){
        expect(board.center()).toEqual(4);
      });
    });
  });
});