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

function renderPhoto(generatePhoto, number) {
  var photoElement = templatePhotoSomeUser.cloneNode(true);

  var picture = photoElement.querySelector('.picture');
  picture.dataset.id = number;

  photoElement.querySelector('.picture__img').src = generatePhoto.url;
  photoElement.querySelector('.picture__comments').textContent = generatePhoto.commentsCount;
  photoElement.querySelector('.picture__likes').textContent = generatePhoto.likes;

  return photoElement;
}

var fragment = document.createDocumentFragment();
for (var j = 0; j < photosList.length; j++) {
  fragment.appendChild(renderPhoto(photosList[j], j));
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

  bigPictureClouse.addEventListener('click', closeBigPhotoPhoto);
  document.addEventListener('keydown', closeBigPhotoPhotoEsc);
}

// renderCard(photosList[0]);


// ---------------------------------------------- Modulle 4. Обработка событий
var ESC_KEYCODE = 27;

var uploadFile = document.querySelector('.img-upload__input');
var uploadOverlay = document.querySelector('.img-upload__overlay');

var uploadCancel = uploadOverlay.querySelector('.img-upload__cancel');
var bigPictureClouse = bigPicture.querySelector('.big-picture__cancel');

// открытие окна редактирования загруженого фото
uploadFile.onchange = function () {
  uploadOverlay.classList.remove('hidden');

  uploadCancel.addEventListener('click', closeUploadPhoto);
  document.addEventListener('keydown', closeUploadPhotoEsc);

  effectLevel.classList.add('hidden');
};

// закрытие окна редактирования
function closeUploadPhoto() {
  uploadOverlay.classList.add('hidden');
  uploadCancel.removeEventListener('click', closeUploadPhoto);
  document.removeEventListener('keydown', closeUploadPhotoEsc);
}

function closeUploadPhotoEsc(evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeUploadPhoto();
  }
}

// ------------------------------------------
// превью картинки
var downloadPhoto = uploadOverlay.querySelector('.img-upload__preview img');
var effectsList = document.querySelector('.effects__list');

// переменные для работы с баром эффекта
var effectLevel = uploadOverlay.querySelector('.effect-level');
var effectLevelLine = effectLevel.querySelector('.effect-level__line');
var effectLevelPin = effectLevel.querySelector('.effect-level__pin');
var effectLevelDepth = effectLevel.querySelector('.effect-level__depth');
var effectLevelValue = effectLevel.querySelector('.effect-level__value');

var effectValue;

effectsList.addEventListener('change', function (e) {
  var target = e.target;

  if (target === 'INPUT') {
    return;
  }
  target = target.parentNode;

  var targetInput = target.querySelector('input');
  downloadPhoto.classList.remove('effects__preview--' + effectValue);
  effectValue = targetInput.value;
  downloadPhoto.removeAttribute('style'); // удаляет ранее применный стиль с ползунка
  downloadPhoto.classList.add('effects__preview--' + effectValue);
  scaleValue.value = '100%';

  if (effectValue === 'none') {
    effectLevel.classList.add('hidden');
  } else {
    effectLevel.classList.remove('hidden');
    effectLevelPin.style.left = '100%';
    effectLevelDepth.style.width = '100%';
  }

  effectLevelLine.addEventListener('click', function (evt) {
    var clickX = evt.offsetX;
    var clickOffset = Math.floor(clickX / 4.55);
    effectLevelPin.style.left = clickOffset + '%';
    effectLevelDepth.style.width = clickOffset + '%';
    effectLevelValue.value = clickOffset;

    var effectFilter;

    if (effectValue === 'chrome') {
      effectFilter = 'grayscale';
      downloadPhoto.style.filter = effectFilter + '(' + effectCalc(1, 0, clickOffset) + ')';
    } else if (effectValue === 'sepia') {
      effectFilter = 'sepia';
      downloadPhoto.style.filter = effectFilter + '(' + effectCalc(1, 0, clickOffset) + ')';
    } else if (effectValue === 'marvin') {
      effectFilter = 'invert';
      downloadPhoto.style.filter = effectFilter + '(' + effectCalc(100, 0, clickOffset) + '%)';
    } else if (effectValue === 'phobos') {
      effectFilter = 'blur';
      downloadPhoto.style.filter = effectFilter + '(' + effectCalc(3, 1, clickOffset) + 'px)';
    } else {
      effectFilter = 'brightness';
      downloadPhoto.style.filter = effectFilter + '(' + effectCalc(3, 0, clickOffset) + ')';
    }
  });
});

