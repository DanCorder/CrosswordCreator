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

bindControlsToMethod('findMatchingWords', findMatchingWords, new Intl.Collator().compare, singleWordResultFormatter);
bindControlsToMethod('findAnagrams', findAnagramsExcludingLetters, sortAnagramResults, anagramResultFormatter);
bindControlsToMethod('findSingleAnagrams', findAllSingleWordAnagrams, compareByLengthThenAlphabetical, singleWordResultFormatter);

function findAnagramsExcludingLetters(lettersToAnagram) {
    const exclude = document.getElementById('findAnagramsExclude').value.toLowerCase();
    const charsToStrip = /[^a-z]/ig
    const excludeClean = exclude.replaceAll(charsToStrip, '');
    [...excludeClean].forEach(letter => lettersToAnagram = lettersToAnagram.replace(letter, ''));
    return findAnagrams(lettersToAnagram);
}

function singleWordResultFormatter(result) {
    return `<div><a href="${dictionaryUrlPrefix}${result}" target="_blank">${result}</a></div>`;
}

function anagramResultFormatter(result) {
    return `<div class="anagram-block__result">${
        result
            .map(wordGroup => `<div class="anagram-block__word-group">${
                wordGroup
                    .map(word => `<a href="${dictionaryUrlPrefix}${word}" target="_blank">${word}</a>`)
                    .join('<br/>')
                }</div>`)
            .join('')
        }</div>`;
}

// Sort by longest word (always first in the result), then alphabetically
function sortAnagramResults(first, second) {
    if (second[0][0].length !== first[0][0].length) {
        return second[0][0].length - first[0][0].length;
    }
    if (second[0][0] > first[0][0]) {
        return -1;
    }
    return 1;
}

// Helper to bind a text input, output div, button, and search method together
// The controls should all have IDs of the form <controlNamePrefix>(Input|Output|Button)
function bindControlsToMethod(controlNamePrefix, searchMethod, resultComparer, resultFormatter) {
    const input = document.getElementById(controlNamePrefix + 'Input');
    const button = document.getElementById(controlNamePrefix + 'Button');
    const output = document.getElementById(controlNamePrefix + 'Output');

    button.onclick = function(ev) {
        if (!wordListDownloaded) {
            alert('Word list is still downloading, please try again or refresh the page');
            return;
        }
        const matches = searchMethod(input.value);
        if (matches.length === 0) {
            output.innerHTML = "No matches found";
        } else {
            output.innerHTML = matches
                .sort(resultComparer)
                .map(resultFormatter)    
                .join('');
        }
    };

    input.addEventListener("keypress", (e) => {
        if (e.key == "Enter") button.click();
    });
}

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