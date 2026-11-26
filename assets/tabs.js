/* Đánh dấu tab chính đang mở + lọc theo tab phụ. */
(function(){
'use strict';
const nav = document.querySelector('.mt'); if (!nav) return;
const here = document.body.dataset.g, page = document.body.dataset.p;
let g = here;
if (!g && page){ /* Trang thủ tục: giữ nhóm vừa đi qua nếu thủ tục có trong nhóm đó */
  let last = ''; try { last = sessionStorage.getItem('nhom') || ''; } catch(e){}
  const inG = (document.body.dataset.in || '').split(' ');
  g = inG.includes(last) ? last : inG[0];
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
