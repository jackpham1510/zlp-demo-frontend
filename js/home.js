import QRCode from 'qrcode';
import { ZaloPay } from './zalopay';

const qrCanvas = document.querySelector('#qrcode');
const $qrContainer = $('#qrcontainer');
const $amount = $('#amount');
const $description = $('#description');
const $paymentCode = $('#paymentcode');
const $bankcode = $('#bankcode');
const $loading = $('#loading');
const $web2appLink = $('#web2app-link');

ZaloPay.getbanklist(function (banklist) {
  banklist.forEach(bank => {
    $bankcode.append(`
      <option value="${bank.bankcode}">${bank.name}</option>
    `);
  });
});

function showQR(text) {
  $qrContainer.removeClass('d-none');
  QRCode.toCanvas(qrCanvas, text);  
}

function hideQR() {
  $qrContainer.addClass('d-none');
}

function showLoading() {
  $loading.css('display', 'flex');
}

function hideLoading() {
  $loading.css('display', 'none');
}

$('#myForm').submit((e) => {
  e.preventDefault();
  
  if ($amount.val() < 1000) {
    alert('Số tiền tối thiểu là 1000 VNĐ');
    return;
  }
  
  const activeTab = $('#myTab .nav-link.active').attr('id');
  let order = {
    description: $description.val(),
    amount: $amount.val()
  }

  switch(activeTab) {
    case 'qr-tab':
      ZaloPay.qr(order, res => {
        showQR(res.orderurl);
        $web2appLink.attr('href', res.orderurl);
        ZaloPay.listenCallback(res.apptransid, hideQR);
      });
      break;
    case 'gateway-tab':
      order.bankcode = $bankcode.val();
      ZaloPay.gateway(order);
      break;
    case 'quickpay-tab':
      if ($paymentCode.val().length === 0) {
        alert('Mã thanh toán là bắt buộc');
      } else {
        order.paymentcodeRaw = $paymentCode.val();
        ZaloPay.quickPay(order, res => {
          showLoading();
          ZaloPay.listenCallback(res.apptransid, hideLoading);
        });
      }
      break;
  }
});