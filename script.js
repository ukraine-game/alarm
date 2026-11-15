'use strict';
const $=id=>document.getElementById(id);
const CFG=window.CFG||{};
if(CFG.HOSTS&&location.protocol!=='file:'&&!CFG.HOSTS.includes(location.hostname)){document.body.innerHTML='<p style="padding:20px;color:#fff">Ця копія не авторизована. Оригінал: '+(CFG.ORIGINAL||'')+'</p>';throw new Error('host')}
const T={shahed:{n:'Шахед',s:180,c:'#ff9f1a',g:'Ш',p:'M12 2l9 19-9-5-9 5z',d:40},jet:{n:'Реактивний шахед',s:500,c:'#ff6b3d',g:'РШ',p:'M12 2l3 9 7 4v2l-7-2v5l2 2v1l-5-1-5 1v-1l2-2v-5l-7 2v-2l7-4z',d:15},band:{n:'Бандероль',s:2500,c:'#ff3b5c',g:'Б',p:'M12 1l3 6v9l4 5H5l4-5V7z',d:3},kab:{n:'КАБ',s:700,c:'#b388ff',g:'КАБ',p:'M12 2c4 3 5 9 4 14l-4 6-4-6c-1-5 0-11 4-14z',d:2},rocket:{n:'Ракета',s:900,c:'#f06292',g:'Р',p:'M12 1l2.5 6v8l5 4v2l-6-2-1.5 3-1.5-3-6 2v-2l5-4V7z',d:10},unk:{n:'Ціль не визначена',s:400,c:'#9aa4b2',g:'?',p:'M12 3a9 9 0 100 18 9 9 0 000-18z',d:20}};
const ST=['Спокійно','Увага (жовта)','Повітряна тривога'],COL=['#2b3342','#ffc400','#ff3b3b'],TURN=3;
const OB=`Вінницька|вінниц,vinnyts|49.2|28.5
Волинська|волин,volyn|51.3|25.0
Дніпропетровська|дніпро,dnipro|48.5|35.0
Донецька|донец,donets|48.2|37.8
Житомирська|житомир,zhytomyr|50.7|28.4
Закарпатська|закарпат,zakarpat|48.4|23.0
Запорізька|запор,zaporiz|47.4|35.3
Івано-Франківська|франк,frankivsk|48.7|24.7
Київська|#|50.3|30.3
Київ|#|50.45|30.52
Кіровоградська|кіровоград,kirovohrad|48.5|32.3
Луганська|луган,luhan|48.9|38.9
Львівська|львів,lviv|49.6|23.9
Миколаївська|миколаї,mykolai|47.2|31.9
Одеська|одес,odes|46.7|30.5
Полтавська|полтав,poltav|49.5|34.0
Рівненська|рівнен,rivne|51.0|26.3
Сумська|сумськ,sumska,sumy|51.0|34.2
Тернопільська|терноп,ternopil|49.5|25.5
Харківська|харків,kharkiv|49.5|36.5
Херсонська|херсон,kherson|46.7|33.2
Хмельницька|хмельн,khmelnyts|49.5|27.0
Черкаська|черкас,cherkas|49.3|31.8
Чернівецька|чернівец,chernivets|48.3|25.9
Чернігівська|чернігів,chernihiv|51.4|32.0
Севастополь|севастоп,sevastopol|44.6|33.5
АР Крим|крим,krym,crimea|45.3|34.2`.split('\n').map(s=>{const a=s.split('|');return{n:a[0],k:a[1].split(','),c:[+a[2],+a[3]],st:0,t:''}});
OB.forEach((o,i)=>o.i=i);
let R=[],savedR=[],brush=null,down=0,lastH=null,snd=false,ac,ah='',obs=[],nid=1,admin=false,pick=null,org=null,lp=0,lt,sp,scale=10,last=performance.now(),mll,toastT;
const rad=Math.PI/180;
const dest=(la,ln,b,km)=>[la+km*Math.cos(b*rad)/111.32,ln+km*Math.sin(b*rad)/(111.32*Math.cos(la*rad))];
const brg=(a,b)=>(Math.atan2((b[1]-a[1])*Math.cos(a[0]*rad),b[0]-a[0])/rad+360)%360;
const dist=(a,b)=>Math.hypot((b[0]-a[0])*111.32,(b[1]-a[1])*111.32*Math.cos(a[0]*rad));
const map=L.map('map',{zoomControl:false,center:[48.6,31.2],zoom:6,minZoom:5,maxZoom:18,maxBounds:[[41,19],[55,43]]});
L.control.zoom({position:'bottomright'}).addTo(map);
map.createPane('lab').style.cssText='z-index:450;pointer-events:none';
const ES='https://server.arcgisonline.com/ArcGIS/rest/services/',eo=(p,o)=>L.tileLayer(ES+p+'/MapServer/tile/{z}/{y}/{x}',Object.assign({attribution:'Tiles © Esri',maxNativeZoom:16,maxZoom:18},o));
const BASE={'🌙 Темна':L.layerGroup([eo('Canvas/World_Dark_Gray_Base'),eo('Canvas/World_Dark_Gray_Reference',{pane:'lab'})]),
 '🗺 Світла':eo('World_Street_Map',{maxNativeZoom:19}),
 '🛰 Супутник':L.layerGroup([eo('World_Imagery',{maxNativeZoom:17}),eo('Reference/World_Boundaries_and_Places',{pane:'lab',maxNativeZoom:17})]),
 'OSM (укр. назви)':L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap',maxNativeZoom:19,maxZoom:18})};
let bk='🌙 Темна';try{bk=localStorage.getItem('alarmbase')||bk}catch(e){}
BASE[bk in BASE?bk:'🌙 Темна'].addTo(map);
L.control.layers(BASE,null,{position:'topleft'}).addTo(map);
map.on('baselayerchange',e=>{try{localStorage.setItem('alarmbase',e.name)}catch(x){}});
const lg=L.control({position:'bottomleft'});
lg.onAdd=()=>{const d=L.DomUtil.create('div','lg');d.innerHTML=Object.values(T).map(v=>`<i style="background:${v.c}"></i>${v.n}`).join('<br>');return d};lg.addTo(map);
const pl=L.polyline([],{weight:2,dashArray:'4 6'}).addTo(map);
map.getContainer().addEventListener('contextmenu',e=>e.preventDefault());

function say(m){$('ht').textContent=m;$('hc').hidden=true;$('hint').hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>{if(!pick)$('hint').hidden=true},2500)}
function startPick(m,f,c){pick={f,c};$('ht').textContent=m;$('hc').hidden=false;$('hint').hidden=false;map.getContainer().style.cursor='crosshair'}
function endPick(){pick=null;$('hint').hidden=true;map.getContainer().style.cursor=''}
function cancelPick(){if(!pick)return;const c=pick.c;endPick();if(c)c()}
$('hc').onclick=cancelPick;
document.onkeydown=e=>{if(e.key==='Escape')cancelPick()};

