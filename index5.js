window.onload = function () {
  var table = document.querySelector('.table');
  var a = 10;
  var letter = ['','a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', ''];
  var whiteFigure = ['&#9812;', '&#9813;', '&#9814;', '&#9815;', '&#9816;', '&#9817;' ];
  var blackFigure = ['&#9818;', '&#9819;', '&#9820;', '&#9821;', '&#9822;', '&#9823;' ];

  for( let i = 0; i < a; i++){
    var row = document.createElement('div');

    for( let j = 0; j < a; j++){
      var col = document.createElement('div');
      row.appendChild(col);
    }




    table.appendChild(row);


  }







 /*
 ♔ &#9812;
 ♕ &#9813;
 ♖ &#9814;
 ♗ &#9815;
 ♘ &#9816;
 ♙ &#9817;

 ♚ &#9818;
 ♛ &#9819;
 ♜ &#9820;
 ♝ &#9821;
 ♞ &#9822;
 ♟ &#9823;

 */





}