'use strict';

(function () {
  // ---------------------------------------------- Modulle 4. Обработка событий
  var ESC_KEYCODE = 27;

  var uploadFile = document.querySelector('.img-upload__input');
  var uploadOverlay = document.querySelector('.img-upload__overlay');

  var uploadCancel = uploadOverlay.querySelector('.img-upload__cancel');
  var bigPictureClouse = window.bigPicture.querySelector('.big-picture__cancel');

  // открытие окна редактирования загруженого фото
  uploadFile.onchange = function () {
    uploadOverlay.classList.remove('hidden');

    uploadCancel.addEventListener('click', closeUploadPhoto);
    document.addEventListener('keydown', closeUploadPhotoEsc);

    effectLevel.classList.add('hidden');
  };

  // закрытие окна редактирования
  function closeUploadPhoto() {
    uploadOverlay.classList.add('hidden');
    uploadCancel.removeEventListener('click', closeUploadPhoto);
    document.removeEventListener('keydown', closeUploadPhotoEsc);
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

  function effectCalc(max, min, value) {
    return (max - min) * (value / window.gallery.MAX_SLIDER_VALUE);
  }

  function effectWithSomeLevel(someLevel) {
    effectLevelPin.style.left = someLevel + '%';
    effectLevelDepth.style.width = someLevel + '%';
    effectLevelValue.value = someLevel;

    var effectFilter;

    if (effectValue === 'chrome') {
      effectFilter = 'grayscale';
      downloadPhoto.style.filter = effectFilter + '(' + effectCalc(1, 0, someLevel) + ')';
    } else if (effectValue === 'sepia') {
      effectFilter = 'sepia';
      downloadPhoto.style.filter = effectFilter + '(' + effectCalc(1, 0, someLevel) + ')';
    } else if (effectValue === 'marvin') {
      effectFilter = 'invert';
      downloadPhoto.style.filter = effectFilter + '(' + effectCalc(100, 0, someLevel) + '%)';
    } else if (effectValue === 'phobos') {
      effectFilter = 'blur';
      downloadPhoto.style.filter = effectFilter + '(' + effectCalc(3, 0, someLevel) + 'px)';
    } else {
      effectFilter = 'brightness';
      downloadPhoto.style.filter = effectFilter + '(' + effectCalc(3, 1, someLevel) + ')';
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
      var clickOffset = Math.floor(clickX / (effectLevelLine.offsetWidth / window.gallery.MAX_SLIDER_VALUE)); // 100% максимальная длина слайдера
      effectWithSomeLevel(clickOffset);
    });
  });

  // ------- ВАЛИДАЦИЯ ХЭШ-ТЕГОВ --------------

  var formUploadPhoto = document.querySelector('.img-upload__form');
  var buttonPublish = uploadOverlay.querySelector('.img-upload__submit');

  var hashtags = formUploadPhoto.querySelector('.text__hashtags');
  var uploadPhotoComment = formUploadPhoto.querySelector('.text__description');

  function checkOctothorpe(hashtagsArrayElement) {
    return hashtagsArrayElement !== '#' ? true : false;
  }

  function checkHashtagMaxLength(hashtagsArrayElement) {
    return hashtagsArrayElement.length > 20 ? true : false;
  }

  function checkHashtagMinLength(hashtagsArrayElement) {
    return hashtagsArrayElement.length < 2 ? true : false;
  }

  function checkHashtagsRepeat(hashtagsArrayElement) {
    var hashtagsObj = {};

    for (var repeat = 0; repeat < hashtagsArrayElement.length; repeat++) {
      var key = hashtagsArrayElement[repeat];
      if (hashtagsObj[key]) {
        return true;
      }
      hashtagsObj[key] = true;
    }
    return false;
  }

  buttonPublish.addEventListener('click', function () {
    if (hashtags.value) {
      var hashtagsValue = hashtags.value.toLowerCase();
      var hashtagsArray = hashtagsValue.split(' ');
      var hashtagsArrayElement;

      if (checkHashtagsRepeat(hashtagsArray)) {
        hashtags.setCustomValidity('Хэштеги не могут повторятся');
        return;
      } else if (hashtagsArray.length > 5) {
        hashtags.setCustomValidity('Максимальное кол-во хэштегов не может быть больше 5');
        return;
      }

      for (var i = 0; i < hashtagsArray.length; i++) {
        hashtagsArrayElement = hashtagsArray[i].split('');

        if (checkOctothorpe(hashtagsArrayElement[0])) {
          hashtags.setCustomValidity('Хэштеги должны начинаться с #');
          return;
        } else if (checkHashtagMaxLength(hashtagsArrayElement)) {
          hashtags.setCustomValidity('Длина хэштега не может быть более 20 символов, включая #');
          return;
        } else if (checkHashtagMinLength(hashtagsArrayElement)) {
          hashtags.setCustomValidity('Хэштег не может состоять только из #');
          return;
        }
      }

      hashtags.setCustomValidity('');
    }
  });

  // запрет закртыия окна на Esc при активных полях формы
  hashtags.onfocus = function () {
    document.removeEventListener('keydown', closeUploadPhotoEsc);
  };

  hashtags.onblur = function () {
    document.addEventListener('keydown', closeUploadPhotoEsc);
  };

  uploadPhotoComment.onfocus = function () {
    document.removeEventListener('keydown', closeUploadPhotoEsc);
  };

  uploadPhotoComment.onblur = function () {
    document.addEventListener('keydown', closeUploadPhotoEsc);
  };

  window.form = {
    ESC_KEYCODE: ESC_KEYCODE,
    bigPictureClouse: bigPictureClouse,
    downloadPhoto: downloadPhoto,
    effectLevel: effectLevel,
    effectLevelPin: effectLevelPin,
    effectLevelLine: effectLevelLine,
    effectWithSomeLevel: effectWithSomeLevel
  };
})();