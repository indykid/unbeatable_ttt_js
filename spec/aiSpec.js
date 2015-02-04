"use strict";

var JSTicTacToe = JSTicTacToe || {};

define(["../src/board", "../src/game", "../src/ai"], function(Board, Game, AIPlayer) { 

  JSTicTacToe.Board = Board;
  JSTicTacToe.AIPlayer = AIPlayer;
  JSTicTacToe.Game = Game;

  describe('AIPlayer', function(){
    var game,
        board,
        ai;

    beforeEach(function(){
      game = new Game('human');
      ai = game.ai;
      board = ai.board;
    });

    it('has been assigned a mark', function(){
      expect(ai.mark).toBeDefined();
    });

    it("knows opponent's mark", function(){
      expect(ai.humansMark).toBeDefined();
    });

    describe('#winningPosition', function(){
      describe('context: there is a potential win on a:', function(){
        it('row, returns a winning position', function(){
          game.addToBoard(0, 'x');
          game.addToBoard(4, 'o');
          game.addToBoard(8, 'x');
          game.addToBoard(5, 'o');
          game.addToBoard(7, 'x');
          expect(ai.winningPosition(game)).toEqual(3);
        });

        it('first diagonal, returns a winning position', function(){
          game.addToBoard(6, 'x');
          game.addToBoard(4, 'o');
          game.addToBoard(3, 'x');
          game.addToBoard(8, 'o');
          game.addToBoard(2, 'x');
          expect(ai.winningPosition(game)).toEqual(0);
        });

        it('second diagonal, returns a winning position', function(){
          game.addToBoard(0, 'x');
          game.addToBoard(4, 'o');
          game.addToBoard(1, 'x');
          game.addToBoard(6, 'o');
          game.addToBoard(8, 'x');
          expect(ai.winningPosition(game)).toEqual(2);
        });

        it('column, returns a winning position', function(){
          game.addToBoard(0, 'x');
          game.addToBoard(2, 'o');
          game.addToBoard(4, 'x');
          game.addToBoard(8, 'o');
          game.addToBoard(6, 'x');
          expect(ai.winningPosition(game)).toEqual(5);
        });
        
      });

      describe('context: no winning move', function(){
        it('returns undefined', function(){
          game.addToBoard(0, 'x');
          game.addToBoard(2, 'o');
          game.addToBoard(5, 'x');
          expect(ai.winningPosition(game)).toBeUndefined();
        });

        it('returns undefined', function(){
          game.addToBoard(0, 'x');
          game.addToBoard(2, 'o');
          game.addToBoard(4, 'x');
          expect(ai.winningPosition(game)).toBeUndefined();
        });

      });
    });

    describe('#threatPosition', function(){
      describe('context: there is a threat on a:', function(){
        it('first diagonal, returns threat position', function(){
          game.addToBoard(4, 'x');
          game.addToBoard(6, 'o');
          game.addToBoard(8, 'x');
          expect(ai.threatPosition(game)).toEqual(0);
        });

        it('second diagonal, returns threat position', function(){
          game.addToBoard(2, 'x');
          game.addToBoard(4, 'o');
          game.addToBoard(8, 'x');
          expect(ai.threatPosition(game)).toEqual(5);
        });

        it('row, returns threat position', function(){
          game.addToBoard(0, 'x');
          game.addToBoard(4, 'o');
          game.addToBoard(1, 'x');
          expect(ai.threatPosition(game)).toEqual(2);
        });

        it('column, returns threat position', function(){
          game.addToBoard(4, 'x');
          game.addToBoard(5, 'o');
          game.addToBoard(7, 'x');
          expect(ai.threatPosition(game)).toEqual(1);
        });

        // it('column, returns threat position 2', function(){
        //   game.addToBoard(5, 'x');
        //   game.addToBoard(4, 'o');
        //   game.addToBoard(8, 'x');
        //   expect(ai.threatPosition(game)).toEqual(2);
        // });
      });

      describe('context: no threat', function(){
        it('returns undefined', function(){
          game.addToBoard(0, 'x');
          game.addToBoard(2, 'o');
          game.addToBoard(5, 'x');
          expect(ai.threatPosition()).toBeUndefined();
        });
        // it('returns undefined', function(){
        //   game.addToBoard(0, 'x');
        //   game.addToBoard(4, 'o');
        //   game.addToBoard(5, 'x');
        //   expect(ai.threatPosition()).toBeUndefined();
        // });
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
          game = new JSTicTacToe.Game('ai');
          ai = game.ai;
          ai._findStrategy();
          expect(ai.strategy).toEqual('firstPlayer');
        });
      });
    });// not entirely sure about usefullness of this test

    describe('_firstPlayerStrategy', function(){
      beforeEach(function(){
        game = new Game('ai');
        ai = game.ai;
        board = ai.board;
      });

      describe('context: first move', function(){
        it('returns corner or center position', function(){
          var position = ai._firstPlayerStrategy();
          expect(['corner', 'center']).toContain(ai.board.positionType(position));
        });
      });

      describe('context: second move', function(){
       
        describe('context: ai played corner, human played center', function(){
          it('returns corner on the same diagonal as existing moves', function(){
            game.addToBoard(2, 'x');
            game.addToBoard(4, 'o');
            expect(ai._firstPlayerStrategy()).toEqual(6);
          });
        });

        describe('context: ai played center, human played corner', function(){
          it('returns corner on the same diagonal as existing moves', function(){
            game.addToBoard(4, 'x');
            game.addToBoard(6, 'o');
            expect(ai._firstPlayerStrategy()).toEqual(2);
          });
        });

        describe('context: human played edge', function(){
          describe('context: first move was center', function(){
            it('returns any available corner position', function(){
              board.addMove(4, 'x');
              board.addMove(1, 'o');
              expect([0, 2, 6, 8]).toContain(ai._firstPlayerStrategy());
            });
          });
          describe('context: first move was corner', function(){
            it("returns play corner away from human's last move", function(){
              board.addMove(2, 'x');
              board.addMove(1, 'o');
              expect(ai._firstPlayerStrategy()).toEqual(8);
            });
          });
        });

        // 
      });

      describe('context: third move', function(){
        describe('context: human never played center', function(){
          it('returns a position that creates a fork', function(){
            game.addToBoard(0, 'x');
            game.addToBoard(1, 'o');
            game.addToBoard(6, 'x');
            game.addToBoard(3, 'o');
            expect([4, 8]).toContain(ai._firstPlayerStrategy());
          });
        });
      });
    });

    describe('_secondPlayerStrategy', function(){

      describe('context: first move', function(){
        describe('context: center is available', function(){
          describe('human played edge', function(){
            it('returns center', function(){
              board.addMove(1,'x');
              expect(ai._secondPlayerStrategy()).toEqual(4);
            });
          });
          describe('human played corner', function(){
            it('returns center', function(){
              board.addMove(2,'x');
              expect(ai._secondPlayerStrategy()).toEqual(4);
            });
          });
          
        });
        describe('context: center is unavailable', function(){
          it('returns random corner', function(){
            board.addMove(4, 'x');
            expect([0, 2, 6, 8]).toContain(ai._secondPlayerStrategy());
          });
        });
      });

      describe('context: second move', function(){

        describe("context: human's first move was center", function(){
          it('returns random open corner', function(){
            board.addMove(4, 'x');
            board.addMove(2, 'o');
            board.addMove(6, 'o');
            expect([0, 8]).toContain(ai._secondPlayerStrategy());
          });
        });

        describe("context: human's first move was corner", function(){
          describe('context: taken moves form a full line', function(){
            it('returns a random edge', function(){
              board.addMove(2, 'x');
              board.addMove(4, 'o');
              board.addMove(6, 'x');
              expect([1, 3, 5, 7]).toContain(ai._secondPlayerStrategy());
            });
          });
          describe("human's second move is an edge, on the side away from human's first", function(){
            it("returns a corner on the same side as human's move", function(){
              board.addMove(2, 'x');
              board.addMove(4, 'o');
              board.addMove(7, 'x');
              expect(ai._secondPlayerStrategy()).toEqual(8);
            });
          });
        });

        describe("context: human's first move was edge", function(){
          describe('context: taken moves form a full line', function(){
            it('returns random open corner', function(){
              board.addMove(1, 'x');
              board.addMove(4, 'o');
              board.addMove(7, 'x');
              expect([0, 2, 6, 8]).toContain(ai._secondPlayerStrategy());
            });
          });

          describe('context: human played non-opposite edge', function(){
            it("returns a corner position between human's moves", function(){
              board.addMove(5, 'x');
              board.addMove(4, 'o');
              board.addMove(7, 'x');
              expect(ai._secondPlayerStrategy()).toEqual(8);
            });
          });

          describe('context: human played non-adjacent corner to their first move', function(){
            it("returns a corner position between human's moves", function(){
              board.addMove(5, 'x');
              board.addMove(4, 'o');
              board.addMove(6, 'x');
              expect(ai._secondPlayerStrategy()).toEqual(8);
            });
          });
        });
      });
    });






    // describe('#findPosition', function(){

    //   it('returns a winning position, if there is one', function(){
        
    //   });

    //   it('returns a threat position, if there is no winning position', function(){
        
    //   });

    //   it('returns strategic position, if no win or threat', function(){

    //   });

    //   it('falls back to basic strategy if no win, no threat and no strategic position available', function(){

    //   });
    // });

    // describe('#_pickAIStrategy', function(){
    //   describe('context: ai plays first', function(){
    //     it('assigns strategy correctly', function(){
    //       game.addToBoard(0, 'x');
    //     });
    //   });
    // });

    // describe('#play', function(){

    // });
  });
});