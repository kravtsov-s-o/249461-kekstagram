'use strict';

(function () {
  // ---------------------------------------------------------------------------------------------------------------------- данные по умолчанию
  var TEXT_COMMENTS = [
    'Всё отлично!',
    'В целом всё неплохо. Но не всё.',
    'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
    'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
    'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
    'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
  ];

  var NAME_COMMENTS = [
    'Артем',
    'Лена',
    'Вася',
    'Катя',
    'Вова',
    'Таня'
  ];

  var DESCRIPTIONS = [
    'Тестим новую камеру!',
    'Затусили с друзьями на море',
    'Как же круто тут кормят',
    'Отдыхаем...',
    'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
    'Вот это тачка!'
  ];

  var QUANTITY_POSTS = 25; // кол-во постов по умолчанию
  var AVATAR_SIZE = '35'; // размер аватара

  var MAX_SLIDER_VALUE = 100; // размер в 100%;

  /* случайное число в указаном диапазоне */
  function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  /* случайное значение из массива */
  function randomElementMassive(nameMassive) {
    return nameMassive[Math.floor(Math.random() * nameMassive.length)];
  }

  /* генерация списка комментариев к фото */
  function makeCommentsList() {
    var comments = [];

    for (var i = 0; i <= getRandom(1, 2); i++) {
      var comment = {
        avatar: 'img/avatar-' + getRandom(1, 6) + '.svg',
        message: randomElementMassive(TEXT_COMMENTS),
        name: randomElementMassive(NAME_COMMENTS)
      };
      comments.push(comment);
    }
    return comments;
  }

  /* генерация поста */
  function makePosts(quantityPhotos) {
    var photos = [];

    for (var i = 1; i <= quantityPhotos; i++) {
      var photo = {
        url: 'photos/' + i + '.jpg',
        likes: getRandom(15, 200),
        commentsCount: makeCommentsList(QUANTITY_POSTS).length,
        comments: makeCommentsList(QUANTITY_POSTS),
        description: randomElementMassive(DESCRIPTIONS)
      };
      photos.push(photo);
    }
    return photos;
  }

  var photosList = makePosts(QUANTITY_POSTS); // массив постов

  var photoListElement = document.querySelector('.pictures');
  var templatePhotoSomeUser = document.querySelector('#picture').content;

  // функция рендера поста с фотографией
  function renderPhoto(generatePhoto, number) {
    var photoElement = templatePhotoSomeUser.cloneNode(true);

    var picture = photoElement.querySelector('.picture');
    picture.dataset.id = number;

    photoElement.querySelector('.picture__img').src = generatePhoto.url;
    photoElement.querySelector('.picture__comments').textContent = generatePhoto.commentsCount;
    photoElement.querySelector('.picture__likes').textContent = generatePhoto.likes;

    return photoElement;
  }

  // создание фрагмента с постами передвставкой на страницу
  var fragment = document.createDocumentFragment();
  for (var j = 0; j < photosList.length; j++) {
    fragment.appendChild(renderPhoto(photosList[j], j));
  }

  // вставка фрагмента с постами на страницу
  photoListElement.appendChild(fragment);

  // window.AVATAR_SIZE = AVATAR_SIZE;
  // window.MAX_SLIDER_VALUE = MAX_SLIDER_VALUE;
  // window.photosList = photosList;

  window.gallery = {
    AVATAR_SIZE: AVATAR_SIZE,
    MAX_SLIDER_VALUE: MAX_SLIDER_VALUE,
    photosList: photosList
  };
})();
