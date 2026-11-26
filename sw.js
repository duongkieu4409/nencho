/* Service worker: lưu app vào máy để mở được khi không có mạng. Đổi VERSION mỗi lần cập nhật app. */
const VERSION = 'nencho-v3';
const CORE = ['./', './index.html', './nenmatsu.html', './kakutei.html', './zairyu.html', './kazoku.html', './shinzoku.html', './assets/app.css', './assets/proc.js', './assets/pwa.js', './procs/kakutei.js', './procs/zairyu.js', './procs/kazoku.js', './procs/shinzoku.js', './forms/kakutei-1.jpg', './forms/koshin-1.jpg', './forms/henko-1.jpg', './forms/zairyu-2.jpg', './forms/kazoku-1.jpg', './forms/kazoku-2.jpg', './forms/kazoku-3.jpg', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png', './icons/favicon-32.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // Trang chính: lấy bản mới nếu có mạng, không có mạng thì dùng bản đã lưu
  if (req.mode === 'navigate'){
    e.respondWith(fetch(req).then(r => { const c = r.clone(); caches.open(VERSION).then(x => x.put(req, c)); return r; })
      .catch(() => caches.match(req, {ignoreSearch:true}).then(h => h || caches.match('./index.html'))));
    return;
  }
  // File của app: có mạng thì lấy bản mới (rồi lưu lại), mất mạng thì dùng bản đã lưu
  if (url.origin === location.origin){
    e.respondWith(fetch(req).then(r => { if (r.ok){ const c = r.clone(); caches.open(VERSION).then(x => x.put(req, c)); } return r; })
      .catch(() => caches.match(req, {ignoreSearch:true})));
    return;
  }
  // Font Google: dùng bản đã lưu, nếu chưa có thì tải
  if (/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)){
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => { const c = r.clone(); caches.open(VERSION).then(x => x.put(req, c)); return r; })));
  }
});
