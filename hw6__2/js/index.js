$("#slider").rangeSlider({bounds: {min: 52, max: 400}, defaultValues: {min: 80, max: 200}});

window.onload = init;


function init() {
  var items = document.getElementsByClassName('result__item');
  for (var i = 0; i < items.length; i++) {
    var item = items[i];



    item.addEventListener('click', addToCard);
  }
};
  function addToCard() {
    //создание элементов

    var card = document.querySelector('.purchase__list');
    var cardItem = document.createElement('div');
    var cardItemImg = document.createElement('div');
    var cardItemInfo = document.createElement('div');
    var cardItemText = document.createElement('p');
    var cardItemPrice = document.createElement('p');
    var cardItemClose = document.querySelector('.purchase__delite').cloneNode(true);



    var imgSrc = this.querySelector('img').getAttribute('src');

//размещение классов и нужных отсылок
    cardItem.className = 'purchase__item';
    cardItemImg.className = 'purchase__img';

    cardItemImg.style.backgroundImage = 'url(' + imgSrc + ')';
    cardItemInfo.className = 'purchase__info';
    cardItemText.innerText = document.querySelector('.result__text a span').innerText;
    cardItemPrice.className = 'purchase__info';
    cardItemPrice.innerText = document.querySelector('.result__price').innerText;

    console.log(cardItemImg.style.backgroundImage);

//размещение элементов в DOM
    cardItem.appendChild(cardItemImg);
    cardItem.appendChild(cardItemInfo);
    cardItemInfo.appendChild(cardItemText);
    cardItem.appendChild(cardItemPrice);
    cardItem.appendChild(cardItemClose);
    card.insertBefore(cardItem, card.firstChild);

//удаление элемента
    cardItemClose.addEventListener('click', delCardItem)






};
