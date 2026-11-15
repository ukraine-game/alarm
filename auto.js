'use strict';
// ===== v5: Авто запуск (складність Л/С/В/Н), цілі, збиття шахедів мінометом, ТГК-вибух ≤10 с =====
const rnd=(a,b)=>a+Math.random()*(b-a),wp=(a,w)=>{let s=0;a.forEach(x=>s+=w(x));let r=Math.random()*s;for(const x of a)if((r-=w(x))<=0)return x;return a[a.length-1]};
const AUT={on:false,d:'С',m:'mix',el:0,w:0,nx:0,st:-1,l:0};
try{const q=JSON.parse(localStorage.getItem('alarmau')||'null');if(q)Object.assign(AUT,{on:!!q.on,d:q.d||'С',m:q.m||'mix',el:q.el||0,w:q.w||0})}catch(e){}
// r — швидкість наростання, s — розмір груп, i — частота хвиль, c — ліміт цілей у повітрі
const DF={Л:{r:.6,s:.7,i:.7,c:40,n:'Легко'},С:{r:1,s:1,i:1,c:70,n:'Середньо'},В:{r:1.6,s:1.6,i:1.4,c:110,n:'Важко'},Н:{r:2.6,s:2.6,i:2.2,c:170,n:'Нереально'}};
if(MOB)Object.values(DF).forEach(d=>d.c=Math.round(d.c*.6));
const PH=['Шахеди','+ реактивні','+ КАБи з Чорного моря','+ ракети','+ бандероль'];
// звідки летять (назва, широта, довгота, вага)
const SH=[['Приморсько-Ахтарськ',46.05,38.17,3],['Курськ',51.7,36.2,2],['Брянськ',52.6,34.3,2],['Мілерово',48.9,40.4,2],['Бєлгород',50.6,36.6,1],['Шаталово',54.0,32.2,1],['Орел',52.9,36.1,1]],
 RK=[['Курськ',51.7,36.2,2],['Бєлгород',50.6,36.6,2],['Брянськ',52.6,34.3,1],['Воронеж',51.7,39.2,1],['Ростов',47.3,39.7,2]],
 BD=[['Курськ',51.7,36.2],['Воронеж',51.7,39.2],['Ростов',47.3,39.7]],
 SEA=[['Чорне море',45.2,30.9],['Чорне море',44.7,32.2],['Чорне море',44.2,33.6],['Чорне море',45.9,31.1]];
const AIR=[['аеропорт Бориспіль',50.345,30.894],['аеродром Васильків',50.21,30.3],['аеропорт Львів',49.81,23.96],['аеродром Старокостянтинів',49.76,27.4],['аеродром Озерне',50.27,28.74],['аеродром Миргород',49.93,33.63],['аеродром Канатове',48.54,32.28],['аеропорт Дніпро',48.36,35.1],['аеропорт Івано-Франківськ',48.88,24.69],['аеропорт Одеса',46.43,30.68],['аеропорт Харків',49.92,36.29],['аеродром Гавришівка',49.24,28.6]],
 EN=[['Бурштинська ТЕС',49.21,24.67],['Добротвірська ТЕС',50.2,24.38],['Трипільська ТЕС',50.1,30.77],['Ладижинська ТЕС',48.68,29.24],['Зміївська ТЕС',49.59,36.52],['Дніпровська ГЕС',47.87,35.09],['Канівська ГЕС',49.77,31.49],['Кременчуцька ГЕС',49.08,33.27],['ТЕЦ-6 Київ',50.49,30.67],['ТЕЦ-5 Харків',49.97,36.4],['Калуська ТЕЦ',49.03,24.38]];
const BAN=/Донецьк|Луганськ|Маріуполь|Сімферополь|Севастополь|Керч|Ялта|Євпаторія|Феодосія|Мелітополь|Бердянськ|Бахмут|Краматорськ|Слов'янськ|Сєвєродонецьк|Горлівка|Макіївка/,CW={'Київ':6,'Харків':4,'Одеса':4,'Дніпро':4,'Львів':4,'Запоріжжя':3};
const cityL=z=>CT.filter(c=>c.z<=z&&!BAN.test(c.n)).map(c=>[c.n,c.la,c.ln]);
function pickT(m){const k=m==='mix'?wp([['air',25],['en',25],['city',35],['rand',15]],a=>a[1])[0]:m;
 if(k==='air')return AIR[Math.random()*AIR.length|0];if(k==='en')return EN[Math.random()*EN.length|0];
 if(k==='city')return wp(cityL(6),c=>CW[c[0]]||1.2);const c=cityL(7),p=c[Math.random()*c.length|0];return[p[0],p[1]+rnd(-.12,.12),p[2]+rnd(-.15,.15)]}
