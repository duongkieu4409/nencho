/* Bộ máy dùng chung cho các thủ tục: Xem hướng dẫn · Nhập dữ liệu · Tổng quan & in.
   Mỗi trang thủ tục khai báo window.PROC rồi nạp file này. Dữ liệu chỉ lưu trong trình duyệt (localStorage). */
(function(){
'use strict';
const P = window.PROC;
const KEY = 'proc-' + P.id + '-v1';
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const IC = {
  check:'<path d="M20 6 9 17l-5-5"/>', left:'<path d="m15 18-6-6 6-6"/>', right:'<path d="m9 18 6-6-6-6"/>',
  plus:'<path d="M5 12h14M12 5v14"/>', minus:'<path d="M5 12h14"/>', expand:'<path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>',
  info:'<circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>', alert:'<path d="m21.7 18-8-14a2 2 0 0 0-3.4 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3Z"/><path d="M12 9v4M12 17h.01"/>',
  pen:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>', list:'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  print:'<path d="M6 9V2h12v7M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v8H6z"/>',
  rotate:'<path d="M21 12a9 9 0 1 1-3-6.7L21 8"/><path d="M21 3v5h-5"/>', home:'<path d="m3 10 9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>',
  file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>', map:'<path d="M12 22s7-6.3 7-12a7 7 0 1 0-14 0c0 5.7 7 12 7 12Z"/><circle cx="12" cy="10" r="2.5"/>',
  clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>', yen:'<path d="m6 3 6 8 6-8M12 11v10M7 13h10M7 17h10"/>', link:'<path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/>'
};
const icon = (n, s = 20) => `<svg class="icon" width="${s}" height="${s}" viewBox="0 0 24 24" aria-hidden="true">${IC[n] || ''}</svg>`;

/* ---------- Số tiền, ngày ---------- */
function num(v){
  const s = String(v ?? '').replace(/[０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0)).replace(/[＋]/g, '+').replace(/[×xX＊]/g, '*').replace(/[=＝,，、\s円]/g, '');
  if (!s || !/^[\d+\-*.]+$/.test(s)) return 0;
  let t = 0; for (const m of s.matchAll(/([+-]?)([\d.*]+)/g)){ const p = m[2].split('*').reduce((a, x) => a * (Number(x) || 0), 1); t += m[1] === '-' ? -p : p; }
  return Math.round(t);
}
const yen = n => Math.round(Number(n) || 0).toLocaleString('ja-JP') + '円';
const comma = n => Math.round(Number(n) || 0).toLocaleString('ja-JP');
function ymd(d){ if (!d) return ''; const [y, m, dd] = d.split('-').map(Number); return y ? `${y}年${m}月${dd}日` : ''; }
function wareki(d){
  if (!d) return ''; const [y, m, dd] = d.split('-').map(Number); if (!y) return '';
  const v = y * 10000 + m * 100 + dd; let e, ey;
  if (v >= 20190501){ e = '令和'; ey = y - 2018; } else if (v >= 19890108){ e = '平成'; ey = y - 1988; } else if (v >= 19261225){ e = '昭和'; ey = y - 1925; } else { e = '大正'; ey = y - 1911; }
  return `${e}${ey === 1 ? '元' : ey}年${m}月${dd}日`;
}
const toKata = s => String(s).replace(/[ぁ-ゖ]/g, c => String.fromCharCode(c.charCodeAt(0) + 0x60));
window.PU = {num, yen, comma, ymd, wareki, esc, icon};

/* ---------- Trạng thái ---------- */
let st;
try { st = JSON.parse(localStorage.getItem(KEY)) || {}; } catch(e){ st = {}; }
st = Object.assign({tab:'guide', idx:0, a:{}}, st); st.a = Object.assign({}, P.defaults || {}, st.a);
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(st)); } catch(e){} };
/* Link từ trang nhóm có thể chọn sẵn câu trả lời: trang.html?set=kind:koshin,target:kaigo */
(() => { const q = new URLSearchParams(location.search).get('set'); if (!q) return;
  q.split(',').forEach(kv => { const [k, v] = kv.split(':'); if (k && v) st.a[k] = v; }); st.tab = 'guide'; save();
  history.replaceState(null, '', location.pathname); })();
