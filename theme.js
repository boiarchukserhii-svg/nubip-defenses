/* NUBiP Defenses — mobile dashboard + actual calendar view, no push. */
(() => {
const css=document.createElement('style');css.textContent=`
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
.mobile-nav button{border:0!important;background:transparent!important;box-shadow:none!important;flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;gap:3px;font-size:12px;font-weight:700;padding:9px 4px!important;color:#82929a!important}.mobile-nav button .nav-icon{font-size:22px;line-height:1.3}.mobile-nav button.current{background:#e4f4ec!important;color:#147d6b!important}
/* The real calendar replaces the list, not merely a tab heading. */
body.calendar-mode #calendar-screen{display:block}#calendar-screen{display:none}
body.calendar-mode .layout{display:none!important}body.calendar-mode #nextDefense{display:none!important}
#calendar-screen .cal-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:16px}#calendar-screen h2{margin:0;font-size:22px;color:#263e4b}
#calendar-screen .cal-switch{display:flex;align-items:center;gap:8px}#calendar-screen .cal-switch button{width:42px;height:42px;padding:0;font-size:23px;background:#f0f6f5;border:0}#calendar-screen .cal-month{font-weight:800;text-transform:capitalize;font-size:15px;min-width:115px;text-align:center}
#calendar-screen .cal-grid{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:5px}#calendar-screen .cal-weekday{text-align:center;color:#81929a;font-size:12px;padding:8px 0}#calendar-screen .cal-blank{min-height:48px}
#calendar-screen .cal-day{border:1px solid transparent;background:#f3f6f7;border-radius:12px;min-width:0;min-height:54px;padding:7px 2px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;font-weight:700;font-size:14px;color:#344b58}
#calendar-screen .cal-day.has{background:#e3f2ed;color:#176c5d}#calendar-screen .cal-day.selected{border:2px solid #138d78;background:#cceee1}#calendar-screen .cal-day.today{box-shadow:inset 0 0 0 1px #7ba8c9}
#calendar-screen .cal-dots{display:flex;gap:3px;justify-content:center;height:6px}#calendar-screen .cal-dot{height:6px;width:6px;border-radius:50%;background:#68b9aa}#calendar-screen .cal-dot.doctor{background:#b6a0dd}#calendar-screen .cal-dot.candidate{background:#efbc79}
#calendar-screen .cal-agenda{margin-top:20px}#calendar-screen .cal-agenda-title{font-size:17px;font-weight:800;margin:0 0 12px;color:#263c49}#calendar-screen .cal-event{display:flex;gap:13px;align-items:stretch;padding:13px 0;border-top:1px solid #edf0f2}#calendar-screen .cal-event-time{min-width:52px;font-size:14px;font-weight:800;color:#258674;padding-top:2px}#calendar-screen .cal-event-main{border-left:4px solid #8ccfb5;padding:4px 0 4px 12px;min-width:0;flex:1}#calendar-screen .cal-event-main.doctor{border-color:#b8a2de}#calendar-screen .cal-event-main.candidate{border-color:#efbd7c}#calendar-screen .cal-event-main strong{display:block;font-size:15px;color:#293f4c;line-height:1.4}#calendar-screen .cal-event-main small{display:block;color:#748691;margin-top:5px;line-height:1.4}#calendar-screen .cal-event-main a{display:inline-block;margin-top:6px;color:#157b70;font-size:13px;font-weight:750}
#calendar-screen .cal-empty{color:#788a94;background:#f5f8f9;border-radius:15px;padding:20px;text-align:center}#calendar-screen .cal-legend{display:flex;flex-wrap:wrap;gap:13px;margin-top:16px;font-size:12px;color:#71838d}#calendar-screen .cal-legend i{display:inline-block;width:9px;height:9px;border-radius:50%;margin-right:5px;background:#68b9aa}#calendar-screen .cal-legend i.doctor{background:#b6a0dd}#calendar-screen .cal-legend i.candidate{background:#efbc79}
@media(max-width:790px){header{padding:21px 20px 26px!important}main{padding:0 14px!important}.panel{padding:19px!important}.card{padding:19px!important}.stat{min-height:107px;padding:12px 9px}.stat b{font-size:26px!important}.stats{gap:8px!important}.mobile-nav{bottom:12px}}
@media(min-width:900px){.mobile-nav{width:440px}}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
`;document.head.append(css);
const layout=document.querySelector('.layout');if(!layout)return;
const screen=document.createElement('section');screen.id='calendar-screen';screen.className='panel';screen.innerHTML='<div class="cal-head"><h2>Календар захистів</h2><div class="cal-switch"><button id="cal-prev" type="button" aria-label="Попередній місяць">‹</button><span class="cal-month" id="cal-month"></span><button id="cal-next" type="button" aria-label="Наступний місяць">›</button></div></div><div class="cal-grid" id="cal-grid"></div><div class="cal-legend"><span><i></i>PhD</span><span><i class="doctor"></i>Доктор наук</span><span><i class="candidate"></i>Кандидат наук</span></div><div class="cal-agenda"><h3 class="cal-agenda-title" id="cal-agenda-title"></h3><div id="cal-agenda-items"></div></div>';
layout.before(screen);
let selected='';let monthView=new Date();monthView.setDate(1);
const pad=n=>String(n).padStart(2,'0');const iso=(y,m,d)=>`${y}-${pad(m+1)}-${pad(d)}`;
const htmlSafe=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&quot;'}[c]));
const kind=x=>x.degree==='Доктор наук'?'doctor':x.degree==='Кандидат наук'?'candidate':'phd';
function drawCalendar(){
const y=monthView.getFullYear(),m=monthView.getMonth(),days=new Date(y,m+1,0).getDate(),offset=(new Date(y,m,1).getDay()+6)%7;
const byDate=new Map();for(const x of items){if(!byDate.has(x.date))byDate.set(x.date,[]);byDate.get(x.date).push(x);}
document.getElementById('cal-month').textContent=monthView.toLocaleDateString('uk-UA',{month:'long',year:'numeric'});
let markup=['Пн','Вт','Ср','Чт','Пт','Сб','Нд'].map(s=>`<span class="cal-weekday">${s}</span>`).join('')+'<span class="cal-blank"></span>'.repeat(offset);
for(let d=1;d<=days;d++){const date=iso(y,m,d),events=byDate.get(date)||[];const dots=[...new Set(events.map(kind))].slice(0,3).map(k=>`<i class="cal-dot ${k}"></i>`).join('');markup+=`<button type="button" class="cal-day ${events.length?'has':''} ${selected===date?'selected':''} ${today()===date?'today':''}" data-cal-date="${date}" aria-label="${date}, захистів: ${events.length}"><span>${d}</span><span class="cal-dots">${dots}</span></button>`;}
document.getElementById('cal-grid').innerHTML=markup;
const date=selected||today();const chosen=byDate.get(date)||[];
const pretty=new Date(date+'T12:00:00').toLocaleDateString('uk-UA',{day:'numeric',month:'long',year:'numeric'});
document.getElementById('cal-agenda-title').textContent=`${pretty} · ${chosen.length} ${chosen.length===1?'захист':chosen.length>=2&&chosen.length<=4?'захисти':'захистів'}`;
document.getElementById('cal-agenda-items').innerHTML=chosen.length?chosen.slice().sort((a,b)=>(a.time||'').localeCompare(b.time||'')).map(x=>`<div class="cal-event"><div class="cal-event-time">${htmlSafe(x.time||'—')}</div><div class="cal-event-main ${kind(x)}"><strong>${htmlSafe(x.person_original||x.person||x.title||'Захист дисертації')}</strong><small>${htmlSafe(x.degree_full||x.degree||'Ступінь не визначено')}${x.council?' · '+htmlSafe(x.council):''}</small><a href="${htmlSafe(x.url||'#')}" target="_blank" rel="noopener noreferrer">Документи ↗</a></div></div>`).join(''):'<p class="cal-empty">На цю дату захистів немає. Оберіть дату з кольоровою позначкою.</p>';
}
screen.addEventListener('click',e=>{const b=e.target.closest('[data-cal-date]');if(!b)return;selected=b.dataset.calDate;drawCalendar();});
document.getElementById('cal-prev').onclick=()=>{monthView.setMonth(monthView.getMonth()-1);selected='';drawCalendar();};
document.getElementById('cal-next').onclick=()=>{monthView.setMonth(monthView.getMonth()+1);selected='';drawCalendar();};
// Keep original data filtering intact; replace the calendar's visible result with a proper month view.
const originalRender=render;render=function(){originalRender();document.body.classList.toggle('calendar-mode',tab==='calendar');if(tab==='calendar')drawCalendar();};
const nav=document.createElement('nav');nav.className='mobile-nav';nav.setAttribute('aria-label','Основна навігація');
const destinations=[['future','⌂','Зараз'],['calendar','▦','Календар'],['past','◷','Архів'],['all','☷','Усі']];const buttons=[];
function sync(){buttons.forEach(b=>{const active=b.dataset.tab===tab;b.classList.toggle('current',active);b.setAttribute('aria-current',active?'page':'false');});}
for(const [name,icon,label] of destinations){const b=document.createElement('button');b.type='button';b.dataset.tab=name;b.innerHTML=`<span class="nav-icon" aria-hidden="true">${icon}</span><span>${label}</span>`;b.onclick=()=>{if(name==='calendar'){selected=today();monthView=new Date();monthView.setDate(1);}const target=document.querySelector(`.tabs button[data-tab="${name}"]`);if(target){target.click();sync();if(name==='calendar'){screen.scrollIntoView({behavior:'smooth',block:'start'});}else{document.getElementById('heading')?.scrollIntoView({behavior:'smooth',block:'start'});}}};nav.append(b);buttons.push(b);}document.body.append(nav);
document.querySelector('.tabs')?.addEventListener('click',()=>setTimeout(()=>{sync();if(tab==='calendar'){selected=today();monthView=new Date();monthView.setDate(1);drawCalendar();}},0));
// The initial fetch may already have completed before this script loads.
render();sync();
})();
