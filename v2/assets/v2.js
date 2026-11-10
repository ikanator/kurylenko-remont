'use strict';
// v2 behaviours: price calculator + lead form (demo -> WhatsApp)
(function () {
  var isUA = document.documentElement.lang === 'uk';
  var WA = 'https://wa.me/48787760020?text=';
  var fmt = function (n) { return Math.round(n / 100) * 100; };
  var nf = function (n) { return n.toLocaleString(isUA ? 'uk-UA' : 'pl-PL').replace(/ /g, ' '); };

  // per-m2 labour ranges derived from the FAQ figures on the existing pages
  var R = {
    mieszkanie: { min: 1000, max: 1800, pl: 'remont mieszkania pod klucz', ua: 'ремонт квартири під ключ', rt: 'm2' },
    lazienka: { min: 2000, max: 4400, pl: 'remont łazienki', ua: 'ремонт ванної кімнати', rt: 'm2' },
    kuchnia: { min: 1500, max: 2500, pl: 'remont kuchni', ua: 'ремонт кухні', rt: 'm2' },
    wykonczenie: { min: 800, max: 1400, pl: 'wykończenie od stanu deweloperskiego', ua: 'оздоблення від стану забудовника', rt: 'm2' },
    szpachlowanie: { min: 25, max: 55, pl: 'szpachlowanie ścian i sufitów', ua: 'шпаклювання стін і стель', rt: 'm2' }
  };
  var std = { eco: [0, 0.4], std: [0.3, 0.7], pre: [0.6, 1] };

  var calc = document.getElementById('calc');
  if (calc) {
    var type = document.getElementById('c-type'), area = document.getElementById('c-area'),
      out = document.getElementById('c-out'), wal = document.getElementById('c-wa');
    var update = function () {
      var r = R[type.value], a = Math.max(1, Math.min(500, parseFloat(area.value) || 0));
      var s = (calc.querySelector('input[name=c-std]:checked') || {}).value || 'std';
      var span = r.max - r.min, lo = (r.min + span * std[s][0]) * a, hi = (r.min + span * std[s][1]) * a;
      var step = r.max < 100 ? 10 : 100;
      lo = Math.round(lo / step) * step; hi = Math.round(hi / step) * step;
      out.textContent = nf(lo) + ' – ' + nf(hi) + ' PLN';
      var stdName = { eco: isUA ? 'економ' : 'ekonomiczny', std: isUA ? 'стандарт' : 'standard', pre: isUA ? 'преміум' : 'premium' }[s];
      var msg = isUA
        ? 'Добрий день, цікавить ' + r.ua + ', ' + a + ' м², стандарт: ' + stdName + '. Орієнтовно ' + nf(lo) + '–' + nf(hi) + ' PLN. Прошу про точну оцінку.'
        : 'Cześć, interesuje mnie ' + r.pl + ', ' + a + ' m², standard: ' + stdName + '. Orientacyjnie ' + nf(lo) + '–' + nf(hi) + ' PLN. Proszę o dokładną wycenę.';
      wal.href = WA + encodeURIComponent(msg);
    };
    calc.addEventListener('input', update);
    calc.addEventListener('change', update);
    update();
  }

  var form = document.getElementById('leadForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = form.elements, name = f.name.value.trim(), phone = f.phone.value.trim();
      if (!name || !phone) {
        (name ? f.phone : f.name).focus();
        return;
      }
      var msg = isUA
        ? 'Добрий день, мене звати ' + name + '. Телефон: ' + phone + '. Цікавить: ' + f.service.value + (f.area.value ? ', ' + f.area.value + ' м²' : '') + '.'
        : 'Cześć, mam na imię ' + name + '. Telefon: ' + phone + '. Interesuje mnie: ' + f.service.value + (f.area.value ? ', ' + f.area.value + ' m²' : '') + '.';
      window.open(WA + encodeURIComponent(msg), '_blank', 'noopener');
    });
  }
})();
