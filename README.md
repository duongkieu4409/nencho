# Thủ tục ở Nhật — hướng dẫn cho người Việt

Web app giúp người Việt tại Nhật làm các thủ tục thường gặp, từng ô trên mẫu chính thức:

- 年末調整 令和8年分 (nenmatsu.html)
- 確定申告 令和8年分 — 申告書 第一表 (kakutei.html)
- Gia hạn / đổi tư cách lưu trú — 技術・人文知識・国際業務 (zairyu.html)
- Visa gia đình 家族滞在 — 在留資格認定証明書 (kazoku.html)
- Visa thăm thân 短期滞在（親族訪問）— hướng dẫn giấy tờ (shinzoku.html)
- Ông bà sang chăm cháu — 特定活動（高度専門職外国人の親）hoặc 短期滞在 (mago.html)
- Thanh tab chính: Trang chủ · Visa · Kaigo · Thuế · Gia đình · Đời sống; mỗi nhóm có tab phụ để lọc (visa.html, kaigo.html, thue.html, giadinh.html, doisong.html)
- Gia hạn / đổi sang visa 介護 (zairyu.html, dùng chung mẫu đơn với 技人国)
- Luật làm thêm theo từng loại visa (fukugyo.html) · Chuyển cơ sở làm việc, báo 入管 trong 14 ngày (shozoku.html)
- Sửa trang: sửa dữ liệu trong tools/build.py rồi chạy `python3 tools/build.py`
- Nút “Hỏi đáp” trên mọi trang: kho câu hỏi soạn sẵn có nguồn, chạy trên máy, không gửi dữ liệu (assets/faq-data.js, assets/faq.js)

Phần 年末調整 gồm các tờ:

1. 給与所得者の扶養控除等（異動）申告書
2. 給与所得者の基礎控除申告書 兼 配偶者控除等申告書 兼 特定親族特別控除申告書 兼 所得金額調整控除申告書
3. 給与所得者の保険料控除申告書
4. 給与所得者の住宅借入金等特別控除申告書

- Không cần đăng nhập, không có máy chủ: mọi câu trả lời chỉ lưu trong trình duyệt của người dùng.
- Cài được lên màn hình chính như app (PWA) và dùng khi không có mạng.
- Số liệu theo 国税庁「令和8年分 年末調整のしかた」. Ảnh mẫu giấy: 国税庁, 出入国在留管理庁. Dữ liệu mã bưu điện: YubinBango (dựa trên 日本郵便). Icon: Lucide.

App chỉ là công cụ hỗ trợ. Mục ghi “Cần xác nhận” hãy hỏi công ty hoặc 税務署.
