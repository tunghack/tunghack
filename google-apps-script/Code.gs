/**
 * Minh Sanh Đường — nhận dữ liệu từ phiếu "Khai bệnh".
 *
 * Chức năng: mỗi lần bệnh nhân gửi phiếu, script sẽ
 *   1) gửi email thông báo cho phòng khám (LUÔN chạy), và
 *   2) ghi một dòng vào Google Sheet (CHỈ khi script gắn với một Sheet).
 *
 * => Có thể dùng CHỈ EMAIL, chưa cần Google Sheet:
 *    tạo script độc lập tại https://script.google.com (New project),
 *    dán file này vào và deploy — email vẫn hoạt động, phần Sheet tự bỏ qua.
 *    Khi nào muốn lưu Sheet, chỉ cần tạo script này từ trong một Google Sheet
 *    (Extensions → Apps Script) là dòng dữ liệu sẽ được ghi tự động.
 *
 * CÁCH CÀI ĐẶT (xem thêm README.md):
 *   1. Chỉ email: vào https://script.google.com → New project.
 *      (Hoặc kèm Sheet: mở Google Sheet → Extensions → Apps Script.)
 *   2. Dán toàn bộ file này vào, xóa nội dung mẫu.
 *   3. Kiểm tra CLINIC_EMAIL bên dưới là email nhận thông báo.
 *   4. Deploy → New deployment → Web app:
 *        - Execute as: Me
 *        - Who has access: Anyone
 *      Chấp nhận cấp quyền gửi email khi được hỏi.
 *   5. Copy URL "Web app" và dán vào assets/js/khai-benh.js (APPS_SCRIPT_URL).
 */

// Email nhận thông báo khai bệnh — ĐỔI thành email thật của phòng khám.
var CLINIC_EMAIL = 'tuminhcyk@gmail.com';

// Tên tab (sheet) sẽ lưu dữ liệu. Script tự tạo nếu chưa có.
var SHEET_NAME = 'KhaiBenh';

// Thứ tự cột lưu vào Sheet. Trùng với thuộc tính "name" trong form.
var FIELDS = [
  'ho_ten', 'so_dien_thoai', 'gioi_tinh', 'ngay_sinh', 'email', 'nghe_nghiep', 'dia_chi',
  'trieu_chung', 'thoi_gian_mac', 'muc_do',
  'tien_su', 'di_ung', 'thuoc_dang_dung',
  'an_uong', 'giac_ngu', 'dai_tieu_tien', 'mo_hoi', 'han_nhiet',
  'mo_ta_them', 'ngay_hen', 'gio_hen', 'trang_gui'
];

var LABELS = {
  ho_ten: 'Họ và tên', so_dien_thoai: 'Số điện thoại', gioi_tinh: 'Giới tính',
  ngay_sinh: 'Ngày sinh', email: 'Email', nghe_nghiep: 'Nghề nghiệp', dia_chi: 'Địa chỉ',
  trieu_chung: 'Triệu chứng chính', thoi_gian_mac: 'Thời gian mắc bệnh', muc_do: 'Mức độ',
  tien_su: 'Tiền sử bệnh', di_ung: 'Dị ứng', thuoc_dang_dung: 'Thuốc đang dùng',
  an_uong: 'Ăn uống', giac_ngu: 'Giấc ngủ', dai_tieu_tien: 'Đại/tiểu tiện',
  mo_hoi: 'Mồ hôi', han_nhiet: 'Hàn/nhiệt', mo_ta_them: 'Mô tả thêm',
  ngay_hen: 'Ngày hẹn', gio_hen: 'Giờ hẹn', trang_gui: 'Trang gửi'
};

function doPost(e) {
  var params = (e && e.parameter) ? e.parameter : {};
  var now = new Date();
  var result = { ok: true, emailed: false, saved: false };

  // 1) Gửi email trước — hoạt động kể cả khi chưa gắn Google Sheet.
  try {
    sendEmail_(params, now);
    result.emailed = true;
  } catch (err) {
    result.ok = false;
    result.emailError = String(err);
  }

  // 2) Ghi vào Sheet nếu script được gắn với một Google Sheet.
  try {
    if (SpreadsheetApp.getActiveSpreadsheet()) {
      saveToSheet_(params, now);
      result.saved = true;
    }
  } catch (err) {
    result.saveError = String(err);
  }

  return jsonOut_(result);
}

// Cho phép mở URL trên trình duyệt để kiểm tra nhanh.
function doGet() {
  return jsonOut_({ ok: true, message: 'Minh Sanh Duong khai-benh endpoint is running.' });
}

function saveToSheet_(params, now) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) return; // Chưa gắn Sheet — bỏ qua, chỉ gửi email.
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['Thời gian'].concat(FIELDS.map(function (f) { return LABELS[f] || f; })));
  }
  var row = [now].concat(FIELDS.map(function (f) { return params[f] || ''; }));
  sheet.appendRow(row);
}

function sendEmail_(params, now) {
  if (!CLINIC_EMAIL || CLINIC_EMAIL.indexOf('phongkham.vn') !== -1) {
    // Chưa cấu hình email thật — bỏ qua để tránh lỗi.
    return;
  }
  var lines = FIELDS.map(function (f) {
    return (LABELS[f] || f) + ': ' + (params[f] || '—');
  });
  var subject = 'Khai bệnh mới: ' + (params.ho_ten || 'Không rõ tên');
  var body = 'Phiếu khai bệnh gửi lúc ' + now + '\n\n' + lines.join('\n');
  MailApp.sendEmail({
    to: CLINIC_EMAIL,
    subject: subject,
    body: body,
    replyTo: params.email || CLINIC_EMAIL
  });
}

function jsonOut_(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
