/* ---------- App (PWA): cài lên màn hình chính, chạy không cần mạng ---------- */
(function(){
  const btn = document.getElementById('installBtn'), pop = document.getElementById('installPop');
  const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone;
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  let deferred = null;
  if (location.protocol === 'https:' || location.hostname === 'localhost'){
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
    if (isIOS && !standalone) btn.hidden = false;
  }
  addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferred = e; if (!standalone) btn.hidden = false; });
  addEventListener('appinstalled', () => { btn.hidden = true; deferred = null; });
  btn.addEventListener('click', async e => {
    e.stopPropagation();
    if (deferred){ deferred.prompt(); try { await deferred.userChoice; } catch(_){} deferred = null; btn.hidden = true; return; }
    pop.hidden = !pop.hidden;
  });
  document.addEventListener('click', e => { if (!pop.hidden && !e.target.closest('#installPop,#installBtn')) pop.hidden = true; });
})();
