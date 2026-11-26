/* Đánh dấu tab chính đang mở + lọc theo tab phụ. */
(function(){
'use strict';
const nav = document.querySelector('.mt'); if (!nav) return;
const here = document.body.dataset.g, page = document.body.dataset.p;
let g = here;
if (!g && page){
  /* Trang thủ tục: tô nhóm chính; chỉ giữ nhóm vừa xem nếu đi từ trang nhóm đó sang */
  const inG = (document.body.dataset.in || '').split(' ').filter(Boolean);
  g = inG[0];
  let last = ''; try { last = sessionStorage.getItem('nhom') || ''; } catch(e){}
  const link = last && nav.querySelector(`a[data-g="${last}"]`);
  let ref = null; try { ref = document.referrer ? new URL(document.referrer) : null; } catch(e){}
  if (link && inG.includes(last) && ref && ref.origin === location.origin && ref.pathname === new URL(link.href).pathname) g = last;
}
if (here){ try { sessionStorage.setItem('nhom', here); } catch(e){} }
nav.querySelectorAll('a').forEach(a => { if (a.dataset.g === (g || 'home')){ a.classList.add('on'); a.setAttribute('aria-current', 'page'); a.scrollIntoView({block:'nearest', inline:'center'}); } });
const sub = document.querySelector('.sub'); if (!sub) return;
sub.addEventListener('click', e => {
  const b = e.target.closest('button'); if (!b) return;
  sub.querySelectorAll('button').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
  const k = b.dataset.sub;
  document.querySelectorAll('.pgrid .pcard').forEach(c => { c.hidden = k !== 'all' && !c.dataset.sub.split(' ').includes(k); });
});
})();
