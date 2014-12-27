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
    })
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

describe('AIPlayer', function(){
  var game;
  beforeEach(function(){
    game = new JSTicTacToe.Game();
  });

  it('has been assigned a mark', function(){
    expect(game.ai.mark).toBeDefined();
  });

  it("knows opponent's mark", function(){
    expect(game.ai.opponentMark).toBeDefined();
  });

  describe('#winningMove', function(){
    describe('context: there is a potential win on a:', function(){
      it('row, returns a winning position 3', function(){
        game.addToBoard(0, 'x');
        game.addToBoard(4, 'o');
        game.addToBoard(8, 'x');
        game.addToBoard(5, 'o');
        game.addToBoard(7, 'x');
        expect(game.ai.winningMove(game)).toEqual(3);
      });

      it('first diagonal, returns a winning position 4', function(){
        game.addToBoard(6, 'x');
        game.addToBoard(0, 'o');
        game.addToBoard(3, 'x');
        game.addToBoard(8, 'o');
        game.addToBoard(2, 'x');
        expect(game.ai.winningMove(game)).toEqual(4);
      });

      it('first diagonal, returns a winning position 0', function(){
        game.addToBoard(6, 'x');
        game.addToBoard(4, 'o');
        game.addToBoard(3, 'x');
        game.addToBoard(8, 'o');
        game.addToBoard(2, 'x');
        expect(game.ai.winningMove(game)).toEqual(0);
      });

      it('second diagonal, returns a winning position 2', function(){
        game.addToBoard(0, 'x');
        game.addToBoard(4, 'o');
        game.addToBoard(1, 'x');
        game.addToBoard(6, 'o');
        game.addToBoard(8, 'x');
        expect(game.ai.winningMove(game)).toEqual(2);
      });

      it('column, returns a winning position 3', function(){
        game.addToBoard(0, 'x');
        game.addToBoard(2, 'o');
        game.addToBoard(4, 'x');
        game.addToBoard(8, 'o');
        game.addToBoard(6, 'x');
        expect(game.ai.winningMove(game)).toEqual(5);
      });
      
    });

    describe('context: no winning move', function(){
      it('returns false', function(){
        game.addToBoard(0, 'x');
        game.addToBoard(2, 'o');
        game.addToBoard(5, 'x');
        expect(game.ai.winningMove(game)).toBe(false);
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
  });

  // describe('#basicStrategy', function(){
  //   describe('allows', function(){

  //   });
  // });
});