const A = () => st.a;
const calc = () => (P.calc ? P.calc(st.a) : {});
const shown = q => !q.show || q.show(st.a, calc());
const fields = () => P.fields.filter(shown);

/* ---------- Ô nhập ---------- */
function control(q, cls = ''){
  const v = st.a[q.id] ?? '';
  const id = 'in-' + q.id;
  if (q.type === 'choice'){
    return `<div class="chips" role="radiogroup" aria-label="${esc(q.q || q.vi || '')}">${q.opts.map(([val, lab]) => `<button type="button" class="chip" data-set="${q.id}" data-val="${esc(val)}" role="radio" aria-pressed="${v === val}" aria-checked="${v === val}">${esc(lab)}</button>`).join('')}</div>`;
  }
  if (q.type === 'textarea') return `<textarea class="inp ${cls}" id="${id}" data-in="${q.id}" rows="${q.rows || 3}" placeholder="${esc(q.ph || '')}">${esc(v)}</textarea>`;
  if (q.type === 'select') return `<select class="inp ${cls}" id="${id}" data-in="${q.id}">${q.opts.map(([val, lab]) => `<option value="${esc(val)}" ${v === val ? 'selected' : ''}>${esc(lab)}</option>`).join('')}</select>`;
  const t = q.type === 'date' ? 'date' : 'text';
  const im = q.type === 'money' || q.type === 'num' ? 'inputmode="decimal"' : '';
  return `<input class="inp ${cls}" id="${id}" data-in="${q.id}" type="${t}" ${im} value="${esc(v)}" placeholder="${esc(q.ph || '')}" autocomplete="off" ${q.kata ? 'data-kata="1"' : ''}>` + (q.type === 'money' ? `<div class="calc" data-calc="${q.id}">${num(v) && /[+\-*]/.test(String(v).replace(/^=/, '')) ? '→ = ' + yen(num(v)) : ''}</div>` : '');
}
let hid = 0;
function qBlock(q){
  const h = 'h' + (++hid);
  return `<div class="q"><div class="q-head"><div class="q-label">${esc(q.q)}${q.jp ? '<br><span class="jp-req">文 Viết bằng tiếng Nhật</span>' : ''}</div>
    ${q.help ? `<button type="button" class="help-btn" aria-expanded="false" aria-controls="${h}" aria-label="Giải thích">?</button>` : ''}</div>
    ${q.help ? `<div class="help" id="${h}"><div><p>${esc(q.help)}</p></div></div>` : ''}${control(q)}</div>`;
}

/* ---------- Khung trang ---------- */
function modeBtns(){
  const m = st.tab === 'guide' ? 'guide' : 'fill';
  return `<div class="mode no-print" role="tablist"><button type="button" role="tab" data-tab="guide" class="${m === 'guide' ? 'on' : ''}" aria-selected="${m === 'guide'}"><span class="n">1</span><span><b>Xem hướng dẫn</b><span class="s">Cần chuẩn bị gì, nộp ở đâu, theo thứ tự nào.</span></span></button>
    <button type="button" role="tab" data-tab="fill" class="${m === 'fill' ? 'on' : ''}" aria-selected="${m === 'fill'}" ${fields().length ? '' : 'disabled'}><span class="n">2</span><span><b>Nhập dữ liệu và in</b><span class="s">${esc(P.fillDesc || ('Điền ' + (P.formName || 'tờ khai') + ' từng ô rồi in ra.'))}</span></span></button></div>`;
}
function shell(inner){
  if (st.tab === 'fill') return inner;
  if (st.tab === 'done') return `<div class="mini-hero"><b>${esc(P.title)}</b><span class="jp">${esc(P.jp || '')}</span></div>${modeBtns()}<div style="height:14px"></div>${inner}`;
  return inner;
}
function setNav(on){ $('#nav').hidden = !on; document.body.classList.toggle('has-nav', !!on); }

