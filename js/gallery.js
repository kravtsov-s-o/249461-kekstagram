'use strict';

(function () {
  var AVATAR_SIZE = '35'; // размер аватара

  var MAX_SLIDER_VALUE = 100; // размер в 100%;

  var FIRST_NUMBER_ARRAY = 0;
  var AMOUNT_PHOTOS = 10;

  var photoListElement = document.querySelector('.pictures');
  var templatePhotoSomeUser = document.querySelector('#picture').content;

  // функция рендера поста с фотографией
  function renderPhoto(generatedPhoto, number) {
    var photoElement = templatePhotoSomeUser.cloneNode(true);

    var picture = photoElement.querySelector('.picture');
    picture.dataset.id = number;

    photoElement.querySelector('.picture__img').src = generatedPhoto.url;
    photoElement.querySelector('.picture__comments').textContent = generatedPhoto.comments.length;
    photoElement.querySelector('.picture__likes').textContent = generatedPhoto.likes;

    return photoElement;
  }

  window.loadData(function (photos) {
    // создание фрагмента с постами перед вставкой на страницу
    var fragment = document.createDocumentFragment();
    for (var j = 0; j < photos.length; j++) {
      fragment.appendChild(renderPhoto(photos[j], j));
    }

    // вставка фрагмента с постами на страницу
    photoListElement.appendChild(fragment);
    imgFilters.classList.remove('img-filters--inactive');

    window.photosList = photos;
    window.customPhotosList = photos;
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

  // ФИЛЬТР ЗАГРУЖЕННЫХ ПОСТОВ ------------------------------

  var uploadForm = document.querySelector('.img-upload');

  var imgFilters = document.querySelector('.img-filters');
  // imgFilters.classList.remove('img-filters--inactive');

  var buttonPopular = imgFilters.querySelector('#filter-popular');
  var buttonNew = imgFilters.querySelector('#filter-new');
  var buttonDiscussed = imgFilters.querySelector('#filter-discussed');

  var buttonActive = buttonPopular;

  imgFilters.addEventListener('click', function (evt) {
    var target = evt.target;

    var popularArray = window.photosList.slice(0);
    var customPhotosList = popularArray;

    function createPosts(arrayName) {
      photoListElement.innerHTML = '';
      // создание фрагмента с постами перед вставкой на страницу
      var fragment = document.createDocumentFragment();
      for (var j = 0; j < arrayName.length; j++) {
        fragment.appendChild(renderPhoto(arrayName[j], j));
      }

      // вставка фрагмента с постами на страницу
      photoListElement.appendChild(uploadForm);
      photoListElement.appendChild(fragment);
    }

    function getRandomNewArray(arrayName) {
      var randomNewArray = arrayName
      .sort(function () {
        return 0.5 - Math.random();
      })
      .slice(FIRST_NUMBER_ARRAY, AMOUNT_PHOTOS);

      customPhotosList = randomNewArray;
      return randomNewArray;
    }

    function getDiscussedArray(arrayName) {
      var discussedArray = arrayName.sort(function (first, second) {
        if (first.comments.length > second.comments.length) {
          return -1;
        } else if (first.comments.length < second.comments.length) {
          return 1;
        } else {
          return 0;
        }
      });

      customPhotosList = discussedArray;
      return discussedArray;
    }

    // ----------

    if (target === 'BUTTON') {
      return;
    }

    if (target === buttonPopular) {
      buttonActive.classList.remove('img-filters__button--active');
      buttonActive = target;
      buttonActive.classList.add('img-filters__button--active');

      createPosts(popularArray);

    } else if (target === buttonNew) {
      buttonActive.classList.remove('img-filters__button--active');
      buttonActive = target;
      buttonActive.classList.add('img-filters__button--active');

      createPosts(getRandomNewArray(popularArray));

    } else if (target === buttonDiscussed) {
      buttonActive.classList.remove('img-filters__button--active');
      buttonActive = target;
      buttonActive.classList.add('img-filters__button--active');

      createPosts(getDiscussedArray(popularArray));
    }

    window.customPhotosList = customPhotosList;
  });

  // ФИЛЬТР ЗАГРУЖЕННЫХ ПОСТОВ ------------------------------

  window.gallery = {
    AVATAR_SIZE: AVATAR_SIZE,
    MAX_SLIDER_VALUE: MAX_SLIDER_VALUE
  };
})();
