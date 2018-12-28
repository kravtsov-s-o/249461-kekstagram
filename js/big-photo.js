'use strict';

(function () {
  // отрисовка большого фото
  var bigPicture = document.querySelector('.big-picture');

  var arrayElement = window.gallery.photosList[0];

  // рендер большого фото
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
    var commentsList = [];

    for (var i = 0; i < photosNumber.commentsCount; i++) {
      var customComment = renderComment(photosNumber, i);
      commentsList.push(customComment);
    }

    return commentsList;
  }

  var commentsList = renderCommentsList(arrayElement); // массив комментариев

  // создание фрагмента с комментариями
  function addCommentsList(addedСomments) {
    var fragmentComments = document.createDocumentFragment();

    for (var i = 0; i < commentsList.length; i++) {
      fragmentComments.appendChild(addedСomments[i]);
    }

    return fragmentComments;
  }

  // функция создания фотографии
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

    window.form.bigPictureClouse.addEventListener('click', closeBigPhotoPhoto);
    document.addEventListener('keydown', closeBigPhotoPhotoEsc);
  }

  // renderCard(photosList[0]);

  // ---------------------------- Открытие и закрытие фотографий ----------------------------- Временное разделение блоков кода
  var pictures = document.querySelector('.pictures');

  pictures.addEventListener('click', function (evt) {
    var target = evt.target;

    while (target !== pictures) {
      if (target.tagName === 'A') {
        bigPicture.classList.remove('hidden');
        renderCard(window.gallery.photosList[number]);

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
