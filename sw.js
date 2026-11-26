/* Service worker: lưu app vào máy để mở được khi không có mạng. Đổi VERSION mỗi lần cập nhật app. */
const VERSION = 'nencho-v13';
const CORE = ['./', './index.html', './nenmatsu.html', './kakutei.html', './zairyu.html', './kazoku.html', './shinzoku.html', './mago.html', './visa.html', './kaigo.html', './thue.html', './giadinh.html', './doisong.html', './fukugyo.html', './shozoku.html', './procs/fukugyo.js', './procs/shozoku.js', './assets/tabs.js', './procs/mago.js', './assets/faq.js', './assets/faq-data.js', './forms/mago-1.jpg', './forms/mago-k.jpg', './assets/app.css', './assets/proc.js', './assets/pwa.js', './procs/kakutei.js', './procs/zairyu.js', './procs/kazoku.js', './procs/shinzoku.js', './forms/kakutei-1.jpg', './forms/koshin-1.jpg', './forms/henko-1.jpg', './forms/zairyu-2.jpg', './forms/kazoku-1.jpg', './forms/kazoku-2.jpg', './forms/kazoku-3.jpg', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png', './icons/favicon-32.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(CORE.map(u => new Request(u, {cache:'reload'})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
/* Có mạng: luôn hỏi lại server (bỏ qua bộ nhớ đệm HTTP của trình duyệt), lưu bản mới; mất mạng mới dùng bản đã lưu. */
const fresh = req => fetch(req, {cache:'no-cache'}).then(r => { if (r.ok){ const c = r.clone(); caches.open(VERSION).then(x => x.put(req, c)); } return r; });
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (req.mode === 'navigate'){
    e.respondWith(fresh(req).catch(() => caches.match(req, {ignoreSearch:true}).then(h => h || caches.match('./index.html'))));
    return;
  }
  if (url.origin === location.origin){
    e.respondWith(fresh(req).catch(() => caches.match(req, {ignoreSearch:true})));
    return;
  }
  // Font Google: dùng bản đã lưu, nếu chưa có thì tải
  if (/fonts\.(googleapis|gstatic)\.com$/.test(url.hostname)){
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => { const c = r.clone(); caches.open(VERSION).then(x => x.put(req, c)); return r; })));
  }
});
