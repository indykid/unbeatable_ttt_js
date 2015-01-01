var JSTicTacToe = JSTicTacToe || {};



$(function(){

// ================================================
// VARIABLES:
// ================================================


  var grid = $('#grid'),
      gridPositions = $('td'),
      newGameButton = $('#newGame'),
      form = $('#firstPlayerForm'),
      notice = $('#notice'),
      game;


// ================================================
// VISUALS:
// ================================================

  grid.hide();
  newGameButton.hide();
  notice.hide();


// ================================================
// EVENT LISTENERS:
// ================================================

  form.on('submit', function(e){
    e.preventDefault();
    var firstPlayer = $('input[name=firstPlay]:checked').val();
    form.hide();
    game = new JSTicTacToe.Game(firstPlayer);
    game.checkAndUpdateGameState();
    game.updateUI();
    grid.show();
    newGameButton.show();
    if (firstPlayer == 'ai'){
      game.ai.play();
    } // not sure this check belongs here or better on game initialization within game...
  });

  gridPositions.on('click', function(){

    if (game.isActive()){ 

      var position = $(this).data('position');      
      if (this.board.isPositionEmpty(position)){  
        game.humanPlay(position);
      } else {
        alert('this cell is occupied, please try another one');
      }

    } else {
      alert('game over');
    }
    
    // not sure game active check belongs here or better within the humanPlay itself...
    
    
  });

});





