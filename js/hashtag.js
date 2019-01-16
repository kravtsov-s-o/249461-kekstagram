'use strict';

(function () {
  var ERROR_COLOR = 'red';
  var MAX_NUMBER_HASHTAG = 5;

  window.form.buttonPublish.addEventListener('click', function () {
    if (window.form.hashtagsField.value) {
      var hashtagsValue = window.form.hashtagsField.value.toLowerCase().trim();
      var hashtagsArray = hashtagsValue.split(' ');
      var hashtagsArrayElement;

      if (window.form.checkHashtagsRepeat(hashtagsArray)) {
        window.form.hashtagsField.setCustomValidity('Хэштеги не могут повторятся');
        window.form.hashtagsField.style.outlineColor = ERROR_COLOR;
        return;
      } else if (hashtagsArray.length > MAX_NUMBER_HASHTAG) {
        window.form.hashtagsField.setCustomValidity('Максимальное кол-во хэштегов не может быть больше 5');
        window.form.hashtagsField.style.outlineColor = ERROR_COLOR;
        return;
      }

      for (var i = 0; i < hashtagsArray.length; i++) {
        hashtagsArrayElement = hashtagsArray[i].split('');

        if (window.form.checkOctothorpe(hashtagsArrayElement[0])) {
          window.form.hashtagsField.setCustomValidity('Хэштеги должны начинаться с #');
          window.form.hashtagsField.style.outlineColor = ERROR_COLOR;
          return;
        } else if (window.form.checkHashtagMaxLength(hashtagsArrayElement)) {
          window.form.hashtagsField.setCustomValidity('Длина хэштега не может быть более 20 символов, включая #');
          window.form.hashtagsField.style.outlineColor = ERROR_COLOR;
          return;
        } else if (window.form.checkHashtagMinLength(hashtagsArrayElement)) {
          window.form.hashtagsField.setCustomValidity('Хэштег не может состоять только из #');
          window.form.hashtagsField.style.outlineColor = ERROR_COLOR;
          return;
        }
      }

      window.form.hashtagsField.setCustomValidity('');
    }
  });
})();
