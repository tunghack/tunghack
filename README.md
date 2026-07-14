# Website Minh Sanh Đường

Trang web tĩnh cho phòng khám **Y học cổ truyền Minh Sanh Đường**, xây dựng bằng HTML + [Tailwind CSS](https://tailwindcss.com/). Có thể triển khai miễn phí trên **GitHub Pages**.

## Các trang

| Tệp | Nội dung |
|-----|----------|
| `index.html` | Trang chủ (hero, dịch vụ nổi bật, kêu gọi khai bệnh) |
| `gioi-thieu.html` | Giới thiệu phòng khám & đội ngũ |
| `dich-vu.html` | Danh sách dịch vụ điều trị |
| `khai-benh.html` | **Phiếu khai bệnh trực tuyến** (trang chính) |
| `lien-he.html` | Thông tin liên hệ & bản đồ |

## Cấu trúc thư mục

```
├── *.html                     # Các trang
├── src/input.css              # Nguồn Tailwind (chỉnh sửa ở đây)
├── assets/css/style.css       # CSS đã build (đừng sửa tay)
├── assets/js/main.js          # Menu di động, năm ở footer
├── assets/js/khai-benh.js     # Kiểm tra & gửi phiếu khai bệnh
├── assets/img/                # Logo, hình minh họa (SVG)
├── google-apps-script/Code.gs # Backend nhận phiếu (Sheet + Email)
├── tailwind.config.js
└── package.json
```

## Chạy & build

Cần cài [Node.js](https://nodejs.org/).

```bash
npm install       # cài Tailwind
npm run build     # tạo assets/css/style.css
npm run watch     # tự build lại khi sửa (khi phát triển)
npm run serve     # xem thử tại http://localhost:8080
```

> `assets/css/style.css` đã được commit sẵn nên GitHub Pages **không cần** bước build.
> Chỉ chạy `npm run build` lại sau khi bạn sửa `src/input.css` hoặc class trong HTML.

## Kết nối form với Google Sheet & Email

Phiếu khai bệnh gửi dữ liệu tới **một** Google Apps Script Web App, script này vừa **ghi vào Google Sheet** vừa **gửi email** cho phòng khám.

1. Tạo một **Google Sheet** mới.
2. Trong Sheet: **Extensions → Apps Script**.
3. Xóa nội dung mẫu, dán toàn bộ `google-apps-script/Code.gs` vào.
4. Sửa biến `CLINIC_EMAIL` thành email nhận thông báo của phòng khám.
5. **Deploy → New deployment → Web app**:
   - *Execute as*: **Me**
   - *Who has access*: **Anyone**
6. Copy đường dẫn **Web app URL**.
7. Mở `assets/js/khai-benh.js`, dán URL vào biến `APPS_SCRIPT_URL` ở đầu file.

Xong! Mỗi phiếu khai bệnh sẽ tự thêm một dòng trong Sheet và gửi email tới phòng khám.

## Đổi thương hiệu & nội dung

- **Nội dung cần điền**: tìm các đoạn đánh dấu `[[ ... ]]` trong các tệp `.html` (tên phòng khám, địa chỉ, số điện thoại, giá dịch vụ, giới thiệu...) và thay bằng thông tin thật.
- **Màu sắc**: sửa bảng màu `brand` / `accent` trong `tailwind.config.js`, rồi chạy `npm run build`.
- **Logo & hình**: thay các tệp trong `assets/img/`.
- **Bản đồ**: trong `lien-he.html`, thay khối placeholder bằng mã nhúng `<iframe>` Google Maps.

## Triển khai lên GitHub Pages

1. Push toàn bộ mã lên GitHub.
2. Repo → **Settings → Pages** → chọn nhánh và thư mục `/root` → **Save**.
3. Truy cập đường dẫn GitHub Pages cung cấp.

Tệp `.nojekyll` đã có sẵn để GitHub Pages phục vụ file nguyên trạng.
