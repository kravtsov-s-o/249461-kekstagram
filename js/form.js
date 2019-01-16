'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var MAX_HASHTAG_LENGTH = 20;
  var MIN_HASHTAG_LENGTH = 2;

  var uploadFileElement = document.querySelector('.img-upload__input');
  var uploadOverlayElement = document.querySelector('.img-upload__overlay');

  var uploadCancelElement = uploadOverlayElement.querySelector('.img-upload__cancel');

  var imgUploadFormElement = document.querySelector('.img-upload__form');

  uploadFileElement.addEventListener('change', function () {
    uploadOverlayElement.classList.remove('hidden');

    uploadCancelElement.addEventListener('click', uploadPhotoCloseHandler);
    document.addEventListener('keydown', uploadPhotoCloseEscHandler);

    window.scaleValueElement.value = '100%';

    effectLevel.classList.add('hidden');
  });

  function uploadPhotoCloseHandler() {
    uploadOverlayElement.classList.add('hidden');
    uploadCancelElement.removeEventListener('click', uploadPhotoCloseHandler);
    document.removeEventListener('keydown', uploadPhotoCloseEscHandler);

    imgUploadFormElement.reset();
  }

  function uploadPhotoCloseEscHandler(evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      if (document.activeElement === uploadPhotoComment || document.activeElement === hashtagsElement) {
        return;
      }
      uploadPhotoCloseHandler();
    }
  }

  var downloadPhoto = uploadOverlayElement.querySelector('.img-upload__preview img');
  var effectsListElement = document.querySelector('.effects__list');

  var effectLevel = uploadOverlayElement.querySelector('.effect-level');
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

    switch (effectValue) {
      case 'chrome':
        downloadPhoto.style.filter = 'grayscale(' + effectCalculation(1, 0, someLevel) + ')';
        break;
      case 'sepia':
        downloadPhoto.style.filter = 'sepia(' + effectCalculation(1, 0, someLevel) + ')';
        break;
      case 'marvin':
        downloadPhoto.style.filter = 'invert(' + effectCalculation(100, 0, someLevel) + '%)';
        break;
      case 'phobos':
        downloadPhoto.style.filter = 'blur(' + effectCalculation(3, 1, someLevel) + 'px)';
        break;
      case 'heat':
        downloadPhoto.style.filter = 'brightness(' + effectCalculation(3, 0, someLevel) + ')';
        break;
    }
  }

  effectsListElement.addEventListener('change', function (e) {
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
    window.scaleValueElement.value = '100%';

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

  var formUploadPhotoElement = document.querySelector('.img-upload__form');
  var buttonPublish = uploadOverlayElement.querySelector('.img-upload__submit');

  var hashtagsElement = formUploadPhotoElement.querySelector('.text__hashtags');
  var uploadPhotoComment = formUploadPhotoElement.querySelector('.text__description');

  function checkOctothorpe(hashtag) {
    return hashtag !== '#';
  }

  function checkHashtagMaxLength(hashtag) {
    return hashtag.length > MAX_HASHTAG_LENGTH;
  }

  function checkHashtagMinLength(hashtag) {
    return hashtag.length < MIN_HASHTAG_LENGTH;
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

  var mainElement = document.querySelector('main');

  formUploadPhotoElement.addEventListener('submit', function (evt) {
    window.backend.upload(new FormData(formUploadPhotoElement), function () {
      uploadOverlayElement.classList.add('hidden');
      openSuccessMessage();
    }, function () {
      uploadOverlayElement.classList.add('hidden');
      openErrorMessage();
    });

    evt.preventDefault();
  });

  var successTemplateElement = document.querySelector('#success').content;
  var messageSuccess = successTemplateElement.cloneNode(true);
  var successButton = messageSuccess.querySelector('.success__button');
  var errorTemplateElement = document.querySelector('#error').content;
  var errorMessage = errorTemplateElement.cloneNode(true);
  var buttonTryAgain = errorMessage.querySelector('.error__button:nth-child(1)');
  var buttonOtherFile = errorMessage.querySelector('.error__button:nth-child(2)');

  function openSuccessMessage() {
    imgUploadFormElement.reset();

    mainElement.appendChild(messageSuccess);
    successButton.addEventListener('click', messageSuccessCloseHandler);
    document.addEventListener('click', messageSuccessCloseHandler);
    document.addEventListener('keydown', messageSuccessCloseEscHandler);
  }

  function messageSuccessCloseHandler() {
    var popupSuccess = mainElement.querySelector('.success');
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
    var errorUpload = mainElement.querySelector('.error');

    mainElement.appendChild(errorMessage);
    buttonTryAgain.addEventListener('click', errorMessageCloseHandler);
    buttonOtherFile.addEventListener('click', errorMessageCloseHandler);
    document.addEventListener('keydown', errorMessageCloseEscHandler);
    errorUpload.addEventListener('click', errorMessageCloseHandler);
  }

  function errorMessageCloseHandler() {
    var errorUpload = mainElement.querySelector('.error');

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
    uploadFileElement: uploadFileElement,
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
