'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  window.form.uploadFile.addEventListener('change', function () {
    var file = window.form.uploadFile.files[0];
    var fileName = file.name.toLowerCase();

    var match = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (match) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        window.form.downloadPhoto.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  });
})();
