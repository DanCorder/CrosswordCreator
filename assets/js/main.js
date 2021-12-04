import { populateAnagramList, findAnagrams, findAllSingleWordAnagrams } from './modules/anagrams.js';

const dictionaryUrlPrefix = 'https://www.dictionary.com/browse/';

let wordListDownloaded = false;
let wordList = {};

fetch('assets/js/processedWordList.json')
    .then(response => response.json())
    .then(data => {
        wordList = data;
        populateAnagramList(wordList);
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

const getAnagramsInput = document.getElementById('findAnagramsInput');
const getAnagramsButton = document.getElementById('findAnagramsButton');
const getAnagramsOutput = document.getElementById('findAnagramsOutput');

getAnagramsButton.onclick = function(ev) {
    if (!wordListDownloaded) {
        alert('Word list is still downloading, please try again or refresh the page');
        return;
    }
    const matches = findAnagrams(getAnagramsInput.value);
    if (matches.length === 0) {
        getAnagramsOutput.innerHTML = "No matches found";
    } else {
        getAnagramsOutput.innerHTML = matches
            .sort(new Intl.Collator().compare)
            .map(match => `<a href="${dictionaryUrlPrefix}${match}" target="_blank">${match}</a>`)    
            .join('<br/>');
    }
};

getAnagramsInput.addEventListener("keypress", (e) => {
    if (e.key == "Enter") getAnagramsButton.click();
});

const getSingleAnagramsInput = document.getElementById('findSingleAnagramsInput');
const getSingleAnagramsButton = document.getElementById('findSingleAnagramsButton');
const getSingleAnagramsOutput = document.getElementById('findSingleAnagramsOutput');

getSingleAnagramsButton.onclick = function(ev) {
    if (!wordListDownloaded) {
        alert('Word list is still downloading, please try again or refresh the page');
        return;
    }
    const matches = findAllSingleWordAnagrams(getSingleAnagramsInput.value);
    if (matches.length === 0) {
        getSingleAnagramsOutput.innerHTML = "No matches found";
    } else {
        getSingleAnagramsOutput.innerHTML = matches
            .sort(compareByLengthThenAlphabetical)
            .map(match => `<a href="${dictionaryUrlPrefix}${match}" target="_blank">${match}</a>`)    
            .join('<br/>');
    }
};

getSingleAnagramsInput.addEventListener("keypress", (e) => {
    if (e.key == "Enter") getSingleAnagramsButton.click();
});

function compareByLengthThenAlphabetical(first, second) {
    if (first.length !== second.length) {
        return second.length - first.length;
    }
    if (first < second) {
        return -1;
    }
    if (first > second) {
        return 1;
    }
    return 0;
}

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