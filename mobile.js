'use strict';
// ===== v5.1: телефон — адмін-режим одним тапом, панель двома, компактний діалог маршруту, iOS =====
const TCH=MOB||matchMedia('(max-width:700px)').matches;
// admin = режим «все можна» (довге натискання — об'єкт, клік — тривога), p = чи відкрита сама панель
function applyAdm(a,p){admin=a;const B=document.body;B.classList.toggle('adm',a);B.classList.toggle('pnl',a&&p);if(!a)setBrush(null);
 const b=$('adm');b.classList.toggle('on',a);b.classList.toggle('pn',a&&p);$('panel').hidden=!(a&&p);obs.forEach(draw);ui()}
let adT=0;
$('adm').title=TCH?'Тап — адмін-режим, подвійний тап — панель':'Адмін-панель';
$('adm').onclick=()=>{
 if(!TCH)return applyAdm(!admin,!admin);
 if(adT){clearTimeout(adT);adT=0;return applyAdm(true,true)}
 adT=setTimeout(()=>{adT=0;const open=!$('panel').hidden;
  if(!admin){applyAdm(true,false);say('🛠 Адмін-режим: довге натискання — створити об\'єкт, клік — тривога. Двічі торкніться 🛠 — панель')}
  else if(open)applyAdm(true,false);
  else{applyAdm(false,false);say('Адмін-режим вимкнено')}},260)};
$('pcl').onclick=()=>applyAdm(true,false);

// компактний діалог «Створити об'єкт»: внизу вузька смужка, параметри — за кнопкою ⚙
{const d=$('dlg'),g=document.createElement('button');g.id='dgx';g.textContent='⚙';g.title='Параметри';d.append(g);g.onclick=()=>d.classList.toggle('ex');
 const o=openNew;openNew=function(ll,x){o(ll,x);d.classList.remove('ex')}}

// iOS Safari: без масштабування сторінки жестами
['gesturestart','gesturechange','gestureend'].forEach(k=>document.addEventListener(k,e=>e.preventDefault()));
