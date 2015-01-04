var JSTicTacToe = JSTicTacToe || {};



$(function(){

// ================================================
// DOM ELEMENTS:
// ================================================

  JSTicTacToe.grid = $('#grid');
  JSTicTacToe.emptyGridPositions = $('td:not(.occupied)');
  JSTicTacToe.newGameButton = $('#newGame');
  JSTicTacToe.selectPlayer = $('#selectPlayer');
  JSTicTacToe.firstPlayer = $('.firstPlayer');
  JSTicTacToe.notice = $('#notice');
  JSTicTacToe.gameStatus = $('#gameStatus');
  JSTicTacToe.status = $('#status');
  JSTicTacToe.winner = $('#winner');
  


// ================================================
// VISUAL SETUP:
// ================================================

  JSTicTacToe.grid.hide();
  JSTicTacToe.newGameButton.hide();
  JSTicTacToe.notice.hide();
  JSTicTacToe.gameStatus.hide();



// ================================================
// EVENT LISTENERS:
// ================================================

  JSTicTacToe.firstPlayer.on('click', function(){
    var firstPlayer = $(this).data('player');
    // console.log(firstPlayer)
    JSTicTacToe.selectPlayer.hide();
    JSTicTacToe.game = new JSTicTacToe.Game(firstPlayer);
    // JSTicTacToe.game.checkAndUpdateGameState();
    JSTicTacToe.game.updateUI();
    JSTicTacToe.grid.show();
    JSTicTacToe.gameStatus.show();
    JSTicTacToe.newGameButton.show();

    if (firstPlayer == 'ai'){
      JSTicTacToe.game.ai.play();
    } //REVIEW: not sure this check belongs here or better on game initialization within game...
  });

  JSTicTacToe.emptyGridPositions.on('click', function(){

    if (JSTicTacToe.game.isActive()){ 

      var position = $(this).data('position');      
      if (JSTicTacToe.game.board.isPositionEmpty(position)){  
        JSTicTacToe.game.humanPlay(position);
      } else {
        alert('this cell is occupied, please try another one');
      }

    } else {
      alert('game over');
    }
    
    // REVIEW: not sure game active check belongs here or better within the humanPlay itself...
    
    
  });

});





