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

  for (var i = 0; i < getRandom(1, 3); i++) {
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

var photosList = makePosts(QUANTITY_POSTS);

var photoListElement = document.querySelector('.pictures');
var templatePhotoSomeUser = document.querySelector('#picture').content;

function renderPhoto(generatePhoto) {
  var photoElement = templatePhotoSomeUser.cloneNode(true);

  photoElement.querySelector('.picture__img').src = generatePhoto.url;
  photoElement.querySelector('.picture__comments').textContent = generatePhoto.commentsCount;
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

var arrayElement = photosList[0];

function renderBigPhoto(photoNumber) {
  var photo = bigPicture.querySelector('.big-picture__preview');

  photo.querySelector('.big-picture__img img').src = photoNumber.url;
  photo.querySelector('.big-picture__social .social__caption').textContent = photoNumber.description;
  photo.querySelector('.big-picture__social .likes-count').textContent = photoNumber.likes;
  photo.querySelector('.comments-count').textContent = photoNumber.commentsCount;

  return photo;
}

var bigPhoto = renderBigPhoto(arrayElement);

var socialComments = bigPhoto.querySelector('.social__comments');
socialComments.innerHTML = '';

/* генерация аватара комментатора */
function renderAvatar(autorsAvatar, i) {
  var avatar = document.createElement('img');
  avatar.className = 'social__picture';
  avatar.src = autorsAvatar.comments[i].avatar;
  avatar.alt = 'Аватар комментатора фотографии';
  avatar.width = AVATAR_SIZE;
  avatar.height = AVATAR_SIZE;

  return avatar;
}

/* генерация сообщения комментатора */
function renderMessage(commentText, i) {
  var message = document.createElement('p');
  message.className = 'social__text';
  message.textContent = commentText.comments[i].message;

  return message;
}

/* генерация комментария */
function renderComment(readyComment, i) {
  var comment = document.createElement('li');
  comment.className = 'social__comment';

  comment.appendChild(renderAvatar(readyComment, i));
  comment.appendChild(renderMessage(readyComment, i));

  return comment;
}

function renderCommentsList(photosNumber) {
  var commentsList = [];

  for (var i = 0; i < photosNumber.commentsCount; i++) {
    var customComment = renderComment(photosNumber, i);
    commentsList.push(customComment);
  }

  return commentsList;
}

var commentsList = renderCommentsList(arrayElement);

var fragmentComments = document.createDocumentFragment();

for (var i = 0; i < commentsList.length; i++) {
  fragmentComments.appendChild(commentsList[i]);
}

socialComments.appendChild(fragmentComments);

// Скрытие кол-ва комментариев и загрузки дополнительных
var socialCommentCount = bigPhoto.querySelector('.social__comment-count');
var commentsLoader = bigPhoto.querySelector('.comments-loader');

socialCommentCount.classList.add('hidden');
commentsLoader.classList.add('hidden');