/* ---------- 1. Xem hướng dẫn ---------- */
function renderGuide(){
  hid = 0;
  const a = st.a, c = calc();
  const qs = (P.questions || []).filter(shown);
  const g = P.guide(a, c) || {};
  const head = g.head || {};
  let h = `<section class="card case-card"><span class="eyebrow">${esc(P.kicker || 'Thủ tục')} · <span class="jp">${esc(P.jpShort || P.jp || '')}</span></span>
    <h1>${esc(head.title || P.title)}</h1><p class="lead">${head.summary || esc(P.intro)}</p>${modeBtns()}`;
  if (g.quad && g.quad.length) h += `<div class="quad">${g.quad.map(q => `<div class="qd"><small>${esc(q.k)}</small><b>${q.v}</b>${q.note ? `<em>${q.note}</em>` : ''}</div>`).join('')}</div>`;
  h += `</section>`;
  let left = '', right = '';
  if (qs.length) left += `<section class="card"><h2>Trường hợp của bạn</h2><p class="small">Trả lời để app chọn đúng giấy tờ và hướng làm.</p>${qs.map(qBlock).join('')}</section>`;
  if (g.stop) left += `<section class="card"><div class="stopbox">${g.stop}</div></section>`;
  if (g.steps && g.steps.length){
    left += `<section class="card"><h2>Các bước</h2><ol class="steps2">${g.steps.map(x => `<li><b>${esc(x.t)}</b>${x.d ? `<span>${x.d}</span>` : ''}</li>`).join('')}</ol>`;
    (g.notes || []).forEach(n => { left += `<div class="warn2">${n}</div>`; });
    (g.warns || []).forEach(w => { left += `<div class="warn2">⚠ ${w}</div>`; });
    left += `</section>`;
  }
  if (P.sources) left += `<section class="card src"><h2>Nguồn chính thức</h2><ul>${P.sources.map(x => `<li>${icon('link', 14)} <a href="${x.u}" target="_blank" rel="noopener">${esc(x.t)}</a>${x.d ? ` <span class="small">${esc(x.d)}</span>` : ''}</li>`).join('')}</ul></section>`;
  (g.docs || []).forEach((grp, gi) => {
    right += `<section class="card"><h2>${esc(grp.t)}</h2>${grp.d ? `<p class="small">${grp.d}</p>` : ''}${grp.items.map((it, ii) => {
      const k = `ck-${gi}-${ii}`, on = !!(st.ck || {})[k];
      return `<div class="doc2${on ? ' done' : ''}"><button type="button" class="ckb" data-ck="${k}" aria-pressed="${on}" aria-label="Đánh dấu đã chuẩn bị">${on ? icon('check', 14) : ''}</button>
        <div>${it.jp && it.jp !== '—' ? `<b class="jp">${esc(it.jp)}</b><br>` : ''}${esc(it.t)}${it.d ? `<small>${it.d}</small>` : ''}${it.where ? `<small>${icon('map', 12)} ${it.where}</small>` : ''}${it.warn ? `<em>⚠ ${it.warn}</em>` : ''}</div></div>`;
    }).join('')}</section>`;
  });
  right += `<section class="card side-act no-print">${fields().length ? `<button type="button" class="btn btn-pri" data-tab="fill">Bắt đầu điền giấy ${icon('right')}</button>` : `<p class="small">${esc(P.emptyFill || '')}</p>`}<button type="button" class="btn btn-sec" id="printList">${icon('print')} In danh sách này</button></section>`;
  if (!g.docs || !g.docs.length) right = right;
  h += `<div class="cols"><div>${left}</div><div>${right}</div></div>`;
  $('#app').innerHTML = shell(h);
  setNav(false);
  document.body.classList.add('wide');
}

