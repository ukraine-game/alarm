'use strict';
const $=id=>document.getElementById(id);
const CFG=window.CFG||{};
if(CFG.HOSTS&&CFG.HOSTS.length&&location.protocol!=='file:'&&!CFG.HOSTS.includes(location.hostname)){document.body.innerHTML='<p style="padding:20px;color:#fff">Ця копія не авторизована. Оригінал: '+(CFG.ORIGINAL||'')+'</p>';throw new Error('host')}
const T={shahed:{n:'Шахед',s:180,c:'#ff9f1a',g:'Ш',i:'drones/ic_shahed.svg',d:40},jet:{n:'Реактивний шахед',s:500,c:'#ff6b3d',g:'РШ',i:'drones/jet_powered_shahed.svg',d:15},band:{n:'Бандероль',s:2500,c:'#ff3b5c',g:'Б',i:'drones/ic_banderol.svg',d:3},kab:{n:'КАБ',s:700,c:'#b388ff',g:'КАБ',i:'drones/ic_airbomb_kab.svg',d:2},rocket:{n:'Ракета',s:900,c:'#f06292',g:'Р',i:'drones/ic_banderol.svg',d:10},unk:{n:'Ціль не визначена',s:400,c:'#9aa4b2',g:'?',i:'drones/unidentified_flying_object.svg',d:20}};
const ASD={shahed:[30,1],jet:[80,1],band:[150,2],kab:[40,2],rocket:[120,2],unk:[40,1]},HOLD=180;
let AS={on:false,c:{}};Object.keys(T).forEach(k=>AS.c[k]={r:ASD[k][0],l:ASD[k][1]});
try{const q=JSON.parse(localStorage.getItem('alarmas')||'null');if(q){AS.on=!!q.on;Object.keys(q.c||{}).forEach(k=>{if(AS.c[k])Object.assign(AS.c[k],q.c[k])})}}catch(e){}
const asSave=()=>{try{localStorage.setItem('alarmas',JSON.stringify(AS))}catch(e){}};
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
const busy=()=>pick||brush!==null||routeOn||!$('dlg').hidden;
const TG=[];let EV=[],evD=0;try{EV=JSON.parse(localStorage.getItem('alarmev')||'[]')}catch(e){}
let routeOn=false,R=[],savedR=[],brush=null,down=0,lastH=null,snd=false,ac,ah='',obs=[],nid=1,admin=false,pick=null,org=null,lp=0,lt,sp,scale=10,last=performance.now(),mll,toastT;
let SIMT=0;const rad=Math.PI/180;
const dest=(la,ln,b,km)=>[la+km*Math.cos(b*rad)/111.32,ln+km*Math.sin(b*rad)/(111.32*Math.cos(la*rad))];
const brg=(a,b)=>(Math.atan2((b[1]-a[1])*Math.cos(a[0]*rad),b[0]-a[0])/rad+360)%360;
const dist=(a,b)=>Math.hypot((b[0]-a[0])*111.32,(b[1]-a[1])*111.32*Math.cos(a[0]*rad));
const MOB=L.Browser.mobile||matchMedia('(pointer:coarse)').matches;
const map=L.map('map',{preferCanvas:true,zoomControl:false,center:[48.6,31.2],zoom:6,minZoom:4,maxZoom:18,maxBoundsViscosity:1,zoomSnap:0.5,wheelPxPerZoomLevel:90,fadeAnimation:!MOB,markerZoomAnimation:!MOB});
if(!MOB)L.control.zoom({position:'bottomright'}).addTo(map);
let only=true;try{only=localStorage.getItem('alarmonly')!=='0'}catch(e){}
const UB=[[44.0,21.8],[52.8,40.6]];
// «Лише Україна»: карта не виїжджає за межі країни й не зумиться на весь світ; решта закрита маскою. Вимкнено — вільна карта світу.
function applyOnly(f){if(only){map.setMinZoom(map.getBoundsZoom(UB));map.setMaxBounds(UB);if(f)map.fitBounds(UB)}else{map.setMaxBounds(null);map.setMinZoom(2);if(f)map.setZoom(Math.max(2,map.getZoom()-2.5))}}
map.on('resize',()=>applyOnly(false));applyOnly(false);
map.createPane('mask').style.cssText='z-index:460;pointer-events:none';
const ES='https://server.arcgisonline.com/ArcGIS/rest/services/',eo=(p,o)=>L.tileLayer(ES+p+'/MapServer/tile/{z}/{y}/{x}',Object.assign({attribution:'Tiles © Esri',maxNativeZoom:16,maxZoom:18,updateWhenIdle:MOB,keepBuffer:MOB?1:2},o));
const SB={w:22.137,e:40.228,n:52.379,s:44.386,x0:1.8822,x1:258.2805,y0:0.6295,y1:171.9305};
const sll=(x,y)=>[SB.n-(y-SB.y0)/(SB.y1-SB.y0)*(SB.n-SB.s),SB.w+(x-SB.x0)/(SB.x1-SB.x0)*(SB.e-SB.w)];
map.createPane('svgbase').style.zIndex=190;const BR=L.canvas({pane:'svgbase',padding:MOB?0.1:0.3});
function svgPolys(txt,stroke){const doc=new DOMParser().parseFromString(txt,'image/svg+xml'),gs=doc.querySelector('g.state');if(!gs)throw 0;
 const fill=(/fill:\s*(#[0-9a-f]{3,8})/i.exec(gs.getAttribute('style')||'')||[])[1]||'#3b4351',NS='http://www.w3.org/2000/svg',sv=document.createElementNS(NS,'svg');
 sv.style.cssText='position:absolute;width:0;height:0;visibility:hidden';document.body.append(sv);const out=[];
 gs.querySelectorAll('path').forEach(p=>{const rings=[];(p.getAttribute('d')||'').split(/(?=M)/).forEach(sd=>{if(sd.trim().length<3)return;const e=document.createElementNS(NS,'path');e.setAttribute('d',sd);sv.append(e);
  const len=e.getTotalLength(),n=Math.max(8,Math.ceil(len/(MOB?0.6:0.3))),r=[];for(let k=0;k<=n;k++){const q=e.getPointAtLength(len*k/n);r.push(sll(q.x,q.y))}rings.push(r);e.remove()});
  if(rings.length)out.push(L.polygon(rings,{pane:'svgbase',interactive:false,fillColor:fill,fillOpacity:1,color:stroke,weight:0.9,smoothFactor:1.5,renderer:BR}))});
 sv.remove();return out}
function svgBase(file,stroke,fb){const g=L.layerGroup();let st=0;
 g.on('add',async()=>{if(st)return;st=1;try{const t=await(await fetch(file)).text();svgPolys(t,stroke).forEach(l=>g.addLayer(l))}catch(e){st=0;fb.addTo(g);say('SVG-мапа не завантажилась (відкрийте сайт через сервер) — показую запасну')}});return g}
const BASE={'🛰 Супутник':eo('World_Imagery',{maxNativeZoom:17}),'🌙 Темна':svgBase('drones/black_ukraine_map.svg','#171c26',eo('Canvas/World_Dark_Gray_Base')),'🗺 Світла':svgBase('drones/white_ukraine_map.svg','#b9b2a8',eo('World_Street_Map',{maxNativeZoom:19})),
 'OSM (укр. назви)':L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap',maxNativeZoom:19,maxZoom:18,updateWhenIdle:MOB,keepBuffer:MOB?1:2})};
const BG={'🛰 Супутник':'#0b0e14','🌙 Темна':'#0b0e14','🗺 Світла':'#aebfd0','OSM (укр. назви)':'#0b0e14'};
let bk='🛰 Супутник';try{bk=localStorage.getItem('alarmbase')||bk}catch(e){}
if(!(bk in BASE))bk='🛰 Супутник';BASE[bk].addTo(map);
function theme(n){bk=n;$('map').style.background=BG[n];document.body.classList.toggle('lt',n==='🗺 Світла');if(MK)MK.setStyle({fillColor:BG[n]})}
theme(bk);
const CL=L.layerGroup().addTo(map);
const lc=L.control.layers(BASE,{'🏙 Назви міст':CL},{position:'topleft',collapsed:false}).addTo(map),lcc=lc.getContainer();
lcc.classList.remove('leaflet-control-layers-expanded');
const tg=L.DomUtil.create('a','leaflet-control-layers-toggle');tg.href='#';tg.title='Теми карти';lcc.insertBefore(tg,lcc.firstChild);
tg.onclick=e=>{e.preventDefault();lcc.classList.toggle('leaflet-control-layers-expanded')};
const lcClose=()=>lcc.classList.remove('leaflet-control-layers-expanded');map.on('click movestart',lcClose);
const alc=L.control({position:'topleft'});alc.onAdd=()=>{const d=$('al');L.DomEvent.disableClickPropagation(d);L.DomEvent.disableScrollPropagation(d);return d};document.body.append($('al'));
map.on('baselayerchange',e=>{try{localStorage.setItem('alarmbase',e.name)}catch(x){}theme(e.name);lcClose()});
const CT=`Київ|50.45|30.52|5
Харків|49.99|36.23|5
Одеса|46.48|30.73|5
Дніпро|48.46|35.05|5
Львів|49.84|24.03|5
Запоріжжя|47.84|35.14|5
Донецьк|48.02|37.80|6
Луганськ|48.57|39.31|6
Миколаїв|46.97|31.99|6
Херсон|46.64|32.62|6
Вінниця|49.23|28.47|6
Полтава|49.59|34.55|6
Чернігів|51.49|31.29|6
Суми|50.91|34.80|6
Житомир|50.25|28.66|6
Черкаси|49.44|32.06|6
Рівне|50.62|26.25|6
Луцьк|50.75|25.33|6
Ужгород|48.62|22.30|6
Івано-Франківськ|48.92|24.71|6
Тернопіль|49.55|25.59|6
Чернівці|48.29|25.94|6
Хмельницький|49.42|26.99|6
Кропивницький|48.51|32.26|6
Сімферополь|44.95|34.10|6
Севастополь|44.62|33.52|6
Маріуполь|47.10|37.54|6
Кривий Ріг|47.91|33.39|6
Кременчук|49.07|33.42|7
Мелітополь|46.85|35.37|7
Бердянськ|46.76|36.80|7
Бахмут|48.59|38.00|7
Краматорськ|48.72|37.56|7
Слов'янськ|48.87|37.61|7
Біла Церква|49.80|30.12|7
Умань|48.75|30.22|7
Павлоград|48.53|35.87|7
Нікополь|47.57|34.40|7
Дрогобич|49.35|23.51|7
Кам'янець-Подільський|48.68|26.58|7
Мукачево|48.44|22.72|7
Конотоп|51.24|33.20|7
Ніжин|51.05|31.89|7
Ізюм|49.21|37.26|7
Сєвєродонецьк|48.95|38.49|7
Охтирка|50.31|34.90|7
Шостка|51.87|33.48|7
Ковель|51.22|24.71|7
Коломия|48.53|25.04|7
Керч|45.36|36.48|7
Ялта|44.50|34.17|7
Євпаторія|45.20|33.36|7
Феодосія|45.03|35.38|7
Ізмаїл|45.35|28.84|7
Білгород-Дністровський|46.19|30.35|7`.split('\n').map(r=>{const a=r.split('|');return{n:a[0],la:+a[1],ln:+a[2],z:+a[3]}});
function lab(){CL.clearLayers();const z=map.getZoom();const B=map.getBounds().pad(.25);CT.forEach(c=>{if(z>=c.z&&B.contains([c.la,c.ln]))L.marker([c.la,c.ln],{interactive:false,keyboard:false,zIndexOffset:-500,icon:L.divIcon({className:'',iconSize:[0,0],html:`<span class="cl">${c.n}</span>`})}).addTo(CL)})}
map.on('zoomend moveend',lab);lab();
var MK;
const MR=L.canvas({pane:'mask',padding:0.1});
function setMask(rings){if(MK)map.removeLayer(MK);MK=L.polygon([[[-85,-180],[-85,180],[85,180],[85,-180]]].concat(rings),{pane:'mask',interactive:false,fillColor:BG[bk],fillOpacity:1,color:'#8aa0c8',weight:1.5,fillRule:'evenodd',renderer:MR,smoothFactor:2});if(only)MK.addTo(map)}
async function loadMask(){try{const c=JSON.parse(localStorage.getItem('alarmmask2')||'null');if(c){setMask(c);return}}catch(e){}
 let g;for(const f of[async()=>{let j=await(await fetch('https://www.geoboundaries.org/api/current/gbOpen/UKR/ADM0/')).json();j=Array.isArray(j)?j[0]:j;return fetch(j.simplifiedGeometryGeoJSON||j.gjDownloadURL)},()=>fetch('https://cdn.jsdelivr.net/gh/johan/world.geo.json@master/countries/UKR.geo.json')]){try{g=await(await f()).json();break}catch(e){}}
 if(!g)return;const G=g.features?g.features[0].geometry:g.geometry||g;
 if(!MK)setMask((G.type==='Polygon'?[G.coordinates]:G.coordinates).map(p=>p[0].map(c=>[c[1],c[0]])))}
// точний контур = об'єднання меж усіх областей (раз, у фоні, далі з кешу)
async function maskFromObl(){try{if(localStorage.getItem('alarmmask2'))return}catch(e){}
 try{if(!window.turf||OB.some(o=>!o.g))throw 0;let u=null;
  for(const o of OB){let f=turf.feature(o.g);try{f=turf.simplify(f,{tolerance:0.004,highQuality:false})}catch(e){}f=turf.buffer(f,0.3,{units:'kilometers'});u=u?turf.union(u,f):f;await new Promise(r=>setTimeout(r,0))}
  const G=u.geometry,Pl=G.type==='Polygon'?[G.coordinates]:G.coordinates,rings=Pl.map(p=>p[0].map(c=>[+c[1].toFixed(3),+c[0].toFixed(3)]));
  setMask(rings);try{localStorage.setItem('alarmmask2',JSON.stringify(rings))}catch(e){}}
 catch(e){if(!MK)say('Контур України не побудовано — сусідні країни не приховано')}}

const lg=L.control({position:'bottomleft'});
lg.onAdd=()=>{const d=L.DomUtil.create('div','lg');d.innerHTML=Object.values(T).map(v=>`<img class="mi" src="${v.i}" alt="">${v.n}`).join('<br>');return d};lg.addTo(map);
const pl=L.polyline([],{weight:2,dashArray:'4 6'}).addTo(map);
map.getContainer().addEventListener('contextmenu',e=>e.preventDefault());

function say(m){$('ht').textContent=m;$('hc').hidden=true;$('hint').hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>{if(!pick)$('hint').hidden=true},2500)}
function startPick(m,f,c){pick={f,c};$('ht').textContent=m;$('hc').hidden=false;$('hint').hidden=false;map.getContainer().style.cursor='crosshair'}
function endPick(){pick=null;$('hint').hidden=true;map.getContainer().style.cursor=''}
function cancelPick(){if(!pick)return;const c=pick.c;endPick();if(c)c()}
$('hc').onclick=cancelPick;
document.onkeydown=e=>{if(e.key==='Escape')cancelPick()};

let svT=0;const save=()=>{if(!svT)svT=setTimeout(doSave,400)};addEventListener('pagehide',()=>doSave());
function doSave(){svT=0;try{localStorage.setItem('alarmsim1',JSON.stringify({n:nid,o:OB.map(o=>[o.st,o.t,o.a?1:0,o.ts||0]),r:R.map(r=>[r.st,r.t,r.a?1:0,r.ts||0]),b:obs.map(x=>({id:x.id,t:x.t,p:x.p,h:x.h,route:x.route,sIn:x.sIn,sf:x.sf,fid:x.fl&&x.fl.i,tr:x.tr.slice(-150)}))}))}catch(e){}}
function cnt(){const A=OB.filter(o=>o.st&&!R.some(r=>r.ob===o.i)).map(o=>[o.st,oname(o),o.t]).concat(R.filter(r=>r.st).map(r=>[r.st,r.n+' ('+OB[r.ob].n+')',r.t])).sort((a,b)=>b[0]-a[0]);
 $('cnt').textContent=`🔴 ${A.filter(a=>a[0]==2).length}  🟡 ${A.filter(a=>a[0]==1).length}`;thr();
 const h=A.map(a=>`${a[0]==2?'🔴':'🟡'} ${a[1]} <small>${a[2]}</small>`).join('<br>');if(h!==ah){ah=h;$('alh').innerHTML=h;alVis()}}
let thrH='';
function thr(){const a=obs.filter(x=>x.sIn<=0||admin),c={};a.forEach(x=>c[x.t]=(c[x.t]||0)+1);
 const h=a.length+'|'+Object.entries(c).map(([k,n])=>`<div><img class="mi" src="${T[k].i}" alt="">${T[k].n}: <b>${n}</b></div>`).join('');if(h===thrH)return;thrH=h;
 $('tn').textContent=a.length;$('tl').innerHTML=h.slice(h.indexOf('|')+1)||'<div>Загроз немає</div>'}
let FQ='',gran='r';const OPEN=new Set(),bs=(k,i,c)=>['✓','🟡','🔴'].map((e,v)=>`<button data-${k}="${i}" data-s="${v}" class="${c==v?'on':''}">${e}</button>`).join('');
function rpO(){const q=FQ.trim().toLowerCase();$('ol').innerHTML=OB.map((o,i)=>{let rs=[];R.forEach((r,j)=>{if(r.ob===i)rs.push([r,j])});
 if(q&&!oname(o).toLowerCase().includes(q)){rs=rs.filter(x=>x[0].n.toLowerCase().includes(q));if(!rs.length)return ''}
 if(!rs.length)return `<div class="r s${o.st}"><span>${oname(o)}${o.st?' · '+o.t:''}</span><span>${bs('o',i,o.st)}</span></div>`;
 const n=rs.filter(x=>x[0].st).length,tot=R.filter(r=>r.ob===i).length;
 return `<details data-i="${i}"${OPEN.has(String(i))||q?' open':''}><summary><span>${oname(o)}${n?' <small>· '+n+'/'+tot+'</small>':''}</span><span>${bs('o',i,-1)}</span></summary>${rs.map(([r,j])=>`<div class="r s${r.st}"><span>${r.n}</span><span>${bs('r',j,r.st)}</span></div>`).join('')}</details>`}).join('')}
let rbH='';function rpB(){const h=obs.map(x=>`<div class="r"><span><img class="mi" src="${T[x.t].i}" alt="">${T[x.t].n} · ${x.sIn>0?'старт '+Math.ceil(x.sIn/60)+' хв':'ще '+Math.ceil(remMin(x))+' хв · '+x.route.length+' т.'}</span><span><button data-e="${x.id}">✎</button><button data-d="${x.id}">🗑</button></span></div>`).join('')||'<small>Немає об\'єктів</small>';if(h!==rbH){rbH=h;$('ob').innerHTML=h}}
let uiT=0;function ui(){if(uiT)return;uiT=setTimeout(()=>{uiT=0;cnt();if(admin){rpO();rpB()}},MOB?320:180)}

const tm=()=>new Date().toLocaleTimeString('uk',{hour:'2-digit',minute:'2-digit'});
function cls(l,on){(l.eachLayer?f=>l.eachLayer(f):f=>f(l))(p=>{const e=p.getElement&&p.getElement();if(e)e.classList.toggle('pulse',on)})}
function paint(o){if(!o.L)return;const c=o.st&&!R.some(r=>r.ob===o.i);o.L.setStyle({fillColor:COL[c?o.st:0],fillOpacity:c?0.5:(R.length?0:0.1),color:c?COL[o.st]:'#8aa0c8',weight:c?2:1.6,opacity:c?1:0.8});cls(o.L,c&&o.st==2)}
function paintR(r){const v=r.st;r.L.setStyle({fillColor:COL[v],fillOpacity:v?0.5:0.02,color:v?COL[v]:'#8aa0c8',weight:v?2:0.7,opacity:v?1:0.45});cls(r.L,v==2)}
const SM=['🟢 Відбій','🟡 Увага (жовта)','🔴 Повітряна тривога'],esc=t=>String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function logEv(o,r,k,m,src){EV.push({t:Date.now(),o:o.i,r:r||null,k,m,s:src||''});if(EV.length>800)EV.splice(0,EV.length-800);evD=1}
function setSt(o,v){const rs=R.filter(r=>r.ob===o.i),old=o.st;if(rs.length){const ch=rs.some(r=>r.st!==v);rs.forEach(r=>setR(r,v,1,1));if(ch)logEv(o,null,'s'+v,SM[v],'вся область, вручну')}else{o.st=v;if(old!==v||!o.ts){o.t=v?tm():'';o.ts=v?Date.now():0}o.a=0;paint(o);if(old!==v)logEv(o,null,'s'+v,SM[v],'вручну')}save();ui();if(v==2)siren()}
function setR(r,v,q,nl){const old=r.st;r.st=v;if(old!==v||!r.ts){r.t=v?tm():'';r.ts=v?Date.now():0}r.a=0;paintR(r);if(old!==v&&!nl)logEv(OB[r.ob],r.n,'s'+v,SM[v],'вручну');if(!q){save();ui();if(v==2)siren()}}
function btns(d,l,f){const r=document.createElement('div');r.append(l+': ');[[2,'🔴'],[1,'🟡'],[0,'🟢']].forEach(([v,e])=>{const b=document.createElement('button');b.textContent=e;b.onclick=()=>{f(v);map.closePopup()};r.append(b)});d.append(r)}
const oname=o=>o.full||(o.n==='Київ'?'м. Київ':['АР Крим','Севастополь'].includes(o.n)?o.n:o.n+' область');
const fdt=t=>new Date(t).toLocaleString('uk',{day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit'});
function histEl(o,rn){const E=EV.filter(e=>e.o===o.i&&(!rn||e.r===rn||(e.r===null&&e.k!=='x'))).reverse(),d=document.createElement('div');d.className='hist';
 d.innerHTML=`<b>📜 Історія${rn?' району':' області'} (${E.length})</b><div class="hl">`+(E.length?E.slice(0,150).map(e=>`<div class="hv"><span>${fdt(e.t)}</span> ${esc(e.m)}${e.r?` <small>· ${esc(e.r)}</small>`:''}${e.s?` <small>· ${esc(e.s)}</small>`:''}</div>`).join(''):'<div class="hv"><small>Подій ще не було</small></div>')+'</div>';
 if(admin&&E.length){const b=document.createElement('button');b.textContent='🗑 Очистити історію області';b.onclick=()=>{EV=EV.filter(e=>e.o!==o.i);evD=1;map.closePopup()};d.append(b)}return d}
function obPop(o,ll){const d=document.createElement('div');d.innerHTML=`<b>${oname(o)}</b><br><small>${ST[o.st]}${o.st?' з '+o.t:''}</small>`;if(admin)btns(d,'Область',v=>setSt(o,v));d.append(histEl(o));L.popup({maxWidth:340}).setLatLng(ll).setContent(d).openOn(map)}
function rPop(r,ll){const o=OB[r.ob],d=document.createElement('div');d.innerHTML=`<b>${r.n}</b><br><small>${oname(o)}<br>Район: ${ST[r.st]}${r.st?' з '+r.t:''}</small>`;if(admin){btns(d,'Район',v=>setR(r,v));btns(d,'Усі райони обл.',v=>setSt(o,v))}d.append(histEl(o,r.n));L.popup({maxWidth:340}).setLatLng(ll).setContent(d).openOn(map)}
function bind(o,l,g){o.L=l.addTo(map);o.g=g;o.b=l.getBounds();l.on('click',e=>{if(busy())return;obPop(o,e.latlng)});paint(o)}
function pip(g,ll){const x=ll.lng,y=ll.lat;return(g.type==='Polygon'?[g.coordinates]:g.coordinates).some(P=>{let k=false;P.forEach(ring=>{let c=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){const a=ring[i],b=ring[j];if((a[1]>y)!=(b[1]>y)&&x<(b[0]-a[0])*(y-a[1])/(b[1]-a[1])+a[0])c=!c}if(c)k=!k});return k})}
const ar=b=>(b.getNorth()-b.getSouth())*(b.getEast()-b.getWest());
function obAt(ll,strict){const h=OB.filter(o=>o.g&&o.b.contains(ll)&&pip(o.g,ll)).sort((a,b)=>ar(a.b)-ar(b.b))[0];if(h||strict)return h;const p=[ll.lat,ll.lng];return OB.reduce((a,b)=>dist(p,a.c)<dist(p,b.c)?a:b)}
function hitR(ll){return R.find(r=>r.b.contains(ll)&&pip(r.g,ll))}
const RC={};`Вінницька|Вінницький,49.23,28.47|Гайсинський,48.81,29.38|Жмеринський,49.04,28.11|Могилів-Подільський,48.45,27.80|Тульчинський,48.68,28.85|Хмільницький,49.56,27.97
Волинська|Володимир-Волинський,50.85,24.32|Камінь-Каширський,51.62,24.97|Ківерцівський,50.84,25.46|Луцький,50.75,25.33
Дніпропетровська|Дніпровський,48.46,35.05|Кам'янський,48.51,34.60|Криворізький,47.91,33.39|Нікопольський,47.57,34.40|Новомосковський,48.63,35.22|Павлоградський,48.53,35.87|Синельниківський,48.32,35.51
Донецька|Бахмутський,48.59,38.00|Волноваський,47.60,37.50|Горлівський,48.30,38.03|Донецький,48.02,37.80|Кальміуський,47.65,38.00|Краматорський,48.72,37.56|Маріупольський,47.10,37.54|Покровський,48.28,37.18
Житомирська|Бердичівський,49.89,28.60|Житомирський,50.25,28.66|Звягельський,50.60,27.61|Коростенський,50.95,28.64
Закарпатська|Берегівський,48.20,22.64|Мукачівський,48.44,22.72|Рахівський,48.05,24.21|Тячівський,48.01,23.57|Ужгородський,48.62,22.30|Хустський,48.17,23.30
Запорізька|Бердянський,46.76,36.80|Василівський,47.45,35.28|Запорізький,47.84,35.14|Мелітопольський,46.85,35.37|Пологівський,47.48,36.25
Івано-Франківська|Верховинський,48.15,24.80|Івано-Франківський,48.92,24.71|Калуський,49.04,24.36|Коломийський,48.53,25.04|Косівський,48.31,25.09|Надвірнянський,48.63,24.57
Київська|Білоцерківський,49.80,30.12|Бориспільський,50.35,30.96|Броварський,50.51,30.79|Бучанський,50.54,30.21|Вишгородський,50.58,30.47|Обухівський,50.11,30.62|Фастівський,50.08,29.92
Кіровоградська|Голованівський,48.38,30.44|Кропивницький,48.51,32.26|Новоукраїнський,48.32,31.52|Олександрійський,48.67,33.12
Луганська|Алчевський,48.47,38.80|Довжанський,48.00,39.67|Луганський,48.57,39.31|Ровеньківський,48.08,39.37|Сватівський,49.41,38.16|Сєвєродонецький,48.95,38.49|Старобільський,49.28,38.91|Щастинський,48.74,39.27
Львівська|Дрогобицький,49.35,23.51|Золочівський,49.81,24.90|Львівський,49.84,24.03|Самбірський,49.52,23.20|Стрийський,49.26,23.85|Червоноградський,50.39,24.23|Яворівський,49.94,23.38
Миколаївська|Баштанський,47.41,32.44|Вознесенський,47.57,31.33|Миколаївський,46.97,31.99|Первомайський,48.05,30.85
Одеська|Березівський,47.20,30.93|Білгород-Дністровський,46.19,30.35|Болградський,45.69,28.61|Ізмаїльський,45.35,28.84|Одеський,46.48,30.73|Подільський,47.75,29.53|Роздільнянський,46.84,30.08
Полтавська|Кременчуцький,49.07,33.42|Лубенський,50.02,32.99|Миргородський,49.97,33.60|Полтавський,49.59,34.55
Рівненська|Вараський,51.34,25.85|Дубенський,50.42,25.75|Рівненський,50.62,26.25|Сарненський,51.34,26.60
Сумська|Конотопський,51.24,33.20|Охтирський,50.31,34.90|Роменський,50.75,33.47|Сумський,50.91,34.80|Шосткинський,51.87,33.48
Тернопільська|Кременецький,50.10,25.73|Тернопільський,49.55,25.59|Чортківський,49.02,25.80
Харківська|Богодухівський,50.16,35.52|Ізюмський,49.21,37.26|Красноградський,49.37,35.44|Куп'янський,49.71,37.62|Лозівський,48.89,36.32|Харківський,49.99,36.23|Чугуївський,49.84,36.69
Херсонська|Бериславський,46.84,33.43|Генічеський,46.17,34.80|Каховський,46.81,33.48|Скадовський,46.12,32.91|Херсонський,46.64,32.62
Хмельницька|Кам'янець-Подільський,48.68,26.58|Хмельницький,49.42,26.99|Шепетівський,50.18,27.06
Черкаська|Звенигородський,49.08,30.97|Золотоніський,49.67,32.04|Уманський,48.75,30.22|Черкаський,49.44,32.06
Чернівецька|Вижницький,48.25,25.19|Дністровський,48.50,26.49|Чернівецький,48.29,25.94
Чернігівська|Корюківський,51.77,32.25|Ніжинський,51.05,31.89|Новгород-Сіверський,51.99,33.26|Прилуцький,50.59,32.39|Чернігівський,51.49,31.29
АР Крим|Бахчисарайський,44.75,33.86|Білогірський,45.06,34.60|Джанкойський,45.71,34.39|Євпаторійський,45.20,33.36|Керченський,45.36,36.48|Красноперекопський,45.95,33.80|Курманський,45.50,34.30|Сімферопольський,44.95,34.10|Феодосійський,45.03,35.38|Ялтинський,44.50,34.17`.split('\n').forEach(l=>{const a=l.split('|');RC[a[0]]=a.slice(1).map(x=>{const q=x.split(',');return[q[0],+q[1],+q[2]]})});
function unionG(fs){if(fs.length===1)return fs[0].geometry;
 if(window.turf){try{const bf=f=>turf.buffer(f,0.25,{units:'kilometers'});let u=bf(fs[0]);for(let i=1;i<fs.length;i++)u=turf.union(u,bf(fs[i]));if(u&&u.geometry)return u.geometry}catch(e){}}
 return{type:'MultiPolygon',coordinates:fs.reduce((a,f)=>a.concat(f.geometry.type==='Polygon'?[f.geometry.coordinates]:f.geometry.coordinates),[])}}
function mainRaions(g){const fs=g.features.filter(f=>f.geometry&&/Polygon/.test(f.geometry.type)),cen=f=>L.geoJSON(f).getBounds().getCenter(),ob=c=>obAt(c,true)||obAt(c);
 if(fs.length<=160)return{type:'FeatureCollection',features:fs.filter(f=>RC[ob(cen(f)).n])};
 const G=new Map();fs.forEach(f=>{const c=cen(f),o=ob(c),cs=RC[o.n];if(!cs)return;const q=[c.lat,c.lng];let bi=0,bd=1e9;cs.forEach((x,i)=>{const d=dist(q,[x[1],x[2]]);if(d<bd){bd=d;bi=i}});const k=o.i+'|'+bi;if(!G.has(k))G.set(k,{o,c:cs[bi],fs:[]});G.get(k).fs.push(f)});
 return{type:'FeatureCollection',features:[...G.values()].map(x=>({type:'Feature',properties:{shapeName:x.c[0]+' район',_ob:x.o.i},geometry:unionG(x.fs)}))}}
async function loadR(){try{let g;try{g=JSON.parse(localStorage.getItem('alarmraions2')||'null')}catch(e){}
 if(!g)for(const f of[async()=>{let j=await(await fetch('https://www.geoboundaries.org/api/current/gbOpen/UKR/ADM2/')).json();j=Array.isArray(j)?j[0]:j;return(await fetch(j.simplifiedGeometryGeoJSON||j.gjDownloadURL)).json()},
  async()=>(await fetch('https://media.githubusercontent.com/media/wmgeolab/geoBoundaries/main/releaseData/gbOpen/UKR/ADM2/geoBoundaries-UKR-ADM2_simplified.geojson')).json(),
  async()=>(await fetch('https://raw.githubusercontent.com/wmgeolab/geoBoundaries/main/releaseData/gbOpen/UKR/ADM2/geoBoundaries-UKR-ADM2_simplified.geojson')).json(),
  async()=>(await fetch('https://cdn.jsdelivr.net/gh/wmgeolab/geoBoundaries@main/releaseData/gbOpen/UKR/ADM2/geoBoundaries-UKR-ADM2_simplified.geojson')).json()]){try{g=await f();if(g&&g.features)break}catch(e){}}
 if(!g||!g.features)throw 0;
 if(!g.main){g=mainRaions(g);g.main=1;try{localStorage.setItem('alarmraions2',JSON.stringify(g,(k,v)=>typeof v==='number'?Math.round(v*1e4)/1e4:v))}catch(e){}}
 L.geoJSON(g,{smoothFactor:2.5,style:()=>({fillOpacity:0.02,weight:0.7}),onEachFeature:(f,l)=>{const raw=f.properties.shapeName||'Район',r={n:raw.replace(/ Raion$/i,'')+' р-н',L:l,g:f.geometry,b:l.getBounds(),st:0,t:''};r.ob=f.properties._ob!==undefined?f.properties._ob:obAt(r.b.getCenter()).i;const k=sk(raw),D=OB[r.ob].D||[],m=D.find(d=>!d.u&&d.k===k)||D.find(d=>!d.u&&k.length>2&&d.k.slice(0,3)===k.slice(0,3));if(m){m.u=1;r.n=m.name;r.id=m.id}if(f.properties._n)r.n=f.properties._n;R.push(r);
  l.on('click',e=>{if(busy())return;gran==='o'?obPop(OB[r.ob],e.latlng):rPop(r,e.latlng)});if(!MOB){l.on('mouseover',()=>{if(!r.st)l.setStyle({weight:1.6,color:'#cfd8ea',opacity:.9})});l.on('mouseout',()=>paintR(r))}}}).addTo(map);
 R.forEach((r,i)=>{const v=savedR[i];if(v){r.st=v[0];r.t=v[1];r.a=!!v[2];r.ts=v[3]||0}});OB.forEach(o=>{if(o.st&&R.some(r=>r.ob===o.i)){R.forEach(r=>{if(r.ob===o.i&&!r.st){r.st=o.st;r.t=o.t;r.a=o.a;r.ts=o.ts}});o.st=0;o.t='';o.ts=0}});R.forEach(paintR);OB.forEach(paint);save();ui();say('Райони завантажено: '+R.length)}catch(e){say('Межі районів не завантажились — працюють області')}}
function find(f){const s=Object.values(f.properties||{}).filter(v=>typeof v==='string').join(' ').toLowerCase();
 if(/київ|kyiv|kiev/.test(s))return OB.find(o=>o.n===(/област|oblast|kyivska|київськ|region|province|kievska/.test(s)?'Київська':'Київ'));
 return OB.find(o=>o.k.some(k=>s.includes(k)))}
const TR={а:'a',б:'b',в:'v',г:'h',ґ:'g',д:'d',е:'e',є:'ye',ж:'zh',з:'z',и:'y',і:'i',ї:'yi',й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'kh',ц:'ts',ч:'ch',ш:'sh',щ:'shch',ю:'yu',я:'ya'};
const sk=s=>s.toLowerCase().replace(/\s*(район|raion|district)\s*$/,'').replace(/[а-яіїєґ]/g,c=>TR[c]||'').replace(/[aeiouy'’`ʼ\s-]/g,'').replace(/(.)\1+/g,'$1');
`Вінницька:Вінницький,Гайсинський,Жмеринський,Могилів-Подільський,Тульчинський,Хмільницький
Волинська:Володимир-Волинський,Камінь-Каширський,Ківерцівський,Луцький
Дніпропетровська:Дніпровський,Кам'янський,Криворізький,Нікопольський,Новомосковський,Павлоградський,Синельниківський
Донецька:Бахмутський,Волноваський,Горлівський,Донецький,Кальміуський,Краматорський,Маріупольський,Покровський
Житомирська:Бердичівський,Житомирський,Звягельський,Коростенський
Закарпатська:Берегівський,Мукачівський,Рахівський,Тячівський,Ужгородський,Хустський
Запорізька:Бердянський,Василівський,Запорізький,Мелітопольський,Пологівський
Івано-Франківська:Верховинський,Івано-Франківський,Калуський,Коломийський,Косівський,Надвірнянський
Київська:Білоцерківський,Бориспільський,Броварський,Бучанський,Вишгородський,Обухівський,Фастівський
Кіровоградська:Голованівський,Кропивницький,Новоукраїнський,Олександрійський
Луганська:Алчевський,Довжанський,Луганський,Ровеньківський,Сватівський,Сєвєродонецький,Старобільський,Щастинський
Львівська:Дрогобицький,Золочівський,Львівський,Самбірський,Стрийський,Червоноградський,Яворівський
Миколаївська:Баштанський,Вознесенський,Миколаївський,Первомайський
Одеська:Березівський,Білгород-Дністровський,Болградський,Ізмаїльський,Одеський,Подільський,Роздільнянський
Полтавська:Кременчуцький,Лубенський,Миргородський,Полтавський
Рівненська:Вараський,Дубенський,Рівненський,Сарненський
Сумська:Конотопський,Охтирський,Роменський,Сумський,Шосткинський
Тернопільська:Кременецький,Тернопільський,Чортківський
Харківська:Богодухівський,Ізюмський,Красноградський,Куп'янський,Лозівський,Харківський,Чугуївський
Херсонська:Бериславський,Генічеський,Каховський,Скадовський,Херсонський
Хмельницька:Кам'янець-Подільський,Хмельницький,Шепетівський
Черкаська:Звенигородський,Золотоніський,Уманський,Черкаський
Чернівецька:Вижницький,Дністровський,Чернівецький
Чернігівська:Корюківський,Ніжинський,Новгород-Сіверський,Прилуцький,Чернігівський
АР Крим:Бахчисарайський,Білогірський,Джанкойський,Євпаторійський,Керченський,Красноперекопський,Курманський,Сімферопольський,Феодосійський,Ялтинський`.split('\n').forEach(l=>{const[n,d]=l.split(':'),o=OB.find(o=>o.n===n);if(o)o.D=d.split(',').map(x=>({name:x+' район',k:sk(x)}))});
$('cr').textContent='© '+(CFG.OWNER||'')+' · симулятор, не реальні дані';
window.INIT=(async()=>{loadMask();let g;for(const u of['https://cdn.jsdelivr.net/gh/EugeneBorshch/ukraine_geojson@master/UA_FULL_Ukraine.geojson','https://raw.githubusercontent.com/EugeneBorshch/ukraine_geojson/master/UA_FULL_Ukraine.geojson']){try{g=await(await fetch(u)).json();break}catch(e){}}
 if(g)g.features.forEach(f=>{const o=find(f);if(o&&!o.L)bind(o,L.geoJSON(f,{smoothFactor:2.5}),f.geometry)});
 OB.forEach(o=>{if(!o.L)bind(o,L.circle(o.c,{radius:o.n==='Київ'?15000:50000}))});maskFromObl();await loadR()})();

const remKm=x=>{let k=0,a=x.p;x.route.forEach(q=>{k+=dist(a,q);a=q});return k},remMin=x=>remKm(x)/T[x.t].s*60;
function ic(x){const t=T[x.t];return L.divIcon({className:'',iconSize:[22,22],iconAnchor:[11,11],html:`<div class="ob" style="--c:${t.c}"><img src="${t.i}" alt="" draggable="false"><span>${t.g}</span></div>`})}
function mk(x){const c=T[x.t].c;x.m=L.marker(x.p,{icon:ic(x),zIndexOffset:500,title:T[x.t].n}).addTo(map);x.l=L.polyline([],{color:c,weight:2,dashArray:'6 6',opacity:0.8}).addTo(map);x.r=L.polyline(x.tr,{color:c,weight:1.5,opacity:0.5,smoothFactor:2}).addTo(map);
 x.z=L.circle(x.p,{radius:1,color:c,weight:1,fillOpacity:0.05,dashArray:'3 5',interactive:false});x.m.on('click',()=>edit(x));draw(x)}
function draw(x){const vis=x.sIn<=0||admin,e=x.m.getElement(),op=vis?(x.sIn>0?0.45:1):0;x.m.setLatLng(x.p);if(x._o!==op){x._o=op;x.m.setOpacity(op)}
 if(e){const hh=Math.round(x.h/2)*2;if(x._h!==hh||!x._im){x._h=hh;const im=x._im||(x._im=e.querySelector('img'));if(im)im.style.transform=`rotate(${hh}deg)`}}
 if(admin){x.l.setLatLngs([x.p].concat(x.route));x._l=1}else if(x._l){x.l.setLatLngs([]);x._l=0}
 const kk=vis?x.tr.length:-1;if(x._k!==kk){x._k=kk;x.r.setLatLngs(vis?x.tr:[])}
 if(admin&&AS.on&&x.sIn<=0){x.z.setLatLng(x.p).setRadius(AS.c[x.t].r*1000);if(!map.hasLayer(x.z))x.z.addTo(map)}else if(map.hasLayer(x.z))map.removeLayer(x.z)}
function add(t,p,route,delay){const x={id:nid++,t,p:[p.lat,p.lng],h:brg([p.lat,p.lng],route[0]),route:route.map(r=>r.slice()),sIn:delay*60,tr:[[p.lat,p.lng]],sf:0.92+Math.random()*0.16};mk(x);obs.push(x);save();ui()}
function rm(x){if(!x)return;if(x.fl&&!x.fl.e){x.fl.e=Math.round(SIMT);x.fl.P.push([Math.round(SIMT),+x.p[0].toFixed(3),+x.p[1].toFixed(3)])}[x.m,x.l,x.r,x.z].forEach(l=>map.removeLayer(l));obs=obs.filter(o=>o!==x);save();ui()}
function boomSnd(){if(!snd)return;try{ac=ac||new(window.AudioContext||window.webkitAudioContext)();if(ac.state==='suspended')ac.resume();const o=ac.createOscillator(),g=ac.createGain(),t=ac.currentTime;o.type='sawtooth';o.connect(g);g.connect(ac.destination);o.frequency.setValueAtTime(110,t);o.frequency.exponentialRampToValueAtTime(30,t+.7);g.gain.setValueAtTime(.18,t);g.gain.exponentialRampToValueAtTime(.001,t+.8);o.start();o.stop(t+.85)}catch(e){}}
function boom(x){const p=x.p.slice();if(x.fl)x.fl.h=1;tgm(x,'hit');rm(x);
 const b=L.marker(p,{icon:L.divIcon({className:'',html:'<div class="bx"><i></i><i></i><b>💥</b></div>',iconSize:[64,64],iconAnchor:[32,32]}),interactive:false,keyboard:false,zIndexOffset:900}).addTo(map);setTimeout(()=>map.removeLayer(b),3600);
 const c=L.circle(p,{radius:5000,color:'#ff5722',weight:2,fillColor:'#ff9800',fillOpacity:.22,interactive:false}).addTo(map);setTimeout(()=>map.removeLayer(c),7000);boomSnd()}
function edit(x){if(busy())return;const t=T[x.t],d=document.createElement('div');d.innerHTML=`<b>${t.n}</b><br><small>курс ${Math.round(x.h)}° · ${t.s} км/год · ще ${Math.ceil(remMin(x))} хв · точок маршруту: ${x.route.length}</small>`;
 if(admin){d.innerHTML+=`<br><button class="eo">✎ Маршрут</button><button class="ex">🗑</button>`;
  d.querySelector('.eo').onclick=()=>{map.closePopup();openNew(L.latLng(x.p),x)};d.querySelector('.ex').onclick=()=>{map.closePopup();rm(x)}}
 L.popup().setLatLng(x.p).setContent(d).openOn(map)}
setInterval(()=>{const n=performance.now();if(document.hidden){last=n;return}const dt=Math.min((n-last)/1000,1)*scale;last=n;SIMT+=dt*1000;
 for(const x of obs.slice()){let d=dt;if(x.sIn>0){x.sIn-=d;if(x.sIn>0)continue;d=-x.sIn;x.sIn=0}
  const v=T[x.t].s*(x.sf||1)/3600,tol=Math.max(1.5,v/(TURN*rad)*1.1);
  while(d>0&&x.route.length){const k=Math.min(d,5);d-=k;const q=x.route[0],db=dist(x.p,q),last_=x.route.length===1;
   if(db<=(last_?Math.max(v*k,tol*0.5):tol)){if(last_){x.p=q.slice();x.route=[];break}x.route.shift();continue}
   const df=((brg(x.p,q)-x.h+540)%360)-180;x.h=(x.h+Math.sign(df)*Math.min(Math.abs(df),TURN*k)+360)%360;x.p=dest(x.p[0],x.p[1],x.h,v*k);
   if(dist(x.tr[x.tr.length-1],x.p)>2)x.tr.push(x.p)}
  if(!x.route.length){boom(x);continue}draw(x);typeof rec==='function'&&rec(x)}},MOB?220:150);
setInterval(()=>{if(obs.length)save();if(evD){evD=0;try{localStorage.setItem('alarmev',JSON.stringify(EV))}catch(e){}}if(admin)rpB();cnt();if(HLu)hlDraw();tpR()},1000);

// ---- АС Тривог: автоматична система тривог
const ptsOf=g=>{const o=[];(g.type==='Polygon'?[g.coordinates]:g.coordinates).forEach(P=>P.forEach(ring=>{const k=Math.max(1,Math.ceil(ring.length/60));for(let i=0;i<ring.length;i+=k)o.push([ring[i][1],ring[i][0]])}));return o};
const units=()=>R.concat(OB.filter(o=>!R.some(r=>r.ob===o.i)));
function hit(u,s,r){if(!u.P){u.P=u.g?ptsOf(u.g):[u.c];u.pad=u.g?0:(u.n==='Київ'?15:50)}const b=u.b,pd=r+u.pad,dl=pd/111.32,dn=dl/Math.cos(s[0]*rad);
 if(s[0]<b.getSouth()-dl||s[0]>b.getNorth()+dl||s[1]<b.getWest()-dn||s[1]>b.getEast()+dn)return false;
 if(u.g&&pip(u.g,{lat:s[0],lng:s[1]}))return true;return u.P.some(p=>dist(p,s)<=pd)}
function samples(x,r){const P=[x.p].concat(x.route),o=[x.p],W=[r*0.5,r];let acc=0,k=0;
 for(let i=1;i<P.length&&k<2;i++){const sd=dist(P[i-1],P[i]);while(k<2&&sd>0&&acc+sd>=W[k]){const f=(W[k]-acc)/sd;o.push([P[i-1][0]+(P[i][0]-P[i-1][0])*f,P[i-1][1]+(P[i][1]-P[i-1][1])*f]);k++}acc+=sd}
 if(k<2)o.push(P[P.length-1]);return o}
function autoSet(u,v){const old=u.st;if(v===0&&old&&typeof tgU==='function')tgU(u,'off');if(old!==v){const o=u.ob!==undefined?OB[u.ob]:u;logEv(o,u.ob!==undefined?u.n:null,'s'+v,SM[v],'АС Тривог')}u.st=v;if(old!==v||!u.ts){u.t=v?tm():'';u.ts=v?Date.now():0}u.a=v?1:0;u.ob!==undefined?paintR(u):paint(u)}
function asTick(){if(!AS.on)return;if(!obs.length&&!R.some(u=>u.st&&u.a)&&!OB.some(u=>u.st&&u.a))return;const U=units(),need=new Map();
 obs.forEach(x=>{if(x.sIn>0)return;const c=AS.c[x.t],S=samples(x,c.r);U.forEach(u=>{if(S.some(s=>hit(u,s,c.r)))need.set(u,Math.max(need.get(u)||0,c.l))})});
 let ch=0,red=0;
 U.forEach(u=>{const n=need.get(u)||0;let v=null;
  if(n){u.free=0;u.dz=0;if(u.st<n||(u.a&&u.st>n))v=n}else if(u.st&&u.a){u.free=(u.free||0)+scale;if(u.free>=HOLD/2&&!u.dz){u.dz=1;typeof tgU==='function'&&tgU(u,'clr')}if(u.free>=HOLD)v=0}
  if(v!==null){autoSet(u,v);ch++;if(v==2)red=1}});
 if(ch){save();ui();if(red)siren()}}
setInterval(asTick,1000);
$('ass').innerHTML=Object.entries(T).map(([k,v])=>`<div class="r"><span><img class="mi" src="${v.i}" alt="">${v.n}</span><span><input data-k="${k}" data-f="r" type="number" min="1" max="1000" value="${AS.c[k].r}" style="width:62px"> км <select data-k="${k}" data-f="l"><option value="1"${AS.c[k].l==1?' selected':''}>🟡</option><option value="2"${AS.c[k].l==2?' selected':''}>🔴</option></select></span></div>`).join('');
$('ass').onchange=e=>{const t=e.target,k=t.dataset.k;if(!k)return;AS.c[k][t.dataset.f]=Math.max(1,+t.value||1);asSave();obs.forEach(draw)};
function asBtn(){$('asb').classList.toggle('on',AS.on);$('asb').textContent=AS.on?'🚨 АС Тривог: УВІМК':'🚨 АС Тривог'}asBtn();

// ---- створення / редагування маршруту (точки на карті)
let RT={o:null,p:[],x:null};const rg=L.layerGroup().addTo(map);
function setRouteOn(v){routeOn=v;$('pk').classList.toggle('on',v);mc.style.cursor=v?'crosshair':''}
function prev(){const t=T[$('t').value],P=[[RT.o.lat,RT.o.lng]].concat(RT.p);pl.setLatLngs(P);pl.setStyle({color:t.c});rg.clearLayers();
 L.circleMarker(P[0],{radius:6,color:'#fff',fillColor:'#2e7d32',fillOpacity:1,weight:2,interactive:false}).addTo(rg);
 RT.p.forEach((q,i)=>L.circleMarker(q,{radius:5,color:t.c,fillColor:'#fff',fillOpacity:1,weight:2,interactive:false}).bindTooltip(String(i+1),{permanent:true,direction:'top',offset:[0,-4],className:'wpt'}).addTo(rg));
 let km=0;for(let i=1;i<P.length;i++)km+=dist(P[i-1],P[i]);
 $('info').textContent=RT.p.length?`Точок: ${RT.p.length} · довжина ≈ ${Math.round(km)} км · політ ≈ ${Math.max(1,Math.round(km/t.s*60))} хв (${t.s} км/год)`:'Клікайте по карті, щоб поставити першу точку маршруту';$('ok').disabled=!RT.p.length}
function openNew(ll,x){RT={o:ll,p:x?x.route.map(r=>r.slice()):[],x:x||null};lp=Date.now();if(x)$('t').value=x.t;$('t').disabled=!!x;$('stl').hidden=!!x;
 $('dh').textContent=x?'Маршрут об\'єкта':'Створити об\'єкт';$('ok').textContent=x?'Зберегти':'Запустити';$('dlg').hidden=false;document.body.classList.add('dl');setRouteOn(true);prev()}
function closeNew(){$('dlg').hidden=true;document.body.classList.remove('dl');setRouteOn(false);pl.setLatLngs([]);rg.clearLayers()}
$('t').innerHTML=Object.entries(T).map(([k,v])=>`<option value="${k}">${v.n}</option>`).join('');
$('t').onchange=prev;$('no').onclick=closeNew;
$('ok').onclick=()=>{if(!RT.p.length)return;if(RT.x){RT.x.route=RT.p.map(r=>r.slice());draw(RT.x);save();ui()}else add($('t').value,RT.o,RT.p,Math.max(0,+$('st').value||0));closeNew()};
$('pk').onclick=()=>setRouteOn(!routeOn);
$('un').onclick=()=>{RT.p.pop();prev()};$('rk').onclick=()=>{RT.p=[];prev()};
$('zz').onclick=()=>{const n=RT.p.length;if(!n)return say('Спочатку поставте кінцеву точку');const A=n>1?RT.p[n-2]:[RT.o.lat,RT.o.lng],B=RT.p.pop(),len=dist(A,B),b=brg(A,B),amp=Math.min(30,len/6);
 if(len<10){RT.p.push(B);prev();return say('Відрізок закороткий для зиґзага')}
 const k=Math.max(3,Math.min(8,Math.round(len/40)));for(let i=1;i<k;i++){const m=dest(A[0],A[1],b,len*i/k);RT.p.push(dest(m[0],m[1],b+(i%2?90:-90),amp))}RT.p.push(B);prev()}

// ---- швидкий запуск (панель знизу): тип → старт → кінцева точка, і так по колу
let Q={t:'shahed',n:1,m:0,on:0,s:null};try{const q=localStorage.getItem('alarmq');if(q&&T[q])Q.t=q}catch(e){}
$('qt').innerHTML=Object.entries(T).map(([k,v])=>`<button data-q="${k}" title="${v.n}"><img src="${v.i}" alt=""><span>${v.g}</span></button>`).join('');
function qUi(){document.querySelectorAll('#qt button').forEach(b=>b.classList.toggle('on',!!Q.on&&b.dataset.q===Q.t));$('qx').hidden=!Q.on;$('qn').textContent='×'+Q.n;$('qm').classList.toggle('on',!!Q.m)}
function qMv(e){if(Q.s)pl.setLatLngs([Q.s,[e.latlng.lat,e.latlng.lng]])}
function qStop(){Q.on=0;Q.s=null;endPick();pl.setLatLngs([]);rg.clearLayers();map.off('mousemove',qMv);qUi()}
function qGo(){if(!$('dlg').hidden)return;if(brush!==null)setBrush(null);const t=T[Q.t];Q.on=1;Q.s=null;pl.setLatLngs([]);rg.clearLayers();qUi();
 startPick('🛫 '+t.n+': торкніться карти — звідки стартує',a=>{Q.s=[a.lat,a.lng];
  if(Q.m){Q.on=0;qUi();$('t').value=Q.t;return openNew(a)}
  pl.setStyle({color:t.c});pl.setLatLngs([Q.s,Q.s]);rg.clearLayers();L.circleMarker(Q.s,{radius:6,color:'#fff',fillColor:'#2e7d32',fillOpacity:1,weight:2,interactive:false}).addTo(rg);map.on('mousemove',qMv);
  startPick('🎯 Тепер торкніться — куди летить (кінцева точка)',b=>{const s=Q.s,e=[b.lat,b.lng];map.off('mousemove',qMv);
   if(dist(s,e)>=3){const sp=Math.min(40,6+Q.n*2.5),ep=Math.min(60,10+Q.n*4);for(let i=0;i<Q.n;i++){const p=i?dest(s[0],s[1],Math.random()*360,8+Math.random()*sp):s,q=i?dest(e[0],e[1],Math.random()*360,6+Math.random()*ep):e;add(Q.t,L.latLng(p[0],p[1]),[q],i?Math.random()*0.12:0)}}
   qGo()},qStop)},qStop)}
$('qt').onclick=e=>{const b=e.target.closest('button');if(!b)return;const k=b.dataset.q;if(Q.on&&Q.t===k)return qStop();Q.t=k;try{localStorage.setItem('alarmq',k)}catch(x){}if(Q.on)qStop();qGo()};
$('qn').onclick=()=>{Q.n=Q.n===1?3:Q.n===3?5:Q.n===5?10:1;qUi()};
$('qm').onclick=()=>{Q.m=Q.m?0:1;qUi();say(Q.m?'Складний маршрут: після старту відкриється редактор точок':'Швидкий режим: старт → кінцева точка')};
$('qx').onclick=qStop;qUi();

map.on('click',e=>{$('menu').hidden=true;if(routeOn){if(Date.now()-lp>500){RT.p.push([e.latlng.lat,e.latlng.lng]);prev()}return}if(pick){const f=pick.f;endPick();f(e.latlng)}});
map.on('movestart',()=>{$('menu').hidden=true});
const coarse=matchMedia('(pointer:coarse)').matches;
map.on('contextmenu',e=>{if(!admin)return say('Увімкніть режим 🛠 Адмін');if(!$('dlg').hidden){if(RT.p.length){RT.p.pop();prev()}return}if(busy()||Date.now()-lp<1500)return;
 if(coarse)return openNew(e.latlng);mll=e.latlng;const m=$('menu');m.style.left=e.originalEvent.clientX+'px';m.style.top=e.originalEvent.clientY+'px';m.hidden=false});
$('menu').onclick=()=>{$('menu').hidden=true;openNew(mll)};
const mc=map.getContainer();
mc.addEventListener('pointerdown',e=>{clearTimeout(lt);if(e.pointerType!=='touch'||!e.isPrimary||!admin||busy())return;sp=[e.clientX,e.clientY];
 lt=setTimeout(()=>{if(Date.now()-lp<1500)return;navigator.vibrate&&navigator.vibrate(30);openNew(map.mouseEventToLatLng(e))},550)});
mc.addEventListener('pointermove',e=>{if(sp&&Math.hypot(e.clientX-sp[0],e.clientY-sp[1])>10)clearTimeout(lt)});
['pointerup','pointercancel'].forEach(k=>mc.addEventListener(k,()=>clearTimeout(lt)));

$('spd').innerHTML=[1,5,10,30,60].map(v=>`<option value="${v}"${v==10?' selected':''}>×${v}</option>`).join('');
$('spd').onchange=e=>{scale=+e.target.value};
$('adm').onclick=()=>{admin=!admin;document.body.classList.toggle('adm',admin);if(!admin)setBrush(null);$('adm').classList.toggle('on',admin);$('panel').hidden=!admin;obs.forEach(draw);ui()};
$('panel').onclick=e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset;e.preventDefault();
 if(d.b!==undefined)setBrush(d.b==='x'?null:+d.b);else if(d.o!==undefined)setSt(OB[d.o],+d.s);else if(d.r!==undefined)setR(R[d.r],+d.s);else if(d.d)rm(obs.find(x=>x.id==d.d));else if(d.e){const x=obs.find(x=>x.id==d.e);if(x){map.setView(x.p);edit(x)}}
 else if(d.g!==undefined){gran=d.g;document.querySelectorAll('#gr button').forEach(x=>x.classList.toggle('on',x.dataset.g===gran));setBrush(brush);say(gran==='o'?'Режим: цілі області':'Режим: окремі райони')}else if(d.a==='as'){AS.on=!AS.on;asSave();asBtn();obs.forEach(draw);say(AS.on?'АС Тривог увімкнено: тривога виставляється автоматично':'АС Тривог вимкнено')}else if(d.a==='clr')OB.forEach(o=>setSt(o,0));else if(d.a==='del')obs.slice().forEach(rm)};
try{const s=JSON.parse(localStorage.getItem('alarmsim1')||'null');if(s){nid=s.n||1;savedR=s.r||[];s.o.forEach((v,i)=>{if(OB[i]){OB[i].st=v[0];OB[i].t=v[1];OB[i].a=!!v[2];OB[i].ts=v[3]||0}});s.b.forEach(b=>{if(!T[b.t])return;if(!b.route)b.route=[dest(b.p[0],b.p[1],b.th||b.h||0,T[b.t].s*Math.max(b.rem||60,60)/3600)];b.sIn=b.sIn||0;mk(b);obs.push(b)})}}catch(e){}
cnt();

function setBrush(v){brush=v;document.querySelectorAll('#br button').forEach(b=>b.classList.toggle('on',v!==null&&b.dataset.b==v));map.dragging[v===null?'enable':'disable']();mc.style.touchAction=v===null?'':'none';mc.style.cursor=v===null?'':'crosshair';if(v!==null)say(R.length?'Пензель: клікайте або водіть по районах. ✋ — повернути рух карти':'Райони ще вантажаться — поки фарбую області')}
function paintAt(e){const ll=map.mouseEventToLatLng(e),r=hitR(ll),o=r?(gran==='o'?OB[r.ob]:null):(R.length?null:obAt(ll,true)),h=(gran==='o'&&r)?o:(r||o);if(h&&h!==lastH){lastH=h;(gran==='o'||!r)?setSt(o,brush):setR(r,brush)}}
mc.addEventListener('pointerdown',e=>{down++;if(brush!==null&&down===1&&!e.target.closest('.leaflet-control,.leaflet-popup')){lastH=null;paintAt(e)}},true);
mc.addEventListener('pointermove',e=>{if(brush!==null&&down===1&&e.buttons&1)paintAt(e)});
['pointerup','pointercancel'].forEach(k=>addEventListener(k,()=>{down=Math.max(0,down-1)}));
function siren(){if(!snd)return;ac=ac||new(window.AudioContext||window.webkitAudioContext)();if(ac.state==='suspended')ac.resume();const o=ac.createOscillator(),g=ac.createGain(),t=ac.currentTime;o.connect(g);g.connect(ac.destination);g.gain.value=0.08;o.frequency.setValueAtTime(500,t);for(let i=0;i<3;i++){o.frequency.linearRampToValueAtTime(900,t+i*2+1);o.frequency.linearRampToValueAtTime(500,t+i*2+2)}o.start();o.stop(t+6)}
$('snd').onclick=()=>{snd=!snd;$('snd').textContent=snd?'🔔':'🔕';if(snd)siren()};

$('ua').classList.toggle('on',only);
$('ua').onclick=()=>{only=!only;try{localStorage.setItem('alarmonly',only?'1':'0')}catch(e){}$('ua').classList.toggle('on',only);if(MK){if(only)MK.addTo(map);else map.removeLayer(MK)}else if(only)say('Контур України ще будується…');applyOnly(true)};

$('fq').oninput=e=>{FQ=e.target.value;rpO()};
$('ol').addEventListener('toggle',e=>{const i=e.target.dataset.i;if(i!==undefined){if(e.target.open)OPEN.add(i);else OPEN.delete(i)}},true);
// ---- меню «Загрози»: райони з тривогою, рівень, початок, тривалість; клік — підсвітити загрози й їхній шлях
const HLo=L.layerGroup().addTo(map),HLt=L.layerGroup().addTo(map);let HLu=null,TPU=[],tpSig='';
const uName=u=>u.ob!==undefined?u.n:oname(u),uObl=u=>u.ob!==undefined?oname(OB[u.ob]):'';
const tsOf=u=>{if(u.ts)return u.ts;const m=/(\d+):(\d+)/.exec(u.t||'');let t=Date.now();if(m){const d=new Date();d.setHours(+m[1],+m[2],0,0);if(d.getTime()>t)d.setDate(d.getDate()-1);t=d.getTime()}return u.ts=t};
const fdur=ms=>{const s=Math.max(0,Math.floor(ms/1000)),h=s/3600|0,m=(s%3600)/60|0;return h?h+' год '+String(m).padStart(2,'0')+' хв':m?m+' хв '+String(s%60).padStart(2,'0')+' с':s+' с'};
const vobs=()=>obs.filter(x=>x.sIn<=0||admin),objsOf=u=>vobs().filter(x=>hit(u,x.p,0)||x.tr.some(p=>hit(u,p,0)));
function tpR(force){if($('tp').hidden)return;const A=units().filter(u=>u.st).sort((a,b)=>b.st-a.st||tsOf(a)-tsOf(b)),sig=A.map(u=>(u.ob!==undefined?u.ob+u.n:'o'+u.i)+u.st).join()+'|'+(HLu?1:0);
 if(force||sig!==tpSig){tpSig=sig;TPU=A;$('tpl').innerHTML=A.length?A.map((u,i)=>`<div class="tr${u===HLu?' on':''}" data-u="${i}"><span class="lv">${u.st==2?'🔴':'🟡'}</span><div class="tnm"><b>${esc(uName(u))}</b><small>${esc(uObl(u))}</small></div><div class="tw"><span>${u.st==2?'Тривога':'Увага'} з ${esc(u.t||'—')}</span><span class="du" data-i="${i}"></span></div><span class="tc" data-i="${i}"></span></div>`).join(''):'<small>Зараз тривог немає</small>'}
 const V=vobs();$('tpl').querySelectorAll('.du').forEach(e=>{e.textContent='триває '+fdur(Date.now()-tsOf(TPU[e.dataset.i]))});
 $('tpl').querySelectorAll('.tc').forEach(e=>{const u=TPU[e.dataset.i],n=V.filter(x=>hit(u,x.p,0)).length;e.textContent=n?'✈ '+n:''})}
function hlClear(){HLo.clearLayers();HLt.clearLayers();HLu=null}
function hlDraw(){HLt.clearLayers();if(!HLu)return[];const A=objsOf(HLu);A.forEach(x=>{const P=x.tr.concat([x.p]),c=T[x.t].c;
 L.polyline(P,{color:'#fff',weight:6,opacity:.45,interactive:false}).addTo(HLt);L.polyline(P,{color:c,weight:3,opacity:1,interactive:false}).addTo(HLt);
 L.circleMarker(P[0],{radius:5,color:'#fff',fillColor:c,fillOpacity:1,weight:2,interactive:false}).addTo(HLt);L.circleMarker(x.p,{radius:15,color:c,weight:3,fillOpacity:.15,interactive:false}).addTo(HLt)});return A}
function hlSet(u){hlClear();HLu=u;const st={color:'#fff',weight:3,fill:false,dashArray:'6 4',interactive:false},
 ol=u.g?L.geoJSON({type:'Feature',geometry:u.g},{style:()=>st,interactive:false}):L.circle(u.c,Object.assign({radius:(u.n==='Київ'?15:50)*1000},st));ol.addTo(HLo);
 const A=hlDraw(),b=L.latLngBounds(ol.getBounds());A.forEach(x=>x.tr.forEach(p=>b.extend(p)));
 const pad=MOB?{paddingTopLeft:[16,Math.round(innerHeight*.46)],paddingBottomRight:[16,90]}:{paddingTopLeft:[16,70],paddingBottomRight:[360,40]};
 map.fitBounds(b.pad(.1),Object.assign({maxZoom:9},pad));if(!A.length)say('У цьому районі зараз немає цілей — тривога виставлена вручну чи АС')}
$('tpl').onclick=e=>{const r=e.target.closest('.tr');if(!r)return;const u=TPU[+r.dataset.u];if(!u)return;if(HLu===u)hlClear();else hlSet(u);tpR(true)};
function tpClose(){$('tp').hidden=true;hlClear()}
$('tpx').onclick=tpClose;$('thr').onclick=()=>{if($('tp').hidden){$('tp').hidden=false;tpR(true)}else tpClose()};


// ---- ТГК-симуляція (вигадані канали) + Groq ШІ
const DIRS=['північ','північний схід','схід','південний схід','південь','південний захід','захід','північний захід'],cmp=a=>DIRS[Math.round(((a%360)+360)%360/45)%8];
// вигадані канали: [назва, стиль для ШІ, номер стилю шаблонів 0-3]
const CH=[['Повітряний простір України UA','офіційно, коротко, як сповіщення про тривогу',2,''],['Офіційний радар UA Захід Тривога','коротко, з 🚨, регіон — захід',2,'Львівська Волинська Рівненська Тернопільська Івано-Франківська Закарпатська Чернівецька Хмельницька'],['Повітряні Сили ЗС України','сухо, військова зведення, без емодзі',2,''],['Карта Повітряних Тривог !! Вибухи !! Ракети!!','капс, окличні знаки, емодзі',3,''],['НЕПТУН','військовий жаргон, дуже коротко',0,''],['Хроніки війни | Оперативний Монітор','стисла хронологія',0,''],['Доброго вечора ми з Тернополя','розмовно, місцевий тон, Тернопіль',1,'Тернопільська'],['Хуйовий Тернопіль','розмовно, іронічно, без лайки, Тернопіль',1,'Тернопільська'],['Труха Україна','розмовно, скептично, емоційно',1,''],['Де Ракета? Моніторинг','тип цілі й напрямок',0,''],['Захід Інформує','регіон — захід, чітко',2,'Львівська Волинська Рівненська Тернопільська Івано-Франківська Закарпатська Чернівецька Хмельницька'],['Львів Інформує','Львів і область, тривожно',3,'Львівська'],['Швидше всіх','дуже швидко, емодзі, без деталей',1,''],['Радник','спокійно, з порадою ховатись',2,''],['Інформатор','розмовно, коротко',1,''],['Лачен пише','особистий тон, коротко',1,''],['Вибухи та бавовна','акцент на вибухах, емодзі 💥',3,''],['Без фільтрів','різко, коротко',3,''],['НЕВІДОМИЙ','лаконічно, загадково',0,''],['Схід UA Онлайн','регіон — схід, чітко',0,'Харківська Донецька Луганська Дніпропетровська Запорізька Сумська Полтавська'],['Одеса Інформує','Одеса й південь, жваво',1,'Одеська Миколаївська Херсонська']];
// шаблони (запасний варіант без ШІ): [стиль][варіант]; {t}тип {r}де {d}напрямок {c}орієнтир {z}небезпека {s}місце удару
const TP={
new:[['{t} — {r}, курс на {d}.','Нова ціль: {t}, {r}. Курс {d}, орієнтир — {c}.','{t} {r}. На {d}.'],['🛩 {t} — {r}, курс на {d} 👀','🚨 {t} {r}, курс {d}. Орієнтир: {c}','Нова ціль! {t}, {r}. Дивимось на {c} 👀'],['За даними моніторингу, {t} зафіксовано {r}. Напрямок — {d}.','Фіксація: {t}, {r}. Вектор — {d}, орієнтир — {c}.','{t}: {r}. Напрямок орієнтовно — {d}.'],['⚠️ {t} — {r}! Курс на {d}. В укриття!','❗️{t} {r}, на {d}. Не ігноруйте тривогу','🚨 {r} — {t}! Курс на {c}, обережно!']],
enter:[['{t} вже {r}, курс {d}.','{t} — {r}. Далі на {d}.','{t} зайшов: {r}. Курс {c}.'],['➡️ {t} вже {r}! Курс {d}','🔜 {t} перетнув межу — {r}, летить на {d}','{t} {r}, напрямок на {c}, обережно!'],['Ціль ({t}) увійшла в межі: {r}. Напрямок — {d}. Небезпека: {z}.','{t} {r}; напрямок — {d}, орієнтир — {c}.','Повідомляють: {t} {r}. Напрямок на {c}.'],['⚠️ {t} {r}, курс на {d}! Небезпека: {z}','❗️{t} зайшов — {r}. В укриття','{r} — {t}! {c}, обережно!!']],
upd:[['{t} ще {r}, курс {d}.','{t}: {r}, {d}. Без змін.','{t} продовжує рух, орієнтир {c}.'],['🔄 {t} ще летить — {r}, орієнтир: {c}','👀 {t} все ще {r}, курс {d}','{t} далі на {c}, обережно!'],['Оновлення: {t} продовжує рух, {r}, орієнтовно на {d}.','За останніми даними, {t} {r}; орієнтир — {c}.','{t} не змінює курс — {d}.'],['⚠️ {t} ще в небі — {r}! Залишайтесь в укритті','❗️{t} {r} продовжує політ на {d}','{c}, тримаємось в укритті!!']],
hit:[['{t} — приліт, {s}. Вибух зафіксовано.','Вибух: {s} ({t}).','{c} Гучно.'],['💥 Бавовна! {t} долетів — {s}','💥💥 Приліт {s}! {t}','{c} Гучно!! 💥'],['Повідомляють про вибух: {s}. Ймовірна причина — {t}. Уточнюємо.','Зафіксовано влучання ({t}), {s}.','Вибухи в районі м. {c}. Деталі уточнюються.'],['💥 Вибух {s}! {t} досяг цілі. Не виходьте з укриття.','‼️ {c} Гучно!! Лишайтесь в укритті','{c}, сховалися в Укриття!!']],
dir:[['{t} на {c}.','Напрямок — {c}. Увага.','{t}: курс на {c}.'],['➡️ {t} на {c}, обережно!','{c}, обережно! {t} курсом на місто 👀','Напрямок на {c} ⚠️'],['За даними моніторингу, {t} рухається в напрямку м. {c}.','Напрямок — {c}. Загроза уточнюється.','{t} орієнтовно на {c}.'],['⚠️ {c}! {t} курсом на місто. В укриття!','❗️{c}, обережно, {t} на вас!','🚨 {c} УКРИТТЯ!']],
near:[['{t} на підльоті до {c}.','До {c} — {t}, підліт.','На підльоті до міста: {c}.'],['На підльоті до міста! {c} 🙏','🔥 {c}, на підльоті {t}','{c}, на підльоті!!'],['Ціль наближається до м. {c}.','{t} на підльоті до {c}. Небезпека.','Підліт до {c}. Залишайтесь в укритті.'],['{c} УКРИТТЯ!','⚠️ {c}, на підльоті! Усі в укриття!!!','Знижається, усі в укриття!!!']],
clr:[['Дорозвідка {r} — чисто, очікуємо відбій.','Дорозвідка: {r}, нових цілей не фіксуємо.','Дорозвідка. Тихо.'],['🟢 Дорозвідка {r}, схоже на відбій','Дорозвідка — тихо. Скоро відбій 🙏','Дорозвідка: чисто 👌'],['Ситуація {r} стабілізується. Дорозвідка триває.','Дорозвідка: нових цілей {r} не виявлено. Очікуйте відбій.','Триває дорозвідка. Відбою ще немає.'],['Дорозвідка. Поки чисто, але з укриття не виходьте!','❗️Дорозвідка {r}. Не поспішайте виходити.','Дорозвідка… чекаємо відбій!!']],
off:[['Відбій тривоги {r}.','Відбій {r}.','🟢 Відбій.'],['🟢 Відбій {r}! Дякуємо ПС 🙏','Відбій! {r} 🟢','🟢🟢 Відбій!!'],['Повітряну тривогу {r} скасовано.','Відбій повітряної тривоги {r}.','Відбій. Дякуємо за уважність.'],['🟢 Відбій {r}!','✅ Відбій тривоги {r}. Будьте обережні','Відбій! Але не розслабляйтесь']]};
const lcN=o=>o.n==='Київ'?'м. Києві':o.n==='АР Крим'?'Криму':o.n==='Севастополь'?'Севастополі':o.n.replace(/а$/,'ій')+' області',
 gnN=o=>o.n==='Київ'?'м. Києва':o.n==='АР Крим'?'АР Крим':o.n==='Севастополь'?'Севастополя':o.n.replace(/а$/,'ої')+' області';
function alVis(){$('alh').hidden=!ah;$('al').hidden=!ah&&!TG.length}
function along(x,d){let a=x.p;for(const q of x.route){const sd=dist(a,q);if(sd>=d){const f=d/sd;return[a[0]+(q[0]-a[0])*f,a[1]+(q[1]-a[1])*f]}d-=sd;a=q}return a}
function facts(x,k,cn){const t=T[x.t],o=obAt(L.latLng(x.p),true),q=along(x,Math.min(remKm(x),90)),c=CT.reduce((a,b)=>dist([b.la,b.ln],q)<dist([a.la,a.ln],q)?b:a),r=AS.c[x.t].r,S=samples(x,r),
  dz=units().filter(u=>S.some(s=>hit(u,s,r))).map(u=>u.ob!==undefined?u.n:oname(u));let s='поза кордонами України';
 if(o){const rr=k==='hit'?hitR(L.latLng(x.p)):null,a=rr?rr.n.split(' ')[0]:'';s=rr?(/ий$/.test(a)?'у '+a.replace(/ий$/,'ому')+' районі '+gnN(o):'в районі «'+rr.n+'», '+lcN(o)):'у '+lcN(o)}
 return{k,t:(n=>n>1?'Група '+n+'× '+t.n:t.n)(vobs().filter(y=>y.t===x.t&&dist(y.p,x.p)<40).length),r:o?'у '+lcN(o):'поза кордонами України',d:cmp(x.h),c:cn||c.n,z:dz.length?dz.slice(0,4).join(', ')+(dz.length>4?' та ще '+(dz.length-4):''):'уточнюється',s,o}}
const tmpl=(f,ch)=>{const P=TP[f.k][ch[2]];return P[Math.random()*P.length|0].replace(/\{(\w)\}/g,(_,c)=>f[c]||'')};
const SYS='Ти пишеш повідомлення для ВИМИШЛЕНОГО Telegram-каналу в грі-симуляторі моніторингу повітряних цілей. Використовуй ЛИШЕ надані факти (подія, тип цілі, місце, приблизний напрямок, орієнтир-місто, райони небезпеки). Не вигадуй інших міст, чисел, швидкостей і подробиць. Подія «вибух» означає, що ціль досягла кінця маршруту у вказаному місці. Пиши українською, 1-3 короткі рядки, 0-2 емодзі, без підпису, без хештегів, без запитань. Пиши як реальні українські тгк про повітряну тривогу: короткі фрази на кшталт «Львів Гучно!!», «Київ УКРИТТЯ!», «На підльоті до міста», «Знижається, усі в укриття!!!», «Дорозвідка» перед відбоєм. Кожне повідомлення має звучати інакше за попередні: не повторюй їхні фрази й будову речень.';
const KH={new:'нова ціль',enter:'ціль в іншій області',upd:'ціль продовжує рух',hit:'вибух: ціль досягла кінця маршруту',dir:'ціль курсом на місто',near:'ціль на підльоті до міста',clr:'дорозвідка, скоро відбій',off:'відбій тривоги'},FMT=['почни з емодзі','почни з типу цілі','почни з місця','без емодзі на початку','лише один рядок','три короткі рядки','розмовний тон','сухий тон зведення'];
const GK=CFG.GROQ_KEY||'',GM=CFG.GROQ_MODEL||'llama-3.1-8b-instant';let aiOff=0,aiN=0,aiWarn=0;
async function ai(f,m,ch){if(!GK||aiN>=3||Date.now()<aiOff)return;aiN++;
 try{const r=await fetch('https://api.groq.com/openai/v1/chat/completions',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+GK},body:JSON.stringify({model:GM,temperature:1,max_tokens:140,messages:[{role:'system',content:SYS+' Стиль каналу «'+ch[0]+'»: '+ch[1]+'.'},{role:'user',content:JSON.stringify({подія:KH[f.k],тип:f.t,місце:f.k==='hit'?f.s:f.r,напрямок_приблизно:'на '+f.d,орієнтир:f.c,небезпека:f.z,побажання_до_форми:FMT[Math.random()*FMT.length|0],вже_були_не_повторюй:TG.slice(0,5).map(z=>z.txt.replace(/\n/g,' ').slice(0,100))})}]})});
  if(r.status===401||r.status===403){aiOff=Infinity;if(!aiWarn){aiWarn=1;say('Groq: ключ недійсний (config.js) — ТГК пише за шаблоном')}return}
  if(!r.ok){aiOff=Date.now()+(r.status===429?30000:15000);return}
  const j=await r.json(),tx=(j.choices&&j.choices[0]&&j.choices[0].message.content||'').trim();if(tx){m.txt=tx;m.ai=1;renderTG()}}
 catch(e){aiOff=Date.now()+15000}finally{aiN--}}
function renderTG(){$('tgk').innerHTML=TG.length?'<div class="th">📡 ТГК <small>(симуляція'+(GK&&aiOff!==Infinity?' · ШІ':'')+')</small></div>'+TG.slice(0,12).map(m=>`<div class="tm"><b>${esc(m.ch)}</b> <small>${m.t}</small><div>${esc(m.txt)}</div></div>`).join(''):'';alVis()}
const PQ=[];function post(f,ch){PQ.push([f,ch]);if(PQ.length>5)PQ.shift()}setInterval(()=>{const q=PQ.shift();if(q)post1(q[0],q[1])},1300);
function post1(f,ch){const m={ch:ch[0],t:tm(),txt:tmpl(f,ch)};TG.unshift(m);if(TG.length>40)TG.pop();renderTG();ai(f,m,ch)}
// про вибух пишуть 2-3 різні канали з невеликою затримкою; канали, що писали щойно, йдуть у кінець черги
const TGC={};function tgm(x,k,cn){const f=facts(x,k,cn),n=k==='hit'?2+(Math.random()*2|0):1,rec=TG.slice(0,4).map(m=>m.ch),cs=CH.slice().sort((a,b)=>(rec.includes(a[0])-rec.includes(b[0]))*2-((a[3]&&f.o&&a[3].includes(f.o.n))-(b[3]&&f.o&&b[3].includes(f.o.n)))*3+Math.random()-.5).slice(0,n);
 const ky=x.t+'|'+(f.o?f.o.i:-1)+'|'+k+'|'+(cn||''),cd=k==='hit'?5000:k==='upd'?40000:20000,ok=!(TGC[ky]&&Date.now()-TGC[ky]<cd);if(ok)TGC[ky]=Date.now();
 if(ok)cs.forEach((ch,i)=>i?setTimeout(()=>post(f,ch),1500+Math.random()*7000):post(f,ch));
 if(f.o&&{new:1,enter:1,upd:1,hit:1}[k]){const dd=cmp(x.h);logEv(f.o,null,'x',{new:`🛩 ${f.t}: зафіксовано, курс на ${dd}`,enter:`➡️ ${f.t} увійшов в область, курс на ${dd}`,upd:`🔄 ${f.t}: у межах області, курс на ${dd}`,hit:`💥 ${f.t}: вибух — ${f.s}`}[k],'ціль')}}
setInterval(()=>{obs.forEach(x=>{if(x.sIn>0)return;if(x.ann!==undefined&&x.cp&&dist(x.cp,x.p)<3){x.nt-=scale;if(x.nt<=0){x.nt=900*(0.7+Math.random()*0.6);tgm(x,'upd')}return}x.cp=x.p.slice();if(obs.length<60){const nc=(q,d,zz)=>{let b=null,bd=d;CT.forEach(c=>{if(c.z<=zz){const m=dist([c.la,c.ln],q);if(m<bd){bd=m;b=c}}});return b},cn=nc(x.p,45,6),cd=nc(along(x,80),22,8);if(cn&&x.nr!==cn.n){x.nr=cn.n;tgm(x,'near',cn.n)}else if(cd&&x.lc!==cd.n){x.lc=cd.n;tgm(x,'dir',cd.n)}}const o=obAt(L.latLng(x.p),true),id=o?o.i:-1;
 if(x.ann===undefined){x.ann=1;x.ob=id;x.nt=900*(0.7+Math.random()*0.6);tgm(x,'new')}
 else if(id!==x.ob){x.ob=id;x.nt=900*(0.7+Math.random()*0.6);if(id>=0)tgm(x,'enter')}
 else{x.nt-=scale;if(x.nt<=0){x.nt=900*(0.7+Math.random()*0.6);tgm(x,'upd')}}})},1000);
renderTG();
