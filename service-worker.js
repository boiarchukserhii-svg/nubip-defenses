/* Independent, locally published data. No University or Firebase requests. */
const VERSION='nubip-defenses-pwa-v23-calendar-title-20261019';
const SHELL=['./','./index.html','./data.json','./manifest.webmanifest','./icon-192.png','./icon-512.png','./nubip-logo-blue.png?v=2','./theme.js?v=7','./brand.js','./cleanup.css?v=3'];
self.addEventListener('install',event=>event.waitUntil(caches.open(VERSION).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('nubip-defenses-pwa-')&&k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 const req=event.request,url=new URL(req.url);
 if(req.method!=='GET'||url.origin!==self.location.origin)return;
 const key=req.mode==='navigate'?'./index.html':url.pathname.endsWith('/data.json')?'./data.json':req;
 event.respondWith((async()=>{
  const cache=await caches.open(VERSION);
  try{const response=await fetch(req,{cache:'no-cache'});if(response.ok){await cache.put(key,response.clone());return response;}return await cache.match(key)||response;}
  catch(error){return await cache.match(key)||Response.error();}
 })());
});
