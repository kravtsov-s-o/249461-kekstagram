'use strict';

(function () {
  var AVATAR_SIZE = '35'; // размер аватара

  var MAX_SLIDER_VALUE = 100; // размер в 100%;

  var photoListElement = document.querySelector('.pictures');
  var templatePhotoSomeUser = document.querySelector('#picture').content;

  // функция рендера поста с фотографией
  function renderPhoto(generatePhoto, number) {
    var photoElement = templatePhotoSomeUser.cloneNode(true);

    var picture = photoElement.querySelector('.picture');
    picture.dataset.id = number;

    photoElement.querySelector('.picture__img').src = generatePhoto.url;
    photoElement.querySelector('.picture__comments').textContent = generatePhoto.comments.length;
    photoElement.querySelector('.picture__likes').textContent = generatePhoto.likes;

    return photoElement;
  }

  window.loadData(function (photos) {
    // создание фрагмента с постами передвставкой на страницу
    var fragment = document.createDocumentFragment();
    for (var j = 0; j < photos.length; j++) {
      fragment.appendChild(renderPhoto(photos[j], j));
    }

    // вставка фрагмента с постами на страницу
    photoListElement.appendChild(fragment);

    window.photosList = photos;
  }, function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 100px auto; text-align: center; min-height: 45px; background-color: #3c3614;';
    node.style.position = 'absolute';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '40px';
    node.style.lineHeight = '40px';

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);
  });

  window.gallery = {
    AVATAR_SIZE: AVATAR_SIZE,
    MAX_SLIDER_VALUE: MAX_SLIDER_VALUE
  };
})();
