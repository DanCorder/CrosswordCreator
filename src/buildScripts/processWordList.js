// Script to take the raw word list and turn into a format useful for the website
const fs = require('fs');
const readline = require('readline');

const wordsByLength = {};

var inHeader = true;
var headerText = '';
const wordListFile = readline.createInterface(fs.createReadStream('../data/wordList.txt'));

console.log("Processing words, this may take a little while");

wordListFile.on('line', function(word) {

    // The word list file starts with a header that ends with "---"
    if (inHeader) {
        headerText += '\n' + word;
        if (word === '---')
        {
            inHeader = false;
        }
        return;
    }

    // Remove apostrophes (and anything else)
    cleanWord = clean(word);

    // We're not supporting crosswords larger than 15x15
    if (cleanWord.length > 15) {
        return;
    }

    if (!wordsByLength.hasOwnProperty(cleanWord.length)) {
        wordsByLength[cleanWord.length] = {};
    }
    let wordsOfSameLength = wordsByLength[cleanWord.length];

    // Combine Georges and George's into a single entry, but keep both original words.
    if (!wordsOfSameLength.hasOwnProperty(cleanWord)) {
        wordsOfSameLength[cleanWord] = []
    }
    wordsOfSameLength[cleanWord].push(word);
});

wordListFile.on('close', function() {
    // JSON doesn't support comments, so use this to keep the word list copyright notice at the top of the file
    wordsByLength[0] = headerText

    let output = fs.createWriteStream('../../assets/js/processedWordList.json');
    output.write(JSON.stringify(wordsByLength));
    output.end();

    console.log('Processing complete');
})

function clean(word) {
    word = word.trim();
    word = word.replaceAll("'", "");
    word = word.toLowerCase();
    return word;
}