// ================================================
// BOARD:
// ================================================

describe('Board', function(){
  var board;
  beforeEach(function(){
    board = new JSTicTacToe.Board();
  });

  it('is empty at the start', function(){
    expect(board.moves).toEqual({});
  });

  describe('#addMove', function(){
    it('adds a new move to the board', function(){
      board.addMove(0, 'x');
      expect(board.moves).toEqual({0: 'x'});
      expect(board.movesInOrder).toEqual([{0: 'x'}]);
    });
  });

  describe('#getPlayer', function(){
    it('returns player who played the given position', function(){
      board.addMove(0, 'x');
      board.addMove(1, 'o');
      expect(board.getPlayer(0)).toEqual('x');
      expect(board.getPlayer(1)).toEqual('o');
    });
  });

  describe('#available', function(){
    it('returns only unoccupied positions', function(){
      board.addMove(5, 'x');
      board.addMove(7, 'o');
      board.addMove(0, 'x');
      board.addMove(4, 'o');
      expect(board.available()).toEqual([1, 2, 3, 6, 8]);
    });
    it('returns only unoccupied positions', function(){
      board.addMove(6, 'x');
      board.addMove(3, 'o');
      board.addMove(0, 'x');
      board.addMove(2, 'o');
      expect(board.available()).toEqual([1, 4, 5, 7, 8]);
    });
  });

  describe('#takenPositions', function(){
    it('returns only occupied positions', function(){
      board.addMove(5, 'x');
      board.addMove(7, 'o');
      board.addMove(0, 'x');
      board.addMove(4, 'o');
      expect(board.takenPositions()).toEqual([0, 4, 5, 7]);
    });
    it('returns only occupied positions', function(){
      board.addMove(6, 'x');
      board.addMove(3, 'o');
      board.addMove(0, 'x');
      board.addMove(2, 'o');
      expect(board.takenPositions()).toEqual([0, 2, 3, 6]);
    });
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
    it('returns [0, 1, 2], for an empty line [0, 1, 2]', function(){
      expect(board.availableOnAGivenLine([0, 1, 2])).toEqual([0, 1, 2]);
    });

    it('returns [0, 8] cells for a given line [0, 4, 8], where, 4 is occupied', function(){
      board.addMove(4, 'x');
      expect(board.availableOnAGivenLine([0, 4, 8])).toEqual([0, 8]);
    });
    it('returns empty array, for a full line [0, 1, 2]', function(){
      board.addMove(0, 'x');
      board.addMove(1, 'o');
      board.addMove(2, 'x');
      expect(board.availableOnAGivenLine([0, 1, 2])).toEqual([]);
    });
  });

  describe('#takenOnAGivenLine', function(){
    it('returns empty array, for an empty line [0, 1, 2]', function(){
      expect(board.takenOnAGivenLine([0, 1, 2])).toEqual([]);
    });

    it('returns [4] for a given line [0, 4, 8], where, 4 is occupied', function(){
      board.addMove(4, 'x');
      expect(board.takenOnAGivenLine([0, 4, 8])).toEqual([4]);
    });

    it('returns [3, 5] for a given line [0, 4, 8], where, 4 is occupied', function(){
      board.addMove(3, 'x');
      board.addMove(2, 'x');
      board.addMove(5, 'x');
      expect(board.takenOnAGivenLine([3, 4, 5])).toEqual([3, 5]);
    });
  });

  describe('#singlePlayerLine', function(){
    describe('context: only 2 moves on a line, both by the same player', function(){
      it('returns true if asking for 2 of the same', function(){
        board.addMove(4, 'x');
        board.addMove(3, 'o');
        board.addMove(8, 'x');
        expect(board.singlePlayerLine([0, 4, 8], 2)).toBe(true);
      });

      it('returns false if asking for 1 of the same', function(){
        board.addMove(1, 'x');
        board.addMove(2, 'o');
        board.addMove(3, 'x');
        board.addMove(8, 'o');
        expect(board.singlePlayerLine([2, 5, 8]), 1).toBe(false);
      });
    });
    describe('context: only 1 move on a line', function(){
      it('returns true when asking for 1 of the same', function(){
        board.addMove(4, 'x');
        board.addMove(3, 'o');
        expect(board.singlePlayerLine([0, 3, 6], 1)).toBe(true);
      });

      it('returns false when asking for 2 of the same', function(){
        board.addMove(5, 'x');
        expect(board.singlePlayerLine([3, 4, 5], 2)).toBe(false);
      });
    });

    describe('context: 2 moves on a line, by different players', function(){
      it('returns false when asking for 1 of the same', function(){
        board.addMove(4, 'x');
        board.addMove(8, 'o');
        board.addMove(3, 'x');
        expect(board.singlePlayerLine([0, 4, 8], 1)).toBe(false);
      });

      it('returns false when asking for 2 of the same', function(){
        board.addMove(8, 'x');
        board.addMove(2, 'o');
        board.addMove(3, 'x');
        board.addMove(1, 'o');
        expect(board.singlePlayerLine([2, 5, 8], 2)).toBe(false);
      });
    });

  });

  describe('#singlePlayerLinesForPlayer', function(){
    var game;
    // board = undefined;
    beforeEach(function(){
      game = new JSTicTacToe.Game('human');
    });
    describe('context: no two positions in a row belong to player x', function(){
      it('given the moves, for player "x" it returns correct lines when asking for 1 in a line, and no lines when asking for 2', function(){
        game.board.addMove(8, 'x');
        game.board.addMove(2, 'o');
        game.board.addMove(3, 'x');
        game.board.addMove(1, 'o');
        expect(game.board.singlePlayerLinesForPlayer('x', 1)).toEqual([[0, 4, 8], [0, 3, 6], [3, 4, 5], [6, 7, 8]]);
        expect(game.board.singlePlayerLinesForPlayer('x', 2)).toEqual([]);
      });
      it('given the moves, for player "o" it returns correct lines when asking for 2 or 1 moves in a line', function(){
        game.board.addMove(8, 'x');
        game.board.addMove(2, 'o');
        game.board.addMove(3, 'x');
        game.board.addMove(1, 'o');
        expect(game.board.singlePlayerLinesForPlayer('o', 1)).toEqual([[2, 4, 6], [1, 4, 7]]);
        expect(game.board.singlePlayerLinesForPlayer('o', 2)).toEqual([[0, 1, 2]]);
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
      expect(board.adjacentPositions(1)).toEqual([0, 2]);
      expect(board.adjacentPositions(2)).toEqual([1, 5]);
      expect(board.adjacentPositions(3)).toEqual([0, 6]);
      expect(board.adjacentPositions(6)).toEqual([3, 7]);
      expect(board.adjacentPositions(7)).toEqual([6, 8]);
    });
  });

  describe('#positionOfMove', function(){
    it('returns the integer representing position', function(){
      expect(board.positionOfMove({0: 'x'})).toEqual(0);
      expect(board.positionOfMove({4: 'x'})).toEqual(4);
    });
  });

  describe('#corners', function(){
    it('out of all possible positions always returns [0, 2, 6, 8] for 3x3 grid', function(){
      expect(board.corners(board.possiblePositions)).toEqual([0, 2, 6, 8]);
    });
  });
  describe('#center', function(){
    it('always returns 4 for 3x3 grid', function(){
      expect(board.center()).toEqual(4);
    });
  });

});

// ================================================
// GAME:
// ================================================


describe('Game', function(){
  var game;
  beforeEach(function(){
    game = new JSTicTacToe.Game('human');
  });

  it('has an empty board at the start', function(){
    expect(game.board).not.toBeUndefined();
    expect(game.board.moves).toEqual({});
  });

  describe('#addToBoard', function(){
    it('adds moves to the board', function(){
      game.addToBoard(0, 'x');
      expect(game.board.moves).toEqual({0: 'x'})
    });
  });

  describe('#winningMark', function(){
    describe('context: human won on a ...', function(){
      describe('fist diagonal', function(){
        it('returns x mark', function(){
          game.addToBoard(0, 'x');
          game.addToBoard(6, 'o');
          game.addToBoard(4, 'x');
          game.addToBoard(5, 'o');
          game.addToBoard(8, 'x');
          // expect(game.isWon()).toBe(true);
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
          // expect(game.isWon()).toBe(true);
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
          // expect(game.isWon()).toBe(true);
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
          // expect(game.isWon()).toBe(true);
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
          // expect(game.isWon()).toBe(true);
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
          // expect(game.isWon()).toBe(true);
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
          // expect(game.isWon()).toBe(true);
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
          // expect(game.isWon()).toBe(true);
          expect(game.winnerMark()).toEqual('o')
        });
      });
    });

    describe('context: no one won', function(){
      it('returns false', function(){
        game.addToBoard(2, 'x');
        game.addToBoard(3, 'o');
        game.addToBoard(1, 'x');
        // expect(game.isWon()).toBe(false)
        expect(game.winnerMark()).toBeUndefined();
      });

      it('returns false', function(){
        game.addToBoard(3, 'x');
        game.addToBoard(0, 'o');
        game.addToBoard(4, 'x');
        // expect(game.isWon()).toBe(false)
        expect(game.winnerMark()).toBeUndefined();
      });

      it('returns false', function(){
        game.addToBoard(6, 'x');
        game.addToBoard(0, 'o');
        game.addToBoard(8, 'x');
        // expect(game.isWon()).toBe(false)
        expect(game.winnerMark()).toBeUndefined();
      });

      it('returns false', function(){
        game.addToBoard(0, 'x');
        game.addToBoard(1, 'o');
        game.addToBoard(3, 'x');
        // expect(game.isWon()).toBe(false)
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

// ================================================
// AI-PLAYER:
// ================================================
describe('AIPlayer', function(){
  var game;
  beforeEach(function(){
    game = new JSTicTacToe.Game('human');
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
      it('returns false', function(){
        game.addToBoard(0, 'x');
        game.addToBoard(2, 'o');
        game.addToBoard(5, 'x');
        expect(game.ai.winningPosition(game)).toBe(false);
      });

      it('returns false', function(){
        game.addToBoard(0, 'x');
        game.addToBoard(2, 'o');
        game.addToBoard(4, 'x');
        expect(game.ai.winningPosition(game)).toBe(false);
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
      it('returns false', function(){
        game.addToBoard(0, 'x');
        game.addToBoard(2, 'o');
        game.addToBoard(5, 'x');
        expect(game.ai.threatPosition()).toBe(false);
      });
      it('returns false', function(){
        game.addToBoard(0, 'x');
        game.addToBoard(4, 'o');
        game.addToBoard(5, 'x');
        expect(game.ai.threatPosition()).toBe(false);
      });
    });
  });

  describe('#firstPlayerStrategy', function(){

  });

});