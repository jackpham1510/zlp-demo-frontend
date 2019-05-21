import './jquery.simplePagination';
import { APIs, getQueryString } from "./common";
import { ZaloPay } from './zalopay';

const $modal = $('#modal');
const $amount = $('#amount');
const $description = $('#description');

$modal.submit(function (e) {
  e.preventDefault();
  const zptransid = $modal.data('zptransid');
  const amount = Number($amount.val());
  const maxAmount = Number($amount.attr('max'));
  const description = $description.val();

  if (amount <= 0 || amount > maxAmount) {
    alert('Số tiền muốn hoàn không hợp lệ');
    return;
  }

  ZaloPay.refund({
    zptransid: String(zptransid), 
    amount: String(amount),
    description
  }, res => {
    $modal.modal('hide');
    $(`#${zptransid} button.getrefundstatus`)
      .data('mrefundid', res.mrefundid)
      .removeClass('d-none');
  });
});

function renderRow(row) {
  const $row = $(`
    <tr id="${row.zptransid}">
      <td width="300">${row.apptransid}</td>
      <td width="150">${row.zptransid}</td>
      <td width="200">${row.channel}</td>
      <td>${row.description}</td>
      <td width="200">${new Date(row.timestamp).toLocaleString()}</td>
      <td width="100">${row.amount}</td>
      <td width="150">
        <button class="btn btn-primary refund" data-zptransid="${row.zptransid}" data-max-amount="${row.amount}">Hoàn tiền</button><br/>
        <button class="btn btn-primary d-none getrefundstatus mt-2">GetRefundStatus</button>
      </td>
    </tr>
  `);

  $row.find('button.refund').click(function () {
    const { zptransid, maxAmount } = $(this).data();
    $modal.data('zptransid', zptransid).modal();
    $amount.val(''+maxAmount).attr('max', ''+maxAmount);
  });

  $row.find('button.getrefundstatus').click(function () {
    const mrefundid = $(this).data('mrefundid');
    ZaloPay.getRefundStatus(mrefundid);
  });
  
  return $row;
}

function renderPagination(data) {
  $('#pagination').pagination({
    items: data.totalOrder,
    itemsOnPage: data.orderPerPage,
    currentPage: data.currentPage,
    cssStyle: 'light-theme',
    nextText: '>>',
    prevText: '<<',
    onPageClick(page) {
      window.location.search = 'page='+page;
    }
  });
}

let { page } = getQueryString();
page = Number(page);
page = page && !isNaN(page) ? page : 1;

$.getJSON(APIs.GETHISTORY + '?page=' + page)
.done(data => {
  renderPagination(data);
  const $tbody = $('#historyTable tbody')
  data.orders.forEach(order => {
    $tbody.append(renderRow(order));
  });
})
.fail(err => {
  alert('Lấy lịch sử thanh toán thất bại');
});
