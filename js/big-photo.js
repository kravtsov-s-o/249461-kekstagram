'use strict';

(function () {
  var START_NUMBERS_OF_COMMENTS = 5;
  var COMMENTS_STEP = 5;
  var ENTER_KEYCODE = 13;

  // отрисовка большого фото
  var bigPicture = document.querySelector('.big-picture');
  var bigPictureClouse = bigPicture.querySelector('.big-picture__cancel');

  // рендер большого фото
  function renderBigPhoto(photoToView) {
    var photo = bigPicture.querySelector('.big-picture__preview');

    photo.querySelector('.big-picture__img img').src = photoToView.url;
    photo.querySelector('.big-picture__social .social__caption').textContent = photoToView.description;
    photo.querySelector('.big-picture__social .likes-count').textContent = photoToView.likes;
    photo.querySelector('.comments-count').textContent = photoToView.comments.length;

    renderCommentsList(photoToView);

    return photo;
  }

  /* генерация аватара комментатора */
  function renderAvatar(autorAvatar, i) {
    var avatar = document.createElement('img');
    avatar.className = 'social__picture';
    avatar.src = autorAvatar.comments[i].avatar;
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
  function renderCommentsList(photoToView) {
    var comments = [];

    for (var i = 0; i < photoToView.comments.length; i++) {
      var customComment = renderComment(photoToView, i);
      comments.push(customComment);
    }

    return comments;
  }

  var commentsList = []; // массив комментариев

  // создание фрагмента с комментариями
  function addCommentsToList(addedСomments) {
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

    // ------------------------------------------------- попытка разделить комменты
    var someCommentsList = commentsList.slice(0); // копируем массив с комментариями
    var visibleComments = START_NUMBERS_OF_COMMENTS;
    var visiblSomeCommentsList = someCommentsList.slice(0, visibleComments); // вырезаем часть показанную по умолчанию

    var visibleCommentsCount = socialCommentCount.querySelector('span');
    visibleCommentsCount.textContent = visiblSomeCommentsList.length;

    function moreVisibleComments() {
      visibleComments += COMMENTS_STEP;
      visiblSomeCommentsList = someCommentsList.slice(0, visibleComments);
      visibleCommentsCount.textContent = visiblSomeCommentsList.length;

      if (someCommentsList.length === visiblSomeCommentsList.length) {
        commentsLoader.classList.add('hidden');
      }

      return visiblSomeCommentsList;
    }

    commentsLoader.addEventListener('click', function () {
      socialComments.innerHTML = '';
      socialComments.appendChild(addCommentsToList(moreVisibleComments()));
    });

    // ------------------------------------------------- попытка разделить комменты

    socialComments.appendChild(addCommentsToList(visiblSomeCommentsList));

    bigPictureClouse.addEventListener('click', closeBigPhoto);
    document.addEventListener('keydown', closeBigPhotoEsc);
  }

  // ---------------------------- Открытие и закрытие фотографий ----------------------------- Временное разделение блоков кода
  var bodyHtml = document.querySelector('body');

  var pictures = document.querySelector('.pictures');

  pictures.addEventListener('click', function (evt) {
    var target = evt.target;

    while (target !== pictures) {
      if (target.tagName === 'A') {
        evt.preventDefault();
        bodyHtml.classList.add('modal-open');
        bigPicture.classList.remove('hidden');
        commentsList = renderCommentsList(window.customPhotosList[number]);
        renderCard(window.customPhotosList[number]);

        return;
      }
      target = target.parentNode;
      var number = target.dataset.id;
    }
  });

  // ----- открытие фотографий по клавише ENTER
  pictures.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      var target = evt.target;
      var number = target.dataset.id;
      while (target !== pictures) {
        if (target.tagName === 'A') {
          evt.preventDefault();
          bodyHtml.classList.add('modal-open');
          bigPicture.classList.remove('hidden');
          commentsList = renderCommentsList(window.customPhotosList[number]);
          renderCard(window.customPhotosList[number]);

          return;
        }
        target = target.parentNode;
      }
    }
  });
  // ----- открытие фотографий по клавише ENTER

  // закрытие большого фото
  function closeBigPhoto() {
    bigPicture.classList.add('hidden');
    bodyHtml.classList.remove('modal-open');
    bigPictureClouse.removeEventListener('click', closeBigPhoto);
    document.removeEventListener('keydown', closeBigPhotoEsc);
  }

  function closeBigPhotoEsc(evt) {
    if (evt.keyCode === window.form.ESC_KEYCODE) {
      closeBigPhoto();
    }
  }
})();