const RNG={shahed:1100,jet:900,band:1600,rocket:1500,kab:380};
// запуск групи; fx — спільні старт/ціль (для двох колон на одну ціль)
function launch(type,n,mode,fx,fm){const pool=type==='kab'?SEA:type==='rocket'?RK:type==='band'?BD:SH;let tg,src,ok=[];
 if(fx){tg=fx.tg;src=fx.src}else for(let i=0;i<14&&!ok.length;i++){tg=pickT(mode);ok=pool.filter(o=>dist([o[1],o[2]],[tg[1],tg[2]])<RNG[type])}
 if(!fx){if(!ok.length)return null;src=wp(ok,o=>(o[3]||1)/Math.max(150,dist([o[1],o[2]],[tg[1],tg[2]])))}
 const s=fx?[fx.s[0]+.07,fx.s[1]-.07]:[src[1]+rnd(-.3,.3),src[2]+rnd(-.4,.4)],e=[tg[1],tg[2]],len=dist(s,e),route=[];
 if(type!=='kab'&&len>250&&Math.random()<.4){const b=brg(s,e),m=dest(s[0],s[1],b,len*rnd(.35,.65));route.push(dest(m[0],m[1],b+(Math.random()<.5?90:-90),rnd(30,90)))}
 route.push(e);const f=fm||(n===1?'rows':(type==='rocket'||type==='band')?(Math.random()<.6?'rows':'col'):wp([['rows',3],['wedge',2],['col',2],['swarm',2],['wide',1]],a=>a[1])[0]);
 spawnG(type,s,route,Math.max(1,Math.min(MOB?25:40,n)),f,0);return{tg,src,s}}
function wave(e,D){const m=AUT.m,S=D.s,sz=(b,g)=>Math.max(1,Math.round((b+e*g)*S*rnd(.6,1.3)));AUT.w++;
 launch('shahed',sz(1,.18),m);
 if(e>=15&&Math.random()<.4)launch('jet',sz(1,.06),m);
 if(e>=30&&Math.random()<.35)launch('kab',Math.max(1,Math.round(rnd(1,3)+e/40*S)),m);
 if(e>=60&&Math.random()<.3)launch('rocket',sz(1,.08),m);
 if(e>=100&&Math.random()<.1)launch('band',Math.max(1,Math.round(rnd(1,2)*S)),m);
 // табун ракет двома колонами на одну ціль
 if(e>=50&&Math.random()<({Л:0,С:.03,В:.07,Н:.12}[AUT.d])){const c=Math.min(24,Math.round(10+e/8)),fx=launch('rocket',Math.ceil(c/2),m,null,'col');if(fx){launch('rocket',Math.floor(c/2),m,fx,'col');say('🚀 Масований удар: '+c+' ракет на «'+fx.tg[0]+'»')}}}
function auTick(){if(document.hidden){AUT.l=SIMT;return}const d=AUT.l?SIMT-AUT.l:0;AUT.l=SIMT;if(!AUT.on)return;AUT.el+=Math.max(0,d);
 const D=DF[AUT.d],e=AUT.el/60000*D.r,st=e>=100?4:e>=60?3:e>=30?2:e>=15?1:0;
 if(st!==AUT.st){if(AUT.st>=0&&st>AUT.st)say('🚀 Авто запуск: нова фаза — '+PH[st]);AUT.st=st}
 if(AUT.el>=AUT.nx){AUT.nx=AUT.el+Math.max(60,330-e*2.4)*1000*rnd(.6,1.4)/D.i;if(obs.length<D.c&&map)wave(e,D)}}
setInterval(auTick,500);
setInterval(()=>{try{localStorage.setItem('alarmau',JSON.stringify({on:AUT.on,d:AUT.d,m:AUT.m,el:Math.round(AUT.el),w:AUT.w}))}catch(e){}auUi()},3000);

// ---- панель в адмінці
const aud=document.createElement('details');aud.id='aud';aud.open=true;
aud.innerHTML=`<summary>🚀 Авто запуск</summary><div class="row"><button id="aub"></button></div>
<div class="row" id="aud1"><span style="align-self:center">Складність:</span>${Object.keys(DF).map(k=>`<button data-df="${k}" title="${DF[k].n}">${k}</button>`).join('')}</div>
<div class="row" style="margin-top:6px"><select id="aum" style="flex:1"><option value="mix">🎲 Мікс (аеропорти, міста, енергетика)</option><option value="rand">🎯 Рандом по Україні</option><option value="air">✈ Аеропорти / аеродроми</option><option value="city">🏙 Великі міста</option><option value="en">⚡ Енергетика</option></select></div>
<div class="row" style="margin-top:6px"><button id="aun">💥 Хвиля зараз</button><button id="aur">↺ Наростання з початку</button></div>
<small id="aus"></small><small>Спочатку невеликі групи шахедів з різних боків Росії, згодом — реактивні, КАБи з акваторії Чорного моря, ракети. Л/С/В/Н — наскільки швидко росте інтенсивність і розмір груп. Ваше завдання — вмикати тривогу (або дивитись, як це робить 🚨 АС Тривог).</small>`;
$('asd').before(aud);
function auUi(){$('aub').textContent=AUT.on?'🚀 Авто запуск: УВІМК':'🚀 Авто запуск: ВИМК';$('aub').classList.toggle('on',AUT.on);
 document.querySelectorAll('#aud1 button').forEach(b=>b.classList.toggle('on',b.dataset.df===AUT.d));$('aum').value=AUT.m;
 const D=DF[AUT.d],e=AUT.el/60000*D.r,st=e>=100?4:e>=60?3:e>=30?2:e>=15?1:0;$('aus').textContent=`Фаза ${st+1}/5: ${PH[st]} · хвиль: ${AUT.w} · у повітрі: ${obs.length}/${D.c} · ${DF[AUT.d].n}`}
