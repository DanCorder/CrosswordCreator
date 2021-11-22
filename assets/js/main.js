const dictionaryUrlPrefix = 'https://www.dictionary.com/browse/';

let wordListDownloaded = false;
let wordList = {};

fetch('assets/js/processedWordList.json')
    .then(response => response.json())
    .then(data => {
        wordList = data;
        wordListDownloaded = true;
    });

const getMatchesInput = document.getElementById('findMatchingWordsInput');
const getMatchesButton = document.getElementById('findMatchingWordsButton');
const getMatchesOutput = document.getElementById('findMatchingWordsOutput');

getMatchesButton.onclick = function(ev) {
    if (!wordListDownloaded) {
        alert('Word list is still downloading, please try again or refresh the page');
        return;
    }
    const matches = findMatchingWords(getMatchesInput.value);
    if (matches.length === 0) {
        getMatchesOutput.innerHTML = "No matches found";
    } else {
        getMatchesOutput.innerHTML = matches
            .sort(new Intl.Collator().compare)
            .map(match => `<a href="${dictionaryUrlPrefix}${match}" target="_blank">${match}</a>`)    
            .join('<br/>');
    }
};

getMatchesInput.addEventListener("keypress", (e) => {
    if (e.key == "Enter") getMatchesButton.click();
});

function findMatchingWords(pattern) {
    let matches = [];
    if (pattern === '') {
        return matches;
    }

    const wordsOfSameLength = wordList[pattern.length];
    const regex = new RegExp(pattern.replaceAll('.', '\\w').replaceAll(' ', '\\w'));

    Object.keys(wordsOfSameLength).forEach(candidate => {
        if (regex.test(candidate)) {
            matches = matches.concat(wordsOfSameLength[candidate]);
        }
    });

    return matches;
}