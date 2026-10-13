/* NUBiP Defenses — mobile dashboard and single enhanced calendar, no push. */
(() => {
  'use strict';
  const css = document.createElement('style');
  css.textContent = `
:root{color:#233947;background:#f5f9f8}body{background:radial-gradient(ellipse at top left,#e1f4ec,transparent 52%),radial-gradient(ellipse at top right,#eaf0ff,transparent 48%),#f5f8f8!important;padding-bottom:90px}
header{background:transparent!important;color:#223746!important;padding:24px max(18px,calc((100vw - 1120px)/2)) 33px!important}
header .nubip-brand{margin-bottom:20px!important;gap:12px!important}header .nubip-brand-name{color:#27435a;font-size:clamp(11px,1.5vw,14px)!important}header .nubip-brand img{width:54px!important;height:70px!important}
header .tag{color:#6e858b!important;font-size:11px!important}header h1{color:#203545!important;letter-spacing:-.045em;font-size:clamp(29px,5vw,48px)!important;margin:12px 0!important}header p{color:#738791!important;opacity:1!important}
main{max-width:1160px!important;margin:0 auto 100px!important}.panel,.card{background:#fff!important;border:1px solid #edf1f2!important;border-radius:26px!important;box-shadow:0 9px 28px #1f3d5110!important}.panel{padding:21px!important}.card{padding:22px!important}.card h3{color:#263947!important}.card p{color:#637681}.date{color:#118474!important}
.stats{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px!important;width:100%}
.stat{position:relative;min-width:0;border-radius:19px;padding:13px 10px 12px;background:#eaf5f0;display:flex;flex-direction:column;align-items:flex-start;min-height:112px}
.stat::before{content:'◉';font-size:22px;line-height:1;margin-bottom:9px;color:#278c76}
.stat:nth-child(1){background:#e5f3ed}.stat:nth-child(1)::before{content:'▦'}
.stat:nth-child(2){background:#e5f0ff}.stat:nth-child(2)::before{content:'◷';color:#467cba}
.stat:nth-child(3){background:#f0eafb}.stat:nth-child(3)::before{content:'▤';color:#8960b4}
.stat:nth-child(4){background:#fff0e6}.stat:nth-child(4)::before{content:'🎓'}
.stat:nth-child(5){background:#e9f4fb}.stat:nth-child(5)::before{content:'◆';color:#4e88a8}
.stat:nth-child(6){background:#fff2d9}.stat:nth-child(6)::before{content:'◇';color:#ad8336}
.stat b{font-size:29px!important;color:#253e4b!important;line-height:1.15}.stat small{color:#627681!important;font-size:12px!important;line-height:1.35;margin-top:5px}
button,select,input{border-radius:14px!important;border-color:#dfe9eb!important}.primary,.install-app{background:#128e78!important;color:white!important;border-color:#128e78!important}.next-defense{background:linear-gradient(115deg,#e6f7ee,#f4f9ff)!important;border:1px solid #d5ebe3!important;border-radius:23px!important}.next-defense h2{color:#187363!important}.countdown.far{background:#e2f5eb!important;color:#14785d!important}.countdown.soon{background:#fff1dc!important;color:#9d6a26!important}
.pill,.pill.blue{background:#e8f5ee!important;color:#277a5e!important}.pill.orange{background:#fff1e4!important;color:#ad7746!important}
.tabs button{background:#f3f7f6!important;border:0!important;font-weight:700!important}.tabs button.active{background:#e0f3e9!important;color:#087d69!important}
#heading{color:#263d49;font-size:23px!important}#pwaPanel{max-width:1160px!important}
.mobile-nav{position:fixed;z-index:999;bottom:12px;left:50%;transform:translateX(-50%);width:min(calc(100% - 24px),560px);display:flex;justify-content:space-around;gap:6px;background:#fffffff2;border:1px solid #edf0f0;border-radius:27px;box-shadow:0 8px 35px #273a4d22;padding:9px;backdrop-filter:blur(18px)}
.mobile-nav button{border:0!important;background:transparent!important;box-shadow:none!important;flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;gap:3px;font-size:12px;font-weight:700;padding:9px 4px!important;color:#82929a!important}.mobile-nav button .nav-icon{display:flex;align-items:center;justify-content:center;width:24px;height:24px;flex-shrink:0;line-height:1}.mobile-nav .nav-icon svg{display:block;width:24px;height:24px}.filters{scroll-margin-bottom:110px}html{scroll-padding-bottom:110px}.mobile-nav button.current{background:#e4f4ec!important;color:#147d6b!important}
/* The dedicated calendar replaces the cards in the calendar tab. */
#calendar-screen{display:none}body.calendar-mode #calendar-screen{display:block}
body.calendar-mode .layout,body.calendar-mode #nextDefense{display:none!important}
#calendar-screen .cal-head{display:flex;flex-direction:column;align-items:stretch;gap:12px;margin-bottom:16px}
#calendar-screen h2{margin:0;font-size:22px;color:#263e4b}
#calendar-screen .cal-switch{display:grid;grid-template-columns:auto 42px minmax(0,1fr) 42px;align-items:center;gap:6px;min-width:0}
#calendar-screen .cal-switch button{min-width:42px;min-height:44px;padding:6px 9px;font-size:21px;background:#f0f6f5;border:0}
#calendar-screen #cal-today{font-size:13px;font-weight:750;color:#0e7c68;background:#e2f4eb;padding:8px 11px}
#calendar-screen .cal-month{font-weight:800;font-size:14px;min-width:0;text-align:center;line-height:1.35}
#calendar-screen .cal-grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:5px}
#calendar-screen .cal-weekday{text-align:center;color:#81929a;font-size:12px;padding:8px 0}
#calendar-screen .cal-blank{min-height:48px}
#calendar-screen .cal-day{border:1px solid transparent;background:#f3f6f7;border-radius:12px;min-width:0;min-height:54px;padding:7px 2px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;font-weight:700;font-size:14px;color:#344b58;cursor:pointer}
#calendar-screen .cal-day.has.upcoming{background:#159b74;color:#fff;border-color:#0c805e;box-shadow:0 2px 5px #117d6a22}
#calendar-screen .cal-day.has.upcoming.selected{border-color:#075542;box-shadow:inset 0 0 0 1px #075542}
#calendar-screen .cal-day.has.upcoming.today{outline-color:#fff}
#calendar-screen .cal-day.has.completed{background:#edf0f2;color:#697983}
#calendar-screen .cal-day.has.current-defense{background:#fff0da;color:#905200}
#calendar-screen .cal-day.selected{border:2px solid #138d78;box-shadow:inset 0 0 0 1px #138d78}
#calendar-screen .cal-day.today{outline:1px solid #7ba8c9;outline-offset:-3px}
#calendar-screen .cal-day:focus-visible,#calendar-screen button:focus-visible{outline:3px solid #138d78;outline-offset:2px}
#calendar-screen .cal-dots{display:flex;gap:3px;justify-content:center;height:6px}
#calendar-screen .cal-dot{height:6px;width:6px;border-radius:50%;background:#68b9aa}
#calendar-screen .cal-dot.doctor{background:#b6a0dd}
#calendar-screen .cal-dot.candidate{background:#efbc79}
#calendar-screen .cal-dot.unknown{background:#93a1a9}
#calendar-screen .cal-status-legend{display:flex;flex-wrap:wrap;gap:8px 15px;margin:15px 0 9px;font-size:12px;color:#637681}
#calendar-screen .cal-legend{display:flex;flex-wrap:wrap;gap:13px;font-size:12px;color:#71838d}
#calendar-screen .cal-legend i{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:5px;background:#68b9aa}
#calendar-screen .cal-legend i.doctor{background:#b6a0dd}
#calendar-screen .cal-legend i.candidate{background:#efbc79}
#calendar-screen .cal-legend i.unknown{background:#93a1a9}
#calendar-screen .cal-agenda{margin-top:20px}
#calendar-screen .cal-agenda-head{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:9px;margin-bottom:10px}
#calendar-screen .cal-agenda-title{font-size:17px;font-weight:800;margin:0;color:#263c49}
#calendar-screen #cal-month-all{font-size:13px;color:#127b6b;background:#e8f5ee;border:0;padding:9px 12px;font-weight:750}
#calendar-screen .cal-group-title{font-size:14px;color:#5b7686;font-weight:800;padding:12px 0 1px;margin:0}
#calendar-screen .cal-event{display:flex;gap:13px;align-items:stretch;padding:13px 0;border-top:1px solid #edf0f2}
#calendar-screen .cal-event-time{min-width:53px;font-size:14px;font-weight:800;color:#258674;padding-top:2px}
#calendar-screen .cal-event-main{border-left:4px solid #8ccfb5;padding:4px 0 4px 12px;min-width:0;flex:1}
#calendar-screen .cal-event-main.doctor{border-color:#b8a2de}
#calendar-screen .cal-event-main.candidate{border-color:#efbd7c}
#calendar-screen .cal-event-main.unknown{border-color:#c4cbd1}
#calendar-screen .cal-event-main strong{display:block;font-size:15px;color:#293f4c;line-height:1.4}
#calendar-screen .cal-event-main small{display:block;color:#748691;margin-top:5px;line-height:1.45}
#calendar-screen .cal-event-main .cal-topic{display:block;color:#354e5a;font-size:13px;line-height:1.5;margin-top:8px}
#calendar-screen .cal-event-links{display:flex;gap:8px 16px;flex-wrap:wrap;margin-top:8px}
#calendar-screen .cal-event-main a{color:#157b70;font-size:13px;font-weight:750}
#calendar-screen .cal-empty{color:#788a94;background:#f5f8f9;border-radius:15px;padding:20px;text-align:center}
@media(max-width:790px){header{padding:21px 20px 26px!important}main{padding:0 14px!important}.panel{padding:19px!important}.card{padding:19px!important}.stat{min-height:107px;padding:12px 9px}.stat b{font-size:26px!important}.stats{gap:8px!important}.mobile-nav{bottom:12px}}
@media(min-width:900px){.mobile-nav{width:480px}}
@media(max-width:370px){.mobile-nav{gap:3px;padding:7px}.mobile-nav button{font-size:11px}.mobile-nav button .nav-icon{font-size:20px}#calendar-screen .cal-switch{gap:3px;grid-template-columns:auto 38px minmax(0,1fr) 38px}#calendar-screen .cal-switch button{min-width:38px}#calendar-screen .cal-month{font-size:12px}#calendar-screen .cal-grid{gap:3px}#calendar-screen .cal-day{min-height:49px}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
`;
  document.head.append(css);

  const layout = document.querySelector('.layout');
  if (!layout) return;
  const screen = document.createElement('section');
  screen.id = 'calendar-screen';
  screen.className = 'panel';
  screen.innerHTML = `
    <div class="cal-head">
      <h2>Календар захистів</h2>
      <div class="cal-switch">
        <button id="cal-today" type="button">Сьогодні</button>
        <button id="cal-prev" type="button" aria-label="Попередній місяць">‹</button>
        <span class="cal-month" id="cal-month"></span>
        <button id="cal-next" type="button" aria-label="Наступний місяць">›</button>
      </div>
    </div>
    <div class="cal-grid" id="cal-grid"></div>
    <div class="cal-status-legend" aria-label="Позначення дат">
      <span>🟢 Майбутні захисти</span><span>🟠 Сьогодні</span><span>⚪ Минулі захисти</span>
    </div>
    <div class="cal-legend" aria-label="Позначення наукових ступенів">
      <span><i></i>PhD</span><span><i class="doctor"></i>Доктор наук</span><span><i class="candidate"></i>Кандидат наук</span><span><i class="unknown"></i>Не визначено</span>
    </div>
    <div class="cal-agenda">
      <div class="cal-agenda-head">
        <h3 class="cal-agenda-title" id="cal-agenda-title" aria-live="polite"></h3>
        <button id="cal-month-all" type="button" hidden>Усі дати місяця</button>
      </div>
      <div id="cal-agenda-items"></div>
    </div>`;
  layout.before(screen);

  const $cal = id => screen.querySelector('#' + id);
  const pad = n => String(n).padStart(2, '0');
  const iso = (y, m, d) => `${y}-${pad(m + 1)}-${pad(d)}`;
  const escapeHTML = s => String(s ?? '').replace(/[&<>"']/g,
    c => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]));
  const kind = x => x.degree === 'Доктор наук' ? 'doctor' :
    x.degree === 'Кандидат наук' ? 'candidate' :
    x.degree === 'PhD' ? 'phd' : 'unknown';
  const plural = n => {
    const k = n % 10, k100 = n % 100;
    return n === 1 || (k === 1 && k100 !== 11) ? 'захист' :
      k >= 2 && k <= 4 && (k100 < 12 || k100 > 14) ? 'захисти' : 'захистів';
  };
  const prettyDate = d => {
    const [y, m, day] = d.split('-').map(Number);
    return new Date(y, m - 1, day, 12).toLocaleDateString('uk-UA',
      {day:'numeric', month:'long', year:'numeric'});
  };
  const atMonth = d => new Date(Number(d.slice(0, 4)), Number(d.slice(5, 7)) - 1, 1, 12);
  let monthView = atMonth(today());
  // Empty selected day means the entire selected month is shown below the grid.
  let selected = '';

  function filteredItems() {
    const query = (document.getElementById('q')?.value || '').toLocaleLowerCase('uk-UA').trim();
    const degree = document.getElementById('degree')?.value || '';
    const year = document.getElementById('year')?.value || '';
    return items.filter(x =>
      (!year || (x.date || '').startsWith(year)) &&
      (!degree || (degree === 'unknown' ? !x.degree : x.degree === degree)) &&
      (!query || [x.title, x.person, x.person_original, x.person_display, x.topic, x.place, x.degree,
        x.degree_full, x.council, x.specialty]
        .join(' ').toLocaleLowerCase('uk-UA').includes(query))
    );
  }

  function eventHTML(x) {
    const dateLabel = `<div class="cal-event-time">${escapeHTML(x.time || '—')}</div>`;
    const topic = x.topic || x.title || '';
    const degree = x.degree_full || x.degree || 'Ступінь не визначено';
    const url = /^https:\/\/(?:www\.)?nubip\.edu\.ua\//i.test(x.url || '') ? x.url : '';
    return `<article class="cal-event">
      ${dateLabel}
      <div class="cal-event-main ${kind(x)}">
        <strong>${escapeHTML(x.person_original || x.person || x.title || 'Захист дисертації')}</strong>
        <small>${escapeHTML(degree)}</small>
        ${topic ? `<span class="cal-topic"><b>Тема:</b> ${escapeHTML(topic)}</span>` : ''}
        ${x.specialty ? `<small><b>Спеціальність:</b> ${escapeHTML(x.specialty)}</small>` : ''}
        ${x.council ? `<small><b>Рада:</b> ${escapeHTML(x.council)}</small>` : ''}
        <div class="cal-event-links">
          ${url ? `<a href="${escapeHTML(url)}" target="_blank" rel="noopener noreferrer">Документи ↗</a>` : ''}
        </div>
        ${calendarControls(x)}
      </div>
    </article>`;
  }

  function drawCalendar() {
    const y = monthView.getFullYear(), m = monthView.getMonth();
    const days = new Date(y, m + 1, 0).getDate();
    const offset = (new Date(y, m, 1).getDay() + 6) % 7;
    const monthKey = `${y}-${pad(m + 1)}`;
    const todayKey = today();
    const byDate = new Map();
    for (const x of filteredItems()) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(x.date || '')) continue;
      if (!byDate.has(x.date)) byDate.set(x.date, []);
      byDate.get(x.date).push(x);
    }
    const monthText = monthView.toLocaleDateString('uk-UA', {month:'long', year:'numeric'});
    $cal('cal-month').textContent = monthText.charAt(0).toLocaleUpperCase('uk-UA') + monthText.slice(1);
    let markup = ['Пн','Вт','Ср','Чт','Пт','Сб','Нд']
      .map(s => `<span class="cal-weekday">${s}</span>`).join('') +
      '<span class="cal-blank"></span>'.repeat(offset);
    for (let d = 1; d <= days; d++) {
      const date = iso(y, m, d), events = byDate.get(date) || [];
      const status = events.length ? (date < todayKey ? 'completed' :
        date === todayKey ? 'current-defense' : 'upcoming') : '';
      const dots = [...new Set(events.map(kind))].slice(0, 3)
        .map(k => `<i class="cal-dot ${k}"></i>`).join('');
      markup += `<button type="button" class="cal-day ${events.length ? 'has' : ''} ${status} ${selected === date ? 'selected' : ''} ${todayKey === date ? 'today' : ''}"
        data-cal-date="${date}" aria-label="${date}, захистів: ${events.length}" aria-pressed="${selected === date}">
        <span>${d}</span><span class="cal-dots">${dots}</span></button>`;
    }
    $cal('cal-grid').innerHTML = markup;

    const monthEvents = [...byDate.entries()]
      .filter(([date]) => date.startsWith(monthKey))
      .flatMap(([, entries]) => entries)
      .sort((a, b) => (a.date + ' ' + (a.time || '')).localeCompare(b.date + ' ' + (b.time || '')));
    const selectedEvents = selected ? (byDate.get(selected) || []).slice().sort((a,b) =>
      (a.time || '').localeCompare(b.time || '')) : monthEvents;
    const dayTitle = selected ? prettyDate(selected) :
      monthView.toLocaleDateString('uk-UA', {month:'long', year:'numeric'});
    $cal('cal-agenda-title').textContent = `${dayTitle} · ${selectedEvents.length} ${plural(selectedEvents.length)}`;
    $cal('cal-month-all').hidden = !selected;

    if (!selectedEvents.length) {
      $cal('cal-agenda-items').innerHTML = `<p class="cal-empty">${selected ?
        'На цю дату захистів немає.' : 'У цьому місяці за вибраними умовами захистів немає.'}</p>`;
      return;
    }
    if (selected) {
      $cal('cal-agenda-items').innerHTML = selectedEvents.map(x => eventHTML(x)).join('');
      return;
    }
    // In month mode, group entries by date to prevent showing another month's agenda.
    const groups = new Map();
    for (const x of selectedEvents) {
      if (!groups.has(x.date)) groups.set(x.date, []);
      groups.get(x.date).push(x);
    }
    $cal('cal-agenda-items').innerHTML = [...groups.entries()].map(([date, events]) =>
      `<section class="cal-date-group"><h4 class="cal-group-title">${escapeHTML(prettyDate(date))}</h4>${events.map(x => eventHTML(x)).join('')}</section>`
    ).join('');
  }

  screen.addEventListener('click', event => {
    const button = event.target.closest('[data-cal-date]');
    if (!button) return;
    selected = button.dataset.calDate;
    drawCalendar();
  });
  $cal('cal-month-all').onclick = () => {selected = ''; drawCalendar();};
  $cal('cal-prev').onclick = () => {monthView.setMonth(monthView.getMonth() - 1); selected = ''; drawCalendar();};
  $cal('cal-next').onclick = () => {monthView.setMonth(monthView.getMonth() + 1); selected = ''; drawCalendar();};
  $cal('cal-today').onclick = () => {selected = today(); monthView = atMonth(selected); drawCalendar();};

  // Original render updates data/counters; this wrapper makes the actual calendar visible.
  // Interactive statistics reflect the complete data set.
  const statFilters = [
    ['all', 'all', ''], ['future', 'future', ''], ['past', 'past', ''],
    ['phd', 'all', 'PhD'], ['doctor', 'all', 'Доктор наук'],
    ['candidate', 'all', 'Кандидат наук']
  ];
  function syncStatistics() {
    for (const [id, targetTab, degree] of statFilters) {
      const tile = document.getElementById(id)?.closest('.stat');
      if (!tile) continue;
      const active = tab === targetTab &&
        (document.getElementById('degree')?.value || '') === degree &&
        !(document.getElementById('q')?.value || '') &&
        !(document.getElementById('year')?.value || '') && !day;
      tile.classList.toggle('stat-selected', active);
      tile.setAttribute('aria-pressed', String(active));
    }
  }
  const statStyle = document.createElement('style');
  statStyle.textContent = '.stat[role="button"]{cursor:pointer;transition:box-shadow .15s}.stat[role="button"]:hover{box-shadow:0 0 0 2px #7abbaa}.stat.stat-selected{box-shadow:inset 0 0 0 2px #138d78}.stat[role="button"]:focus-visible{outline:3px solid #138d78;outline-offset:3px}';
  document.head.append(statStyle);
  for (const [id, targetTab, degree] of statFilters) {
    const tile = document.getElementById(id)?.closest('.stat');
    if (!tile) continue;
    tile.setAttribute('role', 'button');
    tile.tabIndex = 0;
    tile.setAttribute('aria-label', 'Показати захисти: ' + tile.querySelector('small').textContent);
    function activate() {
      document.getElementById('q').value = '';
      document.getElementById('year').value = '';
      document.getElementById('degree').value = degree;
      day = '';
      tab = targetTab;
      setTabs();
      render();
      syncNavigation();
      document.getElementById('heading')?.scrollIntoView({behavior:'smooth', block:'start'});
    }
    tile.addEventListener('click', activate);
    tile.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        activate();
      }
    });
  }


  const homeStyle = document.createElement('style');
  homeStyle.textContent = `#nextDefense .next-defense-badge{display:inline-flex;align-items:center;gap:6px;min-height:44px;padding:10px 14px;border:1px solid #d5ebe3;border-radius:14px;background:#e8f5ee;color:#157b70;font-size:14px;font-weight:750;margin-bottom:8px}#nextDefense h3{overflow-wrap:anywhere}#nextDefense[hidden]{display:none!important}#nextDefense .home-actions{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0}#nextDefense button{min-height:44px;background:#fff;font-size:13px}#nextDefense .home-row{display:block;width:100%;text-align:left;margin-top:8px;padding:12px}#nextDefense .home-row strong,#nextDefense .home-row small{display:block;overflow-wrap:anywhere}#nextDefense .home-row small{color:#637681;margin-top:5px}#nextDefense .home-topic{font-size:14px;line-height:1.5}#nextDefense button:focus-visible{outline:3px solid #138d78;outline-offset:2px}`;
  document.head.append(homeStyle);
  nextDefense = function () {
    const box = document.getElementById('nextDefense');
    const filtered = day || ['q','degree','year'].some(id => document.getElementById(id)?.value);
    box.hidden = tab !== 'future' || !!filtered;
    if (box.hidden) { box.innerHTML = ''; return; }
    const upcoming = items.filter(x => x.date >= today()).slice().sort((a,b) =>
      (a.date + ' ' + (a.time || '23:59')).localeCompare(b.date + ' ' + (b.time || '23:59')));
    if (!upcoming.length) {
      box.innerHTML = '<h2>Найближчі захисти</h2><p>Запланованих захистів поки немає.</p>';
      return;
    }
    const x = upcoming[0];
    const name = x => escapeHTML(x.person_original || x.person || x.title || 'Захист дисертації');
    const degree = x => escapeHTML(x.degree_full || x.degree || 'Ступінь уточнюється');
    box.innerHTML = `<div class="next-defense-badge">📅 Найближчий захист</div>
      <p><b>${escapeHTML(prettyDate(x.date))} · ${escapeHTML(x.time || 'час не вказано')}</b></p>
      ${countdownMarkup(x)}
      <h3>Захист дисертації ${name(x)}</h3><p>${degree(x)}</p>
      ${x.topic ? `<p class="home-topic">${escapeHTML(x.topic)}</p>` : ''}
      <div class="home-actions"><button type="button" data-home-event="${items.indexOf(x)}">Деталі захисту →</button>
      <button type="button" data-home-all>Усі найближчі (${upcoming.length}) →</button></div>
      ${calendarControls(x)}
      ${upcoming.length > 1 ? `<h2 style="margin-top:18px">Наступні захисти</h2>${upcoming.slice(1,4).map(e =>
        `<button type="button" class="home-row" data-home-event="${items.indexOf(e)}"><strong>${name(e)}</strong><small>${escapeHTML(prettyDate(e.date))} · ${escapeHTML(e.time || 'час не вказано')} · ${degree(e)}</small></button>`).join('')}` : ''}`;
  };
  document.getElementById('nextDefense')?.addEventListener('click', event => {
    const button = event.target.closest('[data-home-event], [data-home-all]');
    if (!button) return;
    const entry = button.hasAttribute('data-home-event') ? items[Number(button.dataset.homeEvent)] : null;
    if (button.hasAttribute('data-home-event') && !entry) return;
    for (const id of ['q','degree','year']) document.getElementById(id).value = '';
    tab = 'future'; day = entry ? entry.date : '';
    setTabs(); render();
    const matching = entry ? items.filter(x => x.date === entry.date).slice().sort((a,b) =>
      (a.time || '').localeCompare(b.time || '')) : [];
    const target = entry ? document.getElementById('cards')?.children[matching.indexOf(entry)] : document.getElementById('heading');
    if (target) { target.tabIndex = -1; target.focus({preventScroll:true}); target.scrollIntoView({behavior:'smooth',block:'start'}); }
  });


  // Group the already rendered archive cards; keep their calendar controls intact.
  const archiveOpen = new Map();
  const archiveStyle = document.createElement('style');
  archiveStyle.textContent = `
.archive-year,.archive-month{min-width:0}
.archive-year{border:1px solid #e0ebe6;border-radius:20px;background:#fff;padding:12px}
.archive-year>summary,.archive-month>summary{cursor:pointer;min-height:44px;padding:12px 8px;color:#274b57;font-weight:750;overflow-wrap:anywhere}
.archive-year>summary{font-size:20px}
.archive-month{margin-top:8px;border-top:1px solid #edf1ef;padding-top:5px}
.archive-month>summary{font-size:15px}
.archive-count{font-size:12px;font-weight:500;color:#647e88;margin-left:8px}
.archive-list{display:grid;gap:12px;padding:8px 0}
.archive-year>summary:focus-visible,.archive-month>summary:focus-visible{outline:3px solid #138d78;outline-offset:2px;border-radius:8px}
`;
  document.head.append(archiveStyle);
  function groupArchive() {
    if (tab !== 'past') return;
    const container = document.getElementById('cards');
    if (!container || container.querySelector('.archive-year')) return;
    const cards = [...container.children].filter(el => el.classList.contains('card'));
    if (!cards.length) return;
    const query = (document.getElementById('q').value || '').toLocaleLowerCase('uk-UA').trim();
    const degree = document.getElementById('degree').value;
    const year = document.getElementById('year').value;
    const entries = items.filter(x =>
      x.date < today() && (!day || x.date === day) &&
      (!year || x.date.startsWith(year)) &&
      (!degree || (degree === 'unknown' ? !x.degree : x.degree === degree)) &&
      (!query || [x.title,x.person,x.person_original,x.person_display,x.topic,x.place,x.degree,x.degree_full,x.council,x.specialty].join(' ').toLocaleLowerCase('uk-UA').includes(query))
    ).sort((a,b) => (b.date+' '+(b.time || '')).localeCompare(a.date+' '+(a.time || '')));
    if (entries.length !== cards.length) return;
    const groups = new Map();
    entries.forEach((entry,index) => {
      const yearKey = entry.date.slice(0,4), monthKey = entry.date.slice(0,7);
      if (!groups.has(yearKey)) groups.set(yearKey,new Map());
      const months = groups.get(yearKey);
      if (!months.has(monthKey)) months.set(monthKey,[]);
      months.get(monthKey).push(cards[index]);
    });
    const fragment = document.createDocumentFragment();
    let newest = true;
    const searching = !!(query || degree || year || day);
    for (const [yearKey,months] of groups) {
      const yearGroup = document.createElement('details');
      yearGroup.className = 'archive-year';
      yearGroup.dataset.archiveKey = yearKey;
      yearGroup.open = searching || (archiveOpen.get(yearKey) ?? newest);
      const total = [...months.values()].reduce((sum,list) => sum + list.length,0);
      const heading = document.createElement('summary');
      heading.innerHTML = yearKey + '<span class="archive-count">' + total + ' ' + plural(total) + '</span>';
      yearGroup.append(heading);
      for (const [monthKey,list] of months) {
        const monthGroup = document.createElement('details');
        monthGroup.className = 'archive-month';
        monthGroup.dataset.archiveKey = monthKey;
        monthGroup.open = searching || (archiveOpen.get(monthKey) ?? newest);
        const title = new Date(monthKey+'-01T12:00:00').toLocaleDateString('uk-UA',{month:'long'});
        const summary = document.createElement('summary');
        summary.innerHTML = escapeHTML(title.charAt(0).toLocaleUpperCase('uk-UA')+title.slice(1)) +
          '<span class="archive-count">' + list.length + ' ' + plural(list.length) + '</span>';
        const content = document.createElement('div');
        content.className = 'archive-list';
        content.append(...list);
        monthGroup.append(summary,content);
        yearGroup.append(monthGroup);
        newest = false;
      }
      fragment.append(yearGroup);
    }
    container.replaceChildren(fragment);
  }
  document.getElementById('cards')?.addEventListener('toggle', event => {
    const group = event.target;
    if (group.dataset.archiveKey && group.isConnected)
      archiveOpen.set(group.dataset.archiveKey, group.open);
  }, true);

  function defenseKey(x) {
    return officialUrl(x) || [x.date,x.person_original || x.person || x.title,x.topic || ''].join('|');
  }
  function defenseLink(x) {
    const url = new URL(location.href);
    url.hash = new URLSearchParams({defense:defenseKey(x)}).toString();
    return url.href;
  }
  function shareButton(x) {
    return '<button type="button" data-share-index="' + items.indexOf(x) + '">Поділитися ↗</button>';
  }
  calendarControls = function (x) {
    const google = googleEventLink(x);
    return '<div class="defense-actions">' +
      (google && google !== '#' ? '<a class="google-calendar-button" href="' +
        escapeHTML(google) + '" target="_blank" rel="noopener noreferrer">Google Календар ↗</a>' : '') +
      shareButton(x) + '</div>';
  };
  const actionStyle = document.createElement('style');
  actionStyle.textContent = '.defense-actions{display:flex;flex-direction:column;align-items:stretch;gap:8px;margin-top:14px;max-width:320px}.defense-actions .google-calendar-button,.defense-actions [data-share-index]{box-sizing:border-box;display:flex;align-items:center;justify-content:center;min-height:44px;padding:10px 12px;border:1px solid #dfe9eb;border-radius:14px!important;font:inherit;font-size:14px;font-weight:700;text-decoration:none;margin:0!important}.defense-actions .google-calendar-button{background:#e8f5ee;color:#157b70!important}.defense-actions .google-calendar-button:focus-visible{outline:3px solid #138d78;outline-offset:2px}';
  document.head.append(actionStyle);
  const shareStyle = document.createElement('style');
  shareStyle.textContent = '[data-share-index]{min-height:44px;margin-top:8px;color:#157b70;font-weight:700}.share-feedback{padding:12px;overflow-wrap:anywhere}.share-feedback input{display:block;width:100%;margin-top:8px}.shared-defense{outline:3px solid #138d78;outline-offset:3px}';
  document.head.append(shareStyle);
  const feedback = document.createElement('div');
  feedback.className = 'share-feedback panel';
  feedback.hidden = true;
  feedback.setAttribute('role','status');
  layout.before(feedback);
  function shareMessage(message, link) {
    feedback.replaceChildren();
    feedback.hidden = false;
    const text = document.createElement('span');
    text.textContent = message;
    feedback.append(text);
    if (link) {
      const input = document.createElement('input');
      input.readOnly = true;
      input.value = link;
      input.setAttribute('aria-label','Посилання на захист');
      feedback.append(input);
      input.focus(); input.select();
    }
  }
  document.addEventListener('click', async event => {
    const button = event.target.closest('[data-share-index]');
    if (!button) return;
    const x = items[Number(button.dataset.shareIndex)];
    if (!x) return;
    const link = defenseLink(x);
    const title = 'Захист дисертації — НУБіП України';
    const text = (x.person_original || x.person || x.title || '') + ' · ' + prettyDate(x.date);
    if (typeof navigator.share === 'function') {
      try { await navigator.share({title,text,url:link}); return; }
      catch (error) { if (error.name === 'AbortError') return; }
    }
    try {
      await navigator.clipboard.writeText(link);
      shareMessage('Посилання скопійовано. Його можна надіслати.');
    } catch (error) { shareMessage('Скопіюйте це посилання:',link); }
  });
  let pendingDefense = new URLSearchParams(location.hash.slice(1)).get('defense');
  let sharedEntry = null;
  function resolveSharedDefense() {
    sharedEntry = null;
    if (!pendingDefense) return;
    const x = items.find(entry => defenseKey(entry) === pendingDefense);
    if (!x) {
      shareMessage('Захист за посиланням поки не знайдено. Спробуйте натиснути «Оновити».');
      return;
    }
    pendingDefense = null;
    sharedEntry = x;
    feedback.hidden = true;
    tab = 'all'; day = x.date;
    for (const id of ['q','degree','year']) document.getElementById(id).value = '';
    setTabs();
  }
  function focusSharedDefense() {
    if (!sharedEntry) return;
    const list = items.filter(x => x.date === sharedEntry.date).slice().sort((a,b) =>
      (a.time || '').localeCompare(b.time || ''));
    const card = document.getElementById('cards').children[list.indexOf(sharedEntry)];
    if (!card) return;
    card.classList.add('shared-defense');
    card.tabIndex = -1;
    card.focus({preventScroll:true});
    card.scrollIntoView({behavior:'smooth',block:'start'});
    sharedEntry = null;
  }
  window.addEventListener('hashchange', () => {
    pendingDefense = new URLSearchParams(location.hash.slice(1)).get('defense');
    render();
  });

  // The original sidebar calendar is hidden and superseded by drawCalendar.
  calendar = function () {};
  const originalRender = render;
  render = function () {
    clearTimeout(searchTimer);
    resolveSharedDefense();
    originalRender();
    groupArchive();
    syncStatistics();
    syncNavigation();
    document.body.classList.toggle('calendar-mode', tab === 'calendar');
    if (tab === 'calendar') drawCalendar();
    focusSharedDefense();
  };
  // Route filters through the current renderer and coalesce fast typing.
  let searchTimer;
  const searchInput = document.getElementById('q');
  searchInput.oninput = () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => render(), 120);
  };
  for (const id of ['degree', 'year']) document.getElementById(id).onchange = () => render();

  const nav = document.createElement('nav');
  nav.className = 'mobile-nav';
  nav.setAttribute('aria-label', 'Основна навігація');
  const navIcon = content => '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + content + '</svg>';
  const destinations = [
    ['future', navIcon('<path d="m3 10 9-7 9 7v10H15v-7H9v7H3Z"></path>'), 'Зараз'],
    ['calendar', navIcon('<rect x="3" y="5" width="18" height="16" rx="2"></rect><path d="M7 3v4m10-4v4M3 10h18M7 14h2m6 0h2M7 17h2m6 0h2"></path>'), 'Календар'],
    ['past', navIcon('<circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l4 2"></path>'), 'Архів'],
    ['search', navIcon('<circle cx="10.5" cy="10.5" r="7.5"></circle><path d="m16 16 5 5"></path>'), 'Пошук'],
    ['all', navIcon('<path d="M9 5h12M9 12h12M9 19h12M3 5h1M3 12h1M3 19h1"></path>'), 'Усі']
  ];
  const buttons = [];
  let searchNavigation = false;
  function syncNavigation() {
    buttons.forEach(b => {
      const active = searchNavigation && tab === 'all' ? b.dataset.tab === 'search' : b.dataset.tab === tab;
      b.classList.toggle('current', active);
      b.setAttribute('aria-current', active ? 'page' : 'false');
    });
  }
  for (const [name, icon, label] of destinations) {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.tab = name;
    button.innerHTML = `<span class="nav-icon" aria-hidden="true">${icon}</span><span>${label}</span>`;
    button.onclick = () => {
      searchNavigation = name === 'search';
      if (name === 'search') {
        tab = 'all'; day = ''; setTabs(); render(); syncNavigation();
        const input = document.getElementById('q');
        const panel = input?.closest('.panel');
        input?.focus({preventScroll:true});
        panel?.scrollIntoView({behavior:'smooth', block:'center'});
        return;
      }
      const target = document.querySelector(`.tabs button[data-tab="${name}"]`);
      if (!target) return;
      target.click();
      syncNavigation();
      if (name === 'calendar') screen.scrollIntoView({behavior:'smooth', block:'start'});
      else document.getElementById('heading')?.scrollIntoView({behavior:'smooth', block:'start'});
    };
    nav.append(button);
    buttons.push(button);
  }
  document.body.append(nav);

  // Data may already have loaded when this script is attached.
  render();
  syncNavigation();
})();










