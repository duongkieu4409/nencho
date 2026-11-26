/* Làm thêm theo từng loại visa — 副業・資格外活動（chỉ hướng dẫn） */
(function(){
const ISA = 'https://www.moj.go.jp/isa/';
const SRC = {
  ryu:{t:'「留学」の資格外活動許可 (出入国在留管理庁)', u:ISA + 'applications/procedures/nyuukokukanri07_00003.html'},
  kaz:{t:'「家族滞在」の資格外活動許可 (出入国在留管理庁)', u:ISA + 'applications/procedures/nyuukokukanri07_00004.html'},
  sgk:{t:'資格外活動許可について (出入国在留管理庁)', u:ISA + 'applications/procedures/nyuukokukanri07_00045.html'},
  ssw:{t:'特定技能制度に関するＱ＆Ａ (出入国在留管理庁)', u:ISA + 'policies/ssw/faq.html'},
  kg:{t:'在留資格「介護」 (出入国在留管理庁)', u:ISA + 'applications/status/nursingcare.html'},
  tax:{t:'給与所得者で確定申告が必要な人 (国税庁 No.1900)', u:'https://www.nta.go.jp/taxes/shiraberu/taxanswer/shotoku/1900.htm'},
};
const V = {kaigo:'介護', tokutei:'特定技能1号', ryugaku:'留学 (du học)', kazoku:'家族滞在', gijinkoku:'技術・人文知識・国際業務'};
window.PROC = {
  id:'fukugyo', short:'Làm thêm theo visa', jpShort:'副業・資格外活動', kicker:'Làm thêm', title:'Luật làm thêm với từng loại visa', jp:'副業・アルバイトと資格外活動許可',
  intro:'Visa của bạn được làm thêm gì, bao nhiêu giờ, có cần xin phép không.',
  formName:'giấy tờ', defaults:{visa:'kaigo', job:'same'}, forms:{},
  questions:[
    {id:'visa', type:'choice', q:'Bạn đang có visa (tư cách lưu trú) gì?', help:'Xem dòng 在留資格 trên 在留カード.', opts:Object.entries(V)},
    {id:'job', type:'choice', q:'Việc làm thêm là việc gì?', show:a => a.visa === 'kaigo' || a.visa === 'gijinkoku', help:'Cùng loại: ví dụ đang làm 介護, làm thêm 介護 ở cơ sở khác. Khác loại: ví dụ làm ở cửa hàng tiện lợi, nhà hàng.', opts:[['same','Cùng loại công việc chính'],['diff','Việc khác loại']]},
  ],
  calc:() => ({}),
  guide(a){
    const v = a.visa, items = [], warns = [];
    let title, summary, quad, src;
    if (v === 'ryugaku' || v === 'kazoku'){
      title = `${V[v]}: được làm thêm tối đa 28 giờ/tuần, phải có 資格外活動許可`;
      summary = 'Trước khi đi làm thêm phải xin 資格外活動許可 (giấy phép hoạt động ngoài tư cách).';
      quad = [{k:'Giờ làm tối đa', v: v === 'ryugaku' ? '28 giờ/tuần; kỳ nghỉ dài của trường: 8 giờ/ngày' : '28 giờ/tuần (cộng tất cả nơi làm)'},
        {k:'Giấy phép', v:'資格外活動許可 (包括許可)'}, {k:'Nộp ở đâu', v:'地方出入国在留管理官署 nơi bạn ở'}, {k:'Lệ phí', v:'Không mất phí', note:'Cần xác nhận.'}];
      items.push(['Tính 28 giờ cho mọi tuần, bắt đầu đếm từ ngày nào cũng không được vượt.','ok'], ['Cộng giờ của tất cả nơi làm thêm.','ok'],
        ['Không được làm ở cơ sở 風俗営業 (quán bar tiếp khách…).','ok']);
      if (v === 'ryugaku') items.push(['Đã tốt nghiệp (hết tư cách học sinh) thì không được làm thêm nữa.','ok']);
      if (v === 'kazoku') items.push(['Từ 1/10/2026, người 家族滞在 có thể làm ở tiệm pachinko… nếu xin giấy phép riêng (個別許可).','ok']);
      warns.push('Làm quá giờ có thể bị từ chối khi gia hạn visa.');
      src = [v === 'ryugaku' ? SRC.ryu : SRC.kaz, SRC.sgk];
    } else if (v === 'tokutei'){
      title = '特定技能1号: không được làm thêm ở công ty khác';
      summary = '特定技能 phải làm toàn thời gian cho đúng 1 nơi tiếp nhận (特定技能所属機関).';
      quad = [{k:'Làm thêm nơi khác', v:'Không được'}, {k:'資格外活動許可', v:'Không áp dụng cho 特定技能'}, {k:'Muốn đổi nơi làm', v:'Phải xin 在留資格変更許可'}, {k:'Hỏi', v:'0570-013904'}];
      items.push(['Q&A của 入管: làm thêm ở công ty khác — “không được”.','ok'], ['Việc phụ liên quan ở chính nơi tiếp nhận (việc người Nhật cùng vị trí thường làm) thì được.','ok'],
        ['資格外活動許可 không áp dụng cho 特定技能 và 技能実習.','ok']);
      src = [SRC.ssw, SRC.sgk];
    } else {
      const same = a.job !== 'diff';
      title = same ? `${V[v]}: làm thêm cùng loại việc ở nơi khác — Cần xác nhận` : `${V[v]}: việc khác loại phải có 資格外活動許可`;
      summary = same ? 'Việc nằm trong phạm vi tư cách (ví dụ 介護 ở cơ sở khác) thường không cần xin phép riêng, nhưng nên hỏi 入管 trước khi ký hợp đồng thứ 2.' : 'Việc ngoài phạm vi tư cách (cửa hàng, nhà hàng…) phải xin 資格外活動許可 (個別許可) trước khi làm.';
      quad = [{k:'Giấy phép', v: same ? 'Cần xác nhận' : '資格外活動許可 (個別)'}, {k:'Báo 入管', v: same ? 'Có thể cần 所属機関に関する届出 (14 ngày)' : '—', note: same ? 'Cần xác nhận.' : ''}, {k:'Thuế', v:'Thu nhập phụ trên 20万円/năm → 確定申告'}, {k:'Hỏi', v:'0570-013904'}];
      items.push(v === 'kaigo' ? ['Tư cách 「介護」: làm 介護 hoặc hướng dẫn 介護 theo hợp đồng với cơ sở ở Nhật, phải có 介護福祉士.','ok'] : ['Tư cách lưu trú quy định loại công việc được làm.','ok'],
        same ? ['Làm cùng loại việc ở nơi thứ 2 có cần xin phép hay báo 入管 không: hãy hỏi 入管 trước.','cx'] : ['Việc ngoài phạm vi tư cách phải có 資格外活動許可 trước khi bắt đầu.','ok'],
        ['Lương từ 2 nơi: nơi phụ trên 20万円/năm thì phải tự khai thuế (確定申告).','ok']);
      src = [v === 'kaigo' ? SRC.kg : SRC.sgk, SRC.sgk, SRC.tax];
    }
    const steps = (v === 'ryugaku' || v === 'kazoku') ? [
      {t:'Xin 資格外活動許可', d:'Nộp đơn tại 入管 nơi bạn ở (hoặc online). Du học sinh mới nhập cảnh có thể xin ngay ở sân bay.'},
      {t:'Nhận giấy phép', d:'Được ghi ở mặt sau 在留カード (資格外活動許可欄).'},
      {t:'Đi làm', d:'Ghi lại giờ làm mỗi tuần để không vượt 28 giờ.'}] : v === 'tokutei' ? [
      {t:'Không nhận làm thêm ở nơi khác', d:'Kể cả làm cuối tuần.'},
      {t:'Muốn chuyển nơi làm', d:'Phải xin 在留資格変更許可 trước khi làm ở nơi mới.'}] : [
      {t:'Hỏi 入管 trước khi ký hợp đồng thứ 2', d:'Gọi 0570-013904 (có tiếng Việt), nói rõ tư cách và việc định làm.'},
      {t:'Xin giấy phép nếu cần', d:'Việc ngoài phạm vi tư cách: 資格外活動許可 (個別許可).'},
      {t:'Khai thuế', d:'Đầu năm sau làm 確定申告 nếu lương nơi phụ trên 20万円.'}];
    const docs = (v === 'ryugaku' || v === 'kazoku' || (v !== 'tokutei' && a.job === 'diff')) ? [{t:'Hồ sơ xin 資格外活動許可', items:[
      {jp:'資格外活動許可申請書', t:'Đơn xin phép hoạt động ngoài tư cách', d:'Mẫu dùng chung cho 包括 và 個別.'},
      {jp:'活動内容を明らかにする書類', t:'Giấy tờ về công việc làm thêm (nội dung, giờ làm, lương)', where:'Nơi làm thêm', warn: v === 'ryugaku' || v === 'kazoku' ? '' : 'Cần xác nhận theo hướng dẫn mới nhất.'},
      {jp:'パスポート・在留カード', t:'Hộ chiếu và thẻ lưu trú', d:'Xuất trình.'}]}] : [];
    return {head:{title, summary}, quad, notes: items.map(([t, k]) => t + (k === 'cx' ? ' (Cần xác nhận)' : '')), steps, docs, warns, srcList: src};
  },
  fields:[],
  emptyFill:'Thủ tục này chỉ có phần hướng dẫn. Đơn 資格外活動許可申請書 tải ở trang 入管 (link trong phần nguồn).',
  sources:[SRC.sgk, SRC.ryu, SRC.kaz, SRC.ssw, SRC.kg, SRC.tax],
};
})();
