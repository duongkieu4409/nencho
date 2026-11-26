/* Visa gia đình 「家族滞在」 — 在留資格認定証明書交付申請 (đón vợ/chồng, con từ Việt Nam sang) */
(function(){
const ISA = 'https://www.moj.go.jp/isa/';
const yn = [['無','Không','○ 無'],['有','Có','○ 有']];
const f1 = 'p1', f2 = 'p2', f3 = 'p3';
const ymdS = d => d ? d.replace(/-/g, '/') : '';
const fields = [
  /* Trang 1 — thông tin người được đón sang (申請人) */
  {form:f1, id:'nat', fillArea:[100, 155, 210, 14], jpLabel:'1 国籍・地域', viLabel:'Quốc tịch người sang', vi:'Quốc tịch của vợ/chồng hoặc con.', q:'Quốc tịch', ph:'ベトナム', jp:true, area:[45,153,272,18], out:a => a.nat || 'ベトナム'},
  {form:f1, id:'birth', fillArea:[360, 155, 190, 14], type:'date', jpLabel:'2 生年月日', viLabel:'Ngày sinh người sang', vi:'Dương lịch: năm 年 tháng 月 ngày 日.', q:'Ngày sinh', area:[319,153,231,18]},
  {form:f1, id:'name', fillArea:[85, 183, 465, 12], jpLabel:'3 氏名', viLabel:'Họ tên người sang', vi:'Đúng như trang thông tin hộ chiếu, chữ Latin in hoa: họ (Family name) rồi tên (Given name).', q:'Họ tên như trên hộ chiếu', ph:'NGUYEN THI LAN', area:[45,171,505,24]},
  {form:f1, id:'sex', fillArea:[85, 196, 75, 14], type:'choice', opts:[['男','Nam','○ 男'],['女','Nữ','○ 女']], jpLabel:'4 性別', viLabel:'Giới tính', vi:'Khoanh 男 (nam) hoặc 女 (nữ).', q:'Giới tính', area:[45,194,117,18]},
  {form:f1, id:'bplace', fillArea:[200, 196, 185, 14], jpLabel:'5 出生地', viLabel:'Nơi sinh', vi:'Tỉnh/thành nơi sinh.', q:'Nơi sinh', ph:'ベトナム ハノイ', area:[164,194,224,18]},
  {form:f1, id:'married', fillArea:[465, 196, 85, 14], type:'choice', opts:yn, jpLabel:'6 配偶者の有無', viLabel:'Có vợ/chồng không', vi:'Người sang là vợ/chồng của bạn → khoanh 有. Là con chưa kết hôn → 無.', q:'Người sang đã kết hôn?', area:[390,194,160,18]},
  {form:f1, id:'job', fillArea:[86, 213, 135, 14], jpLabel:'7 職業', viLabel:'Nghề nghiệp hiện tại', vi:'Công việc hiện tại ở Việt Nam, ví dụ 「会社員」「主婦」「学生」「無職」.', q:'Nghề nghiệp', ph:'会社員', jp:true, area:[45,212,177,18]},
  {form:f1, id:'home', fillArea:[300, 213, 250, 14], jpLabel:'8 本国における居住地', viLabel:'Địa chỉ ở Việt Nam', vi:'Tỉnh/thành phố đang sống ở Việt Nam.', q:'Nơi ở tại Việt Nam', ph:'ハノイ市', area:[224,212,326,18]},
  {form:f1, id:'contact', fillArea:[150, 229, 400, 34], type:'textarea', rows:2, jpLabel:'9 日本における連絡先', viLabel:'Liên lạc ở Nhật', vi:'Địa chỉ và số điện thoại ở Nhật — thường là địa chỉ của bạn (người bảo lãnh).', q:'Địa chỉ + điện thoại ở Nhật', ph:'大阪府大阪市城東区森之宮1-2-3 101号\n090-1234-5678', jp:true, area:[45,228,505,38]},
  {form:f1, id:'pass', fillArea:[140, 266, 165, 14], jpLabel:'10 旅券 (1)番号', viLabel:'Số hộ chiếu', vi:'Số hộ chiếu của người sang. Chưa có hộ chiếu thì làm trước khi nộp.', q:'Số hộ chiếu', ph:'C1234567', area:[45,264,260,18]},
  {form:f1, id:'passExp', fillArea:[352, 266, 198, 14], type:'date', jpLabel:'10 (2)有効期限', viLabel:'Hạn hộ chiếu', vi:'Ngày hết hạn hộ chiếu.', q:'Hạn hộ chiếu', area:[307,264,243,18]},
  {form:f1, id:'purpose', noInput:true, jpLabel:'11 入国目的', viLabel:'Mục đích nhập cảnh', vi:'Đánh dấu ☑ ô 「Ｒ 家族滞在」.', area:[480,354,72,16], out:() => '☑ R 家族滞在'},
  {form:f1, id:'entry', fillArea:[125, 421, 180, 14], type:'date', jpLabel:'12 入国予定年月日', viLabel:'Ngày dự định sang Nhật', vi:'Ngày dự kiến nhập cảnh (ước tính, sau khi có kết quả 1–3 tháng).', q:'Ngày dự định sang', area:[45,419,260,18]},
  {form:f1, id:'port', fillArea:[362, 421, 188, 14], jpLabel:'13 上陸予定港', viLabel:'Sân bay dự định đến', vi:'Sân bay đến ở Nhật, ví dụ 「関西空港」「成田空港」「羽田空港」.', q:'Sân bay đến', ph:'関西空港', jp:true, area:[307,419,243,18]},
  {form:f1, id:'stay', fillArea:[118, 439, 187, 14], jpLabel:'14 滞在予定期間', viLabel:'Thời gian dự định ở', vi:'Thường ghi giống thời hạn lưu trú của bạn, hoặc 「扶養者の在留期間に合わせる」.', q:'Thời gian dự định ở', ph:'扶養者の在留期間に合わせる', jp:true, area:[45,437,260,18]},
  {form:f1, id:'together', fillArea:[365, 439, 185, 14], type:'choice', opts:yn, jpLabel:'15 同伴者の有無', viLabel:'Có người đi cùng không', vi:'Ví dụ vợ dẫn con sang cùng chuyến → 有.', q:'Có người đi cùng chuyến?', area:[307,437,243,18]},
  {form:f1, id:'visaPlace', fillArea:[125, 456, 425, 14], jpLabel:'16 査証申請予定地', viLabel:'Nơi xin visa', vi:'Nơi người sang sẽ nộp hồ sơ visa ở Việt Nam, ví dụ 「ハノイ」 (Đại sứ quán) hoặc 「ホーチミン」 (Tổng lãnh sự quán).', q:'Nơi xin visa ở Việt Nam', ph:'ハノイ', jp:true, area:[45,454,505,18]},
  {form:f1, id:'pastEntry', fillArea:[150, 474, 400, 14], jpLabel:'17 過去の出入国歴', viLabel:'Đã từng sang Nhật chưa', vi:'Chưa từng → khoanh 無. Đã từng → 有, ghi số lần và lần gần nhất (từ ngày… đến ngày…).', q:'Ví dụ: 無 / 有 2回 直近 2024年8月1日から2024年8月20日', ph:'無', area:[45,472,505,44]},
  {form:f1, id:'pastCoe', fillArea:[260, 517, 290, 14], jpLabel:'18 過去の在留資格認定証明書交付申請歴', viLabel:'Đã từng xin COE chưa', vi:'Chưa từng → 無. Đã từng → 有, ghi số lần (và số lần bị từ chối).', q:'Ví dụ: 無 / 有 1回（うち不交付 0回）', ph:'無', area:[45,515,505,44]},
  {form:f1, id:'crime', fillArea:[148, 573, 350, 14], type:'choice', opts:[['無','Không','○ 無'],['有','Có','○ 有（内容を記入）']], jpLabel:'19 犯罪を理由とする処分', viLabel:'Từng bị xử phạt hình sự', vi:'Kể cả ở nước ngoài và vi phạm giao thông. Có thì ghi nội dung.', q:'Người sang từng bị xử phạt?', area:[45,557,505,34]},
  {form:f1, id:'deport', fillArea:[260, 592, 290, 14], type:'choice', opts:yn, jpLabel:'20 退去強制又は出国命令による出国の有無', viLabel:'Từng bị trục xuất khỏi Nhật', vi:'Từng bị trục xuất / lệnh xuất cảnh khỏi Nhật chưa.', q:'Từng bị trục xuất?', area:[45,590,505,36]},
  {form:f1, id:'family', fillArea:[48, 676, 500, 70], type:'textarea', rows:4, jpLabel:'21 在日親族及び同居者', viLabel:'Người thân ở Nhật', vi:'Khoanh 有 và ghi người thân ở Nhật — ít nhất là bạn (người bảo lãnh): 続柄・氏名・生年月日・国籍・同居予定の有無・勤務先・在留カード番号.', q:'Mỗi người 1 dòng', ph:'夫　NGUYEN VAN A　1993/4/12　ベトナム　有　〇〇株式会社　AB1234567CD', area:[45,624,505,124], out:a => (a.family || '').trim() ? '有\n' + a.family.trim() : ''},
  /* Trang 3 — 申請人等作成用２ R */
  {form:f2, id:'notifJp', fillArea:[120, 84, 430, 32], jpLabel:'22 (1)日本国届出先・届出年月日', viLabel:'Nơi đăng ký kết hôn/khai sinh ở Nhật', vi:'Nếu đã đăng ký kết hôn (vợ/chồng) hoặc khai sinh (con) tại cơ quan Nhật (市区町村), ghi tên nơi đó và ngày. Không có thì để trống.', q:'Ví dụ: 大阪市城東区役所　2023/5/1', area:[19,70,556,48], optional:true},
  {form:f2, id:'notifVn', fillArea:[120, 132, 430, 34], jpLabel:'22 (2)本国等届出先・届出年月日', viLabel:'Nơi đăng ký ở Việt Nam', vi:'Nơi đăng ký kết hôn/khai sinh ở Việt Nam (UBND xã/phường…) và ngày đăng ký.', q:'Ví dụ: ハノイ市〇〇区〇〇坊人民委員会　2022/10/1', area:[19,119,556,50]},
  {form:f2, id:'pay', fillArea:[36, 190, 520, 14], type:'choice', opts:[['親族負担','Người thân (bạn) chi trả','☑ 親族負担'],['外国からの送金','Tiền gửi từ nước ngoài','☑ 外国からの送金'],['身元保証人負担','Người bảo lãnh chi trả','☑ 身元保証人負担']], jpLabel:'23 滞在費支弁方法', viLabel:'Ai chi trả chi phí sinh hoạt', vi:'Thông thường người bảo lãnh (bạn) là người thân chi trả → 「親族負担」. Cột bên cạnh ghi số tiền mỗi tháng nếu mẫu yêu cầu.', q:'Ai chi trả', area:[19,168,556,70]},
  {form:f2, id:'agName', fillArea:[110, 260, 440, 14], jpLabel:'24 (1)氏名・(2)本人との関係', viLabel:'Người làm đơn thay (bạn)', vi:'Bạn là người đại diện (代理人) làm đơn ở Nhật: ghi họ tên bạn và quan hệ với người sang, ví dụ 「夫」「妻」「父」「母」.', q:'Họ tên bạn + quan hệ', ph:'NGUYEN VAN A　夫', area:[35,259,520,24]},
  {form:f2, id:'agAddr', fillArea:[75, 286, 480, 38], type:'textarea', rows:2, jpLabel:'24 (3)住所・電話番号', viLabel:'Địa chỉ, điện thoại của bạn', vi:'Địa chỉ và điện thoại của bạn ở Nhật.', q:'Địa chỉ + điện thoại', ph:'大阪府大阪市城東区森之宮1-2-3 101号\n090-1234-5678', jp:true, area:[35,284,520,42]},
  {form:f2, id:'sign', fillArea:[300, 366, 250, 14], type:'date', jpLabel:'署名／申請書作成年月日', viLabel:'Chữ ký và ngày', vi:'Bạn (代理人) tự ký và ghi ngày làm đơn.', q:'Ngày làm đơn', area:[35,352,520,50], out:a => (a.sign ? ymdS(a.sign) : '')},
  /* Trang 4 — 扶養者等作成用１ R (bạn viết) */
  {form:f3, id:'s_name', fillArea:[210, 57, 340, 14], jpLabel:'1 扶養される家族（申請人）の氏名', viLabel:'Họ tên người được đón', vi:'Ghi lại họ tên người sang (giống trang 1).', noInput:true, area:[45,54,505,26], out:a => a.name || ''},
  {form:f3, id:'sup', fillArea:[110, 95, 440, 14], jpLabel:'2 (1)扶養者の氏名', viLabel:'Họ tên bạn (người bảo lãnh)', vi:'Họ tên bạn như trên 在留カード.', q:'Họ tên bạn', ph:'NGUYEN VAN A', area:[59,93,490,26]},
  {form:f3, id:'supBirth', fillArea:[120, 122, 210, 14], type:'date', jpLabel:'(2)生年月日', viLabel:'Ngày sinh của bạn', vi:'Ngày sinh của bạn.', q:'Ngày sinh của bạn', area:[59,120,274,26]},
  {form:f3, id:'supNat', fillArea:[400, 122, 150, 14], jpLabel:'(3)国籍・地域', viLabel:'Quốc tịch của bạn', vi:'Quốc tịch của bạn.', q:'Quốc tịch', ph:'ベトナム', area:[335,120,215,26], out:a => a.supNat || 'ベトナム'},
  {form:f3, id:'supCard', fillArea:[140, 149, 410, 14], jpLabel:'(4)在留カード番号', viLabel:'Số thẻ lưu trú của bạn', vi:'12 ký tự ở góc trên bên phải 在留カード.', q:'Số 在留カード', ph:'AB12345678CD', area:[59,147,490,26]},
  {form:f3, id:'supStatus', fillArea:[120, 176, 430, 14], jpLabel:'(5)在留資格・(6)在留期間', viLabel:'Tư cách và thời hạn lưu trú của bạn', vi:'Chép từ 在留カード, ví dụ 「技術・人文知識・国際業務　3年」.', q:'Tư cách + thời hạn', ph:'技術・人文知識・国際業務　3年', jp:true, area:[59,174,490,26]},
  {form:f3, id:'supExp', fillArea:[160, 203, 390, 14], type:'date', jpLabel:'(7)在留期間の満了日', viLabel:'Ngày hết hạn lưu trú của bạn', vi:'Ngày hết hạn trên 在留カード.', q:'Ngày hết hạn', area:[59,201,490,26]},
  {form:f3, id:'rel', fillArea:[74, 244, 470, 14], type:'choice', opts:[['夫','Tôi là chồng','☑ 夫'],['妻','Tôi là vợ','☑ 妻'],['父','Tôi là bố','☑ 父'],['母','Tôi là mẹ','☑ 母']], jpLabel:'(8)申請人との関係（続柄）', viLabel:'Bạn là gì của người sang', vi:'Đánh dấu quan hệ của BẠN đối với người sang: đón vợ → bạn là 夫 (chồng); đón con → 父 hoặc 母.', q:'Bạn là…', area:[59,229,490,66]},
  {form:f3, id:'work', fillArea:[180, 298, 370, 14], jpLabel:'(9)勤務先名称・(10)法人番号', viLabel:'Tên công ty và mã số pháp nhân', vi:'Tên công ty bạn làm. 法人番号 13 số: hỏi công ty hoặc tra trên trang 国税庁法人番号公表サイト.', q:'Tên công ty + 法人番号', ph:'〇〇株式会社　1234567890123', jp:true, area:[59,296,490,50]},
  {form:f3, id:'workAddr', fillArea:[140, 386, 410, 60], type:'textarea', rows:2, jpLabel:'(11)支店・事業所名・(12)勤務先所在地・電話番号', viLabel:'Chi nhánh, địa chỉ, điện thoại nơi làm', vi:'Nơi bạn làm việc chính.', q:'Chi nhánh + địa chỉ + điện thoại', ph:'大阪支店\n大阪市中央区〇〇1-1　06-1234-5678', jp:true, area:[59,345,490,112]},
  {form:f3, id:'income', fillArea:[110, 461, 440, 14], type:'money', jpLabel:'(13)年収', viLabel:'Thu nhập năm', vi:'Thu nhập 1 năm (theo 課税証明書 / 源泉徴収票). Ghi bằng yên.', q:'Thu nhập năm (yên)', ph:'4,500,000', area:[59,459,490,46], out:a => a.income ? PU.comma(PU.num(a.income)) + '円' : ''},
  {form:f3, id:'sign2', fillArea:[300, 524, 250, 14], type:'date', jpLabel:'扶養者の署名／申請書作成年月日', viLabel:'Chữ ký của bạn và ngày', vi:'Bạn (người bảo lãnh) tự ký và ghi ngày.', q:'Ngày làm đơn', area:[59,508,490,40], out:a => (a.sign2 ? ymdS(a.sign2) : '')},
  {form:f1, id:'photo', noInput:true, optional:true, jpLabel:'写真', viLabel:'Ảnh 4×3 cm của người sang', vi:'Ảnh dọc 4 cm × ngang 3 cm, chụp trong 6 tháng, chính diện, không mũ, nền trơn. Ghi tên ở mặt sau rồi dán vào đơn.', area:[457,41,87,113], out:() => ''},
];
window.PROC = {
  id:'kazoku', short:'Visa gia đình', jpShort:'家族滞在', fillDesc:'Điền đơn xin COE 3 trang từng ô rồi in ra.', kicker:'Visa gia đình', title:'Đón vợ/chồng, con sang Nhật (visa gia đình)', jp:'在留資格認定証明書交付申請（家族滞在）',
  intro:'Bạn ở Nhật làm hồ sơ xin “Giấy chứng nhận tư cách lưu trú” (COE) cho vợ/chồng hoặc con. Có COE rồi, gia đình xin visa tại Việt Nam và sang Nhật.',
  formName:'đơn xin COE', defaults:{who:'spouse', supWork:'work', nat:'ベトナム', supNat:'ベトナム'},
  forms:{
    p1:{title:'在留資格認定証明書交付申請書（申請人等作成用１）', short:'Đơn COE · trang 1', src:'forms/kazoku-1.jpg', w:595.3, h:841.9, note:'Mẫu chính thức của 出入国在留管理庁 (様式 第六号の三)'},
    p2:{title:'申請人等作成用２ R（家族滞在）', short:'Đơn COE · trang 2', src:'forms/kazoku-2.jpg', w:595.3, h:841.9, note:'Mẫu chính thức của 出入国在留管理庁'},
    p3:{title:'扶養者等作成用１ R（家族滞在）', short:'Trang của người bảo lãnh', src:'forms/kazoku-3.jpg', w:595.3, h:841.9, note:'Mẫu chính thức của 出入国在留管理庁'}
  },
  questions:[
    {id:'who', type:'choice', q:'Bạn muốn đón ai sang?', opts:[['spouse','Vợ / chồng'],['child','Con'],['both','Cả vợ/chồng và con']], help:'「家族滞在」 dành cho vợ/chồng và con được bạn nuôi. Bố mẹ không dùng tư cách này (bố mẹ sang chơi ngắn hạn thì dùng visa thăm thân).'},
    {id:'myStatus', type:'choice', q:'Tư cách lưu trú của bạn là gì?', opts:[['work','技術・人文知識・国際業務 / tư cách làm việc khác'],['ssw1','特定技能1号'],['student','留学 (du học)'],['tit','技能実習']], help:'Không phải tư cách nào cũng được đón gia đình theo diện 家族滞在.'},
    {id:'supWork', type:'choice', q:'Bạn đang đi làm có lương không?', show:a => a.myStatus !== 'ssw1' && a.myStatus !== 'tit', opts:[['work','Có, đi làm có lương'],['other','Không (du học…)']]},
  ],
  calc:() => ({}),
  guide(a){
    if (a.myStatus === 'ssw1' || a.myStatus === 'tit') return {stop:`Theo quy định, người có tư cách ${a.myStatus === 'ssw1' ? '「特定技能1号」' : '「技能実習」'} về nguyên tắc không được đón gia đình theo diện 「家族滞在」. Hãy hỏi 外国人在留総合インフォメーションセンター (0570-013904) để xác nhận trường hợp của bạn.`};
    const facts = [
      {icon:'map', k:'Ai nộp, nộp ở đâu', v:'Bạn (người bảo lãnh ở Nhật) nộp thay với tư cách 代理人, tại 地方出入国在留管理官署 quản lý nơi gia đình sẽ ở. <b>Không nhận nộp qua bưu điện.</b>'},
      {icon:'yen', k:'Phí', v:'Xin COE không mất phí.', note:'Phí visa tại Việt Nam và vé máy bay tính riêng.'},
      {icon:'clock', k:'Thời gian xét', v:'Khoảng 1–3 tháng (thời gian xử lý chuẩn).', note:'Sau khi có COE, gia đình phải nhập cảnh trong thời hạn hiệu lực của COE (thông thường 3 tháng) — Cần xác nhận khi nhận COE.'},
    ];
    const steps = [
      {t:'Chuẩn bị giấy tờ ở Việt Nam', d:'Giấy đăng ký kết hôn / giấy khai sinh (bản sao) + bản dịch tiếng Nhật; ảnh; bản sao hộ chiếu người sang.'},
      {t:'Chuẩn bị giấy tờ ở Nhật', d:'Giấy chứng nhận đang làm việc, giấy thuế cư trú, bản sao 在留カード của bạn.'},
      {t:'Điền đơn và nộp', d:'Bấm “Bắt đầu điền” để được hướng dẫn từng ô. Mang hồ sơ đến cục xuất nhập cảnh.'},
      {t:'Nhận COE, gửi về Việt Nam', d:'Kết quả gửi về theo phong bì trả lời bạn nộp kèm (hoặc nhận bản điện tử nếu chọn). Gửi COE cho gia đình.'},
      {t:'Gia đình xin visa tại Việt Nam', d:'Nộp COE + hộ chiếu + đơn xin visa + ảnh tại Đại sứ quán / Tổng lãnh sự quán Nhật (hoặc nơi nhận hồ sơ được chỉ định), rồi sang Nhật.'},
      {t:'Sau khi sang Nhật', d:'Trong 14 ngày kể từ khi có chỗ ở, đăng ký địa chỉ tại 区役所/市役所 (mang 在留カード).'},
    ];
    const me = [
      {jp:'在留資格認定証明書交付申請書', t:'Đơn xin COE', d:'Trang người sang (申請人等作成用１・２) và trang người bảo lãnh (扶養者等作成用１).'},
      {jp:'写真', t:'Ảnh 4×3 cm của người sang', d:'Chụp trong 6 tháng, chính diện, không mũ, nền trơn. Ghi tên ở mặt sau, dán vào đơn.'},
      {jp:'返信用封筒', t:'Phong bì trả lời', d:'Phong bì cỡ chuẩn (定形), ghi sẵn tên và địa chỉ người nhận, dán tem đủ tiền gửi 簡易書留.', where:'Bưu điện'},
      {jp:'身分関係を証する文書', t:'Giấy chứng minh quan hệ gia đình', d: a.who === 'child' ? 'Giấy khai sinh (出生証明書) bản sao — hoặc giấy tờ tương đương.' : a.who === 'both' ? 'Giấy chứng nhận kết hôn (結婚証明書) + giấy khai sinh của con (出生証明書), bản sao.' : 'Giấy chứng nhận kết hôn (結婚証明書) bản sao — hoặc 婚姻届受理証明書 nếu đăng ký kết hôn ở Nhật.', where:'UBND nơi đăng ký ở Việt Nam (hoặc 市区町村 nếu đăng ký ở Nhật)', warn:'Giấy tiếng Việt phải kèm bản dịch tiếng Nhật.'},
      {jp:'扶養者の在留カード又は旅券の写し', t:'Bản sao thẻ lưu trú (hoặc hộ chiếu) của bạn'},
    ];
    if (a.supWork === 'other') me.push({jp:'預金残高証明書 / 奨学金給付に関する証明書', t:'Chứng nhận số dư tài khoản đứng tên bạn, hoặc giấy chứng nhận học bổng (ghi số tiền và thời gian)', d:'Chứng minh bạn đủ khả năng nuôi gia đình.', where:'Ngân hàng / tổ chức cấp học bổng'});
    else me.push(
      {jp:'在職証明書', t:'Giấy chứng nhận đang làm việc', d:'Hoặc bản sao giấy phép kinh doanh nếu bạn tự kinh doanh.', where:'Công ty của bạn'},
      {jp:'住民税の課税（又は非課税）証明書・納税証明書', t:'Giấy thuế cư trú 1 năm', d:'Loại ghi tổng thu nhập 1 năm và tình trạng nộp thuế (có cả 2 nội dung thì 1 tờ là đủ).', where:'区役所・市役所 nơi bạn ở ngày 1/1, hoặc máy コンビニ bằng thẻ My Number'});
    const who = {spouse:'vợ/chồng', child:'con', both:'vợ/chồng và con'}[a.who] || 'gia đình';
    const head = {title:`Đón ${who} sang Nhật sống cùng`, summary:`Theo câu trả lời: bạn ở Nhật ${a.supWork === 'other' ? 'không đi làm có lương (du học…)' : 'đang đi làm có lương'}, xin giấy chứng nhận tư cách lưu trú (COE) 「家族滞在」 cho ${who}.`};
    const quad = [
      {k:'Nơi nộp', v:'地方出入国在留管理官署 quản lý nơi gia đình sẽ ở', note:'Không nhận nộp qua bưu điện.'},
      {k:'Người nộp', v:'Bạn — người bảo lãnh ở Nhật (代理人)'},
      {k:'Thời gian xét', v:'Khoảng 1–3 tháng', note:'Sau đó gia đình xin visa tại Việt Nam.'},
      {k:'Lệ phí', v:'Xin COE không mất phí', note:'Phí visa tại Việt Nam tính riêng.'},
    ];
    return {head, quad, notes:[facts[2].note], steps, docs:[{t:'Giấy tờ cần chuẩn bị', items:me}],
      warns:['Giấy tờ do cơ quan Nhật cấp phải trong vòng 3 tháng. Giấy tờ tiếng nước ngoài phải kèm bản dịch tiếng Nhật.', 'Cục có thể yêu cầu thêm giấy tờ khác tùy trường hợp.']};
  },
  fields,
  sources:[
    {t:'在留資格認定証明書交付申請 (出入国在留管理庁)', u:ISA + 'applications/procedures/16-1.html'},
    {t:'「家族滞在」 — mẫu đơn và bảng kê giấy tờ', u:ISA + 'applications/status/dependent.html'},
  ]
};
})();
