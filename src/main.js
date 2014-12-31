var JSTicTacToe = JSTicTacToe || {};



$(function(){

// ================================================
// VARIABLES:
// ================================================


  var grid = $('table'),
      gridPositions = $('td'),
      newGameButton = $('#newGame'),
      form = $('#firstPlayerForm'),
      game;


// ================================================
// VISUALS:
// ================================================

  grid.hide();
  newGameButton.hide();


// ================================================
// EVENT LISTENERS:
// ================================================

  form.on('submit', function(e){
    e.preventDefault();
    var firstPlayer = $('input[name=firstPlay]:checked').val();
    form.hide();
    grid.show();
    newGameButton.show();
    game = new JSTicTacToe.Game(firstPlayer);
    if (firstPlayer == 'ai'){
      game.ai.play();
    }
  });

  gridPositions.on('click', function(){
    position = $(this).data('position');
    game.humanPlay(position);
  });

});





