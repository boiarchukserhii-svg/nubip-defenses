/* Offline-capable PWA and Firebase background messaging. */
const VERSION='nubip-defenses-pwa-v9-20261013';
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
