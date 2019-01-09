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
    // создание фрагмента с постами перед вставкой на страницу
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

  // ФИЛЬТР ЗАГРУЖЕННЫХ ПОСТОВ ------------------------------

  var uploadForm = document.querySelector('.img-upload');

  var imgFilters = document.querySelector('.img-filters');
  imgFilters.classList.remove('img-filters--inactive');

  var btnPopular = imgFilters.querySelector('#filter-popular');
  var btnNew = imgFilters.querySelector('#filter-new');
  var btnDiscussed = imgFilters.querySelector('#filter-discussed');

  imgFilters.addEventListener('click', function (evt) {
    var target = evt.target;

    var testArrayList = window.photosList;
    // var fragment = document.createDocumentFragment();
    // var j;

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

    if (target === 'BUTTON') {
      return;
    }

    if (target === btnPopular) {
      btnPopular.classList.add('img-filters__button--active');
      btnNew.classList.remove('img-filters__button--active');
      btnDiscussed.classList.remove('img-filters__button--active');

      createPosts(testArrayList);

    } else if (target === btnNew) {
      btnPopular.classList.remove('img-filters__button--active');
      btnNew.classList.add('img-filters__button--active');
      btnDiscussed.classList.remove('img-filters__button--active');

      var testArrayListTwo = testArrayList
      .slice(0)
      .sort(function () {
        return 0.5 - Math.random();
      })
      .slice(0, 10);

      createPosts(testArrayListTwo);

    } else if (target === btnDiscussed) {
      btnPopular.classList.remove('img-filters__button--active');
      btnNew.classList.remove('img-filters__button--active');
      btnDiscussed.classList.add('img-filters__button--active');

      // console.log('третья');

      var testArrayListThree = testArrayList.slice(0).sort(function (first, second) {
        if (first.comments.length > second.comments.length) {
          return -1;
        } else if (first.comments.length < second.comments.length) {
          return 1;
        } else {
          return 0;
        }
      });

      createPosts(testArrayListThree);
    }
  });

  // ФИЛЬТР ЗАГРУЖЕННЫХ ПОСТОВ ------------------------------

  window.gallery = {
    AVATAR_SIZE: AVATAR_SIZE,
    MAX_SLIDER_VALUE: MAX_SLIDER_VALUE
  };
})();
