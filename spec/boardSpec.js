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

  describe('#taken', function(){
    it('returns only occupied positions', function(){
      board.addMove(5, 'x');
      board.addMove(7, 'o');
      board.addMove(0, 'x');
      board.addMove(4, 'o');
      expect(board.taken()).toEqual([0, 4, 5, 7]);
    });
    it('returns only occupied positions', function(){
      board.addMove(6, 'x');
      board.addMove(3, 'o');
      board.addMove(0, 'x');
      board.addMove(2, 'o');
      expect(board.taken()).toEqual([0, 2, 3, 6]);
    });
  });

  describe('#playerMoves', function(){
    it('returns moves for a given player', function(){
      board.addMove(5, 'x');
      board.addMove(7, 'o');
      board.addMove(0, 'x');
      board.addMove(4, 'o');
      expect(board.playerMoves('x')).toEqual([0, 5]);
      expect(board.playerMoves('o')).toEqual([4, 7]);

    });
  });

  describe('#cellType', function(){
    it('returns "corner" cell type if corner is played', function(){
      expect(board.cellType(1)).toEqual('corner')
    });

    it('returns "center" cell type if center is played', function(){
      expect(board.cellType(4)).toEqual('center');
    });

    it('returns "edge" cell type if edge is played', function(){
      expect(board.cellType(2)).toEqual('edge');
    });
  });
});

describe('Game', function(){
  var game;
  beforeEach(function(){
    game = new JSTicTacToe.Game();
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

  describe('#won', function(){
    describe('context: human won on a ...', function(){
      describe('fist diagonal', function(){
        it('returns true', function(){
          game.addToBoard(0, 'x');
          game.addToBoard(6, 'o');
          game.addToBoard(4, 'x');
          game.addToBoard(5, 'o');
          game.addToBoard(8, 'x');
          expect(game.isWon()).toBe(true);
        });
      });
      describe('second diagonal', function(){
        it('returns true', function(){
          game.addToBoard(2, 'x');
          game.addToBoard(3, 'o');
          game.addToBoard(4, 'x');
          game.addToBoard(5, 'o');
          game.addToBoard(6, 'x');
          expect(game.isWon()).toBe(true);
        });
      });
      describe('row', function(){
        it('returns true', function(){
          game.addToBoard(0, 'x');
          game.addToBoard(4, 'o');
          game.addToBoard(1, 'x');
          game.addToBoard(5, 'o');
          game.addToBoard(2, 'x');
          expect(game.isWon()).toBe(true);
        });
      });
      describe('column', function(){
        it('returns true', function(){
          game.addToBoard(0, 'x');
          game.addToBoard(4, 'o');
          game.addToBoard(3, 'x');
          game.addToBoard(5, 'o');
          game.addToBoard(6, 'x');
          expect(game.isWon()).toBe(true);
        });
      });
    });

    describe('context: AI won on a ...', function(){
      describe('first diagonal', function(){
        it('returns true', function(){
          game.addToBoard(6, 'x');
          game.addToBoard(0, 'o');
          game.addToBoard(5, 'x');
          game.addToBoard(4, 'o');
          game.addToBoard(1, 'x');
          game.addToBoard(8, 'o');
          expect(game.isWon()).toBe(true);
        });
      });
      describe('second diagonal', function(){
        it('returns true', function(){
          game.addToBoard(3, 'x');
          game.addToBoard(2, 'o');
          game.addToBoard(5, 'x');
          game.addToBoard(4, 'o');
          game.addToBoard(7, 'x');
          game.addToBoard(6, 'o');
          expect(game.isWon()).toBe(true);
        });
      });
      describe('row', function(){
        it('returns true', function(){
          game.addToBoard(4, 'x');
          game.addToBoard(0, 'o');
          game.addToBoard(5, 'x');
          game.addToBoard(1, 'o');
          game.addToBoard(7, 'x');
          game.addToBoard(2, 'o');
          expect(game.isWon()).toBe(true);
        });
      });
      describe('column', function(){
        it('returns true', function(){
          game.addToBoard(4, 'x');
          game.addToBoard(0, 'o');
          game.addToBoard(5, 'x');
          game.addToBoard(3, 'o');
          game.addToBoard(7, 'x');
          game.addToBoard(6, 'o');
          expect(game.isWon()).toBe(true);
        });
      });
    });

    describe('context: no one won', function(){
      it('returns false', function(){
        game.addToBoard(2, 'x');
        game.addToBoard(3, 'o');
        game.addToBoard(1, 'x');
        expect(game.isWon()).toBe(false);
      });

      it('returns false', function(){
        game.addToBoard(3, 'x');
        game.addToBoard(0, 'o');
        game.addToBoard(4, 'x');
        expect(game.isWon()).toBe(false);
      });

      it('returns false', function(){
        game.addToBoard(6, 'x');
        game.addToBoard(0, 'o');
        game.addToBoard(8, 'x');
        expect(game.isWon()).toBe(false);
      });

      it('returns false', function(){
        game.addToBoard(0, 'x');
        game.addToBoard(1, 'o');
        game.addToBoard(3, 'x');
        expect(game.isWon()).toBe(false);
      });
    });
  });

  describe('#isFinished', function(){
    describe('context: game is not won and still has available moves', function(){
      it('returns false', function(){
        game.addToBoard(0, 'x');
        game.addToBoard(1, 'o');
        expect(game.isFinished()).toBe(false)
      });
      it('returns false', function(){
        game.addToBoard(0, 'x');
        game.addToBoard(1, 'o');
        game.addToBoard(5, 'x');
        game.addToBoard(3, 'o');
        game.addToBoard(6, 'x');
        game.addToBoard(7, 'o');
        expect(game.isFinished()).toBe(false)
      });
    });
    describe('context: game is won and still has available moves', function(){
      it('returns true', function(){
        game.addToBoard(0, 'x');
        game.addToBoard(1, 'o');
        game.addToBoard(4, 'x');
        game.addToBoard(2, 'o');
        game.addToBoard(8, 'x');
        expect(game.isFinished()).toBe(true)
      });
    });
    describe('context: game is not won, but no available moves', function(){
      it('returns true', function(){
        game.addToBoard(0, 'x');
        game.addToBoard(4, 'o');
        game.addToBoard(8, 'x');
        game.addToBoard(5, 'o');
        game.addToBoard(3, 'x');
        game.addToBoard(6, 'o');
        game.addToBoard(2, 'x');
        game.addToBoard(1, 'o');
        game.addToBoard(7, 'x');
        expect(game.isFinished()).toBe(true);
      });
    });
  });

  
});