// ------------------------------------------

function effectCalc(max, min, value) {
  return (max - min) * (value / 100); // value в процентах
}


// ---------------------------- Открытие и закрытие фотографий ----------------------------- Временное разделение блоков кода
var pictures = document.querySelector('.pictures');

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

// закрытие большого фото
function closeBigPhotoPhoto() {
  bigPicture.classList.add('hidden');
  bigPictureClouse.removeEventListener('click', closeBigPhotoPhoto);
  document.removeEventListener('keydown', closeBigPhotoPhotoEsc);
}

function closeBigPhotoPhotoEsc(evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeBigPhotoPhoto();
  }
}
// ---------------------------- Открытие и закрытие фотографий ----------------------------- Временное разделение блоков кода

// управление масштабом фотографии

var scaleValue = document.querySelector('.scale__control--value');
var buttonMin = document.querySelector('.scale__control--smaller');
var buttonMax = document.querySelector('.scale__control--bigger');

scaleValue.value = '100%';

buttonMin.onclick = function () {
  if (scaleValue.value === '100%') {
    downloadPhoto.style.transform = 'scale(0.75)';
    scaleValue.value = '75%';
  } else if (scaleValue.value === '75%') {
    downloadPhoto.style.transform = 'scale(0.5)';
    scaleValue.value = '50%';
  } else if (scaleValue.value === '50%') {
    downloadPhoto.style.transform = 'scale(0.25)';
    scaleValue.value = '25%';
  }

  return scaleValue;
};

buttonMax.onclick = function () {
  if (scaleValue.value === '25%') {
    downloadPhoto.style.transform = 'scale(0.5)';
    scaleValue.value = '50%';
  } else if (scaleValue.value === '50%') {
    downloadPhoto.style.transform = 'scale(0.75)';
    scaleValue.value = '75%';
  } else if (scaleValue.value === '75%') {
    downloadPhoto.style.transform = 'scale(1)';
    scaleValue.value = '100%';
  }

  return scaleValue;
};

// ------- ВАЛИДАЦИЯ ХЭШ-ТЕГОВ --------------

var formUploadPhoto = document.querySelector('.img-upload__form');
// var buttonPublish = uploadOverlay.querySelector('.img-upload__submit');

var hashtags = formUploadPhoto.querySelector('.text__hashtags');

function checkOctothorpe(hashtagsArrayElement) {
  if (hashtagsArrayElement !== '#') {
    return true;
  } else {
    return false;
  }
}

function checkHashtagMaxLength(hashtagsArrayElement) {
  if (hashtagsArrayElement.length > 20) {
    return true;
  } else {
    return false;
  }
}

function checkHashtagMinLength(hashtagsArrayElement) {
  if (hashtagsArrayElement.length < 2) {
    return true;
  } else {
    return false;
  }
}

function checkHashtagsRepeat(hashtagsArrayElement) {
  var hashtagsObj = {};

  for (var repeat = 0; repeat < hashtagsArrayElement.length; repeat++) {
    var key = hashtagsArrayElement[repeat];
    if (hashtagsObj[key]) {
      return true;
    }
    hashtagsObj[key] = true;
  }
  return false;
}

formUploadPhoto.addEventListener('submit', function (evt) {
  var hashtagsValue = hashtags.value.toLowerCase();
  var hashtagsArray = hashtagsValue.split(' ');

  var hashtagsArrayElement;

  for (var i = 0; i < hashtagsArray.length; i++) {
    hashtagsArrayElement = hashtagsArray[i].split('');
    evt.preventDefault();
    if (checkHashtagsRepeat(hashtagsArray)) {
      hashtags.setCustomValidity('Хэштеги не могут повторятся');
      return;
    } else if (hashtagsArray.length > 5) {
      hashtags.setCustomValidity('Максимальное кол-во хэштегов не может быть больше 5');
      return;
    } else if (checkOctothorpe(hashtagsArrayElement[0])) {
      hashtags.setCustomValidity('хэштеги должны начинаться с #');
      return;
    } else if (checkHashtagMaxLength(hashtagsArrayElement)) {
      hashtags.setCustomValidity('длина хэштега не может быть более 20 символов, включая #');
      return;
    } else if (checkHashtagMinLength(hashtagsArrayElement)) {
      hashtags.setCustomValidity('хештег не может состоять только из #');
      return;
    } else {
      formUploadPhoto.submit();
    }
  }
});
