/* Chuyển cơ sở làm việc — 所属（契約）機関に関する届出（chỉ hướng dẫn） */
(function(){
const ISA = 'https://www.moj.go.jp/isa/';
window.PROC = {
  id:'shozoku', short:'Chuyển cơ sở làm việc', jpShort:'所属機関に関する届出', kicker:'Chuyển việc', title:'Nghỉ việc / vào cơ sở mới: báo 入管 trong 14 ngày', jp:'所属（契約）機関に関する届出',
  intro:'Khi nghỉ việc, vào nơi làm mới, hoặc nơi làm đổi tên/địa chỉ/giải thể, bạn phải tự báo 入管 trong 14 ngày.',
  formName:'giấy tờ', defaults:{visa:'kaigo', ev:'move'}, forms:{},
  questions:[
    {id:'visa', type:'choice', q:'Visa của bạn là gì?', opts:[['kaigo','介護'],['gijinkoku','技術・人文知識・国際業務'],['tokutei','特定技能'],['other','Visa làm việc khác']]},
    {id:'ev', type:'choice', q:'Chuyện gì đã xảy ra?', opts:[['quit','Nghỉ việc (hết hợp đồng)'],['move','Nghỉ nơi cũ và vào nơi mới'],['new','Ký thêm hợp đồng mới'],['org','Nơi làm đổi tên / địa chỉ / giải thể']]},
  ],
  calc:() => ({}),
  guide(a){
    const T = a.visa === 'tokutei', n = {quit:1, move:2, new:1, org:1}[a.ev] || 1;
    const head = {title: T && a.ev === 'move' ? '特定技能 chuyển nơi làm: phải xin 在留資格変更許可 trước' : `Báo 入管 trong 14 ngày (${n === 2 ? '2 việc: nghỉ nơi cũ + vào nơi mới' : '1 việc'})`,
      summary:'Người nộp là chính bạn. Không cần nộp giấy tờ chứng minh. Nộp online là tiện nhất.'};
    const quad = [{k:'Hạn', v:'14 ngày kể từ ngày xảy ra sự việc'}, {k:'Cách nộp', v:'Online (電子届出システム), tại quầy 入管, hoặc gửi bưu điện'}, {k:'Giấy tờ kèm', v:'Không cần'}, {k:'Quá hạn', v:'Có thể bị phạt đến 20万円', note:'Quá hạn vẫn phải nộp ngay.'}];
    const steps = [
      {t:'Chuẩn bị thông tin', d:'Ngày nghỉ / ngày vào, tên, địa chỉ cơ sở cũ và mới, số 在留カード.'},
      {t:'Nộp 届出', d:`Online tại <a href="${ISA}applications/procedures/nyuukokukanri10_00015.html" target="_blank" rel="noopener">trang 所属機関に関する届出</a>, hoặc in mẫu nộp ở quầy / gửi bưu điện (kèm bản sao 在留カード).`},
      {t:'Lưu lại bằng chứng', d:'Chụp màn hình hoặc giữ bản sao. Khi gia hạn sẽ cần.'}];
    if (n === 2) steps.splice(2, 0, {t:'Nộp đủ 2 nội dung', d:'Báo cả việc kết thúc hợp đồng cũ và việc ký hợp đồng mới (có thể nộp cùng lúc).'});
    const warns = [];
    if (a.visa === 'kaigo') warns.push('Lần gia hạn 介護 đầu tiên sau khi chuyển việc: phải nộp thêm giấy điều kiện lao động và tài liệu giới thiệu cơ sở mới. Xem thủ tục “Gia hạn visa 介護”.');
    if (T) warns.push('特定技能 đổi nơi làm: phải xin 在留資格変更許可 và được phép rồi mới được làm ở nơi mới. Nơi tiếp nhận cũng phải báo riêng (届出 của 特定技能所属機関) — việc của công ty.');
    if (a.ev === 'quit') warns.push('Nghỉ việc mà không có hoạt động theo tư cách hơn 3 tháng (không có lý do chính đáng) có thể bị hủy tư cách lưu trú. Cần xác nhận cho trường hợp của bạn.');
    const docs = [{t:'Thông tin cần có', items:[
      {jp:'在留カード', t:'Thẻ lưu trú (số thẻ)', d:'Nộp bưu điện thì kèm bản sao.'},
      {jp:'所属機関の名称・所在地', t:'Tên và địa chỉ nơi làm cũ / mới', where:'Hợp đồng, giấy báo nghỉ việc'},
      {jp:'年月日', t:'Ngày kết thúc / ngày bắt đầu hợp đồng'}]}];
    return {head, quad, notes:['Đối tượng: 高度専門職, 研究, 技術・人文知識・国際業務, 介護, 興行, 技能, 特定技能… (người có visa làm việc theo hợp đồng).', 'Không cần nộp giấy tờ chứng minh khi báo.'], steps, docs, warns};
  },
  fields:[],
  emptyFill:'Thủ tục này nộp online là nhanh nhất, không cần điền giấy. Link nộp ở bước 2.',
  sources:[
    {t:'所属（契約）機関に関する届出 (出入国在留管理庁)', u:ISA + 'applications/procedures/nyuukokukanri10_00015.html'},
    {t:'所属機関等に関する届出 Q&A (出入国在留管理庁)', u:ISA + 'applications/procedures/shozokunikansuru_00001.html'},
  ],
};
})();
