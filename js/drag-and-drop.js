'use strict';

(function () {
  function getCoords(elem) {
    var box = elem.getBoundingClientRect();

    return {
      top: box.top + pageYOffset,
      left: box.left + pageXOffset
    };

  }

  window.form.effectLevelPinElement.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var sliderCoords = getCoords(window.form.effectLevelElement);

    function documentMouseMoveHandler(moveEvt) {
      moveEvt.preventDefault();

      var clickOffset = (moveEvt.pageX - sliderCoords.left) / (window.form.effectLevelLineElement.offsetWidth / window.gallery.MAX_SLIDER_VALUE);

      if (clickOffset < 0) {
        clickOffset = 0;
      } else if (clickOffset > window.gallery.MAX_SLIDER_VALUE) {
        clickOffset = window.gallery.MAX_SLIDER_VALUE;
      }

      window.form.calculationEffectWithSomeLevel(clickOffset);
    }

    function documentMouseUpHandler(upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', documentMouseMoveHandler);
      document.removeEventListener('mouseup', documentMouseUpHandler);
    }

    document.addEventListener('mousemove', documentMouseMoveHandler);
    document.addEventListener('mouseup', documentMouseUpHandler);
  });
})();
