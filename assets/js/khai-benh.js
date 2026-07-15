// Patient intake form: validation + submission to a Google Apps Script Web App
// that both appends a row to a Google Sheet and emails the clinic.
(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // 1) Paste the Web App URL you get after deploying google-apps-script/Code.gs.
  //    See README.md → "Kết nối form với Google Sheet & Email".
  // ---------------------------------------------------------------------------
  var APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxonomBnCFFloIV539uxcdjqDTmIpArOYjiQA2DkUC7gsvG_0YM6zBH8jayFVeI7O1VlQ/exec';

  var form = document.getElementById('khai-benh-form');
  if (!form) return;

  var statusBox = document.getElementById('form-status');
  var submitBtn = document.getElementById('submit-btn');

  function showStatus(type, message) {
    if (!statusBox) return;
    var styles = {
      success: 'bg-green-50 text-green-800 ring-green-200',
      error: 'bg-red-50 text-red-800 ring-red-200',
      info: 'bg-brand-50 text-brand-800 ring-brand-200',
    };
    statusBox.className =
      'mb-6 rounded-lg px-4 py-3 text-sm ring-1 ' + (styles[type] || styles.info);
    statusBox.textContent = message;
    statusBox.classList.remove('hidden');
    statusBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function validate() {
    var valid = true;
    form.querySelectorAll('[required]').forEach(function (el) {
      var empty = !el.value || (el.type === 'checkbox' && !el.checked);
      el.classList.toggle('invalid', empty);
      if (empty) valid = false;
    });
    // Basic phone sanity check (Vietnamese numbers).
    var phone = form.querySelector('[name="so_dien_thoai"]');
    if (phone && phone.value && !/^[0-9+\s().-]{8,15}$/.test(phone.value.trim())) {
      phone.classList.add('invalid');
      valid = false;
    }
    return valid;
  }

  // Clear the invalid state as the user fixes a field.
  form.addEventListener('input', function (e) {
    if (e.target.classList.contains('invalid')) {
      e.target.classList.remove('invalid');
    }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    if (!validate()) {
      showStatus('error', 'Vui lòng điền đầy đủ các trường bắt buộc (đánh dấu *).');
      return;
    }

    if (APPS_SCRIPT_URL.indexOf('PASTE_YOUR') === 0) {
      showStatus(
        'info',
        'Form chưa được cấu hình gửi dữ liệu. Quản trị viên cần dán URL Google Apps Script vào assets/js/khai-benh.js.'
      );
      return;
    }

    var data = new FormData(form);
    data.append('trang_gui', window.location.href);

    submitBtn.disabled = true;
    submitBtn.textContent = 'Đang gửi...';
    showStatus('info', 'Đang gửi thông tin khai bệnh, vui lòng chờ...');

    // Apps Script doesn't send CORS headers, so we can't read the response.
    // 'no-cors' still delivers the POST (the script runs and emails); we treat
    // a resolved fetch as success. A network failure rejects -> error message.
    fetch(APPS_SCRIPT_URL, { method: 'POST', body: data, mode: 'no-cors' })
      .then(function () {
        form.reset();
        showStatus(
          'success',
          'Cảm ơn bạn! Thông tin khai bệnh đã được gửi. Phòng khám sẽ liên hệ lại trong thời gian sớm nhất.'
        );
      })
      .catch(function () {
        showStatus(
          'error',
          'Rất tiếc, gửi thông tin không thành công. Vui lòng thử lại hoặc gọi trực tiếp cho phòng khám.'
        );
      })
      .finally(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Gửi khai bệnh';
      });
  });
})();