$('aub').onclick=()=>{AUT.on=!AUT.on;if(AUT.on){AUT.nx=AUT.el+15000;AUT.l=SIMT}say(AUT.on?'Авто запуск увімкнено':'Авто запуск вимкнено');auUi()};
$('aud1').onclick=e=>{const b=e.target.closest('button');if(b){AUT.d=b.dataset.df;auUi()}};
$('aum').onchange=e=>{AUT.m=e.target.value;auUi()};
$('aun').onclick=()=>{const D=DF[AUT.d];wave(AUT.el/60000*D.r,D);auUi()};
$('aur').onclick=()=>{AUT.el=0;AUT.w=0;AUT.st=-1;AUT.nx=15000;auUi()};
auUi();if(AUT.on){AUT.nx=AUT.el+30000}

// ---- збиття: лише шахеди (реактивні — майже ніколи); ракети й КАБи не збиваються
const SDR={shahed:.002,jet:.0003}; // шанс за хвилину польоту над Україною (за ігровим часом)
function burst(p){const b=L.marker(p,{icon:L.divIcon({className:'',html:'<div class="bx"><i></i><b>✨</b></div>',iconSize:[64,64],iconAnchor:[32,32]}),interactive:false,keyboard:false,zIndexOffset:900}).addTo(map);setTimeout(()=>map.removeLayer(b),2200);
 const c=L.circle(p,{radius:1800,color:'#ffd54f',weight:2,fillColor:'#ffd54f',fillOpacity:.15,interactive:false}).addTo(map);setTimeout(()=>map.removeLayer(c),1800)}
function shoot(x){if(x.dy)return;x.dy=1;let lp=x.p.slice();const g=dest(lp[0],lp[1],rnd(0,360),rnd(3,6)),
 gm=L.marker(g,{icon:L.divIcon({className:'',iconSize:[26,26],iconAnchor:[13,13],html:'<div class="mt"><i></i><b></b></div>'}),interactive:false,keyboard:false,zIndexOffset:700}).addTo(map),T0=performance.now();let tr=[],ls=-999;
 const step=n=>{const el=n-T0,al=obs.includes(x);if(al)lp=x.p.slice();const me=gm.getElement()&&gm.getElement().firstChild;
  if(el<1500&&el-ls>170){ls=el;tr.push({s:n,m:L.circleMarker(g,{radius:2.5,color:'#ffd54f',weight:1,fillColor:'#fff',fillOpacity:1,interactive:false}).addTo(map)});
   if(me){me.querySelector('i').style.setProperty('--a',brg(g,lp)+'deg');me.classList.remove('f');void me.offsetWidth;me.classList.add('f')}}
  tr=tr.filter(q=>{const k=(n-q.s)/380;if(k>=1){map.removeLayer(q.m);return false}q.m.setLatLng([g[0]+(lp[0]-g[0])*k,g[1]+(lp[1]-g[1])*k]);return true});
  if(el<1500||tr.length){requestAnimationFrame(step);return}
  map.removeLayer(gm);if(al){const o=obAt(L.latLng(lp),true);burst(lp);if(o)logEv(o,null,'x','🎯 '+T[x.t].n+' збито ППО','ППО');say('🎯 '+T[x.t].n+' збито');rm(x)}};
 requestAnimationFrame(step)}
setInterval(()=>{if(document.hidden)return;const dm=.5*scale/60;obs.forEach(x=>{const r=SDR[x.t];if(!r||x.sIn>0||x.dy)return;if(Math.random()<r*dm&&obAt(L.latLng(x.p),true))shoot(x)})},500);

// ---- ТГК: повідомлення про вибух живуть у стрічці не довше хвилини
setInterval(()=>{const n=Date.now();let ch=0;for(let i=TG.length-1;i>=0;i--)if(TG[i].k==='hit'&&n-TG[i].at>60000){TG.splice(i,1);ch=1}if(ch)renderTG()},2000);
