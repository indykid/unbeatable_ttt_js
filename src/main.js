var JSTicTacToe = JSTicTacToe || {};



$(function(){

  var grid = $('table'),
      cells = $('td'),
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
  });

  cells.on('click', function(){
    // check turn
    // register the move
    // comp play
  });

});

// JSTicTacToe.getMarks = function()