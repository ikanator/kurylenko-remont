'use strict';
// v2 behaviours: price calculator + lead form (demo -> WhatsApp)
(function () {
  var isUA = document.documentElement.lang === 'uk';
  var WA = 'https://wa.me/48787760020?text=';
  var fmt = function (n) { return Math.round(n / 100) * 100; };
  var nf = function (n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '\u00a0'); };

  // Labour ranges. Whole-job types use the FAQ figures on the existing service pages
  // (bathroom 5-6 m2 floor = 12-22k, kitchen 10-14 m2 = 15-35k, flat 50 m2 = 50-90k, ...).
  // Area means FLOOR area, except 'plytki' where it is the TILED area (walls + floor).
  var R = {
    mieszkanie: { min: 1000, max: 1800, lo: 20, hi: 200, def: 50, fix: [0, 0], pl: 'remont mieszkania pod klucz', ua: 'ремонт квартири під ключ',
      lp: 'Powierzchnia mieszkania (m²)', lu: 'Площа квартири (м²)', hp: '', hu: '' },
    lazienka: { min: 2000, max: 4400, lo: 2, hi: 12, def: 5, fix: [0, 0], pl: 'remont łazienki', ua: 'ремонт ванної кімнати',
      lp: 'Powierzchnia podłogi łazienki (m²)', lu: 'Площа підлоги ванної кімнати (м²)',
      hp: 'Podaj powierzchnię podłogi (typowa łazienka: 4–6 m²). Płytki na ścianach są w cenie. Samo układanie płytek wybierz osobno.',
      hu: 'Вкажіть площу підлоги (типова ванна: 4–6 м²). Плитка на стінах враховано. Лише укладання плитки обирайте окремо.' },
    kuchnia: { min: 1500, max: 2500, lo: 4, hi: 30, def: 12, fix: [0, 0], pl: 'remont kuchni', ua: 'ремонт кухні',
      lp: 'Powierzchnia kuchni (m²)', lu: 'Площа кухні (м²)', hp: 'Podaj powierzchnię podłogi kuchni (zwykle 8–14 m²).', hu: 'Вкажіть площу підлоги кухні (зазвичай 8–14 м²).' },
    plytki: { min: 180, max: 300, lo: 4, hi: 80, def: 25, fix: [2000, 3000], pl: 'układanie płytek z białym montażem', ua: 'укладання плитки з монтажем сантехніки',
      lp: 'Powierzchnia płytek: ściany + podłoga (m²)', lu: 'Площа плитки: стіни + підлога (м²)',
      hp: 'Robocizna za układanie płytek (z fugowaniem) plus biały montaż (WC, umywalka, bateria, kabina). Bez skuwania, instalacji i materiałów.',
      hu: 'Робота з укладання плитки (із затиранням швів) плюс монтаж сантехніки (унітаз, умивальник, змішувач, кабіна). Без демонтажу, інженерних робіт і матеріалів.' },
    wykonczenie: { min: 800, max: 1400, lo: 20, hi: 200, def: 50, fix: [0, 0], pl: 'wykończenie od stanu deweloperskiego', ua: 'оздоблення від стану забудовника',
      lp: 'Powierzchnia mieszkania (m²)', lu: 'Площа квартири (м²)', hp: '', hu: '' },
    szpachlowanie: { min: 25, max: 55, lo: 5, hi: 400, def: 50, fix: [0, 0], pl: 'szpachlowanie ścian i sufitów', ua: 'шпаклювання стін і стель',
      lp: 'Powierzchnia ścian i sufitów (m²)', lu: 'Площа стін і стель (м²)', hp: '', hu: '' }
  };
  var std = { eco: [0, 0.4], std: [0.3, 0.7], pre: [0.6, 1] };

  var calc = document.getElementById('calc');
  if (calc) {
    var type = document.getElementById('c-type'), area = document.getElementById('c-area'),
      out = document.getElementById('c-out'), wal = document.getElementById('c-wa'),
      lbl = document.getElementById('c-area-label'), hint = document.getElementById('c-hint');
    var setType = function () {
      var r = R[type.value];
      area.min = r.lo; area.max = r.hi; area.value = r.def;
      lbl.textContent = isUA ? r.lu : r.lp;
      hint.textContent = isUA ? r.hu : r.hp;
    };
    var update = function () {
      var r = R[type.value], raw = parseFloat(area.value) || 0;
      var a = Math.max(r.lo, Math.min(r.hi, raw));
      var s = (calc.querySelector('input[name=c-std]:checked') || {}).value || 'std';
      var span = r.max - r.min;
      var lo = (r.min + span * std[s][0]) * a + r.fix[0], hi = (r.min + span * std[s][1]) * a + r.fix[1];
      var step = r.max < 100 ? 10 : (r.max < 500 ? 50 : 100);
      lo = Math.round(lo / step) * step; hi = Math.round(hi / step) * step;
      out.textContent = nf(lo) + ' – ' + nf(hi) + ' PLN';
      if (raw && raw !== a) {
        hint.textContent = (isUA ? 'Для цього виду робіт рахуємо ' : 'Dla tego zakresu liczymy ') + a + ' m². ' + (isUA ? 'Для точної оцінки напишіть нам.' : 'Dla dokładnej wyceny napisz do nas.');
      } else {
        hint.textContent = isUA ? r.hu : r.hp;
      }
      var stdName = { eco: isUA ? 'економ' : 'ekonomiczny', std: isUA ? 'стандарт' : 'standard', pre: isUA ? 'преміум' : 'premium' }[s];
      var msg = isUA
        ? 'Добрий день, цікавить ' + r.ua + ', ' + a + ' м², стандарт: ' + stdName + '. Орієнтовно ' + nf(lo) + '–' + nf(hi) + ' PLN. Прошу про точну оцінку.'
        : 'Cześć, interesuje mnie ' + r.pl + ', ' + a + ' m², standard: ' + stdName + '. Orientacyjnie ' + nf(lo) + '–' + nf(hi) + ' PLN. Proszę o dokładną wycenę.';
      wal.href = WA + encodeURIComponent(msg);
    };
    type.addEventListener('change', function () { setType(); update(); });
    calc.addEventListener('input', update);
    calc.addEventListener('change', update);
    setType();
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
