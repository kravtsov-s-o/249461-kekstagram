'use strict';

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

var QUANTITY_POSTS = 25;
var AVATAR_SIZE = '35';

/* Перетасовка фотографий в случайном порядке */
function randomUrl() {
  return Math.random() - 0.5;
}

/* случайное число в указаном диапазоне */
function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

/* случайное число */
function quantityCommentsCounter() {
  return Math.floor(Math.random() * 100);
}

/* случайное значение из массива */
function rendomElementMassive(nameMassive) {
  return nameMassive[Math.floor(Math.random() * nameMassive.length)];
}

/* функция генерации комментария */
function makeCommentsList(quantityComments) {
  var comments = [];

  for (var i = 0; i < quantityComments; i++) {
    var comment = {
      avatar: 'img/avatar-' + getRandom(1, 6) + '.svg',
      message: rendomElementMassive(TEXT_COMMENTS),
      name: rendomElementMassive(NAME_COMMENTS)
    };
    comments.push(comment);
  }
  return comments;
}

var commentsList = makeCommentsList(QUANTITY_POSTS);

/* генерация поста */
function makePosts(quantityPhotos) {
  var photos = [];

  for (var i = 1; i <= quantityPhotos; i++) {
    var photo = {
      url: 'photos/' + i + '.jpg',
      likes: getRandom(15, 200),
      quantityComments: quantityCommentsCounter(),
      comments: commentsList.sort(randomUrl)[i],
      description: rendomElementMassive(DESCRIPTIONS)
    };
    photos.push(photo);
  }
  return photos;
}

var photosList = makePosts(QUANTITY_POSTS);

var photoListElement = document.querySelector('.pictures');
var templatePhotoSomeUser = document.querySelector('#picture').content;

/* большое фото */
function renderPhoto(generatePhoto) {
  var photoElement = templatePhotoSomeUser.cloneNode(true);

  photoElement.querySelector('.picture__img').src = generatePhoto.url;
  photoElement.querySelector('.picture__comments').textContent = generatePhoto.quantityComments;
  photoElement.querySelector('.picture__likes').textContent = generatePhoto.likes;

  return photoElement;
}

var fragment = document.createDocumentFragment();
for (var j = 0; j < photosList.length; j++) {
  fragment.appendChild(renderPhoto(photosList[j]));
}

photoListElement.appendChild(fragment);

var bigPicture = document.querySelector('.big-picture');
bigPicture.classList.remove('hidden');

var massiveElement = photosList[0];

function renderBigPhoto(numberElement) {
  var photo = bigPicture.querySelector('.big-picture__preview');

  photo.querySelector('.big-picture__img img').src = numberElement.url;
  photo.querySelector('.big-picture__social .social__caption').textContent = numberElement.description;
  photo.querySelector('.big-picture__social .likes-count').textContent = numberElement.likes;
  photo.querySelector('.comments-count').textContent = numberElement.quantityComments;

  return photo;
}

var bigPhoto = renderBigPhoto(massiveElement);

var socialComments = bigPhoto.querySelector('.social__comments');
socialComments.innerHTML = '';

function renderComment(renderCustomComment) {
  var customComment = document.createElement('li');
  customComment.className = 'social__comment';

  var customAvatar = document.createElement('img');
  customAvatar.className = 'social__picture';
  customAvatar.src = renderCustomComment.comments.avatar;
  customAvatar.alt = 'Аватар комментатора фотографии';
  customAvatar.width = AVATAR_SIZE;
  customAvatar.height = AVATAR_SIZE;

  var customMessage = document.createElement('p');
  customMessage.className = 'social__text';
  customMessage.textContent = renderCustomComment.comments.message;

  customComment.appendChild(customAvatar);
  customComment.appendChild(customMessage);

  return customComment;
}

var customComment = renderComment(massiveElement);
socialComments.appendChild(customComment);

// Скрытие кол-ва комментариев и загрузки дополнительных
var socialCommentCount = bigPhoto.querySelector('.social__comment-count');
var commentsLoader = bigPhoto.querySelector('.comments-loader');

socialCommentCount.classList.add('hidden');
commentsLoader.classList.add('hidden');
