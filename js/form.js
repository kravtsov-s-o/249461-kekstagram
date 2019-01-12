'use strict';

(function () {
  // ---------------------------------------------- Modulle 4. Обработка событий
  var ESC_KEYCODE = 27;

  var uploadFile = document.querySelector('.img-upload__input');
  var uploadOverlay = document.querySelector('.img-upload__overlay');

  var uploadCancel = uploadOverlay.querySelector('.img-upload__cancel');

  var imgUploadForm = document.querySelector('.img-upload__form');
  var formInputs = imgUploadForm.querySelectorAll('input');

  // открытие окна редактирования загруженого фото
  uploadFile.addEventListener('change', function () {
    uploadOverlay.classList.remove('hidden');

    uploadCancel.addEventListener('click', closeUploadPhoto);
    document.addEventListener('keydown', closeUploadPhotoEsc);

    effectLevel.classList.add('hidden');
  });

  // закрытие окна редактирования
  function closeUploadPhoto() {
    uploadOverlay.classList.add('hidden');
    uploadCancel.removeEventListener('click', closeUploadPhoto);
    document.removeEventListener('keydown', closeUploadPhotoEsc);

    formInputs.value = '';
    window.form.hashtags.setCustomValidity('');
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

  // переменные для работы с баром эффектов
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
    downloadPhoto.removeAttribute('style'); // удаляет ранее применный стиль с ползунка
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

  // ------- ВАЛИДАЦИЯ ХЭШ-ТЕГОВ --------------

  var formUploadPhoto = document.querySelector('.img-upload__form');
  var buttonPublish = uploadOverlay.querySelector('.img-upload__submit');

  var hashtags = formUploadPhoto.querySelector('.text__hashtags');
  var uploadPhotoComment = formUploadPhoto.querySelector('.text__description');

  function checkOctothorpe(hashtag) {
    return hashtag !== '#' ? true : false;
  }

  function checkHashtagMaxLength(hashtag) {
    return hashtag.length > 20 ? true : false;
  }

  function checkHashtagMinLength(hashtag) {
    return hashtag.length < 2 ? true : false;
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

  // запрет закртыия окна на Esc при активных полях формы
  hashtags.addEventListener('focus', function () {
    document.removeEventListener('keydown', closeUploadPhotoEsc);
  });

  hashtags.addEventListener('blur', function () {
    document.addEventListener('keydown', closeUploadPhotoEsc);
  });

  uploadPhotoComment.addEventListener('focus', function () {
    document.removeEventListener('keydown', closeUploadPhotoEsc);
  });

  uploadPhotoComment.addEventListener('blur', function () {
    document.addEventListener('keydown', closeUploadPhotoEsc);
  });

  var main = document.querySelector('main');

  // ------------------------------------------------------------------------------------------------
  formUploadPhoto.addEventListener('submit', function (evt) {
    window.upload(new FormData(formUploadPhoto), function () {
      uploadOverlay.classList.add('hidden');
      openSuccessMessage();
    }, function () {
      uploadOverlay.classList.add('hidden');
      openErrorMessage();
    });

    evt.preventDefault();
  });
  // ------------------------------------------------------------------------------------------------
  // ОКНО УСПЕШНОЙ ЗАГРУЗКИ ФОТО
  // открытие окна успешной загрузки
  function openSuccessMessage() {
    var successTemplate = document.querySelector('#success').content;
    var messageSuccess = successTemplate.cloneNode(true);
    var successButton = messageSuccess.querySelector('.success__button');

    main.appendChild(messageSuccess);
    successButton.addEventListener('click', closeMessageSuccess);
    document.addEventListener('click', closeMessageSuccess);
    document.addEventListener('keydown', closeMessageSuccessEsc);
  }

  // закрытие окна успешной загрузки
  function closeMessageSuccess() {
    var popupSuccess = main.querySelector('.success');
    popupSuccess.remove();
    document.removeEventListener('click', closeMessageSuccess);
    document.removeEventListener('keydown', closeMessageSuccessEsc);
  }

  function closeMessageSuccessEsc(evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closeMessageSuccess();
    }
  }

  // ------------------------------------------------------------------------------------------------
  // ОКНО ОШИБКИ ЗАГРУЗКИ ФОТО
  function openErrorMessage() {
    var errorTemplate = document.querySelector('#error').content;
    var errorMessage = errorTemplate.cloneNode(true);
    var buttonTryAgain = errorMessage.querySelector('.error__button:nth-child(1)');
    var buttonOtherFile = errorMessage.querySelector('.error__button:nth-child(2)');
    var errorUpload = main.querySelector('.error');
    main.appendChild(errorMessage);
    buttonTryAgain.addEventListener('click', closeErrorMessage);
    buttonOtherFile.addEventListener('click', closeErrorMessage);
    document.addEventListener('keydown', closeErrorMessageEsc);
    errorUpload.addEventListener('click', closeErrorMessage);
  }

  // закрытие окна ошибки загрузки
  function closeErrorMessage() {
    var errorUpload = main.querySelector('.error');
    errorUpload.remove();
    document.removeEventListener('keydown', closeErrorMessageEsc);
    errorUpload.removeEventListener('click', closeErrorMessage);
  }

  function closeErrorMessageEsc(evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closeMessageSuccess();
    }
  }
  // ------------------------------------------------------------------------------------------------

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
    hashtags: hashtags
  };
})();