function save(){try{localStorage.setItem('alarmsim1',JSON.stringify({n:nid,o:OB.map(o=>[o.st,o.t]),r:R.map(r=>[r.st,r.t]),b:obs.map(x=>({id:x.id,t:x.t,p:x.p,h:x.h,th:x.th,rem:x.rem,sIn:x.sIn,tr:x.tr.slice(-200)}))}))}catch(e){}}
function cnt(){const A=OB.filter(o=>o.st).map(o=>[o.st,oname(o),o.t]).concat(R.filter(r=>r.st>OB[r.ob].st).map(r=>[r.st,r.n+' ('+OB[r.ob].n+')',r.t])).sort((a,b)=>b[0]-a[0]);
 $('cnt').textContent=`🔴 ${A.filter(a=>a[0]==2).length}  🟡 ${A.filter(a=>a[0]==1).length}  ✈ ${obs.filter(x=>x.sIn<=0||admin).length}`;
 const h=A.map(a=>`${a[0]==2?'🔴':'🟡'} ${a[1]} <small>${a[2]}</small>`).join('<br>');if(h!==ah){ah=h;$('al').hidden=!A.length;$('al').innerHTML=h}}
function rpO(){$('ol').innerHTML=OB.map((o,i)=>`<div class="r s${o.st}"><span>${oname(o)}${o.st?' · '+o.t:''}</span><span>${['✓','🟡','🔴'].map((e,v)=>`<button data-o="${i}" data-s="${v}" class="${o.st==v?'on':''}">${e}</button>`).join('')}</span></div>`).join('')}
function rpB(){$('ob').innerHTML=obs.map(x=>`<div class="r"><span>${T[x.t].g} ${T[x.t].n} · ${x.sIn>0?'старт '+Math.ceil(x.sIn/60)+' хв':'ще '+Math.ceil(x.rem/60)+' хв, '+Math.round(x.h)+'°'}</span><span><button data-e="${x.id}">✎</button><button data-d="${x.id}">🗑</button></span></div>`).join('')||'<small>Немає об\'єктів</small>'}
function ui(){cnt();if(admin){rpO();rpB()}}

