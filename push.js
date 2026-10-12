/* NUBiP Defenses: FCM registration, no automatic sending yet. */
(() => {
  const config = {
    apiKey: 'apiKey: 'AIzaSyAaZnClBaIXQDj6gxdS5KYlFH7ZKTiHutc',
    authDomain: 'nubip-dissertation-defenses.firebaseapp.com',
    projectId: 'nubip-dissertation-defenses',
    storageBucket: 'nubip-dissertation-defenses.firebasestorage.app',
    messagingSenderId: '204128815245',
    appId: '1:204128815245:web:590ed6d46f1a006a13bac4'
  };
  const vapidKey = 'BOOcMQyIwT-zjPan4z7Pla4d6mLY1Etmc5gnbPuvB-bk8MehxlAmJ2J3QbrtFfdgAYS6M5a5DDEK_iKFkCU542s';
  const panel = document.createElement('section');
  panel.className = 'panel';
  panel.style.cssText = 'max-width:1140px;margin:12px auto 28px;padding:16px 18px';
  panel.innerHTML = '<h2 style="margin:0 0 8px;font-size:18px">🔔 Сповіщення про захисти</h2>' +
    '<p style="margin:0 0 12px;line-height:1.5">Підключення телефона до сповіщень. Автоматичні нагадування стануть доступні після налаштування серверного надсилання.</p>' +
    '<button type="button" id="enable-push">Увімкнути сповіщення</button>' +
    '<p id="push-status" role="status" aria-live="polite" style="margin:10px 0 0;font-size:14px"></p>';
  const main = document.querySelector('main');
  if (!main) return;
  main.before(panel);
  const btn = panel.querySelector('#enable-push');
  const status = panel.querySelector('#push-status');
  const say = message => { status.textContent = message; };
  if (!('serviceWorker' in navigator) || !('Notification' in window) || !('PushManager' in window)) {
    btn.disabled = true;
    say('Цей браузер не підтримує необхідні вебсповіщення.');
    return;
  }
  if (Notification.permission === 'denied') say('Сповіщення заблоковані в налаштуваннях браузера.');

  const loadScript = src => new Promise((resolve, reject) => {
    const existing = [...document.scripts].find(s => s.src === src);
    if (existing && existing.dataset.loaded === 'yes') return resolve();
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => { script.dataset.loaded = 'yes'; resolve(); };
    script.onerror = () => reject(new Error('Не вдалося завантажити бібліотеку Firebase. Перевірте інтернет.'));
    document.head.appendChild(script);
  });
  btn.addEventListener('click', async () => {
    btn.disabled = true;
    try {
      say('Підключаємо Firebase…');
      await loadScript('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
      await loadScript('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');
      if (!window.firebase || !firebase.messaging || !(await firebase.messaging.isSupported())) {
        throw new Error('Firebase Messaging недоступний у цьому браузері.');
      }
      if (!firebase.apps.length) firebase.initializeApp(config);
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        say('Дозвіл не надано. Його можна змінити в налаштуваннях браузера.');
        return;
      }
      const registration = await navigator.serviceWorker.register('./service-worker.js');
      await navigator.serviceWorker.ready;
      const token = await firebase.messaging().getToken({vapidKey, serviceWorkerRegistration: registration});
      if (!token) throw new Error('Firebase не видав токен пристрою.');
      localStorage.setItem('nubip_fcm_token', token);
      say('✓ Дозвіл отримано, телефон зареєстровано у Firebase. Автоматичне надсилання нагадувань ще не підключене.');
    } catch (err) {
      say('Не вдалося підключити сповіщення: ' + (err.message || String(err)));
    } finally { btn.disabled = false; }
  });
})();
