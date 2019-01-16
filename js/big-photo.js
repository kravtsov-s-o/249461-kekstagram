'use strict';

(function () {
  var START_NUMBERS_OF_COMMENTS = 5;
  var COMMENTS_STEP = 5;
  var ENTER_KEYCODE = 13;

  var bigPictureElement = document.querySelector('.big-picture');
  var bigPictureCloseElement = bigPictureElement.querySelector('.big-picture__cancel');

  function renderBigPhoto(photoToView) {
    var photo = bigPictureElement.querySelector('.big-picture__preview');

    photo.querySelector('.big-picture__img img').src = photoToView.url;
    photo.querySelector('.big-picture__social .social__caption').textContent = photoToView.description;
    photo.querySelector('.big-picture__social .likes-count').textContent = photoToView.likes;
    photo.querySelector('.comments-count').textContent = photoToView.comments.length;

    renderCommentsList(photoToView);

    return photo;
  }

  function renderAvatar(autorAvatar, i) {
    var avatar = document.createElement('img');
    avatar.className = 'social__picture';
    avatar.src = autorAvatar.comments[i].avatar;
    avatar.alt = 'Аватар комментатора фотографии';
    avatar.width = window.gallery.AVATAR_SIZE;
    avatar.height = window.gallery.AVATAR_SIZE;

    return avatar;
  }

  function renderMessage(commentText, i) {
    var message = document.createElement('p');
    message.className = 'social__text';
    message.textContent = commentText.comments[i].message;

    return message;
  }

  function renderComment(readyComment, i) {
    var comment = document.createElement('li');
    comment.className = 'social__comment';

    comment.appendChild(renderAvatar(readyComment, i));
    comment.appendChild(renderMessage(readyComment, i));

    return comment;
  }

  function renderCommentsList(photoToView) {
    var comments = [];

    for (var i = 0; i < photoToView.comments.length; i++) {
      var customComment = renderComment(photoToView, i);
      comments.push(customComment);
    }

    return comments;
  }

  var commentsList = [];

  function addCommentsToList(addedСomments) {
    var commentsFragment = document.createDocumentFragment();

    for (var i = 0; i < addedСomments.length; i++) {
      commentsFragment.appendChild(addedСomments[i]);
    }

    return commentsFragment;
  }

  function renderCard(photoNumber) {
    var bigPhoto = renderBigPhoto(photoNumber);

    var socialCommentsElement = bigPhoto.querySelector('.social__comments');
    socialCommentsElement.innerHTML = '';

    var socialCommentCount = bigPhoto.querySelector('.social__comment-count');
    var commentsLoader = bigPhoto.querySelector('.comments-loader');

    var commentsListCopy = commentsList.slice(0);
    var visibleCommentsNumber = START_NUMBERS_OF_COMMENTS;
    var visibleCommentsList = commentsListCopy.slice(0, visibleCommentsNumber);

    var visibleCommentsCount = socialCommentCount.querySelector('span');
    visibleCommentsCount.textContent = visibleCommentsList.length;

    function moreVisibleComments() {
      visibleCommentsNumber += COMMENTS_STEP;
      visibleCommentsList = commentsListCopy.slice(0, visibleCommentsNumber);
      visibleCommentsCount.textContent = visibleCommentsList.length;

      if (commentsListCopy.length === visibleCommentsList.length) {
        commentsLoader.classList.add('hidden');
      }

      return visibleCommentsList;
    }

    commentsLoader.addEventListener('click', function () {
      socialCommentsElement.innerHTML = '';
      socialCommentsElement.appendChild(addCommentsToList(moreVisibleComments()));
    });

    socialCommentsElement.appendChild(addCommentsToList(visibleCommentsList));

    bigPictureCloseElement.addEventListener('click', bigPhotoCloseHandler);
    document.addEventListener('keydown', bigPhotoCloseEscHandler);
  }

  var bodyHtml = document.querySelector('body');

  var picturesElement = document.querySelector('.pictures');

  function openingLargePhoto(evt) {
    var target = evt.target;

    while (target !== picturesElement) {
      if (target.className === 'picture') {
        evt.preventDefault();
        var number = target.dataset.id;
        bodyHtml.classList.add('modal-open');
        bigPictureElement.classList.remove('hidden');
        commentsList = renderCommentsList(window.gallery.customPhotosList[number]);
        renderCard(window.gallery.customPhotosList[number]);

        return;
      }
      target = target.parentNode;
    }
  }

  picturesElement.addEventListener('click', function (evt) {
    openingLargePhoto(evt);
  });

  picturesElement.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      openingLargePhoto(evt);
    }
  });

  function bigPhotoCloseHandler() {
    bigPictureElement.classList.add('hidden');
    bodyHtml.classList.remove('modal-open');
    bigPictureCloseElement.removeEventListener('click', bigPhotoCloseHandler);
    document.removeEventListener('keydown', bigPhotoCloseEscHandler);
  }

  function bigPhotoCloseEscHandler(evt) {
    if (evt.keyCode === window.form.ESC_KEYCODE) {
      bigPhotoCloseHandler();
    }
  }
})();
