'use strict';
(function () {
  window.form.buttonPublish.addEventListener('click', function () {
    if (window.form.hashtags.value) {
      var hashtagsValue = window.form.hashtags.value.toLowerCase();
      var hashtagsArray = hashtagsValue.split(' ');
      var hashtagsArrayElement;

      if (window.form.checkHashtagsRepeat(hashtagsArray)) {
        window.form.hashtags.setCustomValidity('Хэштеги не могут повторятся');
        window.form.hashtags.style.outlineColor = 'red';
        return;
      } else if (hashtagsArray.length > 5) {
        window.form.hashtags.setCustomValidity('Максимальное кол-во хэштегов не может быть больше 5');
        window.form.hashtags.style.outlineColor = 'red';
        return;
      }

      for (var i = 0; i < hashtagsArray.length; i++) {
        hashtagsArrayElement = hashtagsArray[i].split('');

        if (window.form.checkOctothorpe(hashtagsArrayElement[0])) {
          window.form.hashtags.setCustomValidity('Хэштеги должны начинаться с #');
          window.form.hashtags.style.outlineColor = 'red';
          return;
        } else if (window.form.checkHashtagMaxLength(hashtagsArrayElement)) {
          window.form.hashtags.setCustomValidity('Длина хэштега не может быть более 20 символов, включая #');
          window.form.hashtags.style.outlineColor = 'red';
          return;
        } else if (window.form.checkHashtagMinLength(hashtagsArrayElement)) {
          window.form.hashtags.setCustomValidity('Хэштег не может состоять только из #');
          window.form.hashtags.style.outlineColor = 'red';
          return;
        }
      }

      window.form.hashtags.setCustomValidity('');
    }
  });
})();
