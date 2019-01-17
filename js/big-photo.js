'use strict';

(function () {
  var START_NUMBERS_OF_COMMENTS = 5;
  var COMMENTS_STEP = 5;
  var ENTER_KEYCODE = 13;

  var bigPictureElement = document.querySelector('.big-picture');
  var bigPictureCloseElement = bigPictureElement.querySelector('.big-picture__cancel');

  function renderBigPhoto(photoToView) {
    var photoElement = bigPictureElement.querySelector('.big-picture__preview');

    photoElement.querySelector('.big-picture__img img').src = photoToView.url;
    photoElement.querySelector('.big-picture__social .social__caption').textContent = photoToView.description;
    photoElement.querySelector('.big-picture__social .likes-count').textContent = photoToView.likes;
    photoElement.querySelector('.comments-count').textContent = photoToView.comments.length;

    renderCommentsList(photoToView);

    return photoElement;
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

    photoToView.comments.forEach(function (element, i) {
      comments.push(renderComment(photoToView, i));
    });

    return comments;
  }

  var commentsList = [];

  function addCommentsToList(addedСomments) {
    var commentsFragment = document.createDocumentFragment();

    addedСomments.forEach(function (element) {
      commentsFragment.appendChild(element);
    });

    return commentsFragment;
  }

  function renderCard(photoNumber) {
    var bigPhoto = renderBigPhoto(photoNumber);

    var socialCommentsElement = bigPhoto.querySelector('.social__comments');
    socialCommentsElement.innerHTML = '';

    var socialCommentCountElement = bigPhoto.querySelector('.social__comment-count');
    var commentsLoaderElement = bigPhoto.querySelector('.comments-loader');

    var commentsListCopy = commentsList.slice(0);
    var visibleCommentsNumber = START_NUMBERS_OF_COMMENTS;
    var visibleCommentsList = commentsListCopy.slice(0, visibleCommentsNumber);

    var visibleCommentsCountElement = socialCommentCountElement.querySelector('span');
    visibleCommentsCountElement.textContent = visibleCommentsList.length;

    function moreVisibleComments() {
      visibleCommentsNumber += COMMENTS_STEP;
      visibleCommentsList = commentsListCopy.slice(0, visibleCommentsNumber);
      visibleCommentsCountElement.textContent = visibleCommentsList.length;

      if (commentsListCopy.length === visibleCommentsList.length) {
        commentsLoaderElement.classList.add('hidden');
      }

      return visibleCommentsList;
    }

    commentsLoaderElement.addEventListener('click', function () {
      socialCommentsElement.innerHTML = '';
      socialCommentsElement.appendChild(addCommentsToList(moreVisibleComments()));
    });

    socialCommentsElement.appendChild(addCommentsToList(visibleCommentsList));

    bigPictureCloseElement.addEventListener('click', bigPhotoCloseClickHandler);
    document.addEventListener('keydown', bigPhotoCloseEscKeydownHandler);
  }

  var bodyHtmlElement = document.querySelector('body');

  var picturesElement = document.querySelector('.pictures');

  function openingLargePhoto(evt) {
    var target = evt.target;

    while (target !== picturesElement) {
      if (target.className === 'picture') {
        evt.preventDefault();
        var number = target.dataset.id;
        bodyHtmlElement.classList.add('modal-open');
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

  function bigPhotoCloseClickHandler() {
    bigPictureElement.classList.add('hidden');
    bodyHtmlElement.classList.remove('modal-open');
    bigPictureCloseElement.removeEventListener('click', bigPhotoCloseClickHandler);
    document.removeEventListener('keydown', bigPhotoCloseEscKeydownHandler);
  }

  function bigPhotoCloseEscKeydownHandler(evt) {
    if (evt.keyCode === window.form.ESC_KEYCODE) {
      bigPhotoCloseClickHandler();
    }
  }
})();
