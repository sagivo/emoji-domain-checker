// emojis is an array of emojis you want to check. atm it's all the utf8 emojis but you can edit it
// to be whatever you want. example: ['👌👍', '🍑🍆', '😣']
const emojis = require("emoji-chars"); 
const http = require('https');
const urlencode = require('urlencode');

let index = 0;

function check() {
  if (index < emojis.length) {
    setTimeout(() => {
      checkEmoji()
    }, 50);
  }
}

function checkEmoji() {
  const c = emojis[index];
  const addrs = `https://xn--qeiaa.ws/domain/${ urlencode(c) }.ws`;

  http.get(addrs, (res) => {
    const statusCode = res.statusCode;
    const contentType = res.headers['content-type'];

    let error;
    if (statusCode !== 200) {
      error = new Error(`Request Failed.\n` +
                        `Status Code: ${statusCode}`);
    }
    if (error) {
      console.log(error.message);
      res.resume(); // consume response data to free up memory
      return;
    }

    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => rawData += chunk);
    res.on('end', () => {
      try {
        if (rawData.includes('ws is available!')) console.log(c);
      } catch (e) {
        console.log(e.message);
      }
      index++;
      check();
    });
  }).on('error', (e) => {
    console.log(`Got error: ${e.message}`);
  });
}

check();