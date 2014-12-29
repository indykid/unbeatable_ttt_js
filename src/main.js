var JSTicTacToe = JSTicTacToe || {};



$(function(){

  var grid = $('table'),
      positions = $('td'),
      newGameButton = $('#newGame'),
      form = $('#firstPlayerForm'),
      game;

  grid.hide();
  newGameButton.hide();
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

  positions.on('click', function(){
    // check turn
    // register the move
    // comp play
    
    position = $(this).data('position');
    // console.log('human played', position);
    game.humanPlay(position);
  });

});
