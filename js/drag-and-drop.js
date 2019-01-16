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

    function mouseMoveHandler(moveEvt) {
      moveEvt.preventDefault();

      var clickOffset = (moveEvt.pageX - sliderCoords.left) / (window.form.effectLevelLine.offsetWidth / window.gallery.MAX_SLIDER_VALUE);

      if (clickOffset < 0) {
        clickOffset = 0;
      } else if (clickOffset > window.gallery.MAX_SLIDER_VALUE) {
        clickOffset = window.gallery.MAX_SLIDER_VALUE;
      }

      window.form.calculationEffectWithSomeLevel(clickOffset);
    }

    function mouseUpHandler(upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    }

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  });
})();
