'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var MAX_HASHTAG_LENGTH = 20;
  var MIN_HASHTAG_LENGTH = 2;

  var uploadFile = document.querySelector('.img-upload__input');
  var uploadOverlay = document.querySelector('.img-upload__overlay');

  var uploadCancel = uploadOverlay.querySelector('.img-upload__cancel');

  var imgUploadForm = document.querySelector('.img-upload__form');

  uploadFile.addEventListener('change', function () {
    uploadOverlay.classList.remove('hidden');

    uploadCancel.addEventListener('click', uploadPhotoCloseHandler);
    document.addEventListener('keydown', uploadPhotoCloseEscHandler);

    window.scaleValue.value = '100%';

    effectLevel.classList.add('hidden');
  });

  function uploadPhotoCloseHandler() {
    uploadOverlay.classList.add('hidden');
    uploadCancel.removeEventListener('click', uploadPhotoCloseHandler);
    document.removeEventListener('keydown', uploadPhotoCloseEscHandler);

    imgUploadForm.reset();
  }

  function uploadPhotoCloseEscHandler(evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      if (document.activeElement === uploadPhotoComment || document.activeElement === hashtagsElement) {
        return;
      }
      uploadPhotoCloseHandler();
    }
  }

  var downloadPhoto = uploadOverlay.querySelector('.img-upload__preview img');
  var effectsList = document.querySelector('.effects__list');

  var effectLevel = uploadOverlay.querySelector('.effect-level');
  var effectLevelLine = effectLevel.querySelector('.effect-level__line');
  var effectLevelPin = effectLevel.querySelector('.effect-level__pin');
  var effectLevelDepth = effectLevel.querySelector('.effect-level__depth');
  var effectLevelValue = effectLevel.querySelector('.effect-level__value');

  var effectValue;

  function effectCalculation(max, min, value) {
    return (max - min) * (value / window.gallery.MAX_SLIDER_VALUE);
  }

  function calculationEffectWithSomeLevel(someLevel) {
    effectLevelPin.style.left = someLevel + '%';
    effectLevelDepth.style.width = someLevel + '%';
    effectLevelValue.value = Math.floor(someLevel);

    var effectFilter;

    if (effectValue === 'chrome') {
      effectFilter = 'grayscale';
      downloadPhoto.style.filter = effectFilter + '(' + effectCalculation(1, 0, someLevel) + ')';
    } else if (effectValue === 'sepia') {
      effectFilter = 'sepia';
      downloadPhoto.style.filter = effectFilter + '(' + effectCalculation(1, 0, someLevel) + ')';
    } else if (effectValue === 'marvin') {
      effectFilter = 'invert';
      downloadPhoto.style.filter = effectFilter + '(' + effectCalculation(100, 0, someLevel) + '%)';
    } else if (effectValue === 'phobos') {
      effectFilter = 'blur';
      downloadPhoto.style.filter = effectFilter + '(' + effectCalculation(3, 0, someLevel) + 'px)';
    } else {
      effectFilter = 'brightness';
      downloadPhoto.style.filter = effectFilter + '(' + effectCalculation(3, 1, someLevel) + ')';
    }
  }

  effectsList.addEventListener('change', function (e) {
    var target = e.target;

    if (target === 'INPUT') {
      return;
    }
    target = target.parentNode;

    var targetInput = target.querySelector('input');
    downloadPhoto.classList.remove('effects__preview--' + effectValue);
    effectValue = targetInput.value;
    downloadPhoto.removeAttribute('style');
    downloadPhoto.classList.add('effects__preview--' + effectValue);
    window.scaleValue.value = '100%';

    if (effectValue === 'none') {
      effectLevel.classList.add('hidden');
    } else {
      effectLevel.classList.remove('hidden');
      effectLevelPin.style.left = '100%';
      effectLevelDepth.style.width = '100%';
    }

    effectLevelLine.addEventListener('click', function (evt) {
      var clickX = evt.offsetX;
      var clickOffset = Math.floor(clickX / (effectLevelLine.offsetWidth / window.gallery.MAX_SLIDER_VALUE));
      calculationEffectWithSomeLevel(clickOffset);
    });
  });

  var formUploadPhoto = document.querySelector('.img-upload__form');
  var buttonPublish = uploadOverlay.querySelector('.img-upload__submit');

  var hashtagsElement = formUploadPhoto.querySelector('.text__hashtags');
  var uploadPhotoComment = formUploadPhoto.querySelector('.text__description');

  function checkOctothorpe(hashtag) {
    return hashtag !== '#' ? true : false;
  }

  function checkHashtagMaxLength(hashtag) {
    return hashtag.length > MAX_HASHTAG_LENGTH ? true : false;
  }

  function checkHashtagMinLength(hashtag) {
    return hashtag.length < MIN_HASHTAG_LENGTH ? true : false;
  }

  function checkHashtagsRepeat(hashtagsArray) {
    var hashtagsObj = {};

    for (var repeat = 0; repeat < hashtagsArray.length; repeat++) {
      var key = hashtagsArray[repeat];
      if (hashtagsObj[key]) {
        return true;
      }
      hashtagsObj[key] = true;
    }
    return false;
  }

  var main = document.querySelector('main');

  formUploadPhoto.addEventListener('submit', function (evt) {
    window.backend.upload(new FormData(formUploadPhoto), function () {
      uploadOverlay.classList.add('hidden');
      openSuccessMessage();
    }, function () {
      uploadOverlay.classList.add('hidden');
      openErrorMessage();
    });

    evt.preventDefault();
  });

  function openSuccessMessage() {
    var successTemplate = document.querySelector('#success').content;
    var messageSuccess = successTemplate.cloneNode(true);
    var successButton = messageSuccess.querySelector('.success__button');

    imgUploadForm.reset();

    main.appendChild(messageSuccess);
    successButton.addEventListener('click', messageSuccessCloseHandler);
    document.addEventListener('click', messageSuccessCloseHandler);
    document.addEventListener('keydown', messageSuccessCloseEscHandler);
  }

  function messageSuccessCloseHandler() {
    var popupSuccess = main.querySelector('.success');
    popupSuccess.remove();
    document.removeEventListener('click', messageSuccessCloseHandler);
    document.removeEventListener('keydown', messageSuccessCloseEscHandler);
  }

  function messageSuccessCloseEscHandler(evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      messageSuccessCloseHandler();
    }
  }

  function openErrorMessage() {
    var errorTemplate = document.querySelector('#error').content;
    var errorMessage = errorTemplate.cloneNode(true);
    var buttonTryAgain = errorMessage.querySelector('.error__button:nth-child(1)');
    var buttonOtherFile = errorMessage.querySelector('.error__button:nth-child(2)');
    var errorUpload = main.querySelector('.error');
    main.appendChild(errorMessage);
    buttonTryAgain.addEventListener('click', errorMessageCloseHandler);
    buttonOtherFile.addEventListener('click', errorMessageCloseHandler);
    document.addEventListener('keydown', errorMessageCloseEscHandler);
    errorUpload.addEventListener('click', errorMessageCloseHandler);
  }

  function errorMessageCloseHandler() {
    var errorUpload = main.querySelector('.error');
    errorUpload.remove();
    document.removeEventListener('keydown', errorMessageCloseEscHandler);
    errorUpload.removeEventListener('click', errorMessageCloseHandler);
  }

  function errorMessageCloseEscHandler(evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      messageSuccessCloseHandler();
    }
  }

  window.form = {
    ESC_KEYCODE: ESC_KEYCODE,
    uploadFile: uploadFile,
    downloadPhoto: downloadPhoto,
    effectLevel: effectLevel,
    effectLevelPin: effectLevelPin,
    effectLevelLine: effectLevelLine,
    calculationEffectWithSomeLevel: calculationEffectWithSomeLevel,
    buttonPublish: buttonPublish,
    checkOctothorpe: checkOctothorpe,
    checkHashtagMaxLength: checkHashtagMaxLength,
    checkHashtagMinLength: checkHashtagMinLength,
    checkHashtagsRepeat: checkHashtagsRepeat,
    hashtagsElement: hashtagsElement
  };
})();