const tm=()=>new Date().toLocaleTimeString('uk',{hour:'2-digit',minute:'2-digit'});
function cls(l,on){(l.eachLayer?f=>l.eachLayer(f):f=>f(l))(p=>{const e=p.getElement&&p.getElement();if(e)e.classList.toggle('pulse',on)})}
function paint(o){if(!o.L)return;o.L.setStyle({fillColor:COL[o.st],fillOpacity:o.st?0.5:0.1,color:o.st?COL[o.st]:'#8aa0c8',weight:o.st?2:1.4,opacity:o.st?1:0.7});cls(o.L,o.st==2);cnt()}
function paintR(r){const v=r.st>OB[r.ob].st?r.st:0;r.L.setStyle({fillColor:COL[v],fillOpacity:v?0.5:0.02,color:v?COL[v]:'#8aa0c8',weight:v?2:0.7,opacity:v?1:0.45});cls(r.L,v==2);cnt()}
function setSt(o,v){o.st=v;o.t=v?tm():'';paint(o);R.forEach(r=>r.ob===o.i&&paintR(r));save();ui();if(v==2)siren()}
function setR(r,v){r.st=v;r.t=v?tm():'';paintR(r);save();ui();if(v==2)siren()}
function btns(d,l,f){const r=document.createElement('div');r.append(l+': ');[[2,'🔴'],[1,'🟡'],[0,'🟢']].forEach(([v,e])=>{const b=document.createElement('button');b.textContent=e;b.onclick=()=>{f(v);map.closePopup()};r.append(b)});d.append(r)}
const oname=o=>o.full||(o.n==='Київ'?'м. Київ':['АР Крим','Севастополь'].includes(o.n)?o.n:o.n+' область');
function obPop(o,ll){const d=document.createElement('div');d.innerHTML=`<b>${oname(o)}</b><br><small>${ST[o.st]}${o.st?' з '+o.t:''}</small>`;if(admin)btns(d,'Область',v=>setSt(o,v));L.popup().setLatLng(ll).setContent(d).openOn(map)}
function rPop(r,ll){const o=OB[r.ob],d=document.createElement('div');d.innerHTML=`<b>${r.n}</b><br><small>${oname(o)}<br>Район: ${ST[r.st]}${r.st?' з '+r.t:''} · Область: ${ST[o.st]}</small>`;if(admin){btns(d,'Район',v=>setR(r,v));btns(d,'Вся область',v=>setSt(o,v))}L.popup().setLatLng(ll).setContent(d).openOn(map)}
function bind(o,l,g){o.L=l.addTo(map);o.g=g;o.b=l.getBounds();l.on('click',e=>{if(pick||brush!==null)return;obPop(o,e.latlng)});paint(o)}
function pip(g,ll){const x=ll.lng,y=ll.lat;return(g.type==='Polygon'?[g.coordinates]:g.coordinates).some(P=>{let k=false;P.forEach(ring=>{let c=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){const a=ring[i],b=ring[j];if((a[1]>y)!=(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])c=!c}if(c)k=!k});return k})}
const ar=b=>(b.getNorth()-b.getSouth())*(b.getEast()-b.getWest());
function obAt(ll,strict){const h=OB.filter(o=>o.g&&o.b.contains(ll)&&pip(o.g,ll)).sort((a,b)=>ar(a.b)-ar(b.b))[0];if(h||strict)return h;const p=[ll.lat,ll.lng];return OB.reduce((a,b)=>dist(p,a.c)<dist(p,b.c)?a:b)}
function hitR(ll){return R.find(r=>r.b.contains(ll)&&pip(r.g,ll))}
async function loadR(){try{let j=await(await fetch('https://www.geoboundaries.org/api/current/gbOpen/UKR/ADM2/')).json();j=Array.isArray(j)?j[0]:j;
 const g=await(await fetch(j.simplifiedGeometryGeoJSON||j.gjDownloadURL)).json();
 L.geoJSON(g,{style:()=>({fillOpacity:0.02,weight:0.7}),onEachFeature:(f,l)=>{const raw=f.properties.shapeName||'Район',r={n:raw.replace(/ Raion$/i,'')+' р-н',L:l,g:f.geometry,b:l.getBounds(),st:0,t:''};r.ob=obAt(r.b.getCenter()).i;const k=sk(raw),D=OB[r.ob].D||[],m=D.find(d=>!d.u&&d.k===k)||D.find(d=>!d.u&&k.length>2&&d.k.slice(0,3)===k.slice(0,3));if(m){m.u=1;r.n=m.name;r.id=m.id}R.push(r);
  l.on('click',e=>{if(pick||brush!==null)return;rPop(r,e.latlng)});if(!coarse){l.bindTooltip(r.n,{sticky:true});l.on('mouseover',()=>l.setStyle({weight:2.2,color:'#fff',opacity:1}));l.on('mouseout',()=>paintR(r))}}}).addTo(map);
 R.forEach((r,i)=>{const v=savedR[i];if(v){r.st=v[0];r.t=v[1]}paintR(r)});say('Райони завантажено: '+R.length)}catch(e){say('Межі районів не завантажились — працюють області')}}
