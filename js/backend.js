'use strict';

(function () {
  var SUCCESS_CODE = 200;
  var TIMEOUT = 10000;

  var URL_UPLOAD = 'https://js.dump.academy/kekstagram';
  var URL_DATA = 'https://js.dump.academy/kekstagram/data';

  function gettingServerResponse(xhr, onLoad, onError) {
    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_CODE) {
        onLoad(xhr.response);
      } else {
        onError('Ошибка загрузки файла');
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Долгий ответ сервера');
    });

    xhr.timeout = TIMEOUT; // 5s
  }

  function upload(data, onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    gettingServerResponse(xhr, onLoad, onError);

    xhr.open('POST', URL_UPLOAD);
    xhr.send(data);
  }

  function loadData(onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.open('GET', URL_DATA);

    gettingServerResponse(xhr, onLoad, onError);

    xhr.send();
  }

  window.backend = {
    upload: upload,
    loadData: loadData
  };
})();
