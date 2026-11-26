/* Gia hạn / đổi tư cách lưu trú — 「技術・人文知識・国際業務」 (mẫu 出入国在留管理庁) */
(function(){
const ISA = 'https://www.moj.go.jp/isa/';
const FEE = 'Theo thời hạn được cấp (nộp tại quầy, bằng 収入印紙): ≤3 tháng 10.000円 · 3–6 tháng 18.000円 · 6 tháng–dưới 1 năm 25.000円 · 1 năm 33.000円 · trên 1 năm–dưới 3 năm 48.000円 · 3–dưới 5 năm 64.000円 · từ 5 năm 75.000円.';
const FEE_NOTE = 'Mức phí mới áp dụng cho hồ sơ nhận từ 1/10/2026 (hồ sơ nhận đến 30/9/2026 vẫn là 6.000円). Nộp online có mức phí và cách nộp riêng — xem trang 出入国在留管理庁.';
const yesNo = [['有','Có','有'],['無','Không','無']];
const isK = a => a.kind !== 'henko', isH = a => a.kind === 'henko';
const k1 = (area) => area, F = 'k1', H = 'h1', Z = 'z2';
const fields = [];
const add = (o) => fields.push(o);
/* Trang 1 (khác nhau giữa 更新 và 変更) */
const P1 = [
  {id:'nat', jpLabel:'1 国籍・地域', viLabel:'Quốc tịch', vi:'Ghi quốc tịch bằng tiếng Nhật.', q:'Quốc tịch', ph:'ベトナム', jp:true, k:[45,177,225,22], h:[56,173,220,22], out:a => a.nat || 'ベトナム'},
  {id:'birth', type:'date', jpLabel:'2 生年月日', viLabel:'Ngày sinh', vi:'Ghi theo dương lịch: năm 年, tháng 月, ngày 日.', q:'Ngày sinh', k:[273,177,280,22], h:[278,173,275,22]},
  {id:'name', jpLabel:'3 氏名', viLabel:'Họ tên', vi:'Ghi đúng như trang thông tin của hộ chiếu, bằng chữ Latin in hoa: Family name (họ) trước, Given name (tên đệm + tên) sau.', q:'Họ tên như trên hộ chiếu (chữ in hoa)', ph:'KIEU VAN A', k:[45,203,505,30], h:[56,197,497,32]},
  {id:'sex', type:'choice', opts:[['男','Nam','○ 男'],['女','Nữ','○ 女']], jpLabel:'4 性別', viLabel:'Giới tính', vi:'Khoanh tròn 男 (nam) hoặc 女 (nữ).', q:'Giới tính', k:[45,236,235,20], h:[56,229,115,20]},
  {id:'bplace', jpLabel:'5 出生地', viLabel:'Nơi sinh', vi:'Tỉnh/thành phố nơi sinh, ví dụ 「ベトナム ハノイ」 hoặc chữ Latin như hộ chiếu.', q:'Nơi sinh', ph:'ベトナム ハノイ', h:[174,229,218,20], onlyH:true},
  {id:'married', type:'choice', opts:yesNo, jpLabel:'配偶者の有無', viLabel:'Có vợ/chồng không', vi:'Khoanh 有 nếu đã kết hôn, 無 nếu chưa.', q:'Đã kết hôn?', k:[286,236,265,20], h:[394,229,160,20]},
  {id:'job', jpLabel:'職業', viLabel:'Nghề nghiệp', vi:'Ghi ngắn gọn công việc hiện tại, ví dụ 「会社員」.', q:'Nghề nghiệp', ph:'会社員', jp:true, k:[45,259,158,20], h:[56,252,155,20]},
  {id:'home', jpLabel:'本国における居住地', viLabel:'Nơi ở tại Việt Nam', vi:'Địa chỉ (tỉnh/thành) ở Việt Nam.', q:'Địa chỉ ở Việt Nam (tỉnh/thành)', ph:'ハノイ市', k:[206,259,345,20], h:[213,252,340,20]},
  {id:'addr', jpLabel:'住居地', viLabel:'Địa chỉ ở Nhật', vi:'Địa chỉ hiện tại ở Nhật, giống mặt sau 在留カード.', q:'Địa chỉ ở Nhật', ph:'大阪府大阪市城東区森之宮1-2-3 101号', jp:true, k:[45,282,505,22], h:[56,274,497,24]},
  {id:'tel', jpLabel:'電話番号・携帯電話番号', viLabel:'Số điện thoại', vi:'Số điện thoại liên lạc được. Có thể chỉ ghi số di động.', q:'Số điện thoại di động', ph:'090-1234-5678', k:[45,305,505,22], h:[56,298,497,22], out:a => a.tel ? '携帯　' + a.tel : ''},
  {id:'pass', jpLabel:'旅券 (1)番号', viLabel:'Số hộ chiếu', vi:'Số hộ chiếu (ví dụ C1234567).', q:'Số hộ chiếu', ph:'C1234567', k:[45,329,225,22], h:[56,319,220,22]},
  {id:'passExp', type:'date', jpLabel:'旅券 (2)有効期限', viLabel:'Hạn hộ chiếu', vi:'Ngày hết hạn ghi trên hộ chiếu.', q:'Ngày hết hạn hộ chiếu', k:[273,329,280,22], h:[278,319,275,22],
    warn:a => a.passExp && a.passExp < new Date().toISOString().slice(0, 10) ? 'Hộ chiếu đã hết hạn: hãy làm hộ chiếu mới tại Đại sứ quán/Lãnh sự quán Việt Nam trước khi nộp.' : ''},
  {id:'status', jpLabel:'現に有する在留資格', viLabel:'Tư cách lưu trú hiện tại', vi:'Chép từ 在留カード (dòng 在留資格).', q:'Tư cách lưu trú hiện tại (trên 在留カード)', ph:'技術・人文知識・国際業務', jp:true, k:[45,353,265,22], h:[56,342,258,22]},
  {id:'period', jpLabel:'在留期間', viLabel:'Thời hạn lưu trú hiện tại', vi:'Chép từ 在留カード (dòng 在留期間), ví dụ 「1年」「3年」.', q:'Thời hạn lưu trú hiện tại', ph:'1年', jp:true, k:[313,353,238,22], h:[317,342,236,22]},
  {id:'expiry', type:'date', jpLabel:'在留期間の満了日', viLabel:'Ngày hết hạn lưu trú', vi:'Ngày hết hạn trên 在留カード (trong ngoặc sau 在留期間).', q:'Ngày hết hạn lưu trú', k:[59,377,250,24], h:[69,366,250,24],
    warn:a => { if (!a.expiry || a.kind === 'henko') return ''; const d = (new Date(a.expiry) - new Date()) / 864e5; return d > 92 ? 'Còn hơn 3 tháng mới hết hạn: thường chưa nộp được hồ sơ gia hạn (nộp từ khoảng 3 tháng trước ngày hết hạn).' : d < 0 ? 'Đã quá ngày hết hạn: hãy liên hệ ngay 出入国在留管理局.' : ''; }},
  {id:'card', jpLabel:'在留カード番号', viLabel:'Số thẻ lưu trú', vi:'12 ký tự ở góc trên bên phải 在留カード (2 chữ + 8 số + 2 chữ).', q:'Số 在留カード', ph:'AB12345678CD', k:[45,402,330,22], h:[56,390,330,22]},
  {id:'wantStatus', jpLabel:'13 希望する在留資格', viLabel:'Tư cách lưu trú muốn đổi sang', vi:'Ghi tư cách muốn chuyển sang, ví dụ 「技術・人文知識・国際業務」 hoặc 「介護」.', q:'Tư cách muốn đổi sang', ph:'技術・人文知識・国際業務', jp:true, h:[56,413,497,24], onlyH:true},
  {id:'want', jpLabel:'希望する在留期間', viLabel:'Thời hạn mong muốn', vi:'Ghi thời hạn mong muốn, ví dụ 「3年」 hoặc 「5年」. Cục xét duyệt có thể cấp khác.', q:'Thời hạn mong muốn', ph:'3年', jp:true, k:[45,426,240,22], h:[69,437,220,22],
    note:'Phí tính theo thời hạn thực tế được cấp (từ 1/10/2026). ' + FEE},
  {id:'reason', jpLabel:'更新／変更の理由', viLabel:'Lý do gia hạn / đổi', vi:'Viết ngắn gọn bằng tiếng Nhật. Ví dụ gia hạn: 「引き続き現在の会社で勤務するため」. Ví dụ đổi từ du học: 「〇〇株式会社に就職するため」.', q:'Lý do (tiếng Nhật)', ph:'引き続き現在の会社で勤務するため', jp:true, k:[45,451,505,24], h:[56,461,497,24]},
  {id:'crime', type:'choice', opts:[['無','Không','○ 無'],['有','Có','○ 有（内容を記入）']], jpLabel:'15 犯罪を理由とする処分', viLabel:'Từng bị xử phạt hình sự', vi:'Kể cả ở nước ngoài và vi phạm giao thông (bị phạt tiền/罰金…). Nếu có, ghi nội dung trong ngoặc.', q:'Đã từng bị xử phạt (kể cả vi phạm giao thông)?', k:[45,475,505,46], h:[56,484,497,46],
    warn:a => a.crime === '有' ? 'Có tiền án/xử phạt: phải ghi trung thực. Khai sai có thể bị bất lợi. Nên hỏi 行政書士 hoặc 外国人在留総合インフォメーションセンター (0570-013904).' : ''},
  {id:'family', type:'textarea', rows:4, jpLabel:'16 在日親族及び同居者', viLabel:'Người thân ở Nhật / người sống cùng', vi:'Khoanh 有 nếu có bố mẹ, vợ/chồng, con, anh chị em… ở Nhật hoặc người sống cùng nhà; mỗi người 1 dòng: 続柄・氏名・生年月日・国籍・同居の有無・勤務先/通学先・在留カード番号. Không có thì khoanh 無.', q:'Mỗi người 1 dòng (để trống = không có)', ph:'妻　NGUYEN THI LAN　1995/2/1　ベトナム　有　〇〇株式会社　AB1234567CD',
    k:[45,522,505,214], h:[56,530,497,212], out:a => (a.family || '').trim() ? '有\n' + a.family.trim() : '○ 無', optional:true},
];
/* điểm bắt đầu viết (sau nhãn in sẵn) — x của trang 更新 (k) và 変更 (h) */
const FX = {k:{nat:118,birth:330,name:90,sex:98,married:370,job:86,home:306,addr:90,tel:100,pass:140,passExp:326,status:152,period:356,expiry:144,card:130,want:143,reason:114},
  h:{nat:129,birth:335,name:100,sex:100,bplace:222,married:470,job:97,home:312,addr:101,tel:110,pass:150,passExp:330,status:163,period:360,expiry:152,card:141,wantStatus:165,want:115,reason:125}};
const FILL = {k:{crime:[146,497,350,14], family:[48,590,500,142], name:[90,212,460,14]}, h:{crime:[154,505,340,14], family:[59,598,490,140], name:[100,207,450,14]}};
const fillOf = (o, side, area) => FILL[side][o.id] || (FX[side][o.id] ? [FX[side][o.id], area[1] + 1, area[0] + area[2] - FX[side][o.id], Math.min(area[3], 15)] : null);
P1.forEach(o => {
  if (o.k && !o.onlyH) add(Object.assign({}, o, {form:F, area:o.k, show:isK, fillArea:fillOf(o, 'k', o.k)}));
  if (o.h) add(Object.assign({}, o, {id:o.id, form:H, area:o.h, show:isH, fillArea:fillOf(o, 'h', o.h), jpLabel:o.jpLabel.replace('更新／変更','変更')}));
});
/* Trang 2: 申請人等作成用２ N (dùng chung cho 更新 và 変更) */
[
  {id:'work', fillArea:[102,85,440,14], jpLabel:'17 勤務先 (1)名称', viLabel:'Tên công ty', vi:'Tên công ty (và chi nhánh nếu có) bằng tiếng Nhật, giống hợp đồng lao động.', q:'Tên công ty', ph:'〇〇株式会社 大阪支店', jp:true, area:[54,62,497,42]},
  {id:'workAddr', fillArea:[112,106,440,14], jpLabel:'17 (2)所在地 (3)電話番号', viLabel:'Địa chỉ và điện thoại nơi làm việc', vi:'Địa chỉ và số điện thoại nơi bạn làm việc chính.', q:'Địa chỉ nơi làm việc + điện thoại', ph:'大阪市中央区〇〇1-1　06-1234-5678', jp:true, area:[54,106,497,22]},
  {id:'edu', fillArea:[110,201,440,14], type:'textarea', rows:2, jpLabel:'18 最終学歴', viLabel:'Trình độ học vấn cao nhất', vi:'Đánh dấu ☑ 本邦 (học ở Nhật) hoặc 外国 (nước ngoài), loại trường (大学院・大学・短期大学・専門学校…), tên trường và ngày tốt nghiệp.', q:'Ví dụ: 外国・大学・ハノイ工科大学・2018年7月', ph:'☑外国　☑大学　ハノイ工科大学　2018年7月卒業', area:[54,127,497,95]},
  {id:'major', fillArea:[150,221,400,14], jpLabel:'19 専攻・専門分野', viLabel:'Chuyên ngành', vi:'Đánh dấu ☑ chuyên ngành đã học (ví dụ 工学, 経済学, 語学…). Nếu học 専門学校 thì chọn ở dòng dưới.', q:'Chuyên ngành', ph:'☑工学', area:[54,221,497,175]},
  {id:'it', fillArea:[150,410,400,14], type:'choice', opts:[['無','Không','○ 無'],['有','Có','○ 有']], jpLabel:'20 情報処理技術者資格', viLabel:'Chứng chỉ IT (chỉ người làm IT)', vi:'Người làm 介護: chọn 無. Chỉ người làm công việc xử lý thông tin (IT) mới điền. Có chứng chỉ thì ghi tên chứng chỉ.', q:'Có chứng chỉ IT (thi IT quốc gia…) không?', area:[54,396,497,50], optional:true},
  {id:'career', fillArea:[60,478,490,72], type:'textarea', rows:3, jpLabel:'21 職歴', viLabel:'Quá trình làm việc', vi:'Ghi năm tháng vào làm (入社), nghỉ (退社) và tên công ty, kể cả ở Việt Nam.', q:'Mỗi công ty 1 dòng', ph:'2018年8月 入社 2021年3月 退社　ABC Co., Ltd.\n2021年4月 入社　〇〇株式会社', area:[54,446,497,112], optional:true},
  {id:'sign', fillArea:[300,654,250,14], type:'date', jpLabel:'署名／申請書作成年月日', viLabel:'Chữ ký và ngày làm đơn', vi:'Tự ký tên (chữ ký của bạn) và ghi ngày làm đơn. Phải tự tay ký.', q:'Ngày làm đơn', area:[54,632,497,40], out:a => (a.sign ? a.sign.replace(/-/g, '/') : '') + '　（署名）'},
].forEach(o => add(Object.assign({form:Z}, o)));
add({id:'photo', form:F, area:[468,84,92,112], noInput:true, jpLabel:'写真', viLabel:'Ảnh 4×3 cm', vi:'Dán ảnh dọc 4 cm × ngang 3 cm, chụp trong 6 tháng, nhìn thẳng, không đội mũ, nền trơn. Ghi tên ở mặt sau ảnh.', show:isK, optional:true, out:() => ''});
add({id:'photoH', form:H, area:[470,80,92,112], noInput:true, jpLabel:'写真', viLabel:'Ảnh 4×3 cm', vi:'Dán ảnh dọc 4 cm × ngang 3 cm, chụp trong 6 tháng, nhìn thẳng, không đội mũ, nền trơn. Ghi tên ở mặt sau ảnh.', show:isH, optional:true, out:() => ''});
/* thứ tự: trang 1 trước, ảnh, rồi trang 2 */
const order = f => (f.form === Z ? 2 : 1);
fields.sort((x, y) => order(x) - order(y));


const ISA_KG = 'https://www.moj.go.jp/isa/applications/status/nursingcare.html';
function kaigoGuide(a, H){
  const me = [
    {jp:H ? '在留資格変更許可申請書' : '在留期間更新許可申請書', t:'Đơn xin (trang người nộp + trang cơ sở)', d:'Cùng mẫu với 技人国. Trang 申請人等作成用: bạn viết. Trang 所属機関等作成用: cơ sở (施設) viết.'},
    {jp:'写真', t:'Ảnh 4×3 cm', d:'Chụp trong 6 tháng, chính diện, nền trơn. Dán vào đơn.'},
    {jp:'パスポート・在留カード', t:'Hộ chiếu và thẻ lưu trú', d:'Mang theo để xuất trình (提示).'},
  ];
  const co = [{jp:'所属機関の代表者に関する申告書', t:'Tờ khai về người đại diện cơ sở (mẫu tham khảo)', d:'Bắt buộc với hồ sơ nộp từ 15/4/2026.', where:'Cơ sở làm việc'}];
  if (H){
    me.push({jp:'介護福祉士登録証（写し）', t:'Bản sao thẻ đăng ký 介護福祉士', d: a.from === 'tokutei' ? 'Nếu đang 特定技能1号, sắp hết 5 năm mà chưa nhận thẻ đăng ký: nộp trước bản sao 合格通知書, có thẻ thì nộp bổ sung ngay.' : 'Đỗ kỳ thi quốc gia rồi đăng ký mới có thẻ.'});
    if (a.jisshu === 'yes') me.push({jp:'技能移転に係る申告書', t:'Tờ khai về chuyển giao kỹ năng (mẫu tham khảo)', d:'Chỉ cần nếu đã từng ở Nhật bằng visa 技能実習.'});
    co.unshift({jp:'労働条件通知書（雇用契約書）', t:'Giấy điều kiện lao động / hợp đồng', where:'Cơ sở làm việc'},
      {jp:'招へい機関の概要を明らかにする文書', t:'Tài liệu giới thiệu cơ sở (lịch sử, ban lãnh đạo, tổ chức, hoạt động)', where:'Cơ sở làm việc'});
  } else {
    me.push({jp:'住民税の課税（又は非課税）証明書・納税証明書', t:'Giấy chứng nhận thuế cư trú (1 năm)', d:'Loại ghi tổng thu nhập và tình trạng nộp thuế; có cả hai trên 1 tờ thì 1 tờ là đủ.', where:'区役所・市役所 nơi bạn ở ngày 1/1'});
    if (a.jobChange === 'yes') co.unshift({jp:'労働条件通知書（雇用契約書）', t:'Giấy điều kiện lao động / hợp đồng (lần gia hạn đầu sau khi chuyển việc)', where:'Cơ sở mới'},
      {jp:'招へい機関の概要を明らかにする文書', t:'Tài liệu giới thiệu cơ sở mới', where:'Cơ sở mới'});
  }
  if (a.haken === 'yes') co.push({jp:'派遣先での活動内容を明らかにする資料', t:'Giấy tờ về công việc ở nơi được phái cử (労働条件通知書…)', where:'Công ty phái cử'});
  const head = {title: H ? 'Đổi sang visa 介護' : 'Gia hạn visa 介護',
    summary: H ? `Theo câu trả lời: đổi từ ${({tokutei:'特定技能1号', ryugaku:'留学'})[a.from] || 'diện khác'} sang 「介護」. Điều kiện: có 介護福祉士 và hợp đồng làm 介護 với cơ sở ở Nhật.` : 'Theo câu trả lời: tiếp tục làm 介護, xin thêm thời gian lưu trú (5 năm, 3 năm, 1 năm hoặc 3 tháng).'};
  const quad = [
    {k:'Nơi nộp', v:'地方出入国在留管理官署 nơi bạn ở, hoặc nộp online'},
    {k:'Người nộp', v:'Bạn (hoặc nhân viên cơ sở / 行政書士 được ủy quyền)'},
    {k:'Thời gian xét', v: H ? 'Khoảng 1–2 tháng' : 'Khoảng 2 tuần – 1 tháng', note:'Thời gian xử lý chuẩn của 入管.'},
    {k:'Lệ phí', v:'Tính theo thời hạn được cấp: 1 năm 33.000円 · 3 năm 64.000円 · 5 năm 75.000円', note:'Từ 1/10/2026.'},
  ];
  const notes = [H ? 'Nộp ngay khi định làm 介護. Chưa được phép thì chưa được bắt đầu công việc theo diện mới.' : 'Nộp từ khoảng 3 tháng trước ngày hết hạn. Nộp trước hạn thì được ở tiếp đến khi có kết quả (tối đa 2 tháng sau ngày hết hạn).',
    'Hỏi đáp: 外国人在留総合インフォメーションセンター 0570-013904 (có tiếng Việt).'];
  const steps = [
    {t:'Chuẩn bị giấy tờ', d:'Theo danh sách bên phải. Đưa phần “cơ sở chuẩn bị” cho văn phòng (事務所) nơi bạn làm.'},
    {t:'Điền đơn', d:'Bấm “Bắt đầu điền giấy”: cùng mẫu với 技人国. Ô 情報処理技術者資格 chọn 無. Ô tư cách ghi 「介護」.'},
    {t:'Nộp hồ sơ', d:'Mang hộ chiếu + 在留カード đến 入管, hoặc nộp online.'},
    {t:'Nhận kết quả', d:'Có thông báo thì mang hộ chiếu + 在留カード đến nhận thẻ mới, nộp phí bằng 収入印紙.'},
  ];
  if (H && a.from === 'ryugaku') steps.unshift({t:'Kiểm tra quy định cho du học sinh', d:`入管 có hướng dẫn riêng cho du học sinh đỗ kỳ thi 介護福祉士 / tốt nghiệp trường điều dưỡng: <a href="https://www.moj.go.jp/isa/applications/resources/nyuukokukanri07_00056.html" target="_blank" rel="noopener">xem tại đây</a>.`});
  const docs = [{t:'Giấy tờ bạn tự chuẩn bị', items:me}, {t:'Giấy tờ cơ sở làm việc chuẩn bị', d:'Theo bảng kê chính thức (チェックシート) trên trang 「介護」 của 入管.', items:co}];
  const warns = ['Giấy tờ do cơ quan Nhật cấp phải trong vòng 3 tháng. Giấy tờ tiếng nước ngoài phải kèm bản dịch tiếng Nhật.',
    'Đổi cơ sở làm việc: phải báo 入管 trong 14 ngày (所属機関に関する届出) — xem thủ tục “Chuyển cơ sở làm việc”.'];
  return {head, quad, notes, steps, docs, warns, extraSources:[{t:'在留資格「介護」 (出入国在留管理庁)', u:ISA_KG}]};
}
window.PROC = {
  id:'zairyu', short:'Gia hạn / đổi tư cách', jpShort:'在留期間更新・在留資格変更', fillDesc:'Điền đơn 申請人等作成用１・２ từng ô rồi in ra.', kicker:'Lưu trú', title:'Gia hạn / đổi tư cách lưu trú', jp:'在留期間更新許可申請・在留資格変更許可申請（技術・人文知識・国際業務）',
  intro:'Hỏi vài câu để biết bạn cần giấy gì, nộp ở đâu, phí bao nhiêu; rồi hướng dẫn viết từng ô trên đơn chính thức.',
  formName:'đơn xin', defaults:{kind:'koshin', cat:'3', jobChange:'no', haken:'no', nat:'ベトナム'},
  forms:{
    k1:{title:'在留期間更新許可申請書（申請人等作成用１）', short:'Đơn gia hạn · trang 1', src:'forms/koshin-1.jpg', w:595.3, h:841.9, note:'Mẫu chính thức của 出入国在留管理庁 (様式 第三十号の二)'},
    h1:{title:'在留資格変更許可申請書（申請人等作成用１）', short:'Đơn đổi tư cách · trang 1', src:'forms/henko-1.jpg', w:595.3, h:841.9, note:'Mẫu chính thức của 出入国在留管理庁 (様式 第三十号)'},
    z2:{title:'申請人等作成用２ N（技術・人文知識・国際業務）', short:'Trang 2 (người nộp)', src:'forms/zairyu-2.jpg', w:595.3, h:841.9, note:'Mẫu chính thức của 出入国在留管理庁'}
  },
  questions:[
    {id:'kind', type:'choice', q:'Bạn cần làm thủ tục nào?', help:'Gia hạn (更新): tiếp tục công việc hiện tại, chỉ xin thêm thời gian. Đổi tư cách (変更): chuyển sang tư cách khác, ví dụ từ 留学 (du học) sang 技術・人文知識・国際業務 khi đi làm.', opts:[['koshin','Gia hạn (更新)'],['henko','Đổi tư cách (変更)']]},
    {id:'target', type:'choice', q:'Tư cách sau khi gia hạn/đổi là gì?', help:'App hướng dẫn chi tiết 「技術・人文知識・国際業務」 và 「介護」 — hai tư cách này dùng chung một mẫu đơn của 入管. Tư cách khác dùng mẫu khác.', opts:[['gijinkoku','技術・人文知識・国際業務'],['kaigo','介護 (điều dưỡng, có 介護福祉士)'],['other','Khác (特定技能, 家族滞在…)']]},
    {id:'cat', type:'choice', show:a => a.target !== 'kaigo', q:'Công ty bạn thuộc loại (カテゴリー) nào?', help:'Hỏi phòng nhân sự. Loại 1: công ty niêm yết… Loại 2: công ty nộp thuế khấu trừ lương từ 1.000万円/năm trở lên. Loại 3: công ty khác có nộp 法定調書合計表. Loại 4: không thuộc loại nào (công ty mới…). Phần lớn công ty vừa và nhỏ là loại 3.', opts:[['1','Loại 1'],['2','Loại 2'],['3','Loại 3'],['4','Loại 4']]},
    {id:'jobChange', type:'choice', q:'Bạn đã chuyển việc kể từ lần xét duyệt trước?', help:'Nếu đã đổi công ty sau lần gia hạn/đổi trước, lần này cần nộp thêm giấy tờ về công ty mới (và lẽ ra đã phải báo 契約機関に関する届出 trong 14 ngày).', show:a => a.kind !== 'henko', opts:[['no','Không'],['yes','Có']]},
    {id:'from', type:'choice', q:'Bạn đang ở diện nào trước khi đổi sang 介護?', show:a => a.target === 'kaigo' && a.kind === 'henko', opts:[['tokutei','特定技能1号'],['ryugaku','留学 (du học, trường điều dưỡng)'],['other','Khác']]},
    {id:'jisshu', type:'choice', q:'Bạn từng ở Nhật bằng visa 技能実習 chưa?', show:a => a.target === 'kaigo' && a.kind === 'henko', opts:[['no','Chưa'],['yes','Đã từng']]},
    {id:'haken', type:'choice', q:'Bạn làm việc theo dạng phái cử (派遣) không?', opts:[['no','Không'],['yes','Có']]},
  ],
  calc:a => ({}),
  guide(a){
    const H = a.kind === 'henko', cat = +a.cat || 3, cat34 = cat >= 3;
    if (a.target === 'kaigo') return kaigoGuide(a, H);
    if (a.target === 'other') return {stop:`App hiện chỉ hướng dẫn chi tiết tư cách 「技術・人文知識・国際業務」. Tư cách khác (特定技能, 家族滞在, 日本人の配偶者等…) dùng mẫu đơn và danh sách giấy tờ riêng — xem trang <a href="${ISA}applications/procedures/${H ? '16-2' : '16-3'}.html" target="_blank" rel="noopener">${H ? '在留資格変更許可申請' : '在留期間更新許可申請'}</a> của 出入国在留管理庁 và chọn đúng tư cách.`, facts:[], docs:[]};
    const facts = [
      {icon:'clock', k:'Khi nào nộp', v: H ? 'Trước khi bắt đầu công việc mới (khi có sự việc cần đổi).' : 'Từ khoảng 3 tháng trước ngày hết hạn (nếu thời hạn từ 6 tháng trở lên) đến ngày hết hạn.', note: H ? 'Xét duyệt chuẩn: 1–2 tháng. Chưa được phép thì chưa được làm công việc mới.' : 'Xét duyệt chuẩn: 2 tuần – 1 tháng.'},
      {icon:'map', k:'Nộp ở đâu', v:'地方出入国在留管理官署 quản lý nơi bạn ở (giờ nhận: ngày thường 9:00–12:00, 13:00–16:00), hoặc nộp online.', note:'Hỏi đáp: 外国人在留総合インフォメーションセンター 0570-013904 (có tiếng Việt).'},
      {icon:'yen', k:'Phí (khi được cấp phép)', v:FEE, note:FEE_NOTE},
      {icon:'info', k:'Nếu chưa có kết quả khi hết hạn', v:'Nộp trước ngày hết hạn thì được ở tiếp hợp pháp đến khi có kết quả, tối đa 2 tháng sau ngày hết hạn (特例期間).'},
    ];
    const steps = [
      {t:'Chuẩn bị giấy tờ', d:'Theo danh sách bên dưới. Phần của công ty: nhờ phòng nhân sự viết 所属機関等作成用１・２ và cấp giấy tờ công ty.'},
      {t:'Điền đơn', d:'Bấm “Bắt đầu điền” để được hướng dẫn từng ô trang 申請人等作成用１・２.'},
      {t:'Nộp hồ sơ', d:'Mang hộ chiếu + 在留カード (xuất trình) đến cục xuất nhập cảnh, hoặc nộp online.'},
      {t:'Nhận bưu thiếp/thông báo', d:'Khi được cấp phép, mang thông báo + hộ chiếu + 在留カード đến nhận thẻ mới và nộp phí bằng 収入印紙 (dán vào 手数料納付書).'},
    ];
    const me = [
      {jp:H ? '在留資格変更許可申請書' : '在留期間更新許可申請書', t:'Đơn xin (trang người nộp + trang công ty)', d:'Trang 申請人等作成用１・２: bạn viết. Trang 所属機関等作成用１・２: công ty viết.'},
      {jp:'写真', t:'Ảnh 4×3 cm', d:'Chụp trong 6 tháng, chính diện, không mũ, nền trơn, rõ nét. Ghi tên mặt sau rồi dán vào đơn.'},
      {jp:'パスポート・在留カード', t:'Hộ chiếu và thẻ lưu trú', d:'Mang theo để xuất trình (提示).'},
    ];
    if (!H && cat34) me.push({jp:'住民税の課税（又は非課税）証明書・納税証明書', t:'Giấy chứng nhận thuế cư trú (1 năm)', d:'Loại ghi tổng thu nhập 1 năm và tình trạng nộp thuế. Chỉ cần 1 tờ nếu có cả hai nội dung.', where:'Ủy ban quận/thành phố nơi bạn ở ngày 1/1 (区役所・市役所), hoặc máy コンビニ bằng thẻ My Number'});
    if (H) me.push({jp:'履歴書・卒業証明書 等', t:'Lý lịch + bằng/giấy chứng nhận tốt nghiệp', d:'Lý lịch ghi rõ học vấn, kinh nghiệm liên quan đến công việc; giấy tốt nghiệp đại học… (người tốt nghiệp 専門学校 ở Nhật: giấy chứng nhận danh hiệu 専門士/高度専門士).', where:'Trường bạn đã học', warn: cat34 ? '' : null});
    const co = [{jp:'所属機関のカテゴリーを証明する文書', t:'Giấy chứng minh loại (カテゴリー) của công ty', d: cat <= 2 ? 'Ví dụ bản sao 四季報 hoặc 法定調書合計表 (loại 2).' : 'Thường là bản sao 前年分の給与所得の源泉徴収票等の法定調書合計表 (có dấu tiếp nhận).', where:'Phòng nhân sự / kế toán công ty'}];
    if (cat34 && (H || a.jobChange === 'yes')){
      co.push({jp:'労働条件通知書（雇用契約書）', t:'Giấy điều kiện lao động / hợp đồng', where:'Công ty'},
        {jp:'登記事項証明書', t:'Giấy đăng ký doanh nghiệp', where:'Công ty (cấp tại 法務局)'},
        {jp:'事業内容を明らかにする資料', t:'Tài liệu giới thiệu công ty (lịch sử, ban lãnh đạo, ngành nghề, đối tác)', where:'Công ty'},
        {jp:'直近年度の決算文書の写し', t:'Bản sao báo cáo tài chính năm gần nhất (công ty mới: kế hoạch kinh doanh)', where:'Công ty'});
    }
    if (cat34) co.push({jp:'所属機関の代表者に関する申告書', t:'Tờ khai về người đại diện công ty (mẫu tham khảo)', where:'Công ty'});
    if (cat === 4) co.push({jp:'法定調書合計表を提出できない理由を明らかにする資料', t:'Giấy tờ giải thích vì sao không có 法定調書合計表 (ví dụ 給与支払事務所等の開設届書 + 所得税徴収高計算書 3 tháng gần nhất)', where:'Công ty'});
    if (a.haken === 'yes') co.push({jp:'派遣労働に関する誓約書・派遣契約関係資料', t:'Cam kết về lao động phái cử + hợp đồng phái cử', d:'労働条件通知書, 労働者派遣個別契約書…', where:'Công ty phái cử và nơi được phái cử'});
    const docs = [{t:'Giấy tờ bạn tự chuẩn bị', items:me}, {t:'Giấy tờ công ty chuẩn bị', d:'Danh sách theo bảng kê chính thức (提出書類一覧). Công ty có thể đã quen làm — hãy đưa danh sách này cho phòng nhân sự.', items:co}];
    const warns = ['Giấy tờ do cơ quan Nhật cấp phải trong vòng 3 tháng tính đến ngày nộp. Giấy tờ tiếng nước ngoài phải kèm bản dịch tiếng Nhật.'];
    if (cat34 && !H && a.jobChange === 'yes') warns.push('Lần gia hạn đầu tiên sau khi chuyển sang công ty loại 3/4: phải nộp thêm giấy tờ về công ty mới (đã liệt kê ở trên).');
    const head = {title: H ? 'Đổi tư cách lưu trú sang 技術・人文知識・国際業務' : 'Gia hạn visa 技術・人文知識・国際業務',
      summary: `Theo câu trả lời: công ty loại ${cat}${!H && a.jobChange === 'yes' ? ', đã chuyển việc sau lần xét trước' : ''}${a.haken === 'yes' ? ', làm theo dạng phái cử' : ''}.`};
    const quad = [
      {k:'Nơi nộp', v:'地方出入国在留管理官署 nơi bạn ở, hoặc nộp online', note:'Ngày thường 9:00–12:00, 13:00–16:00'},
      {k:'Người nộp', v:'Bạn (hoặc nhân viên công ty / 行政書士 được ủy quyền)'},
      {k:'Thời gian xét', v: H ? 'Khoảng 1–2 tháng' : 'Khoảng 2 tuần – 1 tháng', note: H ? 'Nộp trước khi bắt đầu công việc mới.' : 'Nộp từ 3 tháng trước ngày hết hạn.'},
      {k:'Lệ phí', v:'Tính theo thời hạn được cấp: 1 năm 33.000円 · 3 năm 64.000円 · 5 năm 75.000円', note:'Từ 1/10/2026. Đầy đủ: ' + FEE},
    ];
    const notes = [facts[0].v + ' ' + (facts[0].note || ''), 'Nếu chưa có kết quả khi hết hạn: ' + facts[3].v, 'Hỏi đáp: 外国人在留総合インフォメーションセンター 0570-013904.'];
    return {head, quad, notes, steps, docs, warns};
  },
  fields,
  sources:[
    {t:'在留期間更新許可申請 (出入国在留管理庁)', u:ISA + 'applications/procedures/16-3.html'},
    {t:'在留資格変更許可申請 (出入国在留管理庁)', u:ISA + 'applications/procedures/16-2.html'},
    {t:'「技術・人文知識・国際業務」 — mẫu đơn và bảng kê giấy tờ', u:ISA + 'applications/status/gijinkoku.html'},
    {t:'在留資格「介護」 — mẫu đơn và bảng kê giấy tờ', u:ISA_KG},
  ]
};
})();
