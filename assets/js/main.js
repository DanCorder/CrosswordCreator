const dictionaryUrlPrefix = 'https://www.dictionary.com/browse/';
const maxWordLength = 15;

let wordListDownloaded = false;
let wordList = {};
let anagramList = {};

fetch('assets/js/processedWordList.json')
    .then(response => response.json())
    .then(data => {
        wordList = data;
        anagramList = createAnagramList(wordList);
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

function findAnagrams(letters) {
    const sortedLetters = sortString(letters);
    const anagrams = anagramList[sortedLetters.length].find(x => x.letters === sortedLetters);

    if (anagrams === undefined) {
        return [];
    }

    return anagrams.words.filter(x => x !== letters);
}

// Creates a data structure in the form:
// {
//    4: [ 
//      { letters: "aprt", words: [ "part", "tarp", "trap" ] },
//      { letters: "arst", words: [ "tars", "rats", "star", "arts" ] },
//    ]
// }
// Entries are alphabetically ordered by the "letters" value
function createAnagramList(wordList) {
    const ret = {};
    for (i = 1; i <= maxWordLength; i++) {
        words = wordList[i];
        const processed = {};
        Object.keys(words).forEach(word => {
            const sortedLetters = sortString(word);
            if (!processed.hasOwnProperty(sortedLetters)) {
                processed[sortedLetters] = [];
            }
            processed[sortedLetters].push(word);
        });
        ret[i] = Object.entries(processed).sort(function(x, y) {
            if (x[0] < y[0]) {
                return -1;
            }
            if (x[0] > y[0]) {
                return 1;
            }
            return 0;
        }).map(x => { return { letters: x[0], words: x[1] } } );
    }
    return ret;
}

function sortString(str) {
    var arr = str.split('');
    var sorted = arr.sort();
    return sorted.join('');
}

  