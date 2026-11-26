/* Ông bà / bố mẹ ở Việt Nam sang Nhật chăm cháu lâu dài.
   Nguồn: 出入国在留管理庁 「特定活動（高度専門職外国人又はその配偶者の親）」 và 「短期滞在」. */
(function(){
const ISA = 'https://www.moj.go.jp/isa/';
const PAGE = ISA + 'applications/status/designatedactivities02_00002.html';
/* Đường đi: 't' = 特定活動 (bố mẹ của người 高度専門職), 's' = chỉ ngắn hạn 短期滞在 */
const path = a => (a.status === 'hsp' && (a.child === 'u7' || a.child === 'preg') && a.income === 'yes' && a.together === 'yes' && a.otherSide !== 'yes') ? 't' : 's';
const isT = a => path(a) === 't';
const yn = [['無','Không','○ 無'],['有','Có','○ 有']];
const P1 = 'p1', K = 'k';
/* Trang 1 mẫu U giống bố cục trang 1 mẫu 家族滞在 (lệch khoảng +8pt theo chiều ngang) */
const S = (x, y, w, h) => [x + 8, y, w, h];
const fields = [
  {id:'nat', jpLabel:'1 国籍・地域', viLabel:'Quốc tịch của ông/bà', vi:'Quốc tịch của người sang (ông/bà).', q:'Quốc tịch', ph:'ベトナム', jp:true, area:S(45,153,270,18), fillArea:S(100,155,200,14), out:a => a.nat || 'ベトナム'},
  {id:'birth', type:'date', jpLabel:'2 生年月日', viLabel:'Ngày sinh', vi:'Dương lịch: năm 年 tháng 月 ngày 日.', q:'Ngày sinh của ông/bà', area:S(319,153,223,18), fillArea:S(360,155,182,14)},
  {id:'name', jpLabel:'3 氏名', viLabel:'Họ tên', vi:'Đúng như hộ chiếu, chữ Latin in hoa: họ (Family name) rồi tên (Given name).', q:'Họ tên như trên hộ chiếu', ph:'TRAN THI HOA', area:S(45,171,497,24), fillArea:S(85,183,457,12)},
  {id:'sex', type:'choice', opts:[['男','Nam','○ 男'],['女','Nữ','○ 女']], jpLabel:'4 性別', viLabel:'Giới tính', vi:'Khoanh 男 (nam) hoặc 女 (nữ).', q:'Giới tính', area:S(45,194,117,18), fillArea:S(85,196,75,14)},
  {id:'bplace', jpLabel:'5 出生地', viLabel:'Nơi sinh', vi:'Tỉnh/thành nơi sinh.', q:'Nơi sinh', ph:'ベトナム ハノイ', area:S(164,194,224,18), fillArea:S(200,196,185,14)},
  {id:'married', type:'choice', opts:yn, jpLabel:'6 配偶者の有無', viLabel:'Có vợ/chồng không', vi:'Ông/bà còn vợ/chồng → 有. Không → 無.', q:'Ông/bà có vợ/chồng?', area:S(390,194,152,18), fillArea:S(465,196,77,14)},
  {id:'job', jpLabel:'7 職業', viLabel:'Nghề nghiệp', vi:'Ví dụ 「無職」 (không đi làm), 「年金受給者」 (hưởng lương hưu).', q:'Nghề nghiệp', ph:'無職', jp:true, area:S(45,212,177,18), fillArea:S(86,213,135,14)},
  {id:'home', jpLabel:'8 本国における居住地', viLabel:'Địa chỉ ở Việt Nam', vi:'Tỉnh/thành đang sống ở Việt Nam.', q:'Nơi ở tại Việt Nam', ph:'ハノイ市', area:S(224,212,318,18), fillArea:S(300,213,242,14)},
  {id:'contact', type:'textarea', rows:2, jpLabel:'9 日本における連絡先', viLabel:'Liên lạc ở Nhật', vi:'Địa chỉ và điện thoại của gia đình bạn ở Nhật (nơi ông/bà sẽ ở cùng).', q:'Địa chỉ + điện thoại ở Nhật', ph:'東京都〇〇区〇〇1-2-3\n090-1234-5678', jp:true, area:S(45,228,497,38), fillArea:S(150,229,392,34)},
  {id:'pass', jpLabel:'10 旅券 (1)番号', viLabel:'Số hộ chiếu', vi:'Số hộ chiếu của ông/bà.', q:'Số hộ chiếu', ph:'C1234567', area:S(45,264,260,18), fillArea:S(140,266,165,14)},
  {id:'passExp', type:'date', jpLabel:'10 (2)有効期限', viLabel:'Hạn hộ chiếu', vi:'Ngày hết hạn hộ chiếu.', q:'Hạn hộ chiếu', area:S(307,264,235,18), fillArea:S(352,266,190,14)},
  {id:'purpose', noInput:true, badgeWarn:true, jpLabel:'11 入国目的', viLabel:'Mục đích nhập cảnh', vi:'Diện này không có ô riêng trong danh sách. Thông thường chọn 「U その他」 — Cần xác nhận với cục trước khi nộp (0570-013904).', area:S(472,402,70,14), out:() => '☑ U その他'},
  {id:'entry', type:'date', jpLabel:'12 入国予定年月日', viLabel:'Ngày dự định sang', vi:'Ngày dự kiến sang Nhật (sau khi có kết quả, thường 1–3 tháng).', q:'Ngày dự định sang', area:S(45,419,260,18), fillArea:S(125,421,180,14)},
  {id:'port', jpLabel:'13 上陸予定港', viLabel:'Sân bay đến', vi:'Ví dụ 「成田空港」「羽田空港」「関西空港」.', q:'Sân bay đến', ph:'成田空港', jp:true, area:S(307,419,235,18), fillArea:S(362,421,180,14)},
  {id:'stay', jpLabel:'14 滞在予定期間', viLabel:'Thời gian dự định ở', vi:'Ví dụ 「1年」. Thời hạn được cấp do cục quyết định.', q:'Thời gian dự định ở', ph:'1年', jp:true, area:S(45,437,260,18), fillArea:S(118,439,187,14), badgeWarn:true},
  {id:'together', type:'choice', opts:yn, jpLabel:'15 同伴者の有無', viLabel:'Có người đi cùng không', vi:'Có người đi cùng chuyến bay (ví dụ ông và bà cùng sang) → 有.', q:'Có người đi cùng?', area:S(307,437,235,18), fillArea:S(365,439,177,14)},
  {id:'visaPlace', jpLabel:'16 査証申請予定地', viLabel:'Nơi xin visa', vi:'Nơi ông/bà nộp hồ sơ visa ở Việt Nam, ví dụ 「ハノイ」「ホーチミン」.', q:'Nơi xin visa', ph:'ハノイ', jp:true, area:S(45,454,497,18), fillArea:S(125,456,417,14)},
  {id:'pastEntry', jpLabel:'17 過去の出入国歴', viLabel:'Đã từng sang Nhật chưa', vi:'Chưa từng → 無. Đã từng (ví dụ đi thăm) → 有, ghi số lần và lần gần nhất.', q:'Ví dụ: 有 2回 直近 2025年3月1日から2025年5月20日', ph:'無', area:S(45,472,497,44), fillArea:S(150,474,392,14)},
  {id:'pastCoe', jpLabel:'18 過去の在留資格認定証明書交付申請歴', viLabel:'Đã từng xin COE chưa', vi:'Chưa từng → 無.', q:'Ví dụ: 無', ph:'無', area:S(45,515,497,44), fillArea:S(260,517,282,14)},
  {id:'crime', type:'choice', opts:[['無','Không','○ 無'],['有','Có','○ 有（内容を記入）']], jpLabel:'19 犯罪を理由とする処分', viLabel:'Từng bị xử phạt hình sự', vi:'Kể cả ở nước ngoài và vi phạm giao thông.', q:'Từng bị xử phạt?', area:S(45,557,497,34), fillArea:S(148,573,350,14)},
  {id:'deport', type:'choice', opts:yn, jpLabel:'20 退去強制又は出国命令による出国の有無', viLabel:'Từng bị trục xuất', vi:'Từng bị trục xuất khỏi Nhật chưa.', q:'Từng bị trục xuất?', area:S(45,590,497,36), fillArea:S(260,592,282,14)},
  {id:'family', type:'textarea', rows:4, jpLabel:'21 在日親族及び同居者', viLabel:'Người thân ở Nhật', vi:'Khoanh 有 và ghi gia đình bạn ở Nhật (người 高度専門職, vợ/chồng, cháu): 続柄・氏名・生年月日・国籍・同居予定・勤務先/通学先・在留カード番号.', q:'Mỗi người 1 dòng', ph:'子　KIEU VAN A　1993/4/12　ベトナム　有　〇〇株式会社　AB1234567CD\n孫　KIEU AN　2025/6/1　ベトナム　有　―　CD7654321EF', area:S(45,624,497,124), fillArea:S(48,676,494,70), out:a => (a.family || '').trim() ? '有\n' + a.family.trim() : ''},
  {id:'photo', noInput:true, optional:true, jpLabel:'写真', viLabel:'Ảnh 4×3 cm', vi:'Ảnh dọc 4 cm × ngang 3 cm theo quy cách, ghi tên mặt sau, dán vào đơn.', area:[465,41,87,113], out:() => ''},
  {id:'p34', noInput:true, badgeWarn:true, jpLabel:'申請人等作成用２～４・所属機関等作成用１～３（U）', viLabel:'Các trang còn lại của đơn', vi:'Mẫu U dùng chung cho nhiều diện, không có ô riêng cho “bố mẹ của người 高度専門職”. Cách chọn ô 22 活動内容 (trang 3) và mục 2 申請人の活動内容 (trang 6, người bảo lãnh viết) — Cần xác nhận với cục trước khi nộp (0570-013904).', area:S(45,700,497,30), out:() => ''},
  /* Tờ 確認書 */
  ...[['hspF','Bố của người 高度専門職','在留資格「高度専門職」を有する者の父',[137,117,205,134]],['hspM','Mẹ của người 高度専門職','在留資格「高度専門職」を有する者の母',[347,117,187,134]],
      ['spF','Bố của vợ/chồng người 高度専門職','配偶者の父',[137,403,205,134]],['spM','Mẹ của vợ/chồng người 高度専門職','配偶者の母',[347,403,187,134]]].map(([id, vi, jp, area]) => ({
    form:K, id, type:'textarea', rows:5, jpLabel:'確認書：' + jp, viLabel:vi, area, optional:false,
    vi:`Ghi 5 dòng theo thứ tự trên giấy: 氏名 (họ tên, như hộ chiếu) · 国籍・地域 · 生年月日 · 旅券番号 (không có hộ chiếu ghi 「なし」) · 本邦在留中 はい/いいえ. Phải ghi cho CẢ 4 người (bố mẹ hai bên). Người đã mất hoặc ly hôn: vẫn ghi tên và ghi rõ ở ô 備考.`,
    q:'5 dòng: họ tên / quốc tịch / ngày sinh / số hộ chiếu / はい hoặc いいえ', ph:'TRAN VAN BINH\nベトナム\n1960/3/3\nC1112223\nいいえ', note:'Nếu đang ở Nhật (はい) thì ghi thêm 在留資格, 在留期間, 在留期限 ở các dòng dưới.'})),
  {form:K, id:'kWriter', jpLabel:'記載者の氏名・年月日', viLabel:'Người viết và ngày', vi:'Người viết tờ này (thường là bạn — người 高度専門職) ghi họ tên và ngày.', q:'Họ tên người viết', ph:'KIEU VAN A', area:[54,680,480,22], fillArea:[350,682,180,14], out:a => a.kWriter || ''},
].map(f => Object.assign({form:P1, show:isT}, f, f.form === K ? {form:K, show:isT} : {}));

window.PROC = {
  id:'mago', short:'Ông bà sang chăm cháu', jpShort:'特定活動（高度専門職外国人の親）/ 短期滞在', kicker:'Ông bà sang chăm cháu', title:'Ông bà sang Nhật chăm cháu', jp:'特定活動（高度専門職外国人又はその配偶者の親）・短期滞在',
  intro:'Trả lời vài câu để biết ông bà có thể sang theo hướng nào, ở được bao lâu, cần giấy gì.',
  formName:'đơn xin', fillDesc:'Điền đơn xin COE (diện 特定活動) và tờ 確認書 từng ô rồi in ra.',
  defaults:{status:'work', child:'u7', income:'no', together:'yes', otherSide:'no', nat:'ベトナム'},
  emptyFill:'Theo câu trả lời, ông bà chỉ sang được bằng visa ngắn hạn (thăm thân). Phần giấy tờ cho visa ngắn hạn xem ở thủ tục “Mời bố mẹ, người thân sang chơi”.',
  forms:{
    p1:{title:'在留資格認定証明書交付申請書（申請人等作成用１）', short:'Đơn COE · trang 1', src:'forms/mago-1.jpg', w:595.2, h:842, note:'Mẫu chính thức của 出入国在留管理庁 (mẫu U 「その他」)'},
    k:{title:'高度外国人材にかかる確認書', short:'Tờ 確認書', src:'forms/mago-k.jpg', w:595.3, h:841.9, note:'Mẫu chính thức của 出入国在留管理庁'}
  },
  questions:[
    {id:'status', type:'choice', q:'Bạn (hoặc vợ/chồng bạn) đang có tư cách lưu trú gì?', opts:[['hsp','高度専門職 (nhân lực trình độ cao)'],['work','Visa lao động khác (技人国, 特定技能, 介護…)'],['pr','永住者 / 日本人の配偶者等 / 定住者'],['other','Khác (du học, 家族滞在…)']], help:'Chỉ người có 「高度専門職」 mới được đón bố mẹ sang ở dài hạn để chăm con nhỏ (theo diện 特定活動). Xem dòng 在留資格 trên 在留カード.'},
    {id:'child', type:'choice', q:'Cháu bao nhiêu tuổi?', opts:[['u7','Dưới 7 tuổi'],['o7','Từ 7 tuổi trở lên'],['preg','Đang mang thai, chưa sinh']]},
    {id:'income', type:'choice', q:'Tổng thu nhập năm của vợ + chồng (dự kiến) từ 800万円 trở lên?', show:a => a.status === 'hsp', opts:[['yes','Có'],['no','Không']], help:'“Thu nhập hộ” chỉ tính tiền lương (報酬) năm của người 高度専門職 và vợ/chồng; không tính thu nhập của người khác.'},
    {id:'together', type:'choice', q:'Ông bà sẽ ở cùng nhà với gia đình bạn?', show:a => a.status === 'hsp', opts:[['yes','Có'],['no','Không']]},
    {id:'otherSide', type:'choice', q:'Bố mẹ bên kia (bên vợ hoặc bên chồng) đang ở Nhật theo diện này?', show:a => a.status === 'hsp', opts:[['no','Không'],['yes','Có']], help:'Chỉ được đón bố mẹ của MỘT bên: bố/mẹ người 高度専門職, hoặc bố/mẹ của vợ/chồng — không đồng thời cả hai bên.'},
  ],
  calc:() => ({}),
  guide(a){
    if (path(a) === 't'){
      return {
        head:{title:'Ông bà sang ở dài hạn để chăm cháu (特定活動)', summary:'Theo câu trả lời: bạn có visa 高度専門職, ' + (a.child === 'preg' ? 'đang mang thai' : 'cháu dưới 7 tuổi') + ', thu nhập vợ + chồng từ 800万円, ông bà ở cùng nhà → đủ điều kiện xin diện 「特定活動」 dành cho bố mẹ người 高度専門職.'},
        quad:[
          {k:'Nơi nộp', v:'地方出入国在留管理官署', note:'Không nhận nộp qua bưu điện.'},
          {k:'Người nộp', v:'Người thân ở Nhật nộp thay (代理人)', note:'Cần xác nhận người được nộp thay.'},
          {k:'Thời gian xét', v:'Khoảng 1–3 tháng', note:'Thời gian xử lý chuẩn của thủ tục xin COE.'},
          {k:'Lệ phí', v:'Xin COE không mất phí', note:'Phí visa tại Việt Nam tính riêng.'},
        ],
        notes:['Điều kiện (theo 出入国在留管理庁): sống cùng nhà với người 高度専門職; thu nhập năm (vợ + chồng) từ 800万円 tại thời điểm nhập cảnh; mục đích là chăm con dưới 7 tuổi, hoặc giúp đỡ khi đang mang thai; chỉ bố mẹ của một bên.', 'Khi gia hạn: cháu phải còn dưới 7 tuổi và dự định chăm tiếp ít nhất 3 tháng (tính từ ngày hết hạn); thu nhập vẫn từ 800万円.'],
        steps:[
          {t:'Chuẩn bị giấy tờ', d:'Theo danh sách bên phải. Giấy tờ tiếng Việt kèm bản dịch tiếng Nhật; giấy Nhật cấp trong 3 tháng.'},
          {t:'Điền đơn COE và tờ 確認書', d:'Bấm “Bắt đầu điền giấy”. Tờ 確認書 phải ghi cho cả 4 người (bố mẹ hai bên).'},
          {t:'Nộp tại cục xuất nhập cảnh', d:'Người thân ở Nhật mang hồ sơ đến 地方出入国在留管理官署.'},
          {t:'Nhận COE, gửi về Việt Nam', d:'Ông/bà xin visa tại cơ quan đại diện Nhật ở Việt Nam rồi sang Nhật.'},
          {t:'Sau khi sang', d:'Đăng ký địa chỉ tại 区役所/市役所 trong 14 ngày.'},
        ],
        docs:[{t:'Giấy tờ cần chuẩn bị', d:'Theo trang 出入国在留管理庁 (diện bố mẹ người 高度専門職).', items:[
          {jp:'在留資格認定証明書交付申請書', t:'Đơn xin COE (mẫu U)', d:'Bạn viết · app hướng dẫn từng ô'},
          {jp:'写真', t:'Ảnh của ông/bà theo quy cách'},
          {jp:'返信用封筒', t:'Phong bì trả lời (定形, ghi địa chỉ, dán tem 簡易書留)', where:'Bưu điện'},
          {jp:'世帯年収（予定）を証する文書', t:'Giấy chứng minh thu nhập năm (dự kiến) của vợ + chồng', where:'Công ty / 区役所・市役所', warn:'Cần xác nhận loại giấy cụ thể (課税証明書, 雇用契約書…).'},
          {jp:'身分関係を証する文書', t: a.child === 'preg' ? 'Giấy chứng minh quan hệ (ông/bà ↔ người 高度専門職 hoặc vợ/chồng): giấy khai sinh, giấy kết hôn…' : 'Giấy chứng minh quan hệ ông/bà ↔ bố/mẹ của cháu, và cháu dưới 7 tuổi: 出生証明書, 結婚証明書 (bản sao), 戸籍謄本…', warn:'Kèm bản dịch tiếng Nhật.'},
          a.child === 'preg' ? {jp:'妊娠を証する文書', t:'Giấy chứng minh đang mang thai (診断書, bản sao 母子健康手帳…)'} : {jp:'在留カード又はパスポートの写し', t:'Bản sao 在留カード/hộ chiếu của người 高度専門職, vợ/chồng và cháu'},
          {jp:'高度外国人材にかかる確認書', t:'Tờ xác nhận về bố mẹ hai bên', d:'Bạn viết · app hướng dẫn từng ô'},
        ]}],
        warns:['Cục có thể yêu cầu thêm giấy tờ khác trong quá trình xét.'],
      };
    }
    const reasons = [];
    if (a.status !== 'hsp') reasons.push('Diện đón bố mẹ sang ở dài hạn để chăm con nhỏ chỉ dành cho người có tư cách 「高度専門職」. Theo 出入国在留管理庁: thông thường bố mẹ của người có visa lao động không được cấp tư cách lưu trú.');
    if (a.status === 'hsp' && a.child === 'o7') reasons.push('Diện 特定活動 chỉ áp dụng khi chăm con DƯỚI 7 tuổi (hoặc giúp đỡ khi đang mang thai).');
    if (a.status === 'hsp' && a.income !== 'yes') reasons.push('Diện 特定活動 yêu cầu thu nhập năm vợ + chồng từ 800万円.');
    if (a.status === 'hsp' && a.together !== 'yes') reasons.push('Diện 特定活動 yêu cầu ông bà sống cùng nhà với người 高度専門職.');
    if (a.status === 'hsp' && a.otherSide === 'yes') reasons.push('Bố mẹ bên kia đã ở Nhật theo diện này — chỉ được một bên.');
    return {
      head:{title:'Không có visa dài hạn để chăm cháu trong trường hợp của bạn', summary:'Không có loại visa riêng tên “chăm cháu”. Ông bà chỉ sang được bằng visa ngắn hạn 「短期滞在」 (thăm thân), tối đa 90 ngày mỗi lần, và không được làm việc.'},
      quad:[
        {k:'Hướng phù hợp', v:'Visa ngắn hạn thăm thân (短期滞在)', note:'Xem thủ tục “Mời bố mẹ, người thân sang chơi”.'},
        {k:'Ở tối đa', v:'90 ngày mỗi lần nhập cảnh', note:'Thời hạn: 90, 30 hoặc 15 ngày.'},
        {k:'Gia hạn', v:'Thường không được vì lý do chăm cháu', note:'Chỉ khi có lý do nhân đạo thật sự bất khả kháng (ví dụ phải chữa bệnh).'},
        {k:'Làm việc', v:'Không được làm việc có thu nhập'},
      ],
      notes:reasons.concat(['Sang nhiều lần liên tiếp bằng visa ngắn hạn có thể bị xem xét kỹ khi nhập cảnh — Cần xác nhận.', 'Diện chăm sóc bố mẹ già yếu (老親扶養) không phải diện chăm cháu, không công bố tiêu chuẩn và xét từng trường hợp rất chặt — Cần xác nhận với cục.', 'Hỏi trực tiếp: 外国人在留総合インフォメーションセンター 0570-013904.']),
      steps:[
        {t:'Làm hồ sơ visa ngắn hạn thăm thân', d:'Xem thủ tục <a href="shinzoku.html">“Mời bố mẹ, người thân sang chơi”</a>.'},
        {t:'Ông bà sang, ở tối đa 90 ngày', d:'Không làm việc có thu nhập. Về nước trước khi hết hạn.'},
        {t:'Muốn sang lại', d:'Làm hồ sơ visa mới cho lần sau.'},
      ],
      docs:[], warns:[],
    };
  },
  fields,
  sources:[
    {t:'特定活動（高度専門職外国人又はその配偶者の親） — 出入国在留管理庁', u:PAGE},
    {t:'在留資格「短期滞在」 — 出入国在留管理庁', u:ISA + 'applications/status/temporaryvisitor.html'},
  ]
};
})();
