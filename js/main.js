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

var arrayElement = photosList[0];

function renderBigPhoto(photoNumber) {
  var photo = bigPicture.querySelector('.big-picture__preview');

  photo.querySelector('.big-picture__img img').src = photoNumber.url;
  photo.querySelector('.big-picture__social .social__caption').textContent = photoNumber.description;
  photo.querySelector('.big-picture__social .likes-count').textContent = photoNumber.likes;
  photo.querySelector('.comments-count').textContent = photoNumber.commentsCount;

  renderCommentsList(photoNumber);

  return photo;
}

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

function addCommentsList(addedСomments) {
  var fragmentComments = document.createDocumentFragment();

  for (var i = 0; i < commentsList.length; i++) {
    fragmentComments.appendChild(addedСomments[i]);
  }

  return fragmentComments;
}

function renderCard(photoNumber) {
  var bigPhoto = renderBigPhoto(photoNumber);

  var socialComments = bigPhoto.querySelector('.social__comments');
  socialComments.innerHTML = '';

  socialComments.appendChild(addCommentsList(commentsList));

  // Скрытие кол-ва комментариев и загрузки дополнительных
  var socialCommentCount = bigPhoto.querySelector('.social__comment-count');
  var commentsLoader = bigPhoto.querySelector('.comments-loader');

  socialCommentCount.classList.add('hidden');
  commentsLoader.classList.add('hidden');
}

renderCard(photosList[0]);


// ---------------------------------------------- Modulle 4. Обработка событий
var ESC_KEYCODE = 27;

var uploadFile = document.querySelector('.img-upload__input');
var uploadOverlay = document.querySelector('.img-upload__overlay');

var uploadCancel = uploadOverlay.querySelector('.img-upload__cancel');
var bigPictureClouse = bigPicture.querySelector('.big-picture__cancel');

function onPopupEscPress(evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    popupClose();
  }
}

function popupOpen(popupName) {
  popupName.classList.remove('hidden');
  document.addEventListener('keydown', onPopupEscPress);
}

function popupClose(popupName) {
  popupName.classList.add('hidden');
  document.removeEventListener('keydown', onPopupEscPress);
}

// открытие окна редактирования загруженого фото
uploadFile.onchange = function () {
  popupOpen(uploadOverlay);

  effectLevel.classList.add('hidden');
};

// закрытие окна ред. фото
uploadCancel.addEventListener('click', function () {
  popupClose(uploadOverlay);
});

document.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    popupClose(uploadOverlay);
  }
});

// закрытие большого фото
bigPictureClouse.addEventListener('click', function () {
  popupClose(bigPicture);
});

// закрытие большого фото с клавиатуры
document.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    popupClose(bigPicture);
  }
});


// превью картинки
var donwloadPhoto = uploadOverlay.querySelector('.img-upload__preview img');

// применяемые стили
var photoNormal = uploadOverlay.querySelector('.effects__preview--none');
var photoChrome = uploadOverlay.querySelector('.effects__preview--chrome');
var photoSepia = uploadOverlay.querySelector('.effects__preview--sepia');
var photoMarvin = uploadOverlay.querySelector('.effects__preview--marvin');
var photoPhobos = uploadOverlay.querySelector('.effects__preview--phobos');
var photoHeat = uploadOverlay.querySelector('.effects__preview--heat');

// Range управления насыщеностью эффекта
var effectLevel = uploadOverlay.querySelector('.effect-level');
// var effectLevelPin = effectLevel.querySelector('.effect-level__pin');
// var effectLevelLine = effectLevel.querySelector('.effect-level__line');
// var effectLevelDepth = effectLevel.querySelector('.effect-level__depth');
// var effectPinValue = document.querySelector('.effect-level__value');

// функция удаления примененных стилей и скрытия ползунка при нормал
function deleteEffects() {
  donwloadPhoto.classList.remove('effects__preview--none');
  donwloadPhoto.classList.remove('effects__preview--chrome');
  donwloadPhoto.classList.remove('effects__preview--sepia');
  donwloadPhoto.classList.remove('effects__preview--marvin');
  donwloadPhoto.classList.remove('effects__preview--phobos');
  donwloadPhoto.classList.remove('effects__preview--heat');
  effectLevel.classList.remove('hidden');
}

photoNormal.addEventListener('click', function () {
  deleteEffects();
  effectLevel.classList.add('hidden');
});

photoChrome.addEventListener('click', function () {
  deleteEffects();
  donwloadPhoto.classList.add('effects__preview--chrome');
});

photoSepia.addEventListener('click', function () {
  deleteEffects();
  donwloadPhoto.classList.add('effects__preview--sepia');
});

photoMarvin.addEventListener('click', function () {
  deleteEffects();
  donwloadPhoto.classList.add('effects__preview--marvin');
});

photoPhobos.addEventListener('click', function () {
  deleteEffects();
  donwloadPhoto.classList.add('effects__preview--phobos');
});

photoHeat.addEventListener('click', function () {
  deleteEffects();
  donwloadPhoto.classList.add('effects__preview--heat');
});

// --------------------------------------------------------- Временное разделение блоков кода

var pictures = document.querySelector('.pictures');
var smallPictures = pictures.querySelectorAll('.picture');

for (var i = 0; i < photosList.length; i++) {

  smallPictures[i].dataset.id = i;
}

pictures.addEventListener('click', function (evt) {
  var target = evt.target;

  while (target !== pictures) {
    if (target.tagName === 'A') {
      bigPicture.classList.remove('hidden');
      renderCard(photosList[number]);

      return;
    }
    target = target.parentNode;
    var number = target.dataset.id;
  }
});

// расчет положения пина для уровня эффекта и функция расчета значения между max и min любого значения
/*
function levelValue(max, min, value) {
  return (max - min) * (value / 100) / 1;
}

effectLevelLine.addEventListener('click', function (evt) {
  var x = evt.offsetX;
  effectLevelPin.style.left = Math.floor(x / 4.55) + '%';
  effectLevelDepth.style.width = Math.floor(x / 4.55) + '%';
  effectPinValue = Math.floor(x / 4.55);
  effectPinValue.value = effectPinValue;
});
*/
