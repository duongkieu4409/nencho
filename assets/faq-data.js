/* Kho hỏi đáp (soạn sẵn, chạy trên máy). Mỗi ý: ok = Đã kiểm tra với nguồn chính thức; cx = Cần xác nhận.
   Cập nhật: 2026-11-26. Muốn đổi sang AI sau này: chỉ cần thay hàm QA_ANSWER trong faq.js. */
window.QA_DATE = '26/11/2026';
window.QA_TOPICS = {
  general:{name:'Thủ tục chung', page:'./'},
  nenmatsu:{name:'年末調整', page:'nenmatsu.html'},
  kakutei:{name:'確定申告', page:'kakutei.html'},
  zairyu:{name:'Gia hạn / đổi tư cách lưu trú', page:'zairyu.html'},
  kazoku:{name:'Visa gia đình (家族滞在)', page:'kazoku.html'},
  shinzoku:{name:'Visa thăm thân', page:'shinzoku.html'},
  mago:{name:'Ông bà sang chăm cháu', page:'mago.html'},
  kaigo:{name:'Kaigo (介護)', page:'kaigo.html'},
  fukugyo:{name:'Làm thêm theo visa', page:'fukugyo.html'},
  shozoku:{name:'Chuyển cơ sở làm việc', page:'shozoku.html'},
};
const ISA_KG = {t:'出入国在留管理庁「在留資格『介護』」', u:'https://www.moj.go.jp/isa/applications/status/nursingcare.html'};
const ISA_SZ = {t:'出入国在留管理庁「所属（契約）機関に関する届出」', u:'https://www.moj.go.jp/isa/applications/procedures/nyuukokukanri10_00015.html'};
const ISA_RY = {t:'出入国在留管理庁「『留学』の資格外活動許可」', u:'https://www.moj.go.jp/isa/applications/procedures/nyuukokukanri07_00003.html'};
const ISA_KZ = {t:'出入国在留管理庁「『家族滞在』の資格外活動許可」', u:'https://www.moj.go.jp/isa/applications/procedures/nyuukokukanri07_00004.html'};
const ISA_SG = {t:'出入国在留管理庁「資格外活動許可について」', u:'https://www.moj.go.jp/isa/applications/procedures/nyuukokukanri07_00045.html'};
const ISA_SSW = {t:'出入国在留管理庁「特定技能制度に関するＱ＆Ａ」', u:'https://www.moj.go.jp/isa/policies/ssw/faq.html'};
const NTA_1900 = {t:'国税庁 No.1900「給与所得者で確定申告が必要な人」', u:'https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1900.htm'};
const NTA8 = {t:'国税庁「令和8年分 年末調整のしかた」', u:'https://www.nta.go.jp/publication/pamph/gensen/nencho2026/01.htm'};
const KKT8 = {t:'国税庁「令和8年分の確定申告書（案）」', u:'https://www.nta.go.jp/taxes/shiraberu/shinkoku/pdf/0026006-063.pdf'};
const ISA_K = {t:'出入国在留管理庁「在留期間更新許可申請」', u:'https://www.moj.go.jp/isa/applications/procedures/16-3.html'};
const ISA_H = {t:'出入国在留管理庁「在留資格変更許可申請」', u:'https://www.moj.go.jp/isa/applications/procedures/16-2.html'};
const ISA_N = {t:'出入国在留管理庁「在留資格認定証明書交付申請」', u:'https://www.moj.go.jp/isa/applications/procedures/16-1.html'};
const ISA_D = {t:'出入国在留管理庁「家族滞在」', u:'https://www.moj.go.jp/isa/applications/status/dependent.html'};
const ISA_P = {t:'出入国在留管理庁「特定活動（高度専門職外国人又はその配偶者の親）」', u:'https://www.moj.go.jp/isa/applications/status/designatedactivities02_00002.html'};
const ISA_T = {t:'出入国在留管理庁「短期滞在」', u:'https://www.moj.go.jp/isa/applications/status/temporaryvisitor.html'};
const MOFA_VN = {t:'外務省「ベトナム国籍の方が短期滞在を目的として日本へ渡航する場合」', u:'https://www.mofa.go.jp/mofaj/ca/fna/page23_002812.html'};
window.QA = [
  /* ===== Kaigo ===== */
  {topics:['zairyu'], q:'Gia hạn visa (技人国) cần giấy tờ gì?', kw:['gia han','giay gi','can giay','giay to','更新','技人国'],
   lead:'Đơn gia hạn + ảnh; thêm giấy thuế cư trú và giấy tờ công ty tùy loại công ty.', items:[
    ['在留期間更新許可申請書: trang người nộp bạn viết, trang 所属機関 công ty viết. Kèm 1 ảnh 4×3.','ok'],
    ['Xuất trình hộ chiếu và 在留カード.','ok'],
    ['Công ty loại (カテゴリー) 3–4: thêm 住民税の課税・納税証明書 và tờ khai về người đại diện công ty.','ok'],
    ['Loại công ty và danh sách đầy đủ: hỏi phòng nhân sự, hoặc trả lời câu hỏi trong app.','ok']], src:[ISA_K], go:'zairyu.html'},
  {topics:['kaigo','zairyu'], q:'Gia hạn visa 介護 cần giấy tờ gì?', kw:['gia han kaigo','gia han 介護','gia han','giay gi','can giay','介護 gia han','更新 介護','visa kaigo','visa 介護','giay to kaigo'],
   lead:'Đơn gia hạn + ảnh + giấy thuế cư trú + tờ khai về người đại diện cơ sở.', items:[
    ['在留期間更新許可申請書 (cùng mẫu với 技人国) và 1 ảnh 4×3.','ok'],
    ['住民税の課税（非課税）証明書 và 納税証明書 (1 năm), lấy ở 区役所 nơi bạn ở ngày 1/1.','ok'],
    ['所属機関の代表者に関する申告書: bắt buộc với hồ sơ nộp từ 15/4/2026.','ok'],
    ['Lần gia hạn đầu sau khi chuyển việc: thêm giấy điều kiện lao động và tài liệu giới thiệu cơ sở mới.','ok']], src:[ISA_KG], go:'zairyu.html?set=kind:koshin,target:kaigo'},
  {topics:['kaigo','zairyu'], q:'Đổi từ 特定技能 sang visa 介護 thế nào?', kw:['doi sang kaigo','doi sang 介護','sang kaigo','sang 介護','sang visa kaigo','特定技能 sang','tokutei sang','介護福祉士','dau kaigo','do kaigo','tot nghiep truong dieu duong'],
   lead:'Đỗ 介護福祉士 rồi xin 在留資格変更許可 sang 「介護」.', items:[
    ['Điều kiện: có 介護福祉士 và hợp đồng làm 介護 với cơ sở ở Nhật (đỗ theo con đường nào cũng được).','ok'],
    ['Nộp: đơn đổi tư cách, ảnh, bản sao thẻ đăng ký 介護福祉士, giấy điều kiện lao động, tài liệu về cơ sở.','ok'],
    ['特定技能1号 sắp hết 5 năm mà chưa có thẻ đăng ký: nộp trước bản sao 合格通知書.','ok'],
    ['Từng ở Nhật bằng 技能実習: thêm 技能移転に係る申告書.','ok']], src:[ISA_KG], go:'zairyu.html?set=kind:henko,target:kaigo'},
  {topics:['kaigo','fukugyo'], q:'Visa 介護 có được làm thêm ở cơ sở khác không?', kw:['lam them','co so khac','2 noi','hai noi','副業','arubaito','baito','part time'],
   lead:'Làm 介護 ở nơi khác: hỏi 入管 trước. Việc khác loại: phải xin phép.', items:[
    ['Tư cách 「介護」 là làm 介護 theo hợp đồng với cơ sở ở Nhật.','ok'],
    ['Ký hợp đồng thứ 2 làm 介護: có cần xin phép / báo 入管 không thì hỏi 0570-013904 trước.','cx'],
    ['Việc ngoài 介護 (cửa hàng, nhà hàng…): phải có 資格外活動許可 trước khi làm.','ok'],
    ['Lương nơi phụ trên 20万円/năm: phải làm 確定申告.','ok']], src:[ISA_KG, ISA_SG, NTA_1900], go:'fukugyo.html'},
  {topics:['fukugyo','kaigo'], q:'特定技能 có được làm thêm không?', kw:['特定技能','tokutei','dac dinh','tokutei lam them','特定技能 lam them','lam them'],
   lead:'Không. 特定技能 không được làm thêm ở công ty khác.', items:[
    ['Q&A của 入管: làm thêm ở công ty khác — không được.','ok'],
    ['特定技能 phải làm toàn thời gian cho 1 nơi tiếp nhận.','ok'],
    ['資格外活動許可 không áp dụng cho 特定技能.','ok'],
    ['Muốn đổi nơi làm: phải xin 在留資格変更許可 trước.','ok']], src:[ISA_SSW, ISA_SG], go:'fukugyo.html'},
  {topics:['fukugyo'], q:'Du học sinh được làm thêm bao nhiêu giờ?', kw:['du hoc','留学','28','bao nhieu gio','gio lam','ryugaku'],
   lead:'Tối đa 28 giờ/tuần; kỳ nghỉ dài của trường: 8 giờ/ngày.', items:[
    ['Phải có 資格外活動許可 (包括許可) trước khi làm.','ok'],
    ['Đếm từ ngày nào trong tuần cũng không được vượt 28 giờ; cộng tất cả nơi làm.','ok'],
    ['Không làm ở cơ sở 風俗営業.','ok'],
    ['Tốt nghiệp xong (không còn là học sinh) thì không được làm thêm.','ok']], src:[ISA_RY], go:'fukugyo.html'},
  {topics:['fukugyo','kazoku'], q:'Visa 家族滞在 được làm thêm bao nhiêu giờ?', kw:['家族滞在','kazoku','vo lam them','gia dinh lam them','28'],
   lead:'Tối đa 28 giờ/tuần, phải có 資格外活動許可.', items:[
    ['28 giờ là tổng của tất cả nơi làm.','ok'],
    ['Không có ngoại lệ 8 giờ/ngày như du học sinh.','ok'],
    ['Từ 1/10/2026: làm ở tiệm pachinko… cần giấy phép riêng (個別許可).','ok'],
    ['Làm quá giờ có thể bị từ chối khi gia hạn.','ok']], src:[ISA_KZ], go:'fukugyo.html'},
  {topics:['shozoku','kaigo'], q:'Chuyển việc phải báo 入管 không?', kw:['chuyen viec','chuyen co so','nghi viec','doi cong ty','届出','14 ngay','14日','所属機関','bao nyukan'],
   lead:'Có. Tự báo 入管 trong 14 ngày (所属機関に関する届出).', items:[
    ['Áp dụng khi nghỉ việc, vào nơi mới, hoặc nơi làm đổi tên / địa chỉ / giải thể.','ok'],
    ['Nộp online, tại quầy hoặc gửi bưu điện; không cần giấy tờ chứng minh.','ok'],
    ['Không báo có thể bị phạt đến 20万円.','ok'],
    ['特定技能 đổi nơi làm: phải xin 在留資格変更許可, không chỉ báo.','ok']], src:[ISA_SZ, ISA_SSW], go:'shozoku.html'},
  /* ===== Ông bà sang chăm cháu ===== */
  {topics:['mago','shinzoku'], q:'Bố mẹ sang chăm cháu được bao lâu?', kw:['cham chau','bao lau','o bao lau','sang cham','ong ba','bo me sang','trong chau','giu chau'],
   lead:'Thông thường chỉ sang được bằng visa ngắn hạn, tối đa 90 ngày mỗi lần.', items:[
    ['Không có loại visa riêng tên “chăm cháu”.','ok'],
    ['Visa ngắn hạn 短期滞在 có thời hạn 90, 30 hoặc 15 ngày; không được làm việc có thu nhập.','ok'],
    ['Diện ở dài hạn để chăm cháu dưới 7 tuổi (特定活動) chỉ dành cho bố mẹ của người có 「高度専門職」 và thu nhập vợ + chồng từ 800万円.','ok'],
    ['Sang nhiều lần liên tiếp có thể bị xem xét kỹ khi nhập cảnh.','cx']], src:[ISA_T, ISA_P], go:'mago.html'},
  {topics:['mago'], q:'Tôi visa 介護 (hoặc 技人国), bố mẹ sang chăm cháu 1 năm được không?', kw:['kaigo','介護','gijinkoku','技人国','1 nam','mot nam','lau dai','dai han','visa cham chau','tokutei ginou','特定技能'],
   lead:'Không — với visa lao động thông thường, bố mẹ không được cấp visa dài hạn để chăm cháu.', items:[
    ['Theo 出入国在留管理庁: thông thường bố mẹ của người có visa lao động không được cấp tư cách lưu trú.','ok'],
    ['Ngoại lệ duy nhất có công bố: bố mẹ của người 「高度専門職」 (chăm con dưới 7 tuổi, thu nhập hộ từ 800万円, sống cùng nhà).','ok'],
    ['Ông bà chỉ sang bằng visa thăm thân, tối đa 90 ngày mỗi lần.','ok'],
    ['Gia hạn visa ngắn hạn vì lý do chăm cháu: thường không được.','cx']], src:[ISA_P, ISA_T], go:'mago.html'},
  {topics:['mago'], q:'Điều kiện để bố mẹ người 高度専門職 sang chăm cháu là gì?', kw:['高度専門職','koudo','do senmon','hsp','800','dieu kien','tieu chuan','7 tuoi','duoi 7'],
   lead:'Phải đủ cả 4 điều kiện do 出入国在留管理庁 công bố.', items:[
    ['Sống cùng nhà với người 高度専門職 (con hoặc con rể/dâu của ông bà).','ok'],
    ['Thu nhập năm của người 高度専門職 + vợ/chồng từ 800万円 (không tính thu nhập người khác).','ok'],
    ['Mục đích: chăm con dưới 7 tuổi, hoặc giúp đỡ khi đang mang thai.','ok'],
    ['Chỉ bố mẹ của MỘT bên (bên người 高度専門職 hoặc bên vợ/chồng).','ok']], src:[ISA_P], go:'mago.html'},
  {topics:['mago','shinzoku'], q:'Visa thăm thân có gia hạn được không?', kw:['gia han','keo dai','o them','them ngay','qua 90','hon 90','更新','enchou'],
   lead:'Chỉ khi có lý do nhân đạo thật sự bất khả kháng, ví dụ phải chữa bệnh.', items:[
    ['Theo 出入国在留管理庁: gia hạn 短期滞在 về nguyên tắc chỉ được khi có “人道上の真にやむをえない事情” hoặc tương đương.','ok'],
    ['Cần giấy tờ chứng minh lý do (ví dụ giấy chẩn đoán), giải thích hoạt động từ khi nhập cảnh, chứng minh đủ tiền và vé về.','ok'],
    ['Lý do chăm cháu thường không được chấp nhận.','cx']], src:[ISA_T], go:'mago.html'},
  /* ===== Visa thăm thân ===== */
  {topics:['shinzoku'], q:'Cần những giấy tờ gì ở Nhật?', kw:['giay to','giay gi','can giay','sang choi','o nhat','phia nhat','can gi','chuan bi','書類','招へい理由書','滞在予定表','身元保証書'],
   lead:'Phía Nhật chuẩn bị giấy mời, lịch trình và giấy bảo lãnh theo mẫu 外務省.', items:[
    ['Mẫu dành cho người Việt Nam: 招へい理由書, 滞在予定表, 身元保証書 (trang 外務省, bản 7/4/2025).','ok'],
    ['Thường kèm giấy tờ chứng minh nhân thân, nghề nghiệp, thu nhập của người mời/bảo lãnh (住民票, 在職証明書, 課税証明書…).','cx'],
    ['Gửi bản gốc về Việt Nam cho người thân nộp; không gửi cho Đại sứ quán.','cx']], src:[MOFA_VN], go:'shinzoku.html'},
  {topics:['shinzoku'], q:'Ai phải ký 身元保証書?', kw:['ky','身元保証書','bao lanh','nguoi bao lanh','mimoto','hosho'],
   lead:'Người bảo lãnh ở Nhật — thường là chính người mời.', items:[
    ['Người bảo lãnh cam kết về chi phí lưu trú, vé về và việc tuân thủ pháp luật của người sang.','cx'],
    ['Có thể là người khác ở Nhật nếu người đó đồng ý đứng ra bảo lãnh.','cx']], src:[MOFA_VN], go:'shinzoku.html'},
  {topics:['shinzoku','mago'], q:'Một năm mời được mấy lần?', kw:['may lan','bao nhieu lan','moi lan','nhieu lan','lien tiep','1 nam','mot nam'],
   lead:'Không có con số cố định được công bố — mỗi lần xét riêng.', items:[
    ['Visa ngắn hạn cho phép ở tối đa 90 ngày mỗi lần nhập cảnh.','ok'],
    ['Sang liên tục nhiều lần, tổng thời gian dài, có thể bị hỏi kỹ ở cửa khẩu hoặc khi xét visa.','cx']], src:[ISA_T], go:'shinzoku.html'},
  /* ===== Gia hạn / đổi tư cách ===== */
  {topics:['zairyu'], q:'Phí gia hạn visa bao nhiêu?', kw:['phi','le phi','bao nhieu tien','手数料','tien','gia han het bao nhieu','印紙'],
   lead:'Từ 1/10/2026, phí tính theo thời hạn được cấp (nộp tại quầy bằng 収入印紙).', items:[
    ['≤3 tháng 10.000円 · 3–6 tháng 18.000円 · 6 tháng–dưới 1 năm 25.000円 · 1 năm 33.000円.','ok'],
    ['Trên 1 năm–dưới 3 năm 48.000円 · 3–dưới 5 năm 64.000円 · từ 5 năm 75.000円.','ok'],
    ['Hồ sơ nhận đến 30/9/2026 vẫn trả 6.000円 dù được cấp phép sau 1/10.','ok'],
    ['Nộp online có mức phí và cách nộp riêng.','ok']], src:[ISA_K, ISA_H], go:'zairyu.html'},
  {topics:['zairyu'], q:'Khi nào nộp hồ sơ gia hạn?', kw:['khi nao','luc nao','bao gio','truoc may thang','3 thang','han nop','申請期間'],
   lead:'Từ khoảng 3 tháng trước ngày hết hạn đến ngày hết hạn.', items:[
    ['Áp dụng cho người có thời hạn lưu trú từ 6 tháng trở lên.','ok'],
    ['Trường hợp đặc biệt (đi công tác dài, sinh con…) có thể nộp sớm hơn — phải hỏi trước cục.','ok'],
    ['Thời gian xét chuẩn: 2 tuần – 1 tháng.','ok']], src:[ISA_K], go:'zairyu.html'},
  {topics:['zairyu'], q:'Hết hạn mà chưa có kết quả thì sao?', kw:['het han','chua co ket qua','qua han','tokurei','特例期間','cho ket qua'],
   lead:'Nếu đã nộp trước ngày hết hạn, bạn được ở tiếp hợp pháp trong thời gian chờ.', items:[
    ['Được ở đến khi có kết quả, tối đa 2 tháng sau ngày hết hạn (特例期間).','cx'],
    ['Chưa nộp mà đã quá hạn là ở quá hạn — liên hệ ngay cục xuất nhập cảnh.','cx']], src:[ISA_K], go:'zairyu.html'},
  {topics:['zairyu'], q:'Công ty loại (カテゴリー) 3 cần giấy tờ gì?', kw:['category','カテゴリー','loai 3','cat 3','cong ty nho','giay cong ty'],
   lead:'Ngoài đơn, ảnh, hộ chiếu, 在留カード: thêm giấy của công ty và giấy thuế cư trú của bạn.', items:[
    ['Bản sao 法定調書合計表 năm trước (chứng minh loại công ty).','ok'],
    ['Gia hạn: 住民税の課税（又は非課税）証明書・納税証明書 của bạn.','ok'],
    ['Lần gia hạn đầu sau khi chuyển sang công ty loại 3/4: thêm 労働条件通知書, 登記事項証明書, tài liệu công ty, báo cáo tài chính.','ok']], src:[ISA_K, {t:'「技術・人文知識・国際業務」提出書類一覧', u:'https://www.moj.go.jp/isa/applications/status/gijinkoku.html'}], go:'zairyu.html'},
  {topics:['zairyu'], q:'Du học xong đi làm thì đổi visa thế nào?', kw:['du hoc','留学','di lam','tot nghiep','doi visa','chuyen visa','変更'],
   lead:'Làm thủ tục đổi tư cách lưu trú (在留資格変更) sang 技術・人文知識・国際業務 trước khi bắt đầu làm.', items:[
    ['Nộp tại 地方出入国在留管理官署 nơi ở hoặc online; xét chuẩn 1–2 tháng.','ok'],
    ['Cần lý lịch, giấy tốt nghiệp (専門学校: chứng nhận danh hiệu 専門士) và giấy tờ của công ty.','ok'],
    ['Phí theo thời hạn được cấp, như phí gia hạn.','ok']], src:[ISA_H], go:'zairyu.html'},
  /* ===== Visa gia đình ===== */
  {topics:['kazoku'], q:'Đón vợ con sang mất bao lâu?', kw:['bao lau','mat bao lau','thoi gian','xet','don vo','don con','coe'],
   lead:'Xin COE mất khoảng 1–3 tháng, sau đó gia đình xin visa tại Việt Nam.', items:[
    ['Thời gian xử lý chuẩn của COE: 1–3 tháng.','ok'],
    ['Xin COE không mất phí; không nhận nộp qua bưu điện.','ok'],
    ['Có COE rồi phải nhập cảnh trong thời hạn hiệu lực ghi trên COE.','cx']], src:[ISA_N], go:'kazoku.html'},
  {topics:['kazoku'], q:'Visa 特定技能1号 có đón vợ con được không?', kw:['特定技能','tokutei','1 go','1号','ky nang dac dinh','技能実習','thuc tap sinh'],
   lead:'Về nguyên tắc không — 「特定技能1号」 và 「技能実習」 không được đón gia đình theo diện 家族滞在.', items:[
    ['「特定技能2号」 thì được đón vợ/chồng và con.','cx'],
    ['Hỏi 外国人在留総合インフォメーションセンター 0570-013904 để xác nhận trường hợp của bạn.','cx']], src:[ISA_D], go:'kazoku.html'},
  {topics:['kazoku'], q:'Cần giấy tờ gì để đón vợ/chồng?', kw:['giay to','giay gi','can giay','can gi','ket hon','chung minh','書類','vo','chong'],
   lead:'Đơn COE, ảnh, phong bì trả lời, giấy chứng minh quan hệ và giấy chứng minh thu nhập của bạn.', items:[
    ['Giấy chứng nhận kết hôn (bản sao) hoặc 婚姻届受理証明書 + bản dịch tiếng Nhật.','ok'],
    ['Bản sao 在留カード hoặc hộ chiếu của bạn.','ok'],
    ['在職証明書 + 住民税の課税（又は非課税）証明書・納税証明書.','ok']], src:[ISA_D], go:'kazoku.html'},
  /* ===== 確定申告 ===== */
  {topics:['kakutei'], q:'Hạn nộp 確定申告 năm 2026 là khi nào?', kw:['han','khi nao','thoi han','2027','thang 2','thang 3','期限'],
   lead:'Thông thường từ 16/2 đến 15/3/2027.', items:[
    ['Chỉ xin hoàn thuế (還付申告) thì nộp được từ 1/1/2027.','cx'],
    ['Lịch chính thức sẽ do 国税庁 thông báo — hãy kiểm tra lại khi đến mùa khai thuế.','cx']], src:[KKT8], go:'kakutei.html'},
  {topics:['kakutei'], q:'Làm thêm có phải khai thuế không?', kw:['lam them','arubaito','アルバイト','viec phu','2 noi','hai noi','20 man','20万'],
   lead:'Thường phải khai nếu lương nơi làm thêm (không qua 年末調整) trên 20万円/năm.', items:[
    ['Cộng lương của tất cả nơi làm vào ô 給与 trên tờ khai.','ok'],
    ['Trường hợp cụ thể hãy xác nhận với 税務署.','cx']], src:[KKT8], go:'kakutei.html'},
  {topics:['kakutei'], q:'Chi phí y tế được trừ thế nào?', kw:['y te','benh vien','医療費','iryo','kham benh','10 man','10万'],
   lead:'Được trừ phần chi phí y tế vượt 10万円 (hoặc 5% thu nhập nếu thu nhập dưới 200万円).', items:[
    ['Tính cho chi phí bạn trả cho bản thân và gia đình sống cùng; trừ phần bảo hiểm đã bù.','ok'],
    ['Tối đa 200万円; phải nộp kèm 医療費控除の明細書.','ok']], src:[KKT8], go:'kakutei.html'},
  {topics:['kakutei'], q:'Năm đầu vay mua nhà có phải khai không?', kw:['vay nha','mua nha','住宅ローン','nam dau','khau tru nha'],
   lead:'Có — năm đầu tiên được khấu trừ vay mua nhà phải tự khai 確定申告.', items:[
    ['Từ năm thứ 2, khai qua công ty (年末調整) bằng tờ 税務署 gửi về.','ok'],
    ['Số tiền khấu trừ tính trên 「住宅借入金等特別控除額の計算明細書」.','ok']], src:[NTA8], go:'kakutei.html'},
  /* ===== 年末調整 ===== */
  {topics:['nenmatsu'], q:'Năm 2026 thu nhập người phụ thuộc tối đa bao nhiêu?', kw:['phu thuoc','扶養','fuyou','123','136','62','nguong','toi da'],
   lead:'Năm 2026: thu nhập (所得) từ 62万円 trở xuống — tức lương từ 136万円 trở xuống.', items:[
    ['Trước đây là 58万円 (lương 123万円); năm 2026 đã nâng lên.','ok'],
    ['Con 19–22 tuổi có thu nhập 62万〜123万円 (lương 136万〜197万円): khai 特定親族特別控除.','ok']], src:[NTA8], go:'nenmatsu.html'},
  {topics:['nenmatsu'], q:'基礎控除 năm 2026 là bao nhiêu?', kw:['基礎控除','kiso','co ban','104'],
   lead:'Thu nhập (所得) từ 489万円 trở xuống: 104万円.', items:[
    ['489万〜655万円: 67万円 · 655万〜2.350万円: 62万円.','ok'],
    ['Trên 2.350万円 mức giảm dần (48万 / 32万 / 16万円).','ok']], src:[NTA8], go:'nenmatsu.html'},
  {topics:['nenmatsu','kakutei'], q:'Bố mẹ ở Việt Nam có khai người phụ thuộc được không?', kw:['viet nam','nuoc ngoai','国外','bo me o vn','gui tien','38'],
   lead:'Được, nếu đủ điều kiện và có giấy tờ chứng minh.', items:[
    ['Người 30–69 tuổi ở nước ngoài: chỉ được khi là du học sinh, người khuyết tật, hoặc nhận từ 38万円/năm.','ok'],
    ['Cần 親族関係書類 (kèm bản dịch) và 送金関係書類 (biên lai chuyển tiền).','ok']], src:[NTA8], go:'nenmatsu.html'},
  /* ===== Chung ===== */
  {topics:['general','zairyu','kazoku','mago','shinzoku'], q:'Hỏi trực tiếp ở đâu?', kw:['hoi o dau','lien he','so dien thoai','tieng viet','tu van','info','center'],
   lead:'Gọi 外国人在留総合インフォメーションセンター: 0570-013904.', items:[
    ['Từ IP phone / nước ngoài: 03-5796-7112.','ok'],
    ['Thuế (年末調整, 確定申告): hỏi 税務署 nơi bạn ở hoặc chatbot 「ふたば」 của 国税庁.','ok']], src:[ISA_K, NTA8], go:'./'},
];
