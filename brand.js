/* NUBiP official blue-and-white logo from Brandbook v2.1, page 5. */
(()=>{
  const css=document.createElement('style');
  css.textContent=`
    header{position:relative}
    header .nubip-brand{display:flex;align-items:center;gap:17px;margin-bottom:19px}
    header .nubip-brand img{display:block;width:68px;height:88px;object-fit:contain}
    header .nubip-brand-name{font-size:clamp(12px,1.6vw,17px);line-height:1.35;font-weight:750;letter-spacing:.02em;max-width:590px}
    @media(max-width:520px){header .nubip-brand img{width:53px;height:69px}header .nubip-brand{gap:12px}}
  `;
  document.head.appendChild(css);
  const header=document.querySelector('header');if(!header)return;
  const brand=document.createElement('div');brand.className='nubip-brand';
  const img=document.createElement('img');img.src='./nubip-logo-blue.png?v=2';img.alt='Логотип НУБіП України';
  const name=document.createElement('div');name.className='nubip-brand-name';name.textContent='НАЦІОНАЛЬНИЙ УНІВЕРСИТЕТ БІОРЕСУРСІВ І ПРИРОДОКОРИСТУВАННЯ УКРАЇНИ';
  brand.append(img,name);header.prepend(brand);
})();
