window.onload = function () {
  var table = document.querySelector('.table');
  var a = 9;
  var letter = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'i', 'f'];
  var whiteFigure = ['&#9812;', '&#9813;', '&#9814;', '&#9815;', '&#9816;', '&#9817;' ];
  var blackFigure = ['&#9818;', '&#9819;', '&#9820;', '&#9821;', '&#9822;', '&#9823;' ];
  for( let i = 0; i < a * a; i++){
    var item = document.createElement('div');
    isBlackOrWhite(item, i);
    isNum(item, i);
    isLetter(item, i);
    if( i> a && i<a*3 && i != a*2) {
      whichFigure(item, a);
    }
    table.appendChild(item);


  }
  function isBlackOrWhite(el, i) {
    if(i%2 != 0){
     return el.classList.add('black');
    }
    else{
      return el.classList.add('white');
    }

  }
  function isNum(el, i) {
    if(i < 9){
      if(i !=0){
        return[
          el.innerText = i,
          el.classList.add('num')
        ]
      }

    }
  }
  function isLetter(el, i) {
    if(i%9 != 0){
      return
    }
    else if(i != 0){

      for(let j = 0; j < letter.length; j++){
        el.innerText = letter[j];
        return[
          el.innerText = letter[j],
          el.classList.add('letter')
        ]
      }
    }
    
  }
  function whichFigure(el, a) {
    for (let j = 0; j < whiteFigure.length; j++) {
      return el.innerText = whiteFigure[j];
    }
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