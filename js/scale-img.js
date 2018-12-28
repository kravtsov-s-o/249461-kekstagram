'use strict';

(function () {
  // управление масштабом фотографии

  var scaleValue = document.querySelector('.scale__control--value');
  var buttonMin = document.querySelector('.scale__control--smaller');
  var buttonMax = document.querySelector('.scale__control--bigger');

  scaleValue.value = '100%';

  buttonMin.onclick = function () {
    if (scaleValue.value === '100%') {
      window.form.downloadPhoto.style.transform = 'scale(0.75)';
      scaleValue.value = '75%';
    } else if (scaleValue.value === '75%') {
      window.form.downloadPhoto.style.transform = 'scale(0.5)';
      scaleValue.value = '50%';
    } else if (scaleValue.value === '50%') {
      window.form.downloadPhoto.style.transform = 'scale(0.25)';
      scaleValue.value = '25%';
    }

    return scaleValue;
  };

  buttonMax.onclick = function () {
    if (scaleValue.value === '25%') {
      window.form.downloadPhoto.style.transform = 'scale(0.5)';
      scaleValue.value = '50%';
    } else if (scaleValue.value === '50%') {
      window.form.downloadPhoto.style.transform = 'scale(0.75)';
      scaleValue.value = '75%';
    } else if (scaleValue.value === '75%') {
      window.form.downloadPhoto.style.transform = 'scale(1)';
      scaleValue.value = '100%';
    }

    return scaleValue;
  };

  window.scaleValue = scaleValue;
})();
