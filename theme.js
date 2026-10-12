/* NUBiP Defenses — light mobile-first redesign. Visual layer only; no Firebase. */
(() => {
  const style = document.createElement('style');
  style.textContent = `
:root{font-family:system-ui,-apple-system,'Segoe UI',sans-serif!important;color:#203344!important;background:#f5f8f8!important}
html{scroll-behavior:smooth}body{background:radial-gradient(ellipse at 0 0,#e1f5ee 0,transparent 42%),radial-gradient(ellipse at 100% 18%,#e8efff 0,transparent 40%),#f5f8f8!important;min-height:100vh}
header{background:transparent!important;color:#203344!important;padding:27px max(18px,calc((100vw - 1120px)/2)) 48px!important}
header .nubip-brand{margin-bottom:22px!important;gap:13px!important}header .nubip-brand-name{color:#27435a;font-size:clamp(11px,1.45vw,14px)!important;letter-spacing:.01em!important}
header .nubip-brand img{width:54px!important;height:70px!important;filter:drop-shadow(0 3px 5px #163e5022)}
header .tag{color:#66828a!important;font-size:11px!important;letter-spacing:.09em!important}
header h1{font-size:clamp(31px,5vw,49px)!important;letter-spacing:-.045em!important;line-height:1.1!important;color:#192d3d!important;margin:12px 0!important}
header p{opacity:1!important;color:#748692!important;font-size:clamp(14px,2.3vw,18px);line-height:1.5}
main{margin:-13px auto 95px!important;max-width:1160px!important}
.panel,.card{background:#fff!important;border:1px solid #edf0f2!important;border-radius:27px!important;box-shadow:0 9px 28px #223f5210!important}
.panel{padding:22px!important;margin-bottom:17px!important}.card{padding:23px!important;transition:transform .2s,box-shadow .2s}.card:hover{transform:translateY(-2px);box-shadow:0 13px 34px #223f5219!important}
.card h3{font-size:19px!important;color:#233544!important}.card p{color:#607481}.date{color:#087d6e!important}
.pill,.pill.blue{background:#e7f5ee!important;color:#247a5d!important;border-radius:13px!important}.pill.orange{background:#fff1e5!important;color:#ac7443!important}.pill.gray{background:#f0f1f6!important;color:#747d91!important}
.stats{gap:18px 26px!important}.stat b{color:#167f75!important;font-size:29px!important;letter-spacing:-.04em}.stat small{color:#85929a!important}
button,select,input{border-radius:15px!important;border-color:#e3e9ed!important;color:#28445b!important}
button.active,.primary,.install-app{background:linear-gradient(135deg,#15957c,#087665)!important;border-color:#15957c!important;color:#fff!important;box-shadow:0 5px 12px #078b6a22}
.tabs{gap:7px!important}.tabs button{border:0!important;background:#f4f7f7!important;color:#5d707b!important;font-weight:700!important}.tabs button.active{background:#dff4eb!important;color:#087b66!important;box-shadow:none!important}
.filters input,.filters select{background:#fbfcfd!important}
.next-defense{background:linear-gradient(115deg,#e5f7ee,#f4f9ff)!important;border:1px solid #d4ebe3!important;border-radius:23px!important;padding:22px!important}.next-defense h2{color:#176e60!important}
.countdown.far{background:#e2f4eb!important;color:#14785d!important}.countdown.soon{background:#fff2df!important;color:#986c24!important}.countdown.today{background:#dff4eb!important;color:#087b66!important}
.grid button.has{background:#d7eee6!important;color:#167c65!important}.grid button.chosen{background:#14917b!important;color:white!important}.grid button{border-radius:11px!important}
#heading{font-size:24px!important;letter-spacing:-.03em;color:#253a49}
#pwaPanel{max-width:1160px!important}#pwaPanel .install-help{color:#80909a}
footer{padding-bottom:55px!important}
.mobile-nav{position:fixed;z-index:999;bottom:12px;left:50%;transform:translateX(-50%);width:min(calc(100% - 24px),560px);display:flex;justify-content:space-around;gap:6px;background:#fffffff2;border:1px solid #edf0f0;border-radius:27px;box-shadow:0 8px 35px #273a4d22;padding:9px;backdrop-filter:blur(18px)}
.mobile-nav button{border:0!important;background:transparent!important;box-shadow:none!important;flex:1;min-width:0;display:flex;flex-direction:column;align-items:center;gap:2px;font-size:12px;font-weight:650;padding:8px 4px!important;color:#84919a!important}
.mobile-nav button .nav-icon{font-size:23px;line-height:1.3}.mobile-nav button.current{background:#e7f5ef!important;color:#137c69!important}
@media(min-width:900px){.mobile-nav{width:440px}.layout{grid-template-columns:minmax(0,1fr) 320px!important}}
@media(max-width:790px){header{padding:22px 21px 28px!important}main{padding:0 14px!important;margin:0 auto 105px!important}.panel{padding:19px!important}.card{padding:20px!important}.layout{gap:12px!important}.stats{gap:16px 24px!important}.stat b{font-size:26px!important}.stat small{font-size:12px!important}.calendar{order:-1}.next-defense{padding:17px!important}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}.card{transition:none}}
`;
  document.head.append(style);
  const nav=document.createElement('nav');nav.className='mobile-nav';nav.setAttribute('aria-label','Основна навігація');
  const destinations=[['future','⌂','Зараз'],['calendar','▦','Календар'],['past','◷','Архів'],['all','☷','Усі']];
  const buttons=[];
  function sync(){const active=document.querySelector('.tabs button.active')?.dataset.tab||'future';buttons.forEach(b=>{const on=b.dataset.tab===active;b.classList.toggle('current',on);b.setAttribute('aria-current',on?'page':'false');});}
  for(const [tab,icon,label] of destinations){
    const b=document.createElement('button');b.type='button';b.dataset.tab=tab;b.innerHTML=`<span class="nav-icon" aria-hidden="true">${icon}</span><span>${label}</span>`;
    b.addEventListener('click',()=>{const target=document.querySelector(`.tabs button[data-tab="${tab}"]`);if(target){target.click();sync();document.getElementById('heading')?.scrollIntoView({behavior:'smooth',block:'start'});}});
    nav.append(b);buttons.push(b);
  }
  document.body.append(nav);
  document.querySelector('.tabs')?.addEventListener('click',()=>setTimeout(sync,0));
  sync();
})();
