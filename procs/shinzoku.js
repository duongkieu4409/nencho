/* Visa thăm thân ngắn hạn (mời bố mẹ, người thân ở Việt Nam sang Nhật) — 短期滞在（親族訪問） */
(function(){
const M = 'https://www.mofa.go.jp/';
window.PROC = {
  id:'shinzoku', short:'Visa thăm thân', jpShort:'短期滞在（親族訪問）', kicker:'Visa thăm thân', title:'Mời bố mẹ, người thân sang thăm (visa ngắn hạn)', jp:'短期滞在査証（親族訪問）— 招へい理由書・滞在予定表・身元保証書',
  intro:'Bạn ở Nhật chuẩn bị giấy mời và giấy bảo lãnh, gửi về Việt Nam; người thân nộp hồ sơ xin visa tại Việt Nam.',
  formName:'giấy tờ', defaults:{rel:'parent', who:'self'},
  forms:{},
  questions:[
    {id:'rel', type:'choice', q:'Bạn mời ai?', opts:[['parent','Bố mẹ'],['sibling','Anh chị em'],['other','Họ hàng khác']], help:'Diện thăm thân (親族訪問) dành cho vợ/chồng, họ hàng trong phạm vi 3 đời (血族・姻族３親等内). Bạn bè, người quen dùng diện thăm người quen.'},
    {id:'who', type:'choice', q:'Ai đứng ra bảo lãnh (身元保証人)?', opts:[['self','Tôi (người mời)'],['other','Người khác ở Nhật']], help:'Người bảo lãnh cam kết chịu chi phí lưu trú, vé về và việc tuân thủ pháp luật của người sang.'},
  ],
  calc:() => ({}),
  guide(a){
    const facts = [
      {icon:'map', k:'Ai nộp, nộp ở đâu', v:'Người thân nộp hồ sơ tại Việt Nam: Đại sứ quán Nhật (Hà Nội), Tổng lãnh sự quán (TP.HCM, Đà Nẵng) hoặc nơi nhận hồ sơ được chỉ định.', note:'Cần xác nhận nơi nộp và thời gian xét trên trang Đại sứ quán Nhật tại Việt Nam.'},
      {icon:'info', k:'Bạn ở Nhật làm gì', v:'Chuẩn bị các giấy tờ “phía Nhật” (bên dưới) rồi gửi về cho người thân ở Việt Nam. <b>Không gửi cho Đại sứ quán hay 外務省.</b>', note:'Cần xác nhận: quy định này ghi ở hướng dẫn của các cơ quan đại diện Nhật; hãy kiểm tra lại với hướng dẫn cho người Việt Nam.'},
      {icon:'yen', k:'Phí visa', v:'Theo biểu phí của cơ quan đại diện Nhật tại Việt Nam.', note:'Cần xác nhận.'},
    ];
    const jpSide = [
      {jp:'招へい理由書（一次）', t:'Giấy giải thích lý do mời', d:'Theo mẫu 外務省 (bản dành cho người Việt Nam). Ghi mục đích, thời gian, quan hệ với người được mời.'},
      {jp:'滞在予定表', t:'Lịch trình lưu trú', d:'Theo mẫu 外務省: từng ngày ở đâu, làm gì, liên lạc, chỗ ở.'},
      {jp:'身元保証書', t:'Giấy bảo lãnh', d: a.who === 'other' ? 'Do người bảo lãnh ở Nhật viết và ký.' : 'Bạn viết và ký (bạn là người bảo lãnh).'},
      {jp:'住民票（世帯全員・続柄記載）', t:'Phiếu cư trú của người mời', d:'Loại ghi đầy đủ thành viên và quan hệ.', where:'区役所・市役所', warn:'Cần xác nhận yêu cầu chính xác theo hướng dẫn của Đại sứ quán.'},
      {jp:'在職証明書・課税証明書・納税証明書 等', t:'Giấy tờ chứng minh nghề nghiệp, thu nhập của người bảo lãnh', where:'Công ty / 区役所・市役所', warn:'Cần xác nhận loại giấy cụ thể (một số trường hợp dùng 預金残高証明書).'},
    ];
    const vnSide = [
      {jp:'査証申請書', t:'Đơn xin visa (có dán ảnh)', d:'Mẫu đơn xin visa của 外務省.'},
      {jp:'旅券', t:'Hộ chiếu của người sang'},
      {jp:'親族関係を証明する書類', t:'Giấy tờ chứng minh quan hệ họ hàng với người mời (giấy khai sinh…)', warn:'Cần xác nhận loại giấy và yêu cầu dịch thuật.'},
      {jp:'—', t:'Các giấy tờ khác theo yêu cầu của Đại sứ quán (ví dụ chứng minh tài chính, công việc của người sang)', warn:'Cần xác nhận theo hướng dẫn mới nhất.'},
    ];
    const who = {parent:'bố/mẹ', sibling:'anh chị em', other:'người thân'}[a.rel] || 'người thân';
    const head = {title:`Mời ${who} sang Nhật chơi`, summary:`Theo câu trả lời: bạn ở Nhật mời ${who} từ Việt Nam sang ngắn hạn (tối đa 90 ngày), ${a.who === 'other' ? 'người khác ở Nhật đứng ra bảo lãnh' : 'bạn đứng ra bảo lãnh'}.`};
    const quad = [
      {k:'Nơi nộp', v:'Cơ quan đại diện Nhật tại Việt Nam (hoặc nơi nhận hồ sơ được chỉ định)', note:'Cần xác nhận.'},
      {k:'Người nộp', v:`${who.charAt(0).toUpperCase() + who.slice(1)}, tại Việt Nam`},
      {k:'Thời gian xét', v:'Cần xác nhận', note:'Theo thông báo của Đại sứ quán / Tổng lãnh sự quán.'},
      {k:'Lệ phí', v:'Cần xác nhận'},
    ];
    return {head, quad, facts,
      steps:[
        {t:'Tải mẫu chính thức', d:`Trang 外務省 dành cho người Việt Nam (bản 7/4/2025): <a href="${M}mofaj/ca/fna/page23_002812.html" target="_blank" rel="noopener">ベトナム国籍の方が短期滞在を目的として日本へ渡航する場合</a>.`},
        {t:'Chuẩn bị giấy tờ phía Nhật', d:'招へい理由書, 滞在予定表, 身元保証書 và giấy tờ kèm theo.'},
        {t:'Gửi về Việt Nam', d:'Gửi bản gốc cho người thân (chuyển phát quốc tế).'},
        {t:'Người thân nộp hồ sơ tại Việt Nam', d:'Kèm hộ chiếu, đơn xin visa, ảnh và giấy tờ phía Việt Nam.'},
      ],
      docs:[{t:'Giấy tờ phía Nhật (bạn chuẩn bị)', items:jpSide}, {t:'Giấy tờ phía Việt Nam (người thân chuẩn bị)', items:vnSide}],
      warns:['Phần này đang chờ đối chiếu với tài liệu chính thức 「一次有効の短期滞在査証の申請」 của 外務省. Những mục ghi “Cần xác nhận” hãy kiểm tra lại trên trang Đại sứ quán / 外務省 trước khi gửi.']};
  },
  fields:[],
  emptyFill:'Phần hướng dẫn điền từng ô cho 招へい理由書・滞在予定表・身元保証書 đang được chuẩn bị từ mẫu chính thức của 外務省. Trong lúc chờ, bạn tải mẫu tại trang 外務省 (link ở phần “Xem hướng dẫn”).',
  sources:[
    {t:'ベトナム国籍の方が短期滞在を目的として日本へ渡航する場合 (外務省)', u:M + 'mofaj/ca/fna/page23_002812.html', d:'7/4/2025'},
    {t:'一次有効の短期滞在査証の申請 (PDF, 外務省)', u:M + 'mofaj/files/000472950.pdf'},
    {t:'招へい理由書（1次）', u:M + 'mofaj/files/000472928.pdf'}, {t:'滞在予定表', u:M + 'mofaj/files/000472934.pdf'}, {t:'身元保証書', u:M + 'mofaj/files/000472926.pdf'},
  ]
};
})();
