/* Offline-capable PWA: network-first for data; cache-first for static shell. */
const VERSION='nubip-defenses-pwa-v6-20261012';
const SHELL=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(VERSION).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('nubip-defenses-pwa-')&&k!==VERSION).map(k=>caches.delete(k)))),self.clients.claim()]));});
self.addEventListener('fetch',event=>{
 const req=event.request; if(req.method!=='GET')return;
 const url=new URL(req.url); if(url.origin!==self.location.origin)return;
 if(url.pathname.endsWith('/data.json')){event.respondWith(fetch(req).then(res=>{if(res.ok){const copy=res.clone();caches.open(VERSION).then(cache=>cache.put('./data.json',copy));}return res;}).catch(async()=>{const cached=await caches.match('./data.json');return cached||new Response('{"items":[],"complete":false}',{headers:{'Content-Type':'application/json'}});}));return;}
 if(req.mode==='navigate'){event.respondWith(fetch(req).then(res=>{if(res.ok){const copy=res.clone();caches.open(VERSION).then(cache=>cache.put('./index.html',copy));}return res;}).catch(()=>caches.match('./index.html')));return;}
 event.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(res=>{if(res.ok){const copy=res.clone();caches.open(VERSION).then(cache=>cache.put(req,copy));}return res;})));
});