/* ---------- Ảnh mẫu + ô tô sáng ---------- */
function formSvg(fk, opt = {}){
  const f = P.forms[fk];
  let s = `<svg viewBox="0 0 ${f.w} ${f.h}" width="${f.w}" height="${f.h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(f.title)}"><image href="${f.src}" width="${f.w}" height="${f.h}"/>`;
  (opt.fills || []).forEach(x => { s += fillSvg(x.r, x.t); });
  if (opt.hl) s += `<rect class="hl" x="${opt.hl[0] - 1.5}" y="${opt.hl[1] - 1.5}" width="${opt.hl[2] + 3}" height="${opt.hl[3] + 3}" rx="3"/>`;
  return s + '</svg>';
}
function fillSvg(r, text){
  const lines = String(text).split('\n').slice(0, 8); if (!lines.some(l => l.trim())) return '';
  const len = Math.max(...lines.map(l => [...l].reduce((s, c) => s + (c.charCodeAt(0) > 255 ? 1 : .58), 0)));
  const fs = Math.max(3, Math.min(11, (r[2] - 6) / Math.max(len, 1), (r[3] - 2) / lines.length / 1.12));
  const top = r[1] + Math.max(1, (r[3] - lines.length * fs * 1.12) / 2) + fs * .9;
  const numeric = lines.every(l => /^[\s△\d,]*$/.test(l));
  return `<g fill="#1F4FD6" font-weight="600" font-family="sans-serif"${numeric ? ' text-anchor="end"' : ''}>` + lines.map((l, i) => `<text x="${numeric ? r[0] + r[2] - 3 : r[0] + 3}" y="${(top + i * fs * 1.12).toFixed(1)}" font-size="${fs.toFixed(2)}">${esc(l.trim())}</text>`).join('') + '</g>';
}
let zoom = null;
function applyZoom(){
  const v = $('#fview'); if (!v) return;
  const svg = v.querySelector('svg'), W = +svg.getAttribute('width'), H = +svg.getAttribute('height');
  const fitZ = v.clientWidth / W, hw = +v.dataset.hw;
  const narrow = innerWidth < 900;
  const autoZ = hw ? Math.max(narrow ? fitZ * 1.6 : fitZ, Math.min(narrow ? 3.2 : 2.2, v.clientWidth / (hw + (narrow ? 40 : 200)))) : fitZ;
  const z = zoom == null ? autoZ : Math.max(fitZ, zoom);
  svg.style.width = W * z + 'px'; svg.style.height = H * z + 'px';
  $('#zFit')?.classList.toggle('on', zoom == null);
  if (v.dataset.hy) v.scrollTo({left: Math.max(0, +v.dataset.hx * z - v.clientWidth / 2), top: Math.max(0, +v.dataset.hy * z - v.clientHeight / 2)});
}
function zoomBy(k){ const v = $('#fview'); if (!v) return; const W = +v.querySelector('svg').getAttribute('width'); const cur = parseFloat(v.querySelector('svg').style.width) / W || 1; zoom = Math.min(5, cur * k); applyZoom(); }
addEventListener('resize', () => { if (st.tab === 'fill') applyZoom(); const lb = $('#lb'); if (lb && lb._draw) lb._draw(); });

