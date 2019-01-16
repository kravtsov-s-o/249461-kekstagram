'use strict';

(function () {
  var ERROR_COLOR = 'red';
  var MAX_NUMBER_HASHTAG = 5;

  window.form.buttonPublish.addEventListener('click', function () {
    if (window.form.hashtagsElement.value) {
      var hashtagsValue = window.form.hashtagsElement.value.toLowerCase().trim();
      var hashtagsArray = hashtagsValue.split(' ');
      var hashtagsArrayElement;

      if (window.form.checkHashtagsRepeat(hashtagsArray)) {
        window.form.hashtagsElement.setCustomValidity('Хэштеги не могут повторятся');
        window.form.hashtagsElement.style.outlineColor = ERROR_COLOR;
        return;
      } else if (hashtagsArray.length > MAX_NUMBER_HASHTAG) {
        window.form.hashtagsElement.setCustomValidity('Максимальное кол-во хэштегов не может быть больше 5');
        window.form.hashtagsElement.style.outlineColor = ERROR_COLOR;
        return;
      }

      /* for (var i = 0; i < hashtagsArray.length; i++) {
        hashtagsArrayElement = hashtagsArray[i].split('');

        if (window.form.checkOctothorpe(hashtagsArrayElement[0])) {
          window.form.hashtagsElement.setCustomValidity('Хэштеги должны начинаться с #');
          window.form.hashtagsElement.style.outlineColor = ERROR_COLOR;
          return;
        } else if (window.form.checkHashtagMaxLength(hashtagsArrayElement)) {
          window.form.hashtagsElement.setCustomValidity('Длина хэштега не может быть более 20 символов, включая #');
          window.form.hashtagsElement.style.outlineColor = ERROR_COLOR;
          return;
        } else if (window.form.checkHashtagMinLength(hashtagsArrayElement)) {
          window.form.hashtagsElement.setCustomValidity('Хэштег не может состоять только из #');
          window.form.hashtagsElement.style.outlineColor = ERROR_COLOR;
          return;
        }
      } */

      hashtagsArray.forEach(function (elem) {
        hashtagsArrayElement = elem.split('');

        if (window.form.checkOctothorpe(hashtagsArrayElement[0])) {
          window.form.hashtagsElement.setCustomValidity('Хэштеги должны начинаться с #');
          window.form.hashtagsElement.style.outlineColor = ERROR_COLOR;
          return;
        } else if (window.form.checkHashtagMaxLength(hashtagsArrayElement)) {
          window.form.hashtagsElement.setCustomValidity('Длина хэштега не может быть более 20 символов, включая #');
          window.form.hashtagsElement.style.outlineColor = ERROR_COLOR;
          return;
        } else if (window.form.checkHashtagMinLength(hashtagsArrayElement)) {
          window.form.hashtagsElement.setCustomValidity('Хэштег не может состоять только из #');
          window.form.hashtagsElement.style.outlineColor = ERROR_COLOR;
          return;
        }
      });


      window.form.hashtagsElement.setCustomValidity('');
    }
  });
})();
