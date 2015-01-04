var JSTicTacToe = JSTicTacToe || {};



$(function(){

// ================================================
// VARIABLES:
// ================================================


  var grid = $('#grid'),
      emptyGridPositions = $('td:not(.occupied)'),
      newGameButton = $('#newGame'),
      form = $('#firstPlayerForm'),
      selectPlayer = $('#selectPlayer'),
      firstPlayer = $('.firstPlayer'),
      notice = $('#notice'),
      gameStatus = $('#gameStatus'),
      game;


// ================================================
// VISUALS:
// ================================================

  grid.hide();
  newGameButton.hide();
  notice.hide();
  gameStatus.hide();



// ================================================
// EVENT LISTENERS:
// ================================================

  firstPlayer.on('click', function(){
    var firstPlayer = $(this).data('player');
    console.log(firstPlayer);
    selectPlayer.hide();
    game = new JSTicTacToe.Game(firstPlayer);
    game.checkAndUpdateGameState();
    game.updateUI();
    grid.show();
    gameStatus.show();
    newGameButton.show();
    if (firstPlayer == 'ai'){
      game.ai.play();
    } // not sure this check belongs here or better on game initialization within game...
  });

  // form.on('submit', function(e){
  //   e.preventDefault();
  //   var firstPlayer = $('input[name=firstPlay]:checked').val();
  //   form.hide();
  //   game = new JSTicTacToe.Game(firstPlayer);
  //   game.checkAndUpdateGameState();
  //   game.updateUI();
  //   grid.show();
  //   gameStatus.show();
  //   newGameButton.show();
  //   if (firstPlayer == 'ai'){
  //     game.ai.play();
  //   } // not sure this check belongs here or better on game initialization within game...
  // });

  emptyGridPositions.on('click', function(){

    if (game.isActive()){ 

      var position = $(this).data('position');      
      if (game.board.isPositionEmpty(position)){  
        game.humanPlay(position);
        // $(this).addClass('occupied');
      } else {
        alert('this cell is occupied, please try another one');
      }

    } else {
      alert('game over');
    }
    
    // not sure game active check belongs here or better within the humanPlay itself...
    
    
  });

});





