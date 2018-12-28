'use strict';

(function () {
  function getCoords(elem) {
    var box = elem.getBoundingClientRect();

    return {
      top: box.top + pageYOffset,
      left: box.left + pageXOffset
    };

  }

  window.form.effectLevelPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var sliderCoords = getCoords(window.form.effectLevel);

    function onMouseMove(moveEvt) {
      moveEvt.preventDefault();

      var clickOffset = (moveEvt.pageX - sliderCoords.left) / (window.form.effectLevelLine.offsetWidth / window.gallery.MAX_SLIDER_VALUE);

      if (clickOffset < 0) {
        clickOffset = 0;
      } else if (clickOffset > window.gallery.MAX_SLIDER_VALUE) {
        clickOffset = window.gallery.MAX_SLIDER_VALUE;
      }

      window.form.effectWithSomeLevel(clickOffset);
    }

    function onMouseUp(upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
})();
