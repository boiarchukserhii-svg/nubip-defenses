/* Annual statistics use the same live items as the calendar and search. */
(() => {
  'use strict';
  const layout = document.querySelector('.layout');
  const nav = document.querySelector('.mobile-nav');
  if (!layout || !nav) return;
  const searchPanel = document.querySelector('.filters')?.closest('.panel');
  searchPanel?.classList.add('main-search-panel');
  const screen = document.createElement('section');
  screen.id = 'statistics-screen';
  screen.className = 'panel';
  screen.innerHTML = `
    <h2 tabindex="-1">Статистика захистів</h2>
    <p class="stats-intro">Підсумки за обраний рік. Натисніть на діаграму, щоб переглянути відповідні захисти.</p>
    <div class="annual-filters">
      <label>Рік<select id="stats-year" aria-label="Рік статистики"></select></label>
      <label>Науковий ступінь<select id="stats-degree" aria-label="Ступінь у статистиці">
        <option value="">Усі ступені</option><option value="PhD">PhD</option>
        <option value="Доктор наук">Доктор наук</option><option value="Кандидат наук">Кандидат наук</option>
        <option value="unknown">Не зазначено</option></select></label>
      <button type="button" id="stats-reset">Скинути фільтри</button>
    </div>
    <p id="stats-selection" class="stats-selection" role="status"></p>
    <div class="annual-totals" aria-live="polite"></div>
    <div class="annual-charts">
      <section class="annual-chart"><h3>За науковим ступенем</h3><div id="stats-degrees"></div></section>
      <section class="annual-chart"><h3>За спеціальністю</h3><div id="stats-specialties"></div>
        <button type="button" id="stats-more-specialties" hidden>Показати всі спеціальності</button>
      </section>
    </div>
    <details id="stats-records"><summary>Переглянути захисти</summary>
      <div id="stats-record-list"></div><button id="stats-more-records" type="button" hidden>Показати ще</button>
    </details>
    <p class="annual-updated"></p>`;
  layout.before(screen);
  const style = document.createElement('style');
  style.textContent = `
#statistics-screen{display:none;scroll-margin-top:12px}
body.statistics-mode #statistics-screen{display:block}
body.statistics-mode .layout,body.statistics-mode #calendar-screen,body.statistics-mode #nextDefense,body.statistics-mode .main-search-panel{display:none!important}
#statistics-screen h2{margin:0;color:#263d49;font-size:23px}
.stats-intro,.annual-updated{color:#637681;font-size:13px;line-height:1.5}
.annual-filters{display:flex;gap:10px;align-items:end;flex-wrap:wrap;margin:18px 0}
.annual-filters label{display:flex;flex-direction:column;gap:6px;font-size:13px;font-weight:700;flex:1;min-width:120px}
.annual-filters select{width:100%;min-height:44px;font-size:16px}
.annual-filters button{min-height:44px;background:#e8f5ee;color:#147d6b;font-size:13px}
.stats-selection{font-size:13px;color:#147d6b;line-height:1.5;overflow-wrap:anywhere}
.stats-selection:empty{display:none}
.annual-totals{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:16px 0 22px}
.annual-total{border-radius:17px;background:#e8f5ee;padding:14px 12px;min-width:0}
.annual-total:nth-child(2){background:#f0f3f4}.annual-total:nth-child(3){background:#e5f0ff}
.annual-total strong{display:block;font-size:27px;color:#263d49}.annual-total span{font-size:12px;color:#637681;line-height:1.4;display:block;margin-top:5px}
.annual-charts{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.4fr);gap:18px}
.annual-chart{min-width:0;background:#f7faf9;border:1px solid #e2ece7;padding:16px;border-radius:18px}
.annual-chart h3{margin:0 0 14px;color:#274b57;font-size:17px}
.annual-bar{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:5px 10px;min-height:58px;width:100%;border:1px solid transparent!important;text-align:left;padding:10px!important;margin:6px 0;background:#fff!important;color:#274b57!important}
.annual-bar[aria-pressed=true]{border-color:#138d78!important;box-shadow:inset 0 0 0 1px #138d78}
.annual-bar:disabled{cursor:default;opacity:.6}.annual-bar-label{font-size:13px;line-height:1.4;overflow-wrap:anywhere}
.annual-bar-value{font-size:13px;white-space:nowrap}.annual-bar-value small{color:#637681;font-weight:400}
.annual-bar-track{grid-column:1/-1;height:9px;border-radius:8px;overflow:hidden;background:#eaf0ed}
.annual-bar-fill{display:block;height:100%;background:#159b74;border-radius:8px}
.annual-chart button[id]{margin-top:10px;background:#e8f5ee;color:#147d6b;min-height:44px;font-size:13px}
#stats-records{margin-top:20px;border-top:1px solid #e2ece7;padding-top:10px}
#stats-records>summary{padding:12px 0;cursor:pointer;color:#147d6b;font-weight:750;min-height:44px}
.annual-record{padding:16px 0;border-top:1px solid #e2ece7;overflow-wrap:anywhere}
.annual-record h4{font-size:16px;line-height:1.45;margin:7px 0;color:#263d49}
.annual-record p{margin:6px 0;color:#637681;font-size:13px;line-height:1.5}
.annual-record a{color:#157b70;font-size:13px;font-weight:700}
.annual-record-date{color:#147d6b;font-size:13px;font-weight:750}
#stats-more-records{min-height:44px;background:#e8f5ee;color:#147d6b;margin-top:12px}
#statistics-screen button:focus-visible,#statistics-screen select:focus-visible,#stats-records>summary:focus-visible{outline:3px solid #138d78;outline-offset:2px}
.mobile-nav .statistics-nav{font-size:11px!important}
@media(max-width:790px){.annual-charts{grid-template-columns:minmax(0,1fr)}.annual-totals{gap:7px}.annual-total{padding:12px 9px}.annual-total strong{font-size:24px}.annual-chart{padding:12px}.mobile-nav{gap:3px}.mobile-nav button{font-size:11px!important}}
`;
  document.head.append(style);
  const byId = id => screen.querySelector('#' + id);
  const html = value => String(value ?? '').replace(/[&<>"']/g, ch =>
    ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  const degreeKey = entry => entry.degree || 'unknown';
  const degreeNames = {'PhD':'PhD','Доктор наук':'Доктор наук','Кандидат наук':'Кандидат наук','unknown':'Не зазначено'};
  const specialtyKey = entry => String(entry.specialty || '').trim() || 'Не зазначено';
  let chosenYear = null, chosenDegree = '', chosenSpecialty = '';
  let showAllSpecialties = false, recordLimit = 20;
  let specialtyGroups = [];

  function yearItems() {
    return items.filter(entry => /^\d{4}-\d{2}-\d{2}$/.test(entry.date || '') && entry.date.startsWith(chosenYear || ''));
  }
  function selectedItems() {
    return yearItems().filter(entry => (!chosenDegree || degreeKey(entry) === chosenDegree) &&
      (!chosenSpecialty || specialtyKey(entry) === chosenSpecialty));
  }
  function bar(label, count, total, kind, key, active) {
    const percent = total ? Math.round(count / total * 100) : 0;
    return `<button type="button" class="annual-bar" data-stats-kind="${kind}" data-stats-key="${html(key)}"
      aria-pressed="${active}" aria-label="${html(label)}, захистів: ${count}, ${percent}%${active?', фільтр активний':''}" ${count ? '' : 'disabled'}>
      <span class="annual-bar-label">${html(label)}</span><strong class="annual-bar-value">${count} <small>· ${percent}%</small></strong>
      <span class="annual-bar-track" aria-hidden="true"><span class="annual-bar-fill" style="width:${percent}%"></span></span></button>`;
  }
  function drawRecords(entries) {
    const sorted = entries.slice().sort((a,b) => (b.date+' '+(b.time||'')).localeCompare(a.date+' '+(a.time||'')));
    byId('stats-records').querySelector('summary').textContent = `Переглянути захисти (${entries.length})`;
    byId('stats-record-list').innerHTML = sorted.length ? sorted.slice(0, recordLimit).map(entry =>
      `<article class="annual-record"><div class="annual-record-date">${html(nice(entry.date))}${entry.time?' · '+html(entry.time):''}</div>
        <h4>Захист дисертації ${html(entry.person_original || entry.person || entry.title)}</h4>
        <p>${html(entry.degree_full || degreeNames[degreeKey(entry)])}</p>
        ${entry.topic?`<p><b>Тема:</b> ${html(entry.topic)}</p>`:''}
        <p><b>Спеціальність:</b> ${html(specialtyKey(entry))}</p>
        ${officialUrl(entry)?`<a href="${html(officialUrl(entry))}" target="_blank" rel="noopener noreferrer">Офіційна сторінка та документи ↗</a>`:''}
        ${calendarControls(entry)}</article>`).join('') : '<p class="stats-intro">За вибраними умовами захистів немає.</p>';
    byId('stats-more-records').hidden = sorted.length <= recordLimit;
  }
  function draw() {
    const years = [...new Set(items.filter(entry => /^\d{4}-\d{2}-\d{2}$/.test(entry.date || '')).map(entry => entry.date.slice(0,4)))].sort().reverse();
    if (chosenYear === null && years.length) chosenYear = years[0];
    byId('stats-year').innerHTML = years.length ? years.map(year => `<option value="${year}">${year}</option>`).join('') : '<option value="">Немає даних</option>';
    byId('stats-year').value = chosenYear || '';
    byId('stats-degree').value = chosenDegree;
    const entries = selectedItems(), now = today();
    const past = entries.filter(entry => entry.date < now).length;
    screen.querySelector('.annual-totals').innerHTML =
      `<div class="annual-total"><strong>${entries.length}</strong><span>Захистів ${chosenYear?'за '+chosenYear+' рік':''}</span></div>`+
      `<div class="annual-total"><strong>${past}</strong><span>Дата минула</span></div>`+
      `<div class="annual-total"><strong>${entries.length-past}</strong><span>Сьогодні й майбутні</span></div>`;
    byId('stats-selection').textContent = [chosenDegree?`Ступінь: ${degreeNames[chosenDegree]}`:'',chosenSpecialty?`Спеціальність: ${chosenSpecialty}`:''].filter(Boolean).join(' · ');
    // Each chart keeps the other chart's filter, so its options remain selectable.
    const degreeEntries = yearItems().filter(entry => !chosenSpecialty || specialtyKey(entry) === chosenSpecialty);
    const counts = new Map();
    degreeEntries.forEach(entry => counts.set(degreeKey(entry), (counts.get(degreeKey(entry)) || 0) + 1));
    byId('stats-degrees').innerHTML = Object.entries(degreeNames).filter(([key]) => key !== 'unknown' || counts.has(key))
      .map(([key,label]) => bar(label, counts.get(key) || 0, degreeEntries.length, 'degree', key, chosenDegree === key)).join('');
    const specEntries = yearItems().filter(entry => !chosenDegree || degreeKey(entry) === chosenDegree);
    const specs = new Map();
    specEntries.forEach(entry => specs.set(specialtyKey(entry), (specs.get(specialtyKey(entry)) || 0) + 1));
    specialtyGroups = [...specs].sort((a,b) => b[1]-a[1] || a[0].localeCompare(b[0], 'uk'));
    const visible = showAllSpecialties ? specialtyGroups : specialtyGroups.slice(0,8);
    if (chosenSpecialty && !visible.some(([key]) => key === chosenSpecialty)) {
      const selected = specialtyGroups.find(([key]) => key === chosenSpecialty);
      if (selected) visible.push(selected);
    }
    byId('stats-specialties').innerHTML = visible.length ? visible.map(([key,count]) =>
      bar(key, count, specEntries.length, 'specialty', key, chosenSpecialty === key)).join('') : '<p class="stats-intro">За цей рік даних немає.</p>';
    const more = byId('stats-more-specialties');
    more.hidden = specialtyGroups.length <= 8;
    more.textContent = showAllSpecialties ? 'Показати основні спеціальності' : `Показати всі спеціальності (${specialtyGroups.length})`;
    drawRecords(entries);
    screen.querySelector('.annual-updated').textContent = document.getElementById('status')?.textContent || '';
  }
  byId('stats-year').onchange = event => {
    chosenYear = event.target.value; chosenSpecialty = ''; recordLimit = 20; draw();
  };
  byId('stats-degree').onchange = event => {
    chosenDegree = event.target.value; chosenSpecialty = ''; recordLimit = 20; draw();
  };
  byId('stats-reset').onclick = () => {
    chosenDegree = ''; chosenSpecialty = ''; showAllSpecialties = false; recordLimit = 20; draw();
  };
  byId('stats-more-specialties').onclick = () => { showAllSpecialties = !showAllSpecialties; draw(); };
  byId('stats-more-records').onclick = () => { recordLimit += 20; drawRecords(selectedItems()); };
  screen.addEventListener('click', event => {
    const button = event.target.closest('[data-stats-kind]');
    if (!button) return;
    const key = button.dataset.statsKey;
    if (button.dataset.statsKind === 'degree') chosenDegree = chosenDegree === key ? '' : key;
    else chosenSpecialty = chosenSpecialty === key ? '' : key;
    recordLimit = 20; draw();
    byId('stats-records').open = true;
    // Re-rendered chart buttons retain keyboard focus without moving the page.
    [...screen.querySelectorAll('[data-stats-kind]')].find(el =>
      el.dataset.statsKind === button.dataset.statsKind && el.dataset.statsKey === key)?.focus({preventScroll:true});
  });
  const navButton = document.createElement('button');
  navButton.type = 'button';
  navButton.className = 'statistics-nav';
  navButton.innerHTML = '<span class="nav-icon" aria-hidden="true">▥</span><span>Статистика</span>';
  navButton.onclick = () => {
    document.getElementById('q').value = '';
    day = ''; tab = 'statistics'; setTabs(); render();
    screen.scrollIntoView({behavior:'smooth',block:'start'});
  };
  nav.append(navButton);
  const previousRender = render;
  render = function () {
    previousRender();
    const active = tab === 'statistics';
    document.body.classList.toggle('statistics-mode', active);
    navButton.classList.toggle('current', active);
    navButton.setAttribute('aria-current', active ? 'page' : 'false');
    if (active) draw();
  };
  draw();
})();
