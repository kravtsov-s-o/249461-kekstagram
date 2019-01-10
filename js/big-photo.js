'use strict';

(function () {
  var START_NUMBERS_OF_COMMENTS = 5;
  var COMMENTS_STEP = 5;
  // отрисовка большого фото
  var bigPicture = document.querySelector('.big-picture');

  // рендер большого фото
  function renderBigPhoto(photoNumber) {
    var photo = bigPicture.querySelector('.big-picture__preview');

    photo.querySelector('.big-picture__img img').src = photoNumber.url;
    photo.querySelector('.big-picture__social .social__caption').textContent = photoNumber.description;
    photo.querySelector('.big-picture__social .likes-count').textContent = photoNumber.likes;
    photo.querySelector('.comments-count').textContent = photoNumber.comments.length;

    renderCommentsList(photoNumber);

    return photo;
  }

  /* генерация аватара комментатора */
  function renderAvatar(autorsAvatar, i) {
    var avatar = document.createElement('img');
    avatar.className = 'social__picture';
    avatar.src = autorsAvatar.comments[i].avatar;
    avatar.alt = 'Аватар комментатора фотографии';
    avatar.width = window.gallery.AVATAR_SIZE;
    avatar.height = window.gallery.AVATAR_SIZE;

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

  // функиця генерации списка комментариев к большому фото
  function renderCommentsList(photosNumber) {
    var comments = [];

    for (var i = 0; i < photosNumber.comments.length; i++) {
      var customComment = renderComment(photosNumber, i);
      comments.push(customComment);
    }

    return comments;
  }

  var commentsList = []; // массив комментариев

  // создание фрагмента с комментариями
  function addCommentsList(addedСomments) {
    var fragmentComments = document.createDocumentFragment();

    for (var i = 0; i < addedСomments.length; i++) {
      fragmentComments.appendChild(addedСomments[i]);
    }

    return fragmentComments;
  }

  // функция создания фотографии
  function renderCard(photoNumber) {
    var bigPhoto = renderBigPhoto(photoNumber);

    var socialComments = bigPhoto.querySelector('.social__comments');
    socialComments.innerHTML = '';

    // Скрытие кол-ва комментариев и загрузки дополнительных
    var socialCommentCount = bigPhoto.querySelector('.social__comment-count');
    var commentsLoader = bigPhoto.querySelector('.comments-loader');

    // socialCommentCount.classList.add('hidden');
    // commentsLoader.classList.add('hidden');

    // ------------------------------------------------- попытка разделить комменты
    var someCommentsList = commentsList.slice(0); // копируем массив с комментариями
    var visibleComments = START_NUMBERS_OF_COMMENTS;
    var someCommentsListTwo = someCommentsList.slice(0, visibleComments); // вырезаем часть показанную по умолчанию

    var visibleCommentsCount = socialCommentCount.querySelector('span');
    visibleCommentsCount.textContent = someCommentsListTwo.length;

    function moreVisibleComments() {
      visibleComments += COMMENTS_STEP;
      someCommentsListTwo = someCommentsList.slice(0, visibleComments);
      visibleCommentsCount.textContent = someCommentsListTwo.length;
      return someCommentsListTwo;
    }

    commentsLoader.addEventListener('click', function () {
      socialComments.innerHTML = '';
      socialComments.appendChild(addCommentsList(moreVisibleComments()));

    });
    // ------------------------------------------------- попытка разделить комменты

    socialComments.appendChild(addCommentsList(someCommentsListTwo));

    window.form.bigPictureClouse.addEventListener('click', closeBigPhotoPhoto);
    document.addEventListener('keydown', closeBigPhotoPhotoEsc);
  }

  // ---------------------------- Открытие и закрытие фотографий ----------------------------- Временное разделение блоков кода
  var pictures = document.querySelector('.pictures');

  pictures.addEventListener('click', function (evt) {
    evt.preventDefault();
    var target = evt.target;

    while (target !== pictures) {
      if (target.tagName === 'A') {
        bigPicture.classList.remove('hidden');
        commentsList = renderCommentsList(window.customPhotosList[number]);
        renderCard(window.customPhotosList[number]);

        return;
      }
      target = target.parentNode;
      var number = target.dataset.id;
    }
  });

  // закрытие большого фото
  function closeBigPhotoPhoto() {
    bigPicture.classList.add('hidden');
    window.form.bigPictureClouse.removeEventListener('click', closeBigPhotoPhoto);
    document.removeEventListener('keydown', closeBigPhotoPhotoEsc);
  }

  function closeBigPhotoPhotoEsc(evt) {
    if (evt.keyCode === window.form.ESC_KEYCODE) {
      closeBigPhotoPhoto();
    }
  }

  window.bigPicture = bigPicture;
})();
