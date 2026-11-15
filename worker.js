// Cloudflare Worker — ховає токен Ukraine Alarm, видає дані лише твоєму сайту й друзям із кодом.
// Settings → Variables: секрети UA_TOKEN (токен API), ACCESS_CODE (код для друзів); змінна ALLOWED, напр.
//   https://ТВІЙНІК.github.io,http://localhost:8000
const PATHS=new Set(['/api/v3/regions','/api/v3/alerts','/api/v3/alerts/status']);
export default{async fetch(req,env){
  const o=req.headers.get('Origin')||'',allow=(env.ALLOWED||'').split(',').map(s=>s.trim());
  const cors={'Access-Control-Allow-Origin':allow.includes(o)?o:'null','Access-Control-Allow-Headers':'X-Access-Code','Vary':'Origin'};
  if(req.method==='OPTIONS')return new Response(null,{headers:cors});
  const u=new URL(req.url);
  if(!allow.includes(o)||req.headers.get('X-Access-Code')!==env.ACCESS_CODE||!PATHS.has(u.pathname))return new Response('Forbidden',{status:403,headers:cors});
  const r=await fetch('https://api.ukrainealarm.com'+u.pathname,{headers:{Authorization:env.UA_TOKEN},cf:{cacheTtl:u.pathname.endsWith('regions')?3600:10,cacheEverything:true}});
  return new Response(r.body,{status:r.status,headers:{...cors,'Content-Type':'application/json'}});
}};