function find(f){const s=Object.values(f.properties||{}).filter(v=>typeof v==='string').join(' ').toLowerCase();
 if(/київ|kyiv|kiev/.test(s))return OB.find(o=>o.n===(/област|oblast|kyivska|київськ|region|province|kievska/.test(s)?'Київська':'Київ'));
 return OB.find(o=>o.k.some(k=>s.includes(k)))}
let ok=false;const SK='alarmkey';
const TR={а:'a',б:'b',в:'v',г:'h',ґ:'g',д:'d',е:'e',є:'ye',ж:'zh',з:'z',и:'y',і:'i',ї:'yi',й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'kh',ц:'ts',ч:'ch',ш:'sh',щ:'shch',ю:'yu',я:'ya'};
const sk=s=>s.toLowerCase().replace(/\s*(район|raion|district)\s*$/,'').replace(/[а-яіїєґ]/g,c=>TR[c]||'').replace(/[aeiouy'’`ʼ\s-]/g,'').replace(/(.)\1+/g,'$1');
const kids=o=>Object.values(o).filter(Array.isArray).flat().filter(x=>x&&typeof x==='object'&&x.regionName);
async function api(p){let k='';try{k=localStorage.getItem(SK)||''}catch(e){}const r=await fetch((CFG.API||'https://api.ukrainealarm.com')+p,{headers:CFG.API?{'X-Access-Code':k}:{Authorization:k}});if(!r.ok)throw new Error(r.status);return r.json()}
async function unlock(){let msg='';$('li').onkeydown=e=>{if(e.key==='Enter')$('lb').click()};
 for(;;){try{if(localStorage.getItem(SK))return await api('/api/v3/regions')}catch(e){msg=/^40[13]$/.test(e.message)?'Невірний ключ':'Немає зв’язку з API (можливо CORS) — див. README';try{localStorage.removeItem(SK)}catch(x){}}
  $('ll').firstChild.textContent=CFG.API?'Код доступу':'API-токен Ukraine Alarm';$('lm').textContent=msg;$('lock').hidden=false;
  await new Promise(done=>{$('lb').onclick=()=>{const v=$('li').value.trim();if(v){try{localStorage.setItem(SK,v)}catch(e){}$('li').value='';done()}}});$('lock').hidden=true}}
function useApi(tree){(Array.isArray(tree)?tree:kids(tree)).forEach(s=>{const n=s.regionName.toLowerCase(),city=/київ|kyiv/.test(n)&&!/област|oblast/.test(n),
 o=city?OB.find(o=>o.n==='Київ'):/київськ/.test(n)?OB.find(o=>o.n==='Київська'):OB.find(o=>o.k.some(k=>n.includes(k)));
 if(o){o.full=s.regionName;o.id=s.regionId;o.D=kids(s).filter(d=>!d.regionType||/district/i.test(d.regionType)).map(d=>({id:d.regionId,name:d.regionName,k:sk(d.regionName)}))}});ok=true;rpO();cnt()}
$('cr').textContent='© '+(CFG.OWNER||'')+' · симулятор, не реальні дані';
(async()=>{useApi(await unlock());let g;for(const u of['https://cdn.jsdelivr.net/gh/EugeneBorshch/ukraine_geojson@master/UA_FULL_Ukraine.geojson','https://raw.githubusercontent.com/EugeneBorshch/ukraine_geojson/master/UA_FULL_Ukraine.geojson']){try{g=await(await fetch(u)).json();break}catch(e){}}
 if(g)g.features.forEach(f=>{const o=find(f);if(o&&!o.L)bind(o,L.geoJSON(f),f.geometry)});
 OB.forEach(o=>{if(!o.L)bind(o,L.circle(o.c,{radius:o.n==='Київ'?15000:50000}))});await loadR()})();

function ic(x){const t=T[x.t];return L.divIcon({className:'',iconSize:[34,40],iconAnchor:[17,13],html:`<div class="ob" style="--c:${t.c}"><svg viewBox="0 0 24 24"><path d="${t.p}"/></svg>${t.g}</div>`})}
function mk(x){const c=T[x.t].c;x.m=L.marker(x.p,{icon:ic(x),zIndexOffset:500}).addTo(map);x.l=L.polyline([],{color:c,weight:2,dashArray:'6 6',opacity:0.8}).addTo(map);x.r=L.polyline(x.tr,{color:c,weight:2,opacity:0.5}).addTo(map);x.m.on('click',()=>edit(x));draw(x)}
function draw(x){const vis=x.sIn<=0||admin,e=x.m.getElement();x.m.setLatLng(x.p);x.m.setOpacity(vis?(x.sIn>0?0.45:1):0);
 if(e)e.querySelector('svg').style.transform=`rotate(${x.h}deg)`;
 x.l.setLatLngs(admin?[x.p,dest(x.p[0],x.p[1],x.th,T[x.t].s*Math.max(x.rem,0)/3600)]:[]);x.r.setLatLngs(vis?x.tr:[])}
function add(t,p,az,min,delay){const x={id:nid++,t,p:[p.lat,p.lng],h:az,th:az,rem:min*60,sIn:delay*60,tr:[[p.lat,p.lng]]};mk(x);obs.push(x);save();ui()}
function rm(x){if(!x)return;[x.m,x.l,x.r].forEach(l=>map.removeLayer(l));obs=obs.filter(o=>o!==x);save();ui()}
function boom(x){const p=x.p;rm(x);const b=L.marker(p,{icon:L.divIcon({className:'',html:'<div class="bm">💥</div>',iconSize:[30,30]})}).addTo(map);setTimeout(()=>map.removeLayer(b),4000)}
function edit(x){if(pick)return;const t=T[x.t],d=document.createElement('div');d.innerHTML=`<b>${t.n}</b><br><small>курс ${Math.round(x.h)}° · ${t.s} км/год</small>`;
 if(admin){d.innerHTML+=`<label>Новий курс °<input class="ea" type="number" min="0" max="360" value="${Math.round(x.th)}"></label><label>Лишилось хв<input class="ed" type="number" min="1" value="${Math.max(1,Math.round(x.rem/60))}"></label><button class="eo">Змінити курс</button><button class="ep">🎯 На карті</button><button class="ex">🗑</button>`;
  d.querySelector('.eo').onclick=()=>{x.th=((+d.querySelector('.ea').value%360)+360)%360;x.rem=Math.max(1,+d.querySelector('.ed').value)*60;draw(x);save();map.closePopup()};
  d.querySelector('.ep').onclick=()=>{map.closePopup();startPick('Натисніть нову точку курсу',ll=>{const q=[ll.lat,ll.lng];x.th=brg(x.p,q);x.rem=Math.max(10,dist(x.p,q)/t.s*3600);draw(x);save()})};
  d.querySelector('.ex').onclick=()=>{map.closePopup();rm(x)}}
 L.popup().setLatLng(x.p).setContent(d).openOn(map)}
setInterval(()=>{const n=performance.now(),dt=Math.min((n-last)/1000,1)*scale;last=n;
 for(const x of obs.slice()){let d=dt;if(x.sIn>0){x.sIn-=d;if(x.sIn>0)continue;d=-x.sIn;x.sIn=0}
  d=Math.min(d,x.rem);const df=((x.th-x.h+540)%360)-180;x.h=(x.h+Math.sign(df)*Math.min(Math.abs(df),TURN*d)+360)%360;
  x.p=dest(x.p[0],x.p[1],x.h,T[x.t].s*d/3600);x.rem-=d;if(dist(x.tr[x.tr.length-1],x.p)>2)x.tr.push(x.p);
  if(x.rem<=0.01){boom(x);continue}draw(x)}},100);
setInterval(()=>{save();if(admin)rpB();cnt()},1000);

function prev(){const t=T[$('t').value],m=+$('du').value||1,km=t.s*m/60;pl.setLatLngs([[org.lat,org.lng],dest(org.lat,org.lng,+$('az').value||0,km)]);pl.setStyle({color:t.c});$('info').textContent=`Дистанція ≈ ${Math.round(km)} км · швидкість ${t.s} км/год`}
function openNew(ll){org=ll;lp=Date.now();$('du').value=T[$('t').value].d;$('dlg').hidden=false;prev()}
function closeNew(){$('dlg').hidden=true;pl.setLatLngs([])}
$('t').innerHTML=Object.entries(T).map(([k,v])=>`<option value="${k}">${v.n}</option>`).join('');
$('t').onchange=()=>{$('du').value=T[$('t').value].d;prev()};
$('du').oninput=prev;$('az').oninput=()=>{$('azr').value=$('az').value;prev()};$('azr').oninput=()=>{$('az').value=$('azr').value;prev()};
$('no').onclick=closeNew;
$('ok').onclick=()=>{add($('t').value,org,((+$('az').value%360)+360)%360,Math.max(1,+$('du').value),Math.max(0,+$('st').value||0));closeNew()};
$('pk').onclick=()=>{$('dlg').hidden=true;startPick('Натисніть цільову точку',ll=>{const q=[ll.lat,ll.lng],o=[org.lat,org.lng],t=T[$('t').value];$('az').value=$('azr').value=Math.round(brg(o,q));$('du').value=Math.max(1,Math.round(dist(o,q)/t.s*60));$('dlg').hidden=false;prev()},()=>{$('dlg').hidden=false})};

map.on('click',e=>{$('menu').hidden=true;if(pick){const f=pick.f;endPick();f(e.latlng)}});
map.on('movestart',()=>{$('menu').hidden=true});
const coarse=matchMedia('(pointer:coarse)').matches;
map.on('contextmenu',e=>{if(!admin)return say('Увімкніть режим 🛠 Адмін');if(pick||brush!==null||Date.now()-lp<1500)return;
 if(coarse)return openNew(e.latlng);mll=e.latlng;const m=$('menu');m.style.left=e.originalEvent.clientX+'px';m.style.top=e.originalEvent.clientY+'px';m.hidden=false});
$('menu').onclick=()=>{$('menu').hidden=true;openNew(mll)};
const mc=map.getContainer();
mc.addEventListener('pointerdown',e=>{clearTimeout(lt);if(e.pointerType!=='touch'||!e.isPrimary||!admin||pick||brush!==null)return;sp=[e.clientX,e.clientY];
 lt=setTimeout(()=>{if(Date.now()-lp<1500)return;navigator.vibrate&&navigator.vibrate(30);openNew(map.mouseEventToLatLng(e))},550)});
mc.addEventListener('pointermove',e=>{if(sp&&Math.hypot(e.clientX-sp[0],e.clientY-sp[1])>10)clearTimeout(lt)});
['pointerup','pointercancel'].forEach(k=>mc.addEventListener(k,()=>clearTimeout(lt)));

$('spd').innerHTML=[1,5,10,30,60].map(v=>`<option value="${v}"${v==10?' selected':''}>×${v}</option>`).join('');
$('spd').onchange=e=>{scale=+e.target.value};
$('adm').onclick=()=>{if(!ok)return say('Спочатку потрібен доступ до API');admin=!admin;if(!admin)setBrush(null);$('adm').classList.toggle('on',admin);$('panel').hidden=!admin;obs.forEach(draw);ui()};
$('panel').onclick=e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset;
 if(d.b!==undefined)setBrush(d.b==='x'?null:+d.b);else if(d.o!==undefined)setSt(OB[d.o],+d.s);else if(d.d)rm(obs.find(x=>x.id==d.d));else if(d.e){const x=obs.find(x=>x.id==d.e);if(x){map.setView(x.p);edit(x)}}
 else if(d.a==='clr')OB.forEach(o=>setSt(o,0));else if(d.a==='del')obs.slice().forEach(rm)};
try{const s=JSON.parse(localStorage.getItem('alarmsim1')||'null');if(s){nid=s.n||1;savedR=s.r||[];s.o.forEach((v,i)=>{if(OB[i]){OB[i].st=v[0];OB[i].t=v[1]}});s.b.forEach(b=>{mk(b);obs.push(b)})}}catch(e){}
cnt();

function setBrush(v){brush=v;document.querySelectorAll('#br button').forEach(b=>b.classList.toggle('on',v!==null&&b.dataset.b==v));map.dragging[v===null?'enable':'disable']();mc.style.touchAction=v===null?'':'none';mc.style.cursor=v===null?'':'crosshair';if(v!==null)say(R.length?'Пензель: клікайте або водіть по районах. ✋ — повернути рух карти':'Райони ще вантажаться — поки фарбую області')}
function paintAt(e){const ll=map.mouseEventToLatLng(e),r=hitR(ll),o=r?null:obAt(ll,true),h=r||o;if(h&&h!==lastH){lastH=h;r?setR(r,brush):setSt(o,brush)}}
mc.addEventListener('pointerdown',e=>{down++;if(brush!==null&&down===1&&!e.target.closest('.leaflet-control,.leaflet-popup')){lastH=null;paintAt(e)}},true);
mc.addEventListener('pointermove',e=>{if(brush!==null&&down===1&&e.buttons&1)paintAt(e)});
['pointerup','pointercancel'].forEach(k=>addEventListener(k,()=>{down=Math.max(0,down-1)}));
function siren(){if(!snd)return;ac=ac||new AudioContext();const o=ac.createOscillator(),g=ac.createGain(),t=ac.currentTime;o.connect(g);g.connect(ac.destination);g.gain.value=0.08;o.frequency.setValueAtTime(500,t);for(let i=0;i<3;i++){o.frequency.linearRampToValueAtTime(900,t+i*2+1);o.frequency.linearRampToValueAtTime(500,t+i*2+2)}o.start();o.stop(t+6)}
$('snd').onclick=()=>{snd=!snd;$('snd').textContent=snd?'🔔':'🔕';if(snd)siren()};
