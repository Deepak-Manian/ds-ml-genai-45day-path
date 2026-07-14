const https = require('https');

const data = JSON.stringify({
  checked: {},
  startDate: new Date().toISOString(),
  journalEntries: {},
  updatedAt: new Date().toISOString()
});

const req = https.request({
  hostname: 'json.extendsclass.com',
  path: '/bin',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
}, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => console.log(`BODY: ${body}`));
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

req.write(data);
req.end();
