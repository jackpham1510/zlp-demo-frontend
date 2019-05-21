export const HOST = 'http://localhost:1789';

export const APIs = {
  QR: HOST + '/api/createorder?ordertype=createorder',
  GATEWAY: HOST + '/api/createorder?ordertype=gateway',
  QUICKPAY: HOST + '/api/createorder?ordertype=quickpay',
  GETBANKLIST: HOST + '/api/getbanklist',
  GETORDERSTATUS: HOST + '/api/getorderstatus',
  GETREFUNDSTATUS: HOST + '/api/getrefundstatus',
  REFUND: HOST + '/api/refund',
  GETHISTORY: HOST + '/api/gethistory',
  SUBSCRIBE: HOST.replace('http', 'ws') + '/subscribe',
}

export function parseResult(obj) {
  let str = '';
  for(const key in obj) {
    str += key + ' = ' + obj[key] + '\n';
  }
  return str;
}

export function postJSON(url, data = {}, done, fail) {
  return $.ajax({
    url,
    data: JSON.stringify(data),
    method: 'POST',
    contentType: 'application/json'
  })
  .done(res => {
    try {
      res = JSON.parse(res);
      done(res);
    } catch {
      done(res);
    }
  })
  .fail(fail);
}

export function getQueryString() {
  const result = {};
  const querys = window.location.search.slice(1).split('&');
  querys.forEach(q => {
    const [key, val] = q.split('=');
    result[key] = val;
  });
  return result;
}