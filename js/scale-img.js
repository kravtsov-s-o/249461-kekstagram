'use strict';

(function () {
  var MIN_SIZE_PHOTO = 25;
  var MAX_SIZE_PHOTO = 100;
  var SCALE_STEP = 25;

  var scaleValueElement = document.querySelector('.scale__control--value');
  var buttonMinElement = document.querySelector('.scale__control--smaller');
  var buttonMaxElement = document.querySelector('.scale__control--bigger');

  scaleValueElement.value = '100%';
  var currentPhotoScale = MAX_SIZE_PHOTO;

  function photoReduction() {
    if (currentPhotoScale > MIN_SIZE_PHOTO) {
      currentPhotoScale -= SCALE_STEP;
      window.form.downloadPhoto.style.transform = 'scale(' + (currentPhotoScale / MAX_SIZE_PHOTO) + ')';
      scaleValueElement.value = currentPhotoScale + '%';
    }
  }

  function photoIncrease() {
    if (currentPhotoScale < MAX_SIZE_PHOTO) {
      currentPhotoScale += SCALE_STEP;
      window.form.downloadPhoto.style.transform = 'scale(' + (currentPhotoScale / MAX_SIZE_PHOTO) + ')';
      scaleValueElement.value = currentPhotoScale + '%';
    }
  }

  buttonMinElement.addEventListener('click', photoReduction);

  buttonMaxElement.addEventListener('click', photoIncrease);

  window.scaleValueElement = scaleValueElement;
})();
