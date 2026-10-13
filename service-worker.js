/* Offline shell, fresh interface assets, and existing background messaging. */
const VERSION='nubip-defenses-pwa-v11-20261013';
const SHELL=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png',
 './theme.js?v=2','./brand.js','./cleanup.css?v=1'];
self.addEventListener('install',event=>{
 event.waitUntil(caches.open(VERSION).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
 event.waitUntil(caches.keys().then(keys=>Promise.all(
  keys.filter(key=>key.startsWith('nubip-defenses-pwa-')&&key!==VERSION).map(key=>caches.delete(key))
 )).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
 const req=event.request;
 if(req.method!=='GET')return;
 const url=new URL(req.url);
 if(url.origin!==self.location.origin)return;
 const data=url.pathname.endsWith('/data.json');
 const navigation=req.mode==='navigate';
 const fresh=data||navigation||/\.(?:js|css)$/.test(url.pathname);
 const key=data?'./data.json':navigation?'./index.html':req;
 const task=(async()=>{
  const cache=await caches.open(VERSION);
  if(!fresh){
   const cached=await cache.match(key);
   if(cached)return cached;
  }
  try{
   const response=await fetch(req, fresh?{cache:'no-store'}:undefined);
   if(response.ok){
    try{await cache.put(key,response.clone());}catch(error){/* Full cache must not break a valid network response. */}
    return response;
   }
   const cached=await cache.match(key);
   return cached||response;
  }catch(error){
   const cached=await cache.match(key);
   if(cached)return cached;
   if(data)return new Response('{"items":[],"complete":false}',{headers:{'Content-Type':'application/json'}});
   return Response.error();
  }
 })();
 event.respondWith(task);
 event.waitUntil(task.then(()=>undefined,()=>undefined));
});
// Use Firebase compat in the existing PWA worker, not a second worker with the same scope.
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');
firebase.initializeApp({
 apiKey:'AIzaSyAaZnClBaIXQDj6gxdS5KYlFH7ZKTiHutc',
 authDomain:'nubip-dissertation-defenses.firebaseapp.com',
 projectId:'nubip-dissertation-defenses',
 storageBucket:'nubip-dissertation-defenses.firebasestorage.app',
 messagingSenderId:'204128815245',
 appId:'1:204128815245:web:590ed6d46f1a006a13bac4'
});
const messaging=firebase.messaging();
messaging.onBackgroundMessage(payload=>{
 // Notification messages can be displayed by FCM automatically.
 // For data-only messages, show a single notification here.
 if(payload.notification)return;
 const data=payload.data||{};
 const title=data.title||'Захист дисертації — НУБіП України';
 const options={body:data.body||'Нове повідомлення про захист',icon:'./icon-192.png',data:{url:data.url||'./'}};
 self.registration.showNotification(title,options);
});
self.addEventListener('notificationclick',event=>{
 event.notification.close();
 const target=event.notification.data?.url||'./';
 event.waitUntil(clients.openWindow(target));
});