/* ---------- 2. Nhập dữ liệu (mỗi màn một ô) ---------- */
function paper(text){
  const rows = String(text ?? '').split('\n').filter(x => x !== '').map(l => {
    const m = l.match(/^(.{1,24}?)[　]+(.+)$/);
    return m ? `<div class="row"><span>${esc(m[1])}</span><b>${esc(m[2])}</b></div>` : `<div class="row only"><b>${esc(l)}</b></div>`;
  }).join('');
  return `<div class="lab2">Phần bạn điền vào giấy</div><div class="write">${rows || '<div class="row only"><b class="muted">（chưa nhập）</b></div>'}</div>`;
}
const outText = (fd, a, c) => fd.out ? fd.out(a, c) : (fd.type === 'date' ? ymd(a[fd.id]) : fd.type === 'money' ? (a[fd.id] !== undefined && a[fd.id] !== '' ? comma(num(a[fd.id])) : '') : (fd.type === 'choice' ? ((fd.opts.find(o => o[0] === a[fd.id]) || [])[2] || (fd.opts.find(o => o[0] === a[fd.id]) || [])[1] || '') : (a[fd.id] || '')));
function renderFill(){
  hid = 0;
  const F = fields();
  if (!F.length){ $('#app').innerHTML = shell(`<section class="card"><p class="lead">${esc(P.emptyFill || 'Thủ tục này chưa có phần nhập dữ liệu.')}</p><button type="button" class="btn btn-sec" data-tab="guide">Xem hướng dẫn</button></section>`); setNav(false); return; }
  if (st.idx >= F.length) st.idx = F.length - 1; if (st.idx < 0) st.idx = 0;
  const fd = F[st.idx], a = st.a, c = calc(), fm = P.forms[fd.form];
  const same = F.filter(x => x.form === fd.form), pos = same.indexOf(fd) + 1;
  const r = fd.area;
  let h = `<div class="gtop no-print"><button type="button" class="iconbtn" data-tab="guide" aria-label="Về phần hướng dẫn">${icon('left')}</button>
    <div class="prog"><div class="prog-row"><span>${esc(P.short || P.title)} · Nhập dữ liệu · ${esc(fm.short)}</span><b>${st.idx + 1} / ${F.length}</b></div><div class="bar"><i style="transform:scaleX(${(st.idx + 1) / F.length})"></i></div></div></div>
    <div class="glayout"><section class="card fpanel no-print" aria-label="Vị trí trên tờ giấy">
      <div class="fview" id="fview" data-hx="${r ? r[0] + r[2] / 2 : ''}" data-hy="${r ? r[1] + r[3] / 2 : ''}" data-hw="${r ? r[2] : ''}">${formSvg(fd.form, {hl: r})}</div>
      <span class="flabel">Ô cần viết ở bước này</span>
      <div class="ftools"><button type="button" id="zOut" aria-label="Thu nhỏ">${icon('minus')}</button><button type="button" id="zFit" class="${zoom == null ? 'on' : ''}">Tự động</button><button type="button" id="zIn" aria-label="Phóng to">${icon('plus')}</button><button type="button" id="zFull" aria-label="Xem toàn màn hình">${icon('expand')}</button></div>
      <p class="fnote">${esc(fm.note || 'Mẫu chính thức')}.</p></section>
    <article class="card step-card"><div class="crumb">${esc(fm.title)}${fd.sec ? ' › ' + esc(fd.sec) : ''}</div>
      <div class="st"><span class="n">${st.idx + 1}</span><span class="tt">${esc(fd.jpLabel)}<small>${esc(fd.viLabel)}</small></span></div>
      <p class="vi">${fd.vi}</p>`;
  if (fd.jp || fd.badgeWarn) h += `<div class="badges">${fd.jp ? '<span class="b-jp">文 Viết bằng tiếng Nhật</span>' : ''}${fd.badgeWarn ? `<span class="b-opt">${icon('alert', 14)} Cần xác nhận</span>` : ''}</div>`;
  h += `<div id="paperBox">${paper(outText(fd, a, c))}</div>`;
  if (!fd.noInput) h += `<div class="field inbox no-print"><div class="lab2">Ô nhập của bạn</div><label class="sub-label" for="in-${fd.id}" style="margin-top:0">${esc(fd.q || 'Nhập thông tin của bạn')}</label>${control(fd)}${fd.hint ? `<p class="hint">${esc(fd.hint)}</p>` : ''}</div>`;
  const warn = typeof fd.warn === 'function' ? fd.warn(a, c) : fd.warn;
  const note = typeof fd.note === 'function' ? fd.note(a, c) : fd.note;
  if (warn) h += `<div class="warnbox">${icon('alert')}<span>${warn}</span></div>`;
  if (note) h += `<p class="note">${icon('info')}<span>${note}</span></p>`;
  h += `</article></div>`;
  $('#app').innerHTML = shell(h);
  $('#navIn').innerHTML = `<button type="button" class="btn btn-sec btn-back" id="prev" ${st.idx === 0 ? 'disabled' : ''} aria-label="Quay lại">${icon('left')}<span class="hide-sm">Quay lại</span></button>
    <button type="button" class="btn btn-pri" id="next">${st.idx === F.length - 1 ? `${icon('check')} Xem tổng quan` : `Tiếp theo ${icon('right')}`}</button>`;
  setNav(true);
  document.body.classList.add('wide');
  requestAnimationFrame(applyZoom); setTimeout(applyZoom, 60);
}
function refreshPaper(){
  if (st.tab !== 'fill') return;
  const F = fields(), fd = F[st.idx]; if (!fd) return;
  const box = $('#paperBox'); if (box) box.innerHTML = paper(outText(fd, st.a, calc()));
}

