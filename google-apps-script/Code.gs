/**
 * YHCT Tâm Đức — nhận dữ liệu từ phiếu "Khai bệnh".
 *
 * Chức năng: mỗi lần bệnh nhân gửi phiếu, script sẽ
 *   1) ghi một dòng mới vào Google Sheet, và
 *   2) gửi email thông báo cho phòng khám.
 *
 * CÁCH CÀI ĐẶT (xem thêm README.md):
 *   1. Tạo một Google Sheet mới.
 *   2. Extensions → Apps Script, dán toàn bộ file này vào.
 *   3. Sửa CLINIC_EMAIL bên dưới thành email nhận thông báo.
 *   4. Deploy → New deployment → Web app:
 *        - Execute as: Me
 *        - Who has access: Anyone
 *   5. Copy URL "Web app" và dán vào assets/js/khai-benh.js (APPS_SCRIPT_URL).
 */

// Email nhận thông báo khai bệnh — ĐỔI thành email thật của phòng khám.
var CLINIC_EMAIL = 'email@phongkham.vn';

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
  try {
    var params = (e && e.parameter) ? e.parameter : {};
    var now = new Date();

    saveToSheet_(params, now);
    sendEmail_(params, now);

    return jsonOut_({ ok: true });
  } catch (err) {
    return jsonOut_({ ok: false, error: String(err) });
  }
}

// Cho phép mở URL trên trình duyệt để kiểm tra nhanh.
function doGet() {
  return jsonOut_({ ok: true, message: 'YHCT Tam Duc khai-benh endpoint is running.' });
}

function saveToSheet_(params, now) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
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
