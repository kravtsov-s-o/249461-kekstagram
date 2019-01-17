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

    uploadCancelElement.addEventListener('click', uploadCancelClickHandler);
    document.addEventListener('keydown', documentUploadCancelKeydownHandler);

    window.scaleValueElement.value = '100%';

    effectLevelElement.classList.add('hidden');
  });

  function closeUploadFile() {
    uploadOverlayElement.classList.add('hidden');
    uploadCancelElement.removeEventListener('click', uploadCancelClickHandler);
    document.removeEventListener('keydown', documentUploadCancelKeydownHandler);

    imgUploadFormElement.reset();
  }

  function uploadCancelClickHandler() {
    closeUploadFile();
  }

  function documentUploadCancelKeydownHandler(evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      if (document.activeElement === uploadPhotoComment || document.activeElement === hashtagsElement) {
        return;
      }
      closeUploadFile();
    }
  }

  var downloadPhotoElement = uploadOverlayElement.querySelector('.img-upload__preview img');
  var effectsListElement = document.querySelector('.effects__list');

  var effectLevelElement = uploadOverlayElement.querySelector('.effect-level');
  var effectLevelLineElement = effectLevelElement.querySelector('.effect-level__line');
  var effectLevelPinElement = effectLevelElement.querySelector('.effect-level__pin');
  var effectLevelDepthElement = effectLevelElement.querySelector('.effect-level__depth');
  var effectLevelValueElement = effectLevelElement.querySelector('.effect-level__value');

  var effectValue;

  function effectCalculation(max, min, value) {
    return (max - min) * (value / window.gallery.MAX_SLIDER_VALUE);
  }

  function calculationEffectWithSomeLevel(someLevel) {
    effectLevelPinElement.style.left = someLevel + '%';
    effectLevelDepthElement.style.width = someLevel + '%';
    effectLevelValueElement.value = Math.floor(someLevel);

    switch (effectValue) {
      case 'chrome':
        downloadPhotoElement.style.filter = 'grayscale(' + effectCalculation(1, 0, someLevel) + ')';
        break;
      case 'sepia':
        downloadPhotoElement.style.filter = 'sepia(' + effectCalculation(1, 0, someLevel) + ')';
        break;
      case 'marvin':
        downloadPhotoElement.style.filter = 'invert(' + effectCalculation(100, 0, someLevel) + '%)';
        break;
      case 'phobos':
        downloadPhotoElement.style.filter = 'blur(' + effectCalculation(3, 1, someLevel) + 'px)';
        break;
      case 'heat':
        downloadPhotoElement.style.filter = 'brightness(' + effectCalculation(3, 0, someLevel) + ')';
        break;
    }
  }

  effectsListElement.addEventListener('change', function (e) {
    var target = e.target;

    if (target === 'INPUT') {
      return;
    }
    target = target.parentNode;

    var targetInputElement = target.querySelector('input');
    downloadPhotoElement.classList.remove('effects__preview--' + effectValue);
    effectValue = targetInputElement.value;
    downloadPhotoElement.removeAttribute('style');
    downloadPhotoElement.classList.add('effects__preview--' + effectValue);
    window.scaleValueElement.value = '100%';

    if (effectValue === 'none') {
      effectLevelElement.classList.add('hidden');
    } else {
      effectLevelElement.classList.remove('hidden');
      effectLevelPinElement.style.left = '100%';
      effectLevelDepthElement.style.width = '100%';
    }

    effectLevelLineElement.addEventListener('click', function (evt) {
      var clickX = evt.offsetX;
      var clickOffset = Math.floor(clickX / (effectLevelLineElement.offsetWidth / window.gallery.MAX_SLIDER_VALUE));
      calculationEffectWithSomeLevel(clickOffset);
    });
  });

  var formUploadPhotoElement = document.querySelector('.img-upload__form');
  var buttonPublishElement = uploadOverlayElement.querySelector('.img-upload__submit');

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
  var successButtonElement = messageSuccess.querySelector('.success__button');
  var errorTemplateElement = document.querySelector('#error').content;
  var errorMessage = errorTemplateElement.cloneNode(true);
  var buttonTryAgainElement = errorMessage.querySelector('.error__button:nth-child(1)');
  var buttonOtherFileElement = errorMessage.querySelector('.error__button:nth-child(2)');

  function openSuccessMessage() {
    imgUploadFormElement.reset();

    mainElement.appendChild(messageSuccess);
    successButtonElement.addEventListener('click', successButtonClickHandler);
    document.addEventListener('click', documentMessageSuccessClickHandler);
    document.addEventListener('keydown', documentMessageSuccessKeydownHandler);
  }

  function closeSuccessMessage() {
    var popupSuccessElement = mainElement.querySelector('.success');

    popupSuccessElement.remove();
    document.removeEventListener('click', documentMessageSuccessClickHandler);
    document.removeEventListener('keydown', documentMessageSuccessKeydownHandler);
  }

  function successButtonClickHandler() {
    closeSuccessMessage();
  }

  function documentMessageSuccessClickHandler() {
    closeSuccessMessage();
  }

  function documentMessageSuccessKeydownHandler(evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closeSuccessMessage();
    }
  }

  function openErrorMessage() {
    imgUploadFormElement.reset();

    mainElement.appendChild(errorMessage);
    buttonTryAgainElement.addEventListener('click', buttonTryAgainClickHandler);
    buttonOtherFileElement.addEventListener('click', buttonOtherFileClickHandler);
    document.addEventListener('keydown', documentErrorMessageKeydownHandler);
    document.addEventListener('click', documentErrorUploadClickHandler);
  }

  function closeErrorMessage() {
    var errorUploadElement = mainElement.querySelector('.error');

    errorUploadElement.remove();
    document.removeEventListener('keydown', documentErrorMessageKeydownHandler);
    document.removeEventListener('click', documentErrorUploadClickHandler);
  }

  function buttonTryAgainClickHandler() {
    closeErrorMessage();
  }

  function buttonOtherFileClickHandler() {
    closeErrorMessage();
  }

  function documentErrorUploadClickHandler() {
    closeErrorMessage();
  }

  function documentErrorMessageKeydownHandler(evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closeErrorMessage();
    }
  }

  window.form = {
    ESC_KEYCODE: ESC_KEYCODE,
    uploadFileElement: uploadFileElement,
    downloadPhotoElement: downloadPhotoElement,
    effectLevelElement: effectLevelElement,
    effectLevelPinElement: effectLevelPinElement,
    effectLevelLineElement: effectLevelLineElement,
    calculationEffectWithSomeLevel: calculationEffectWithSomeLevel,
    buttonPublishElement: buttonPublishElement,
    checkOctothorpe: checkOctothorpe,
    checkHashtagMaxLength: checkHashtagMaxLength,
    checkHashtagMinLength: checkHashtagMinLength,
    checkHashtagsRepeat: checkHashtagsRepeat,
    hashtagsElement: hashtagsElement
  };
})();
