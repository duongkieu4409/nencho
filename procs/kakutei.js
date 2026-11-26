/* 確定申告 令和8年分 (năm 2026) — người làm công ăn lương. Số dòng theo 申告書 第一表 (bản 案 công bố 1/7/2026). */
(function(){
const NTA = 'https://www.nta.go.jp/';
const MAN = 10000;
const num = v => PU.num(v), c3 = v => PU.comma(v);
/* 給与所得控除後の金額 (令和8・9年分) — đã đối chiếu bảng 国税庁 */
function kyuyo(x){
  x = Math.floor(x || 0);
  if (x < 741000) return 0; if (x < 2191000) return x - 740000;
  if (x < 6600000){ let lo = x < 2193000 ? 2191000 : x < 2196000 ? 2193000 : x < 2200000 ? 2196000 : 2200000 + Math.floor((x - 2200000) / 4000) * 4000;
    return Math.round(Math.min(lo - 740000, lo < 3600000 ? lo * 7 / 10 - 80000 : lo * 8 / 10 - 440000)); }
  if (x < 8500000) return Math.floor(x * 9 / 10) - 1100000;
  return x - 1950000;
}
function kiso(s){ return s <= 489*MAN ? 104*MAN : s <= 655*MAN ? 67*MAN : s <= 2350*MAN ? 62*MAN : s <= 2400*MAN ? 48*MAN : s <= 2450*MAN ? 32*MAN : s <= 2500*MAN ? 16*MAN : 0; }
function zei(k){ /* 所得税の速算表 */
  const T = [[1949000,.05,0],[3299000,.10,97500],[6949000,.20,427500],[8999000,.23,636000],[17999000,.33,1536000],[39999000,.40,2796000],[Infinity,.45,4796000]];
  for (const [u, r, d] of T) if (k <= u) return Math.max(0, Math.floor(k * r - d));
}
function calc(a){
  const inc = num(a.inc);
  const kyu = a.kyuAfter !== undefined && String(a.kyuAfter).trim() !== '' ? num(a.kyuAfter) : kyuyo(inc);
  const other = a.sideOther === 'yes' ? num(a.otherShotoku) : 0;
  const total = kyu + other;                                   /* ⑫ */
  const sha = num(a.shaho), life = num(a.life), eq = num(a.eq), haigu = num(a.haigu);
  const fuyo = num(a.n38) * 38*MAN + num(a.n63) * 63*MAN + num(a.n48) * 48*MAN + num(a.n58) * 58*MAN;
  const ks = kiso(total);
  const k26 = sha + life + eq + haigu + fuyo + ks;              /* ㉖ (⑬〜㉕) */
  const med = Math.max(0, num(a.med) - num(a.medBack));
  const iryo = a.qIryo === 'yes' ? Math.max(0, Math.min(200*MAN, med - Math.min(10*MAN, Math.floor(total * 0.05)))) : 0; /* ㉘ */
  const kifu = a.qKifu === 'yes' ? Math.max(0, Math.min(num(a.kifu), Math.floor(total * 0.4)) - 2000) : 0;            /* ㉙ */
  const k30 = k26 + iryo + kifu;                                 /* ㉚ */
  const kazei = Math.max(0, Math.floor((total - k30) / 1000) * 1000); /* ㉛ */
  const tax = zei(kazei);                                        /* ㉜ */
  const house = a.qHouse === 'yes' ? num(a.houseDed) : 0;        /* ㉟ */
  const sashi = Math.max(0, tax - house);                        /* ㊷ */
  const fukko = Math.floor(sashi * 0.021);                        /* ㊺ */
  const t46 = sashi + fukko;                                      /* ㊻ */
  const gensen = num(a.gensen);                                   /* ㊾ */
  const diff = t46 - gensen;
  const pay = diff > 0 ? Math.floor(diff / 100) * 100 : 0;        /* ㊿ (100円未満切捨て) */
  const refund = diff < 0 ? -diff : 0;                            /* 還付される税金 */
  return {inc, kyu, other, total, sha, life, eq, haigu, fuyo, ks, k26, iryo, kifu, k30, kazei, tax, house, sashi, fukko, t46, gensen, diff, pay, refund};
}
/* toạ độ (pt) đo bằng lưới trên bản 案: dòng trái x 42–292, cột 税金の計算 x 316–572 */
const R = (y0, y1) => [42, y0, 250, y1 - y0];
const T = (y0, y1) => [316, y0, 256, y1 - y0];
const money = (id, label, vi, q, cy, extra = {}) => Object.assign({form:'d1', id, type:'money', jpLabel:label, viLabel:extra.viLabel || '', vi, q, area:cy, ph:'0', out:a => a[id] ? c3(num(a[id])) : ''}, extra);
const calcF = (id, label, viLabel, vi, area, fn, extra = {}) => Object.assign({form:'d1', id, noInput:true, jpLabel:label, viLabel, vi, area, out:(a, c) => fn(c, a)}, extra);
const fields = [
  {form:'d1', id:'office', jpLabel:'提出日・〇〇税務署長', viLabel:'Ngày nộp và tên 税務署', vi:'Ghi tên 税務署 quản lý nơi bạn ở (ngày 1/1/2027) và ngày nộp. Tra tên 税務署 trên trang 国税庁 theo địa chỉ.', q:'Tên 税務署 (ví dụ 東)', ph:'東', jp:true, area:[158,72,276,14], out:a => (a.office ? a.office + '　税務署長' : '')},
  {form:'d1', id:'addr', jpLabel:'住所', viLabel:'Địa chỉ', vi:'Địa chỉ hiện tại ở Nhật (kèm mã bưu điện).', q:'Mã bưu điện + địa chỉ', ph:'〒536-0025 大阪府大阪市城東区森之宮1-2-3 101号', jp:true, area:[74,103,250,19]},
  {form:'d1', id:'kojin', noInput:true, optional:true, jpLabel:'個人番号', viLabel:'Số My Number', vi:'Chép 12 số trên thẻ My Number (app không lưu số này).', area:[284,87,150,15], out:() => ''},
  {form:'d1', id:'birth', type:'date', jpLabel:'生年月日', viLabel:'Ngày sinh', vi:'Ghi theo lịch Nhật: mã niên hiệu (昭和=3, 平成=4, 令和=5) rồi năm, tháng, ngày.', q:'Ngày sinh', area:[435,79,135,23], out:a => { const w = PU.wareki(a.birth); const m = w.match(/^(昭和|平成|令和)/); return w ? `${({昭和:3,平成:4,令和:5})[m ? m[1] : ''] || ''}　${w}` : ''; }},
  {form:'d1', id:'name', jpLabel:'フリガナ・氏名', viLabel:'Họ tên', vi:'Dòng フリガナ viết katakana; dòng 氏名 viết họ tên như trên 在留カード.', q:'Họ tên (katakana)', ph:'キエウ　ズオン', kata:true, jp:true, area:[370,103,200,41], out:a => a.name ? a.name + '\n' + a.name : ''},
  {form:'d1', id:'job', jpLabel:'職業', viLabel:'Nghề nghiệp', vi:'Ví dụ 「会社員」.', q:'Nghề nghiệp', ph:'会社員', jp:true, area:[370,146,68,15]},
  {form:'d1', id:'tel', jpLabel:'電話番号', viLabel:'Số điện thoại', vi:'Số điện thoại liên lạc ban ngày.', q:'Số điện thoại', ph:'090-1234-5678', area:[457,163,113,17]},
  money('inc', '収入金額等 給与 ㋔', 'Ô ㋔: tổng 「支払金額」 trên tất cả 源泉徴収票 năm 2026 (cộng các công ty, kể cả nơi làm thêm).', 'Tổng 支払金額 (có thể gõ =3000000+800000)', [43,246,250,15], {viLabel:'Tổng lương năm 2026'}),
  {form:'d1', id:'kyuAfter', type:'money', jpLabel:'所得金額等 給与 ⑥', viLabel:'Thu nhập từ lương (sau khấu trừ)', vi:'Ô ⑥: nếu chỉ có 1 tờ 源泉徴収票 thì chép số 「給与所得控除後の金額」. Nhiều nơi làm: để trống, app tự tính từ tổng lương theo bảng 国税庁.', q:'給与所得控除後の金額 (để trống = app tự tính)', ph:'Để trống = tự tính', area:R(436,451), out:(a, c) => c3(c.kyu)},
  calcF('k12', '合計 ⑫', 'Tổng thu nhập', 'Ô ⑫ = tổng các ô ①〜⑪ (thường chỉ có ⑥, cộng thu nhập khác nếu có).', R(532,547), c => c3(c.total)),
  money('shaho', '社会保険料控除 ⑬', 'Ô ⑬: bảo hiểm xã hội — tổng 「社会保険料等の金額」 trên các 源泉徴収票, cộng 国民年金/国保 tự đóng.', 'Tổng bảo hiểm xã hội', R(548,563), {viLabel:'Bảo hiểm xã hội'}),
  money('life', '生命保険料控除 ⑮', 'Ô ⑮: số 「生命保険料の控除額」 trên 源泉徴収票. Nếu chưa khai ở công ty thì tính theo giấy chứng nhận bảo hiểm (dùng app 年末調整 để tính).', 'Khấu trừ bảo hiểm nhân thọ', R(579,594), {viLabel:'Bảo hiểm nhân thọ', optional:true}),
  money('eq', '地震保険料控除 ⑯', 'Ô ⑯: số 「地震保険料の控除額」 trên 源泉徴収票.', 'Khấu trừ bảo hiểm động đất', R(595,610), {viLabel:'Bảo hiểm động đất', optional:true}),
  money('haigu', '配偶者（特別）控除 ㉑〜㉒', 'Ô ㉑㉒: số 「(源泉・特別)控除対象配偶者 / 配偶者(特別)控除の額」 trên 源泉徴収票. Chưa khai ở công ty thì tính theo thu nhập vợ/chồng (xem app 年末調整).', 'Khấu trừ vợ/chồng', R(642,657), {viLabel:'Vợ/chồng', optional:true, show:a => a.married === 'yes'}),
  {form:'d1', id:'fuyo', noInput:true, jpLabel:'扶養控除 ㉓', viLabel:'Khấu trừ người phụ thuộc', vi:'Ô ㉓ = 38万円 × người phụ thuộc thường + 63万円 × người 19–22 tuổi + 48万円 × người từ 70 tuổi + 58万円 × bố mẹ từ 70 tuổi sống cùng. Nhập số người ở phần “Xem hướng dẫn”.', area:R(658,673), out:(a, c) => c.fuyo ? c3(c.fuyo) : '', optional:true,
    warn:a => a.qVn === 'yes' ? 'Người phụ thuộc ở Việt Nam: phải nộp/xuất trình 親族関係書類 và 送金関係書類 (người 30–69 tuổi: chỉ được khi là du học sinh, người khuyết tật, hoặc nhận ≥38万円/năm).' : ''},
  calcF('k25', '基礎控除 ㉕', 'Khấu trừ cơ bản', 'Ô ㉕: theo tổng thu nhập ⑫ (năm 2026: ≤489万円 → 104万円; ≤655万円 → 67万円; ≤2.350万円 → 62万円).', R(689,705), c => c3(c.ks)),
  calcF('k26', '⑬から㉕までの計 ㉖', 'Cộng ⑬〜㉕', 'Cộng các ô ⑬ đến ㉕.', R(705,721), c => c3(c.k26)),
  calcF('k28', '医療費控除 ㉘', 'Khấu trừ chi phí y tế', 'Ô ㉘ = (tiền khám chữa bệnh − tiền bảo hiểm bù) − 10万円 (hoặc 5% tổng thu nhập nếu thu nhập < 200万円). Tối đa 200万円. Phải nộp kèm 「医療費控除の明細書」.', R(737,752), c => c.iryo ? c3(c.iryo) : '', {show:a => a.qIryo === 'yes'}),
  calcF('k29', '寄附金控除 ㉙', 'Khấu trừ tiền quyên góp (ふるさと納税)', 'Ô ㉙ = tổng tiền quyên góp (tối đa 40% thu nhập) − 2.000円.', R(753,768), c => c.kifu ? c3(c.kifu) : '', {show:a => a.qKifu === 'yes'}),
  calcF('k30', '合計 ㉚', 'Tổng các khoản khấu trừ', 'Ô ㉚ = ㉖ + ㉗ + ㉘ + ㉙.', R(769,784), c => c3(c.k30)),
  calcF('k31', '課税される所得金額 ㉛', 'Thu nhập chịu thuế', 'Ô ㉛ = ⑫ − ㉚, bỏ phần dưới 1.000円. Giấy đã in sẵn 「000」 ở cuối ô, nên chỉ viết phần phía trước.', T(183,198.5), c => c3(Math.floor(c.kazei / 1000)), {fillArea:[471, 183, 74, 15.5], note:(a, c) => `Số đầy đủ: ${PU.yen(c.kazei)}.`}),
  calcF('k32', '上の㉛に対する税額 ㉜', 'Thuế thu nhập', 'Ô ㉜: tính theo bảng thuế suất lũy tiến (5%〜45%).', T(199,215), c => c3(c.tax)),
  money('houseDed', '住宅借入金等特別控除 ㉟', 'Ô ㉟: số tiền khấu trừ vay mua nhà tính ở tờ 「住宅借入金等特別控除額の計算明細書」 (năm đầu tiên vào ở).', 'Số tiền khấu trừ vay nhà (từ 計算明細書)', null, {area:T(247,262), show:a => a.qHouse === 'yes', viLabel:'Khấu trừ vay mua nhà', badgeWarn:true}),
  calcF('k42', '差引所得税額 ㊷', 'Thuế sau khấu trừ', 'Ô ㊷ = ㉜ − các khoản trừ thuế (㉟ vay nhà…).', T(294,310), c => c3(c.sashi)),
  calcF('k45', '復興特別所得税額 ㊺', 'Thuế tái thiết', 'Ô ㊺ = ㊷ × 2.1% (bỏ phần lẻ dưới 1円).', T(341,357), c => c3(c.fukko)),
  calcF('k46', '所得税及び復興特別所得税の額 ㊻', 'Tổng thuế', 'Ô ㊻ = ㊷ + ㊺.', T(357,373), c => c3(c.t46)),
  money('gensen', '源泉徴収税額 ㊾', 'Ô ㊾: tổng 「源泉徴収税額」 trên tất cả 源泉徴収票 (thuế công ty đã trừ vào lương).', 'Tổng 源泉徴収税額', null, {area:T(389,404), viLabel:'Thuế đã bị khấu trừ'}),
  calcF('k50', '申告納税額 ㊿', 'Thuế phải nộp thêm / được hoàn', 'Ô ㊿ = ㊻ − ㊾. Âm thì ghi dấu △ phía trước.', T(405,420), c => c.diff < 0 ? '△' + c3(-c.diff) : c3(c.pay)),
  calcF('k52', '納める税金 / 還付される税金', 'Số tiền nộp thêm hoặc được hoàn', 'Phải nộp → ghi ở dòng 「納める税金」 (bỏ phần dưới 100円). Được hoàn → ghi ở dòng 「還付される税金」.', [316, 436, 256, 32],
    c => c.pay ? c3(c.pay) + '\n ' : c.refund ? ' \n' + c3(c.refund) : '0', {fillArea:[471, 436, 101, 32]}),
  {form:'d1', id:'bank', type:'textarea', rows:2, jpLabel:'還付される税金の受取場所', viLabel:'Tài khoản nhận tiền hoàn', vi:'Tên ngân hàng, chi nhánh, loại tài khoản (普通), số tài khoản — đứng tên chính bạn.', q:'Ngân hàng / chi nhánh / số tài khoản', ph:'〇〇銀行　〇〇支店　普通　1234567', jp:true, area:[334,675,238,64], show:(a, c) => c.refund > 0},
];
/* chữ điền: số tiền vào ô giá trị (trái x 192–292, phải x 471–572) */
fields.forEach(f => { if (f.fillArea || !f.area) return; if (f.area[0] === 42) f.fillArea = [192, f.area[1], 100, f.area[3]]; else if (f.area[0] === 316) f.fillArea = [471, f.area[1], 101, f.area[3]]; });
window.PROC = {
  id:'kakutei', short:'確定申告', jpShort:'確定申告 令和8年分', fillDesc:'Điền 申告書 第一表 từng ô, app tính sẵn số tiền rồi in ra.', kicker:'Thuế', title:'Tự khai thuế 確定申告 (năm 2026)', jp:'令和8年分 所得税及び復興特別所得税の確定申告書（第一表）',
  intro:'Cho người làm công: làm thêm, nghỉ việc giữa năm, chi phí y tế cao, quyên góp ふるさと納税, năm đầu vay mua nhà, người phụ thuộc ở Việt Nam chưa khai… App tính sẵn các dòng trên 第一表.',
  formName:'申告書 第一表', defaults:{qSide:'no', qQuit:'no', qIryo:'no', qKifu:'no', qHouse:'no', qVn:'no', married:'no', sideOther:'no'},
  forms:{d1:{title:'令和8年分 所得税及び復興特別所得税の確定申告書 第一表', short:'申告書 第一表', src:'forms/kakutei-1.jpg', w:595.2, h:842, note:'Bản dự thảo (案) 国税庁 công bố 1/7/2026 — bản chính thức dùng từ 1/2027, có thể thay đổi'}},
  questions:[
    {id:'qQuit', type:'choice', q:'Năm 2026 bạn nghỉ việc và cuối năm không làm 年末調整 ở đâu?', opts:[['no','Không'],['yes','Có']], help:'Ví dụ nghỉ việc giữa năm rồi không đi làm lại, hoặc về nước. Khi đó thuế đã trừ có thể bị trừ thừa → khai để được hoàn.'},
    {id:'qSide', type:'choice', q:'Bạn có lương ở nơi làm thêm (không làm 年末調整 ở đó)?', opts:[['no','Không'],['yes','Có']], help:'Lương phụ (給与) trên 20万円/năm thì thường phải khai. Cộng tất cả 源泉徴収票.'},
    {id:'sideOther', type:'choice', q:'Có thu nhập KHÔNG phải lương (kinh doanh, freelance…)?', opts:[['no','Không'],['yes','Có']], help:'App này chỉ tính trường hợp thu nhập chủ yếu là lương. Thu nhập kinh doanh cần 収支内訳書 / 青色申告決算書 — nên dùng 確定申告書等作成コーナー.'},
    {id:'otherShotoku', type:'money', q:'Tổng 所得 ngoài lương (thu − chi phí), yên', show:a => a.sideOther === 'yes'},
    {id:'qIryo', type:'choice', q:'Chi phí khám chữa bệnh năm 2026 của cả gia đình trên 10万円?', opts:[['no','Không'],['yes','Có']], help:'医療費控除: tính cho chi phí bạn trả cho bản thân và người sống cùng (gia đình). Trừ phần bảo hiểm/bồi thường đã nhận.'},
    {id:'med', type:'money', q:'Tổng chi phí y tế đã trả (yên)', show:a => a.qIryo === 'yes'},
    {id:'medBack', type:'money', q:'Tiền được bù (bảo hiểm, 高額療養費…) (yên)', show:a => a.qIryo === 'yes'},
    {id:'qKifu', type:'choice', q:'Bạn có làm ふるさと納税 / quyên góp mà không dùng ワンストップ特例?', opts:[['no','Không'],['yes','Có']], help:'Nếu đã dùng ワンストップ特例 nhưng vẫn phải khai 確定申告 (vì lý do khác), thì phải khai cả tiền quyên góp ở đây.'},
    {id:'kifu', type:'money', q:'Tổng tiền quyên góp (yên)', show:a => a.qKifu === 'yes'},
    {id:'qHouse', type:'choice', q:'Năm 2026 là năm đầu tiên bạn vào ở nhà mua bằng tiền vay?', opts:[['no','Không'],['yes','Có']], help:'Năm đầu tiên được khấu trừ vay mua nhà phải tự khai 確定申告. Từ năm sau mới khai qua công ty (年末調整).'},
    {id:'qVn', type:'choice', q:'Có người phụ thuộc (bố mẹ, con…) ở Việt Nam chưa khai ở công ty?', opts:[['no','Không'],['yes','Có']]},
    {id:'married', type:'choice', q:'Bạn có vợ/chồng thu nhập thấp được khấu trừ?', opts:[['no','Không'],['yes','Có']]},
    {id:'n38', type:'num', q:'Số người phụ thuộc thường (16–18 tuổi, 23–69 tuổi)', ph:'0'},
    {id:'n63', type:'num', q:'Số người phụ thuộc 19–22 tuổi', ph:'0'},
    {id:'n48', type:'num', q:'Số người phụ thuộc từ 70 tuổi (không sống cùng)', ph:'0'},
    {id:'n58', type:'num', q:'Số bố mẹ/ông bà từ 70 tuổi sống cùng nhà', ph:'0'},
  ],
  calc,
  guide(a, c){
    const facts = [
      {icon:'clock', k:'Khi nào nộp', v:'Thời hạn thông thường: <b>16/2 – 15/3/2027</b>. Chỉ xin hoàn thuế (還付申告) thì nộp được từ 1/1/2027 (trong 5 năm).', note:'Cần xác nhận lịch chính thức trên trang 国税庁 khi đến mùa khai thuế.'},
      {icon:'map', k:'Nộp ở đâu', v:'税務署 quản lý nơi bạn ở, hoặc nộp online qua e-Tax / 「確定申告書等作成コーナー」 (cần thẻ My Number + điện thoại đọc được thẻ).'},
      {icon:'yen', k:'Phí', v:'Không mất phí. Nếu phải nộp thêm thuế: hạn nộp tiền 15/3/2027.'},
    ];
    if (c.inc) facts.push({icon:'info', k:'Kết quả ước tính', v: c.refund ? `Được hoàn khoảng <b>${PU.yen(c.refund)}</b>` : c.pay ? `Phải nộp thêm khoảng <b>${PU.yen(c.pay)}</b>` : 'Không phải nộp thêm, không được hoàn.', note:'Ước tính theo số bạn nhập; số cuối cùng theo tờ khai bạn nộp.'});
    const steps = [
      {t:'Gom giấy tờ', d:'源泉徴収票 của tất cả nơi trả lương năm 2026, và giấy tờ cho từng khoản khấu trừ (bên dưới).'},
      {t:'Điền 第一表 (và 第二表)', d:'Bấm “Bắt đầu điền” để được hướng dẫn 第一表. 第二表 ghi chi tiết: nơi trả lương, bảo hiểm, người phụ thuộc… (chép từ 源泉徴収票).'},
      {t:'Nộp', d:'Mang đến 税務署, gửi bưu điện, hoặc nộp e-Tax. Giữ bản sao.'},
      {t:'Nhận tiền hoàn / nộp thêm', d:'Tiền hoàn chuyển vào tài khoản đứng tên bạn. Phải nộp thêm thì nộp trước 15/3/2027.'},
    ];
    const items = [
      {jp:'源泉徴収票', t:'Phiếu khấu trừ thuế năm 2026 của TẤT CẢ nơi trả lương', where:'Công ty phát (nghỉ việc: công ty phải gửi trong 1 tháng sau khi nghỉ)'},
      {jp:'マイナンバーカード（又は通知カード＋本人確認書類）', t:'Thẻ My Number (hoặc giấy thông báo số + 在留カード)', d:'Để ghi số và xác nhận danh tính.'},
      {jp:'還付金の振込口座', t:'Thông tin tài khoản ngân hàng đứng tên bạn (nếu được hoàn)'},
    ];
    if (a.qIryo === 'yes') items.push({jp:'医療費控除の明細書', t:'Bảng kê chi phí y tế (theo mẫu 国税庁)', d:'Có thể dùng 「医療費のお知らせ」 của bảo hiểm y tế. Hóa đơn giữ 5 năm (không cần nộp).', where:'Mẫu trên trang 国税庁'});
    if (a.qKifu === 'yes') items.push({jp:'寄附金受領証明書', t:'Giấy xác nhận đã quyên góp (ふるさと納税)', where:'Địa phương nhận quyên góp gửi về'});
    if (a.qHouse === 'yes') items.push({jp:'（特定増改築等）住宅借入金等特別控除額の計算明細書', t:'Bảng tính khấu trừ vay mua nhà', where:'Mẫu trên trang 国税庁'},
      {jp:'住宅取得資金に係る借入金の年末残高等証明書', t:'Giấy xác nhận số dư nợ cuối năm', where:'Ngân hàng cho vay'},
      {jp:'登記事項証明書・売買契約書（請負契約書）の写し 等', t:'Giấy đăng ký nhà đất, bản sao hợp đồng mua bán…', d:'Danh sách đầy đủ ghi ở mặt sau 計算明細書 — tùy loại nhà.', warn:'Cần xác nhận theo loại nhà (nhà mới, nhà cũ, nhà tiết kiệm năng lượng…).'});
    if (a.qVn === 'yes') items.push({jp:'親族関係書類・送金関係書類', t:'Giấy tờ chứng minh quan hệ gia đình (+ bản dịch tiếng Nhật) và biên lai chuyển tiền năm 2026', d:'Người 30–69 tuổi ở nước ngoài: chỉ được khấu trừ khi là du học sinh, người khuyết tật, hoặc nhận từ 38万円/năm (cần 38万円送金書類).'});
    if (a.qQuit === 'yes' || a.qSide === 'yes') items.push({jp:'国民年金・国民健康保険の控除証明書／領収書', t:'Giấy chứng nhận đã đóng 国民年金/国保 (nếu tự đóng sau khi nghỉ việc)'});
    const warns = ['Mẫu 第一表 trong app là bản dự thảo (案) 国税庁 công bố 1/7/2026; bản chính thức dùng từ 1/2027 có thể thay đổi vị trí ô.'];
    if (a.sideOther === 'yes') warns.push('Có thu nhập kinh doanh/freelance: cần thêm 収支内訳書 hoặc 青色申告決算書 và cách tính khác. Nên dùng 「確定申告書等作成コーナー」 hoặc hỏi 税務署.');
    if (a.qHouse === 'yes') warns.push('Số tiền khấu trừ vay nhà (ô ㉟) phải tính trên 「住宅借入金等特別控除額の計算明細書」. App không tự tính số này.');
    const why = [a.qQuit === 'yes' && 'nghỉ việc giữa năm', a.qSide === 'yes' && 'có lương làm thêm', a.qIryo === 'yes' && 'chi phí y tế cao', a.qKifu === 'yes' && 'quyên góp ふるさと納税', a.qHouse === 'yes' && 'năm đầu vay mua nhà', a.qVn === 'yes' && 'người phụ thuộc ở Việt Nam'].filter(Boolean);
    const head = {title: c.inc ? (c.refund ? `Khai thuế để được hoàn khoảng ${PU.yen(c.refund)}` : c.pay ? `Khai thuế: phải nộp thêm khoảng ${PU.yen(c.pay)}` : 'Tự khai thuế năm 2026') : 'Tự khai thuế năm 2026 (確定申告)',
      summary: why.length ? 'Theo câu trả lời: ' + why.join(', ') + '.' : 'Trả lời các câu bên dưới để app biết bạn cần khai những gì.'};
    const quad = [
      {k:'Nơi nộp', v:'税務署 nơi bạn ở, hoặc online (e-Tax / 作成コーナー)'},
      {k:'Người nộp', v:'Bạn'},
      {k:'Thời hạn', v:'16/2 – 15/3/2027', note:'Chỉ xin hoàn thuế: nộp được từ 1/1/2027. Cần xác nhận lịch chính thức.'},
      {k:'Lệ phí', v:'Không mất phí'},
    ];
    return {head, quad, steps, docs:[{t:'Giấy tờ cần chuẩn bị', items}], warns};
  },
  summary(a, c){
    if (!c.inc) return '';
    return `<section class="card"><h2>Kết quả tính</h2><div class="kv">
      <div><span>⑫ Tổng thu nhập</span><b>${PU.yen(c.total)}</b></div><div><span>㉚ Tổng khấu trừ</span><b>${PU.yen(c.k30)}</b></div>
      <div><span>㉛ Thu nhập chịu thuế</span><b>${PU.yen(c.kazei)}</b></div><div><span>㊻ Tổng thuế</span><b>${PU.yen(c.t46)}</b></div>
      <div><span>㊾ Thuế đã bị trừ</span><b>${PU.yen(c.gensen)}</b></div>
      <div class="big"><span>${c.refund ? 'Được hoàn' : 'Phải nộp thêm'}</span><b>${PU.yen(c.refund || c.pay)}</b></div></div></section>`;
  },
  fields,
  sources:[
    {t:'令和8年分の確定申告書（案） — 国税庁', u:NTA + 'taxes/shiraberu/shinkoku/pdf/0026006-063.pdf', d:'Công bố 1/7/2026'},
    {t:'確定申告書等作成コーナー', u:'https://www.keisan.nta.go.jp/'},
    {t:'令和8年分 年末調整のしかた (bảng thuế, khấu trừ năm 2026)', u:NTA + 'publication/pamph/gensen/nencho2026/01.htm'},
  ]
};
window.KAKUTEI_TEST = {kyuyo, kiso, zei, calc};
})();
