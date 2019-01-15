'use strict';

(function () {
  var START_NUMBERS_OF_COMMENTS = 5;
  var COMMENTS_STEP = 5;
  var ENTER_KEYCODE = 13;

  var bigPicture = document.querySelector('.big-picture');
  var bigPictureClose = bigPicture.querySelector('.big-picture__cancel');

  function renderBigPhoto(photoToView) {
    var photo = bigPicture.querySelector('.big-picture__preview');

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
    var fragmentComment = document.createDocumentFragment();

    for (var i = 0; i < addedСomments.length; i++) {
      fragmentComment.appendChild(addedСomments[i]);
    }

    return fragmentComment;
  }

  function renderCard(photoNumber) {
    var bigPhoto = renderBigPhoto(photoNumber);

    var socialCommentsList = bigPhoto.querySelector('.social__comments');
    socialCommentsList.innerHTML = '';

    var socialCommentCount = bigPhoto.querySelector('.social__comment-count');
    var commentsLoader = bigPhoto.querySelector('.comments-loader');

    var commentsListCopy = commentsList.slice(0);
    var numberOfVisibleComments = START_NUMBERS_OF_COMMENTS;
    var visibleCommentsList = commentsListCopy.slice(0, numberOfVisibleComments);

    var visibleCommentsCount = socialCommentCount.querySelector('span');
    visibleCommentsCount.textContent = visibleCommentsList.length;

    function moreVisibleComments() {
      numberOfVisibleComments += COMMENTS_STEP;
      visibleCommentsList = commentsListCopy.slice(0, numberOfVisibleComments);
      visibleCommentsCount.textContent = visibleCommentsList.length;

      if (commentsListCopy.length === visibleCommentsList.length) {
        commentsLoader.classList.add('hidden');
      }

      return visibleCommentsList;
    }

    commentsLoader.addEventListener('click', function () {
      socialCommentsList.innerHTML = '';
      socialCommentsList.appendChild(addCommentsToList(moreVisibleComments()));
    });

    socialCommentsList.appendChild(addCommentsToList(visibleCommentsList));

    bigPictureClose.addEventListener('click', closeBigPhoto);
    document.addEventListener('keydown', bigPhotoCloseEscHandler);
  }

  var bodyHtml = document.querySelector('body');

  var picturesGallery = document.querySelector('.pictures');

  function openingLargePhoto(evt) {
    var target = evt.target;

    while (target !== picturesGallery) {
      if (target.tagName === 'A') {
        evt.preventDefault();
        var number = target.dataset.id;
        bodyHtml.classList.add('modal-open');
        bigPicture.classList.remove('hidden');
        commentsList = renderCommentsList(window.customPhotosList[number]);
        renderCard(window.customPhotosList[number]);

        return;
      }
      target = target.parentNode;
    }
  }

  picturesGallery.addEventListener('click', function (evt) {
    openingLargePhoto(evt);
  });

  picturesGallery.addEventListener('keydown', function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      openingLargePhoto(evt);
    }
  });

  function closeBigPhoto() {
    bigPicture.classList.add('hidden');
    bodyHtml.classList.remove('modal-open');
    bigPictureClose.removeEventListener('click', closeBigPhoto);
    document.removeEventListener('keydown', bigPhotoCloseEscHandler);
  }

  function bigPhotoCloseEscHandler(evt) {
    if (evt.keyCode === window.form.ESC_KEYCODE) {
      closeBigPhoto();
    }
  }
})();
