// Які email приймає сайт: лише латиниця (портал 1С відхиляє кирилицю) і не російські домени.
// Те саме правило на сервері — App\Service\EmailPolicy; змінюйте в обох місцях.
(function (w) {
  var FORMAT = /^[A-Za-z0-9.!#$%&'*+\/=?^_`{|}~-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
  var BLOCKED_TLD = /\.(ru|su|xn--p1ai)$/i;
  var BLOCKED_SERVICE = /(^|\.)(yandex|rambler)\.[a-z.]+$/i;

  var MESSAGE_FORMAT = 'Вкажіть коректний email латиницею, наприклад name@gmail.com';
  var MESSAGE_BLOCKED = 'Пошту з російським доменом не приймаємо. Вкажіть іншу адресу';

  // null — адреса підходить, інакше текст помилки
  function error(email) {
    email = String(email || '').trim();

    if (!FORMAT.test(email) || email.length > 255) return MESSAGE_FORMAT;

    var domain = email.slice(email.lastIndexOf('@') + 1).toLowerCase();
    if (BLOCKED_TLD.test(domain) || BLOCKED_SERVICE.test(domain)) return MESSAGE_BLOCKED;

    return null;
  }

  w.SkinEmail = {
    error: error,
    isValid: function (email) { return error(email) === null; },
  };
}(window));
