"use strict";

var JSTicTacToe = JSTicTacToe || {};

define(["../src/board", "../src/game", "../src/ai"], function(Board, Game, AIPlayer) { 

  JSTicTacToe.Board = Board;
  JSTicTacToe.AIPlayer = AIPlayer;
  JSTicTacToe.Game = Game;

  describe('AIPlayer', function(){
    var game,
        ai;

    beforeEach(function(){
      game = new Game('human');
      ai = game.ai;
    });

    it('has been assigned a mark', function(){
      expect(ai.mark).toBeDefined();
    });

    it("knows opponent's mark", function(){
      expect(ai.opponentMark).toBeDefined();
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

    // describe('#_pickAIStrategy', function(){
    //   describe('context: ai plays first', function(){
    //     it('assigns strategy correctly', function(){
    //       game.addToBoard(0, 'x');
    //     });
    //   });
    // });

    // describe('#play', function(){

    // });

    describe('#strategicPosition', function(){
      // AI plays first
      describe('context: ai playing first', function(){
        beforeEach(function(){
          game = new Game('ai');
          ai = game.ai;
        });

        describe('context: first move for ai', function(){
          it('returns corner or center position', function(){
            var position = ai.strategicPosition();
            expect(['corner', 'center']).toContain(ai.game.board.positionType(position));
          });
        });

        describe('context: first move was corner', function(){
          describe('context: looking for second move', function(){
            describe('context: human played center', function(){
              it('returns position opposite to first move', function(){
                game.addToBoard(2, 'x');
                game.addToBoard(4, 'o');
                expect(ai.strategicPosition()).toEqual(6);
              });
            });

            describe('context: human played corner', function(){
              it("returns corner which is on the opposite side symmetrically from human's move", function(){
                game.addToBoard(8, 'x');
                game.addToBoard(6, 'o');//corner
                expect(ai.strategicPosition()).toEqual(2);
              });
            });

            describe('context: human played edge', function(){
              it("returns corner which is on the opposite side symmetrically from human's move", function(){
                game.addToBoard(2, 'x');
                game.addToBoard(1, 'o');//edge
                expect(ai.strategicPosition()).toEqual(8);
              });
            });
          });

          describe('context: looking for third move', function(){
            describe('context: human never played center', function(){
              it('returns a position that creates a fork', function(){
                game.addToBoard(0, 'x');
                game.addToBoard(1, 'o');
                game.addToBoard(6, 'x');
                game.addToBoard(3, 'o');
                expect([4, 8]).toContain(ai.strategicPosition());
              });
            });
          });
        });

        describe('context: first move was center', function(){
          describe('context: looking for a second move', function(){
            describe('context: human played corner', function(){
              it("returns position opposite to human's last", function(){
                game.addToBoard(4, 'x');
                game.addToBoard(6, 'o');
                expect(ai.strategicPosition()).toEqual(2);
              });
            });
            describe('context: human played edge', function(){
              it('returns any available corner', function(){
                game.addToBoard(4, 'x');
                game.addToBoard(1, 'o');
                expect([0, 2, 6, 8]).toContain(ai.strategicPosition());
              });
            });
          });

          describe('context: looking for a third move', function(){
            describe('context: human never created a threat', function(){
              it('returns a position that creates a fork', function(){
                game.addToBoard(4, 'x');
                game.addToBoard(6, 'o');
                game.addToBoard(2, 'x');
                game.addToBoard(5, 'o');
                expect([0, 1]).toContain(ai.strategicPosition());
              });
            });
          });
        });    
      });


      
      //   describe('context: ', function(){
          
      //   });

      // describe('context: third move for ai', function(){
      //   describe('context: ', function(){
          
      //   });
      // });
    });
  });
});