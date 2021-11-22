const dictionaryUrlPrefix = 'https://www.dictionary.com/browse/';

let wordListDownloaded = false;
let wordList = {};

fetch('assets/js/processedWordList.json')
    .then(response => response.json())
    .then(data => {
        wordList = data;
        wordListDownloaded = true;
    });

document.getElementById('findMatchingWordsButton').onclick = function(ev) {
    if (!wordListDownloaded) {
        alert('Word list is still downloading, please try again or refresh the page');
        return;
    }
    const input = document.getElementById('findMatchingWordsInput');
    const output = document.getElementById('findMatchingWordsOutput');
    const matches = findMatchingWords(input.value);
    if (matches.length === 0) {
        output.innerHTML = "No matches found";
    } else {
        output.innerHTML = matches
            .map(match => `<a href="${dictionaryUrlPrefix}${match}" target="_blank">${match}</a>`)    
            .join('<br/>');
    }
};

function findMatchingWords(pattern) {
    const wordsOfSameLength = wordList[pattern.length];
    let matches = [];
    const regex = new RegExp(pattern.replace('.', '\\w'));

    Object.keys(wordsOfSameLength).forEach(candidate => {
        if (regex.test(candidate)) {
            matches = matches.concat(wordsOfSameLength[candidate]);
        }
    });

    return matches;
}