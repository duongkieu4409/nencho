/* Nút "Hỏi đáp" nổi + khung chat. Trả lời bằng kho câu hỏi soạn sẵn (faq-data.js), chạy hoàn toàn trên máy, không gửi dữ liệu đi đâu. */
(function(){
'use strict';
const T = window.QA_TOPICS || {}, DATA = window.QA || [];
let topic = window.QA_TOPIC || (window.PROC && window.PROC.id) || 'general';
if (!T[topic]) topic = 'general';
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
/* Bỏ dấu tiếng Việt để gõ không dấu vẫn tìm được */
const norm = s => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/[^\p{L}\p{N}\s]/gu, ' ').replace(/\s+/g, ' ').trim();
const words = s => norm(s).split(' ').filter(w => w.length >= 2);

/* Tìm câu gần nhất. Đổi sang AI sau này: thay hàm này bằng lời gọi API, giữ nguyên định dạng trả về. */
/* Câu hỏi nhắc tên thủ tục nào thì ưu tiên thủ tục đó */
const NAMED = {kaigo:['介護','kaigo','dieu duong'], nenmatsu:['年末調整','nenmatsu','quyet toan cuoi nam','dieu chinh thue cuoi nam'], kakutei:['確定申告','kakutei','tu khai thue'], zairyu:['更新','変更','gia han','doi tu cach'], kazoku:['家族滞在','visa gia dinh','don vo','don chong','vo sang','chong sang','con sang'], shinzoku:['親族訪問','tham than','sang choi','du lich','招へい'], mago:['cham chau','ong ba','特定活動'], shozoku:['chuyen viec','chuyen co so','nghi viec','所属機関'], fukugyo:['lam them','副業','資格外','arubaito','baito']};
function QA_ANSWER(text, tp){
  const n = ' ' + norm(text) + ' ', ws = new Set(words(text));
  for (const [k, list] of Object.entries(NAMED)) if (list.some(x => { const xn = norm(x); return n.includes(/^[a-z0-9 ]+$/.test(xn) ? ' ' + xn + ' ' : xn); })){ tp = k; break; }
  let best = null, bs = 0;
  for (const e of DATA){
    let s = 0;
    for (const k of e.kw){ const kn = norm(k); if (kn && n.includes(/^[a-z0-9 ]+$/.test(kn) ? ' ' + kn + ' ' : kn)) s += 2 + Math.min(kn.length, 12) / 6; }
    for (const w of words(e.q)) if (w.length >= 3 && ws.has(w)) s += .6;
    if (s > 0 && e.topics.includes(tp)) s += 2;
    if (s > bs){ bs = s; best = e; }
  }
  return bs >= 2.2 ? best : null;
}
window.QA_ANSWER = QA_ANSWER;

function answerHtml(e){
  if (!e) return `<b>Mình chưa có câu trả lời chắc chắn cho câu này.</b><ul>
    <li>Lưu trú, visa: gọi 外国人在留総合インフォメーションセンター <b>0570-013904</b> (có tiếng Việt).</li>
    <li>Thuế (年末調整, 確定申告): hỏi 税務署 nơi bạn ở.</li>
    <li>Thử hỏi lại bằng từ khóa khác, ví dụ “phí gia hạn”, “bao lâu”, “giấy tờ”.</li></ul>`;
  const tp = T[e.topics[0]] || T.general;
  const here = location.pathname.split('/').pop() || './';
  const go = e.go && e.go !== here ? `<a class="qa-go" href="${e.go}">Xem phần hướng dẫn →</a>` : (e.go ? `<button type="button" class="qa-go" data-qa-guide>Xem phần hướng dẫn trên trang này →</button>` : '');
  return `<b>${esc(e.lead)}</b><ul>${e.items.map(([t, k]) => `<li>${esc(t)} <span class="qa-tag ${k === 'ok' ? 'ok' : 'cx'}">${k === 'ok' ? 'Đã kiểm tra' : 'Cần xác nhận'}</span></li>`).join('')}</ul>
    <div class="qa-src">Nguồn: ${e.src.map(s => `<a href="${s.u}" target="_blank" rel="noopener">${esc(s.t)}</a>`).join(' · ')} · cập nhật ${esc(window.QA_DATE || '')}</div>${go}`;
}

const fab = document.createElement('div');
fab.className = 'qa-fab no-print';
document.body.appendChild(fab);
function drawFab(){ fab.innerHTML = `<span class="qa-bub">Hỏi về ${esc(topic === 'general' ? 'thủ tục' : (T[topic] || T.general).name)}?</span><button type="button" class="qa-btn" aria-label="Mở hỏi đáp"><i>?</i><span>Hỏi đáp</span></button>`; }
drawFab();
/* Bong bóng gợi ý: chỉ hiện ~4 giây, lần đầu mỗi phiên, để không che nội dung */
(() => { let seen = false; try { seen = !!sessionStorage.getItem('qaBub'); sessionStorage.setItem('qaBub', '1'); } catch(e){}
  if (seen) fab.classList.add('nb'); else setTimeout(() => fab.classList.add('nb'), 4000); })();

let panel = null;
function suggestions(){
  const list = DATA.filter(e => e.topics.includes(topic)).slice(0, 4);
  return `Bạn đang xem <b>${esc((T[topic] || T.general).name)}</b>. Mọi người hay hỏi:<div class="qa-sug">${list.map(e => `<button type="button" data-qa-q="${esc(e.q)}">${esc(e.q)}</button>`).join('')}</div><div class="small" style="margin-top:6px">Hoặc gõ câu hỏi bất kỳ ở dưới ↓</div>`;
}
function add(html, who){ const log = panel.querySelector('.qa-log'); const m = document.createElement('div'); m.className = 'qa-m ' + who; m.innerHTML = html; log.appendChild(m); log.scrollTop = log.scrollHeight; }
function ask(text){
  text = String(text || '').trim(); if (!text) return;
  add(esc(text), 'me');
  add(answerHtml(QA_ANSWER(text, topic)), 'bot');
}
function open(){
  if (panel){ panel.hidden = false; fab.hidden = true; panel.querySelector('input').focus(); return; }
  panel = document.createElement('section');
  panel.className = 'qa-panel no-print'; panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-label', 'Hỏi đáp');
  panel.innerHTML = `<div class="qa-h"><span class="qa-av">Hỏi</span><div><b>Trợ lý thủ tục</b><small>● Trả lời theo nguồn chính thức</small></div><button type="button" class="qa-x" aria-label="Đóng">✕</button></div>
    <div class="qa-topic"><span>Đang xem: ${esc((T[topic] || T.general).name)}</span><label><span class="sr-only" style="position:absolute;left:-9999px">Đổi chủ đề</span><select aria-label="Đổi chủ đề">${Object.entries(T).map(([k, v]) => `<option value="${k}" ${k === topic ? 'selected' : ''}>${k === topic ? 'Đổi chủ đề' : esc(v.name)}</option>`).join('')}</select></label></div>
    <div class="qa-log" aria-live="polite"></div>
    <form class="qa-in"><input type="text" placeholder="Gõ câu hỏi…" aria-label="Câu hỏi" autocomplete="off"><button type="submit" aria-label="Gửi">↑</button></form>`;
  document.body.appendChild(panel);
  add(suggestions(), 'bot');
  panel.querySelector('.qa-x').onclick = () => { panel.hidden = true; fab.hidden = false; };
  panel.querySelector('form').onsubmit = e => { e.preventDefault(); const i = panel.querySelector('input'); ask(i.value); i.value = ''; };
  panel.querySelector('select').onchange = e => {
    topic = e.target.value; panel.querySelector('.qa-topic span').textContent = 'Đang xem: ' + (T[topic] || T.general).name;
    [...e.target.options].forEach(o => { o.textContent = o.value === topic ? 'Đổi chủ đề' : T[o.value].name; });
    add(suggestions(), 'bot'); drawFab();
  };
  panel.addEventListener('click', e => {
    const q = e.target.closest('[data-qa-q]'); if (q) return ask(q.dataset.qaQ);
    if (e.target.closest('[data-qa-guide]')){ const t = document.querySelector('[data-tab="guide"]'); if (t) t.click(); else scrollTo({top:0}); if (innerWidth < 600){ panel.hidden = true; fab.hidden = false; } }
  });
  fab.hidden = true;
  panel.querySelector('input').focus();
}
fab.addEventListener('click', e => { if (e.target.closest('.qa-btn, .qa-bub')) open(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && panel && !panel.hidden){ panel.hidden = true; fab.hidden = false; } });
/* Nổi lên trên thanh Quay lại/Tiếp theo khi thanh đó hiện */
const nav = document.getElementById('nav');
const sync = () => document.body.classList.toggle('has-nav', !!(nav && !nav.hidden));
if (nav){ new MutationObserver(sync).observe(nav, {attributes:true, attributeFilter:['hidden']}); sync(); }
if (/[?&]chat\b/.test(location.search)) open();
})();
