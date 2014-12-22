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
    it('returns only unoccupied positions on the board', function(){
      board.addMove(5, 'x');
      board.addMove(7, 'o');
      board.addMove(0, 'x');
      board.addMove(4, 'o');
      expect(board.available()).toEqual([1, 2, 3, 6, 8]);
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