'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  window.form.uploadFileElement.addEventListener('change', function () {
    var file = window.form.uploadFileElement.files[0];
    var fileName = file.name.toLowerCase();

    var match = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (match) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        window.form.downloadPhotoElement.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  });
})();
