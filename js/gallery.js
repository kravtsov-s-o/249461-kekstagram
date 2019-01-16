'use strict';

(function () {
  var AVATAR_SIZE = '35';

  var MAX_SLIDER_VALUE = 100;

  var FIRST_NUMBER_ARRAY = 0;
  var AMOUNT_PHOTOS = 10;

  var DEBOUNCE_INTERVAL = 500; // ms

  var photoListElement = document.querySelector('.pictures');
  var templatePhotoSomeUserElement = document.querySelector('#picture').content;

  var photosList;

  function renderPhoto(generatedPhoto, number) {
    var photoElement = templatePhotoSomeUserElement.cloneNode(true);

    var picture = photoElement.querySelector('.picture');
    picture.dataset.id = number;

    photoElement.querySelector('.picture__img').src = generatedPhoto.url;
    photoElement.querySelector('.picture__comments').textContent = generatedPhoto.comments.length;
    photoElement.querySelector('.picture__likes').textContent = generatedPhoto.likes;

    return photoElement;
  }

  window.backend.loadData(function (photos) {
    var fragment = document.createDocumentFragment();
    /* for (var j = 0; j < photos.length; j++) {
      fragment.appendChild(renderPhoto(photos[j], j));
    } */

    photos.forEach(function (element, j) {
      fragment.appendChild(renderPhoto(photos[j], j));
    });

    photoListElement.appendChild(fragment);
    imgFiltersElement.classList.remove('img-filters--inactive');

    photosList = photos;
    window.gallery.customPhotosList = photos;
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

  var uploadFormElement = document.querySelector('.img-upload');

  var imgFiltersElement = document.querySelector('.img-filters');

  var buttonPopular = imgFiltersElement.querySelector('#filter-popular');
  var buttonNew = imgFiltersElement.querySelector('#filter-new');
  var buttonDiscussed = imgFiltersElement.querySelector('#filter-discussed');

  var buttonActive = buttonPopular;

  function createPosts(arrayName) {
    photoListElement.innerHTML = '';

    var fragment = document.createDocumentFragment();
    /* for (var j = 0; j < arrayName.length; j++) {
      fragment.appendChild(renderPhoto(arrayName[j], j));
    } */
    arrayName.forEach(function (element, j) {
      fragment.appendChild(renderPhoto(element[j], j));
    });

    photoListElement.appendChild(uploadFormElement);
    photoListElement.appendChild(fragment);
  }

  function getRandomNewArray(arrayName) {
    var randomNewArray = arrayName
    .sort(function () {
      return 0.5 - Math.random();
    })
    .slice(FIRST_NUMBER_ARRAY, AMOUNT_PHOTOS);

    window.gallery.customPhotosList = randomNewArray;
    return randomNewArray;
  }

  function getDiscussedArray(arrayName) {
    var discussedArray = arrayName.sort(function (first, second) {
      return second.comments.length - first.comments.length;
    });

    window.gallery.customPhotosList = discussedArray;
    return discussedArray;
  }

  function debounce(cb) {
    var lastTimeout;

    return function () {

      var args = arguments;

      if (lastTimeout) {
        window.clearTimeout(lastTimeout);
      }

      lastTimeout = window.setTimeout(function () {
        cb.apply(cb, args);
      }, DEBOUNCE_INTERVAL);
    };
  }

  function activationCommentsList(target) {
    buttonActive.classList.remove('img-filters__button--active');
    buttonActive = target;
    buttonActive.classList.add('img-filters__button--active');
  }

  var debouncedCreatePosts = debounce(createPosts);

  imgFiltersElement.addEventListener('click', function (evt) {
    var target = evt.target;

    var popularArray = photosList.slice(0);
    window.gallery.customPhotosList = popularArray;

    if (target === 'BUTTON') {
      return;
    }

    if (target === buttonPopular) {
      activationCommentsList(target);
      debouncedCreatePosts(popularArray);
    } else if (target === buttonNew) {
      activationCommentsList(target);
      debouncedCreatePosts(getRandomNewArray(popularArray));
    } else if (target === buttonDiscussed) {
      activationCommentsList(target);
      debouncedCreatePosts(getDiscussedArray(popularArray));
    }
  });

  window.gallery = {
    AVATAR_SIZE: AVATAR_SIZE,
    MAX_SLIDER_VALUE: MAX_SLIDER_VALUE,
    customPhotosList: []
  };
})();
