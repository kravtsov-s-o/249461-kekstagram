'use strict';

(function () {
  var MIN_SIZE_PHOTO = 25;
  var MAX_SIZE_PHOTO = 100;
  var SCALE_STEP = 25;

  var scaleValue = document.querySelector('.scale__control--value');
  var buttonMin = document.querySelector('.scale__control--smaller');
  var buttonMax = document.querySelector('.scale__control--bigger');

  scaleValue.value = '100%';
  var currentPhotoScale = MAX_SIZE_PHOTO;

  function photoReducion() {
    if (currentPhotoScale > MIN_SIZE_PHOTO) {
      currentPhotoScale -= SCALE_STEP;
      window.form.downloadPhoto.style.transform = 'scale(' + (currentPhotoScale / MAX_SIZE_PHOTO) + ')';
      scaleValue.value = currentPhotoScale + '%';
    }
  }

  function photoIncrease() {
    if (currentPhotoScale < MAX_SIZE_PHOTO) {
      currentPhotoScale += SCALE_STEP;
      window.form.downloadPhoto.style.transform = 'scale(' + (currentPhotoScale / MAX_SIZE_PHOTO) + ')';
      scaleValue.value = currentPhotoScale + '%';
    }
  }

  buttonMin.addEventListener('click', photoReducion());

  buttonMax.addEventListener('click', photoIncrease());

  window.scaleValue = scaleValue;
})();
