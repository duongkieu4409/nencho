"""Sinh các trang HTML (trang chủ, trang nhóm, trang thủ tục) và chèn thanh tab vào nenmatsu.html.
Chạy:  python3 tools/build.py   (từ thư mục app)"""
import re, time, html
V = str(int(time.time()))
E = html.escape

# Thủ tục: key -> (link, chữ Hán, tên VN, tên JP, mô tả, loại: fill|guide|open)
P = {
 'nenmatsu':('nenmatsu.html','税','Điều chỉnh thuế cuối năm','年末調整（会社経由）','4 tờ khai công ty phát vào tháng 11–12.','open'),
 'kakutei':('kakutei.html','申','Tự khai thuế','確定申告（税務署）','Làm thêm, năm đầu vay nhà, chi phí y tế, nghỉ việc giữa năm, hoàn thuế…','fill'),
 'zairyu':('zairyu.html','更','Gia hạn / đổi tư cách lưu trú','在留期間更新・在留資格変更','Gia hạn visa đang có, hoặc đổi sang loại visa khác (du học → đi làm…).','fill'),
 'shinzoku':('shinzoku.html','訪','Visa thăm thân','短期滞在（親族訪問）','Mời bố mẹ, người thân ở Việt Nam sang chơi tối đa 90 ngày.','guide'),
 'kazoku':('kazoku.html','家','Visa gia đình','家族滞在（在留資格認定証明書）','Đón vợ/chồng, con sang Nhật ở cùng lâu dài.','fill'),
 'mago':('mago.html','孫','Ông bà sang chăm cháu','特定活動・短期滞在','Ông bà ở Việt Nam sang giúp chăm cháu: hướng nào hợp pháp, ở được bao lâu.','fill'),
 'kg-koshin':('zairyu.html?set=kind:koshin,target:kaigo','介','Gia hạn visa 介護','在留期間更新許可申請（介護）','Giấy tờ cần chuẩn bị, điền tờ khai, nộp ở 入管.','fill'),
 'kg-henko':('zairyu.html?set=kind:henko,target:kaigo','変','Đổi từ 特定技能 / du học sang visa 介護','在留資格変更許可申請（介護）','Sau khi đỗ 介護福祉士 hoặc tốt nghiệp trường điều dưỡng.','fill'),
 'kg-nenmatsu':('nenmatsu.html','税','年末調整 cho người làm kaigo','年末調整','4 tờ khai cơ sở phát tháng 11–12, có người phụ thuộc ở Việt Nam.','open'),
 'kg-kakutei':('kakutei.html','申','確定申告 khi làm thêm ở cơ sở khác','確定申告','Làm 2 nơi, lương nơi phụ trên 20万円, hoàn thuế người phụ thuộc.','fill'),
 'fukugyo':('fukugyo.html','副','Luật làm thêm với từng loại visa','副業・資格外活動','Visa 介護, 特定技能, du học, 家族滞在 được làm thêm gì, bao nhiêu giờ.','guide'),
 'shozoku':('shozoku.html','届','Chuyển cơ sở làm việc','所属機関に関する届出','Báo 入管 trong 14 ngày khi nghỉ / vào nơi làm mới.','guide'),
}
# Nhóm (tab chính): key -> (chữ, tên, tiêu đề, mô tả, [(tab phụ, [thủ tục])], ghi chú)
G = {
 'visa':('証','Visa','Visa và lưu trú','Gia hạn, đổi tư cách, đón người thân sang Nhật, làm thêm và chuyển việc.',
   [('Gia hạn / đổi',['zairyu','kg-koshin','kg-henko']),('Mời người thân',['shinzoku','kazoku','mago']),('Làm thêm & chuyển việc',['fukugyo','shozoku'])]),
 'kaigo':('介','Kaigo','Kaigo (介護)','Mọi thủ tục cho người làm điều dưỡng: visa 介護, thuế, làm thêm, chuyển cơ sở.',
   [('Visa 介護',['kg-koshin','kg-henko']),('Thuế',['kg-nenmatsu','kg-kakutei']),('Làm thêm',['fukugyo']),('Chuyển việc',['shozoku'])]),
 'thue':('税','Thuế','Thuế','Quyết toán thuế qua công ty và tự khai thuế.',
   [('Qua công ty',['nenmatsu']),('Tự khai',['kakutei'])]),
 'giadinh':('家','Gia đình','Gia đình','Đón vợ/chồng, con sang ở cùng; mời bố mẹ, ông bà sang thăm hoặc chăm cháu.',
   [('Vợ/chồng, con',['kazoku']),('Bố mẹ, ông bà',['shinzoku','mago'])]),
 'doisong':('生','Đời sống','Đời sống','Chuyển nhà, bảo hiểm, lương hưu, giấy tờ ở 区役所…', []),
}
FILE = {'visa':'visa.html','kaigo':'kaigo.html','thue':'thue.html','giadinh':'giadinh.html','doisong':'doisong.html'}
PAGES = {'kakutei':'Tự khai thuế 確定申告 2026','zairyu':'Gia hạn / đổi tư cách lưu trú','kazoku':'Visa gia đình 家族滞在','shinzoku':'Visa thăm thân','mago':'Ông bà sang chăm cháu','fukugyo':'Luật làm thêm với từng loại visa','shozoku':'Chuyển cơ sở làm việc'}

# Nhóm chính của từng trang (tô khi mở thẳng trang, không đi qua trang nhóm)
MAIN = {'kakutei':'thue','nenmatsu':'thue','zairyu':'visa','shinzoku':'visa','kazoku':'giadinh','mago':'giadinh','fukugyo':'visa','shozoku':'visa'}
def groups_of(href):
    base = href.split('?')[0]
    return [g for g, d in G.items() if any(P[k][0].split('?')[0] == base for _, ks in d[4] for k in ks)]

