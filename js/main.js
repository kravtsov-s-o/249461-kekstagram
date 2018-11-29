'use strict';

var URL = [
  'photos/1.jpg',
  'photos/2.jpg',
  'photos/3.jpg',
  'photos/4.jpg',
  'photos/5.jpg',
  'photos/6.jpg',
  'photos/7.jpg',
  'photos/8.jpg',
  'photos/9.jpg',
  'photos/10.jpg',
  'photos/11.jpg',
  'photos/12.jpg',
  'photos/13.jpg',
  'photos/14.jpg',
  'photos/15.jpg',
  'photos/16.jpg',
  'photos/17.jpg',
  'photos/18.jpg',
  'photos/19.jpg',
  'photos/20.jpg',
  'photos/21.jpg',
  'photos/22.jpg',
  'photos/23.jpg',
  'photos/24.jpg',
  'photos/25.jpg'
];

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

/* Перетасовка фотографий в случайном порядке */
function randomUrl() {
  return Math.random() - 0.5;
}

var newUrl = URL.sort(randomUrl);

function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function quantityCommentsCounter() {
  return Math.floor(Math.random() * 100);
}

var makeComments = function (quantityComments) {
  var comments = [];

  for (var i = 0; i < quantityComments; i++) {
    var comment = {
      avatar: 'img/avatar-' + getRandom(1, 6) + '.svg',
      message: TEXT_COMMENTS[Math.floor(Math.random() * TEXT_COMMENTS.length)],
      name: NAME_COMMENTS[Math.floor(Math.random() * NAME_COMMENTS.length)]
    };
    comments.push(comment);
  }
  return comments;
};

var commentsList = makeComments(QUANTITY_POSTS);

var makePosts = function (quantityPhotos) {
  var photos = [];

  for (var i = 0; i < quantityPhotos; i++) {
    var photo = {
      url: newUrl[i],
      likes: getRandom(15, 200),
      quantityComments: quantityCommentsCounter(),
      comments: commentsList.sort(randomUrl)[i],
      description: DESCRIPTIONS[Math.floor(Math.random() * DESCRIPTIONS.length)]
    };
    photos.push(photo);
  }
  return photos;
};

var photosList = makePosts(QUANTITY_POSTS);

var photoListElement = document.querySelector('.pictures');
var templatePhotoSomeUser = document.querySelector('#picture').content;

var renderPhoto = function (generatePhoto) {
  var photoElement = templatePhotoSomeUser.cloneNode(true);

  photoElement.querySelector('.picture__img').src = generatePhoto.url;
  photoElement.querySelector('.picture__comments').textContent = generatePhoto.quantityComments;
  photoElement.querySelector('.picture__likes').textContent = generatePhoto.likes;

  return photoElement;
};

var fragment = document.createDocumentFragment();
for (var j = 0; j < photosList.length; j++) {
  fragment.appendChild(renderPhoto(photosList[j]));
}

photoListElement.appendChild(fragment);

var bigPicture = document.querySelector('.big-picture');
bigPicture.classList.remove('hidden');

var bigPhoto = bigPicture.querySelector('.big-picture__preview');

bigPhoto.querySelector('.big-picture__img img').src = photosList[0].url;
bigPhoto.querySelector('.big-picture__social .social__caption').textContent = photosList[0].description;
bigPhoto.querySelector('.big-picture__social .likes-count').textContent = photosList[0].likes;
bigPhoto.querySelector('.comments-count').textContent = photosList[0].quantityComments;

var socialComments = bigPhoto.querySelector('.social__comments');
// var socialComment = bigPhoto.querySelector('.social_comment');
while (socialComments.firstChild) {
  socialComments.removeChild(socialComments.firstChild);
}

var customComment = document.createElement('li');
customComment.className = 'social__comment';

var customAvatar = document.createElement('img');
customAvatar.className = 'social__picture';
customAvatar.src = photosList[0].comments.avatar;
customAvatar.alt = 'Аватар комментатора фотографии';
customAvatar.width = '35';
customAvatar.height = '35';

var customMessage = document.createElement('p');
customMessage.className = 'social__text';
customMessage.textContent = photosList[0].comments.message;

customComment.appendChild(customAvatar);
customComment.appendChild(customMessage);
socialComments.appendChild(customComment);

var socialCommentCount = bigPhoto.querySelector('.social__comment-count');
var commentsLoader = bigPhoto.querySelector('.comments-loader');

socialCommentCount.classList.add('hidden');
commentsLoader.classList.add('hidden');