/* ---------- 3. Tổng quan & in ---------- */
function renderDone(){
  const F = fields(), a = st.a, c = calc();
  if (!F.length) return renderFill();
  const empty = F.filter(fd => !fd.noInput && !fd.optional && !String(outText(fd, a, c) || '').trim()).length;
  let h = `<section class="card"><div class="done-h"><span class="done-ic">${icon('check', 26)}</span><div><div class="eyebrow" style="color:var(--ok)">Tổng quan</div><h2 style="font-size:22px">Kiểm tra lại rồi in ra</h2></div></div>
    <div class="stats"><span class="chipx cx-blue">${F.length} mục</span>${empty ? `<span class="chipx cx-warn">${icon('alert', 14)} ${empty} mục chưa nhập</span>` : '<span class="chipx cx-gray">Đã nhập đủ</span>'}</div>
    <p class="lead">Chữ màu xanh trên ảnh là nội dung bạn cần viết. Có thể in bản này ra để chép, hoặc lưu PDF.</p>
    <div class="actions no-print" style="margin-top:12px"><button type="button" class="btn btn-pri" id="print">${icon('print')} In / Lưu PDF</button></div>
    <p class="small no-print" id="printNote" hidden>Nếu không thấy hộp thoại in, hãy dùng chức năng In của trình duyệt (menu ⋮ hoặc Chia sẻ → In).</p></section>`;
  if (P.summary) h += P.summary(a, c);
  Object.keys(P.forms).forEach(fk => {
    const list = F.filter(fd => fd.form === fk); if (!list.length) return;
    const fills = list.map(fd => ({r: fd.fillArea || fd.area, t: outText(fd, a, c)})).filter(x => x.r && String(x.t || '').trim());
    h += `<section class="card overview"><h2 class="jp">${esc(P.forms[fk].title)}</h2><div class="ov-img" tabindex="0" role="button" aria-label="Phóng to">${formSvg(fk, {fills})}</div></section>`;
  });
  h += `<section class="card sum-group"><h2>Danh sách từng mục</h2>${F.map((fd, i) => `<button type="button" class="sum-item" data-goto="${i}"><span class="n">${i + 1}</span><span><span class="tt">${esc(fd.jpLabel)}</span><span class="vv">${esc(outText(fd, a, c) || '（chưa nhập）')}</span></span><span class="go">Sửa ${icon('right', 16)}</span></button>`).join('')}</section>
    <div class="card actions no-print"><button type="button" class="btn btn-sec" data-tab="guide">Xem lại hướng dẫn</button><button type="button" class="btn btn-ghost" id="reset">Xoá dữ liệu thủ tục này</button></div>`;
  $('#app').innerHTML = shell(h);
  setNav(false);
  document.body.classList.add('wide');
}

/* ---------- Xem toàn màn hình ---------- */
function openLB(fk, hl){
  closeLB();
  const f = P.forms[fk];
  const lb = document.createElement('div'); lb.className = 'lb'; lb.id = 'lb'; lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true');
  lb.innerHTML = `<div class="lb-top"><button type="button" class="lb-x" data-lb="close" aria-label="Đóng">${icon('left')}</button><div class="lb-t"><b>${esc(f.title)}</b><small>Ô viền xanh là chỗ cần viết</small></div></div>
    <div class="lb-wrap"><div class="lb-img"><div class="lb-sc"></div></div><div class="lb-z"><button type="button" data-lb="rot" aria-label="Xoay">${icon('rotate', 18)}</button><button type="button" data-lb="in" aria-label="Phóng to">${icon('plus')}</button><button type="button" data-lb="out" aria-label="Thu nhỏ">${icon('minus')}</button></div></div>
    <div class="lb-how"><div class="lb-act"><button type="button" class="btn btn-pri" data-lb="close">${icon('check')} Xong</button></div></div>`;
  document.body.appendChild(lb); document.body.style.overflow = 'hidden';
  const sc = lb.querySelector('.lb-sc'), area = lb.querySelector('.lb-img');
  let z = 1, rot = f.w > f.h && innerWidth < 700 && innerHeight > innerWidth;
  lb._draw = () => {
    const vw = rot ? f.h : f.w, vh = rot ? f.w : f.h, g = rot ? `<g transform="translate(${f.h},0) rotate(90)">` : '<g>';
    const fit = Math.min((area.clientWidth - 16) / vw, (area.clientHeight - 16) / vh);
    sc.innerHTML = `<svg viewBox="0 0 ${vw} ${vh}" width="${vw * fit * z}" height="${vh * fit * z}">${g}<image href="${f.src}" width="${f.w}" height="${f.h}"/>${hl ? `<rect class="hl" x="${hl[0] - 1.5}" y="${hl[1] - 1.5}" width="${hl[2] + 3}" height="${hl[3] + 3}" rx="3"/>` : ''}</g></svg>`;
    if (hl && z > 1){ const s = fit * z, cx = rot ? (f.h - (hl[1] + hl[3] / 2)) * s : (hl[0] + hl[2] / 2) * s, cy = rot ? (hl[0] + hl[2] / 2) * s : (hl[1] + hl[3] / 2) * s; area.scrollTo({left: cx - area.clientWidth / 2, top: cy - area.clientHeight / 2}); }
  };
  lb._set = k => { if (k === 'rot'){ rot = !rot; z = 1; } if (k === 'in') z = Math.min(5, z * 1.4); if (k === 'out') z = Math.max(1, z / 1.4); lb._draw(); };
  requestAnimationFrame(lb._draw);
}
function closeLB(){ const lb = $('#lb'); if (lb){ lb.remove(); document.body.style.overflow = ''; } }