def tabbar():
    t = '<a href="./" data-g="home"><i><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/><path d="M9.5 21v-6h5v6"/></svg></i>Trang chủ</a>' + ''.join(f'<a href="{FILE[g]}" data-g="{g}"><i>{d[0]}</i>{d[1]}</a>' for g, d in G.items())
    return f'<nav class="mt no-print" aria-label="Nhóm thủ tục">{t}</nav>'

def card(k, subs='', label=''):
    h, ic, t, j, d, kind = P[k]
    tags = (f'<span class="tg">{E(label)}</span>' if label else '') + {'fill':'<span class="tg f">Hướng dẫn + điền giấy</span>','guide':'<span class="tg s">Chỉ hướng dẫn</span>','open':'<span class="tg f">Đang mở</span>'}[kind]
    return f'<a class="pcard" href="{h}" data-sub="{subs}"><span class="ic">{ic}</span><b>{E(t)}</b><span class="jp">{E(j)}</span><p>{E(d)}</p><span class="meta">{tags}</span></a>'

HEAD = open('tools/head.html').read()
def page(name, title, desc, main, scripts, body):
    open(name, 'w').write(HEAD.format(title=E(title), desc=E(desc), back='', tabs=tabbar(), main=main, scripts=scripts, V=V, body=body))

# Trang chủ
home_keys = ['nenmatsu','kakutei','zairyu','shinzoku','kazoku','mago','fukugyo','shozoku']
grid = ''.join(card(k) for k in home_keys)
page('index.html', 'Thủ tục ở Nhật — hướng dẫn cho người Việt', 'Hướng dẫn người Việt tại Nhật: thuế, visa, kaigo, gia đình.',
     f'<section class="card"><h1>Bạn cần làm <span class="g">thủ tục gì</span>?</h1><p class="lead">Chọn nhóm ở thanh trên, hoặc chọn thủ tục bên dưới. Mỗi thủ tục có phần hướng dẫn, nhiều thủ tục có thêm phần điền giấy rồi in.</p></section><div class="pgrid">{grid}</div>',
     '<script>window.QA_TOPIC="general"</script>', 'class="home-page" data-g="home"')

# Trang nhóm
for g, (ic, nm, title, desc, subs) in G.items():
    if subs:
        order, seen = [], {}
        for i, (sn, ks) in enumerate(subs):
            for k in ks:
                seen.setdefault(k, []).append(f's{i}')
                if k not in order: order.append(k)
        first = {k: next(sn for sn, ks in subs if k in ks) for k in order}
        sb = '<button type="button" class="on" data-sub="all" aria-pressed="true">Tất cả</button>' + ''.join(f'<button type="button" data-sub="s{i}" aria-pressed="false">{E(sn)}</button>' for i, (sn, _) in enumerate(subs))
        body = f'<div class="sub" role="group" aria-label="Lọc">{sb}</div><div class="pgrid">' + ''.join(card(k, ' '.join(seen[k]), first[k]) for k in order) + '</div>'
        multi = [P[k][2] for k in order if len(groups_of(P[k][0])) > 1][:2]
        body += f'<div class="also">Một thủ tục có thể nằm ở nhiều nhóm. Ví dụ <b>{E(multi[0])}</b> cũng có ở nhóm khác.</div>' if multi else ''
    else:
        body = '<div class="soon"><b>Sắp có</b><p class="small">Nhóm này đang được chuẩn bị. Trong lúc chờ, bạn có thể bấm “Hỏi đáp” ở góc dưới.</p></div>'
    page(FILE[g], f'{title} — Thủ tục ở Nhật', desc, f'<section class="ghead"><h1>{E(title)}</h1><p>{E(desc)}</p></section>{body}',
         f'<script>window.QA_TOPIC="{"kaigo" if g == "kaigo" else "general"}"</script>', f'class="home-page" data-g="{g}"')

# Trang thủ tục
for k, t in PAGES.items():
    gs = groups_of(k + '.html'); gs.sort(key=lambda g: g != MAIN.get(k)); ins = ' '.join(gs)
    page(k + '.html', t + ' — Thủ tục ở Nhật', t, '', f'<script src="procs/{k}.js?v={V}"></script>\n<script src="assets/proc.js?v={V}"></script>', f'class="proc-page" data-p="{k}" data-in="{ins}"')

# nenmatsu.html: chèn / cập nhật thanh tab + CSS + script
s = open('nenmatsu.html').read()
css = open('assets/app.css').read(); tcss = css[css.index('/* Tab chính / tab phụ */'):]
s = re.sub(r'\n/\* Tab chính / tab phụ \*/.*?(?=</style>)', '', s, count=1, flags=re.S)
s = s.replace('</style>', '\n' + tcss + '\n</style>', 1)
s = re.sub(r'<nav class="mt no-print".*?</nav>\n?', '', s, flags=re.S)
s = s.replace('</header>', '</header>\n' + tabbar() + '\n', 1)
s = re.sub(r'<body([^>]*)>', lambda m: m.group(0) if 'data-p=' in m.group(0) else f'<body{m.group(1)} data-p="nenmatsu" data-in="{" ".join(sorted(groups_of("nenmatsu.html"), key=lambda g: g != MAIN["nenmatsu"]))}">', s, count=1)
s = re.sub(r'\?v=\d+', f'?v={V}', s)
if 'assets/tabs.js' not in s: s = s.replace('<script src="assets/faq.js', f'<script src="assets/tabs.js?v={V}"></script>\n<script src="assets/faq.js', 1)
open('nenmatsu.html', 'w').write(s)
print('ok', V)
