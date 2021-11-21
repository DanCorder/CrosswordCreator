const fs = require('fs');
const http = require('http');

function saveResponse(response)
{
    let file = fs.createWriteStream('./data/wordList.txt');

    if (response.statusCode !== 200) {
        console.error(`HTTP error: ${response.statusCode}`);
        response.resume();
        return;
    }
  
    response.on('data', (data) => {
        file.write(data);
    });
  
    response.on('close', () => {
        file.end();
        console.log('File saved');
    });
}

let request = http.get(
    'http://app.aspell.net/create?max_size=70&spelling=GBs&spelling=GBz&max_variant=1&diacritic=strip&download=wordlist&encoding=utf-8&format=inline',
    saveResponse);

request.on('error', (err) => {
    console.error(`Error making HTTP request: ${err.message}`);
  });

