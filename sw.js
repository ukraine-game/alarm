// мережа в пріоритеті (завжди свіжа версія), кеш — запасний варіант без інтернету
const V='alarm-v6',A=['./','index.html','style.css','script.js','extra.js','auto.js','mobile.js','final.js','config.js','manifest.webmanifest','img/favicon.ico','img/apple-touch-icon.png','drones/ic_shahed.svg','drones/jet_powered_shahed.svg','drones/ic_banderol.svg','drones/ic_airbomb_kab.svg','drones/unidentified_flying_object.svg','drones/black_ukraine_map.svg','drones/white_ukraine_map.svg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(V).then(c=>c.addAll(A)).catch(()=>0).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET'||new URL(r.url).origin!==location.origin)return;
 e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res}).catch(()=>caches.match(r)))});
