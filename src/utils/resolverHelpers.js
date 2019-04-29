const crypto = require('crypto');
const WSC_API_KEY = `${process.env.WSC_API_KEY}`;
const WSC_ACCESS_KEY = `${process.env.WSC_ACCESS_KEY}`;
const LOCAL_API_URL = process.env.REACT_APP_DEV_API_BASE_URL;

const buildURLConfig = path => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const hmacData = timestamp + ':' + path + ':' + WSC_API_KEY;
  const signature = crypto
    .createHmac('sha256', WSC_API_KEY)
    .update(hmacData)
    .digest('hex');
  return {
    path,
    headersObj: {
      headers: {
        'wsc-access-key': WSC_ACCESS_KEY,
        'wsc-timestamp': timestamp,
        'wsc-signature': signature,
        'Content-Type': 'application/json',
      },
    },
  };
};

module.exports = { buildURLConfig };