/* ---------- Điều hướng & sự kiện ---------- */
function render(){ if (st.tab === 'fill') renderFill(); else if (st.tab === 'done') renderDone(); else renderGuide(); }
function go(tab, idx){ st.tab = tab; if (idx != null) st.idx = idx; save(); render(); scrollTo({top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'}); }
function keep(fn){ const y = scrollY; fn(); scrollTo(0, y); }
document.addEventListener('click', e => {
  const o = e.target.closest('.ov-img'); if (o && !e.target.closest('button')) { o.classList.toggle('big'); return; }
  const t = e.target.closest('button'); if (!t) return;
  if (t.classList.contains('help-btn')){ const op = t.getAttribute('aria-expanded') !== 'true'; t.setAttribute('aria-expanded', op); document.getElementById(t.getAttribute('aria-controls')).classList.toggle('open', op); return; }
  if (t.dataset.tab) return go(t.dataset.tab, t.dataset.tab === 'fill' ? (st.tab === 'fill' ? st.idx : 0) : null);
  if (t.dataset.set){ st.a[t.dataset.set] = t.dataset.val; save(); return keep(render); }
  if (t.dataset.ck){ st.ck = st.ck || {}; st.ck[t.dataset.ck] = !st.ck[t.dataset.ck]; save(); return keep(render); }
  if (t.dataset.goto != null) return go('fill', +t.dataset.goto);
  if (t.dataset.lb){ const lb = $('#lb'); if (!lb) return; return t.dataset.lb === 'close' ? closeLB() : lb._set(t.dataset.lb); }
  switch (t.id){
    case 'prev': return go('fill', st.idx - 1);
    case 'next': return st.idx >= fields().length - 1 ? go('done') : go('fill', st.idx + 1);
    case 'zIn': return zoomBy(1.35);
    case 'zOut': return zoomBy(1 / 1.35);
    case 'zFit': zoom = null; return applyZoom();
    case 'zFull': { const fd = fields()[st.idx]; return openLB(fd.form, fd.area); }
    case 'printList': { try { print(); } catch(_){} return; }
    case 'print': { const n = $('#printNote'); try { print(); } catch(_){} setTimeout(() => { if (n) n.hidden = false; }, 800); return; }
    case 'reset': {
      if (t.dataset.armed !== '1'){ t.dataset.armed = '1'; t.textContent = 'Bấm lần nữa để xoá'; setTimeout(() => { if (t.isConnected){ t.dataset.armed = ''; t.textContent = 'Xoá dữ liệu thủ tục này'; } }, 4000); return; }
      st = {tab:'guide', idx:0, a:Object.assign({}, P.defaults || {})}; save(); return go('guide');
    }
  }
});
document.addEventListener('input', e => {
  const el = e.target; if (!el.dataset.in) return;
  st.a[el.dataset.in] = el.value; save();
  const cl = document.querySelector(`[data-calc="${el.dataset.in}"]`);
  if (cl) cl.textContent = /[+\-*]/.test(el.value.replace(/^=/, '')) && num(el.value) ? '→ = ' + yen(num(el.value)) : '';
  refreshPaper();
});
document.addEventListener('change', e => {
  const el = e.target; if (!el.dataset.in) return;
  if (el.dataset.kata){ el.value = toKata(el.value); st.a[el.dataset.in] = el.value; save(); refreshPaper(); }
  if (st.tab === 'guide') keep(render);
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLB(); });
render();
})();
