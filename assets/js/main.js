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

const getSingleAnagramsInput = document.getElementById('findSingleAnagramsInput');
const getSingleAnagramsButton = document.getElementById('findSingleAnagramsButton');
const getSingleAnagramsOutput = document.getElementById('findSingleAnagramsOutput');

getSingleAnagramsButton.onclick = function(ev) {
    if (!wordListDownloaded) {
        alert('Word list is still downloading, please try again or refresh the page');
        return;
    }
    const matches = getAllSingleWordAnagrams(getSingleAnagramsInput.value);
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

function getAllSingleWordAnagrams(parentWord) {
    const parentLetters = sortString(parentWord);
    let anagrams = [];
    for (let letters of generatePowerSetStrings(parentLetters)) {
        const result = anagramList[letters.length].find(a => a.letters === letters);
        if (result !== undefined) {
            anagrams = anagrams.concat(result.words);
        }
    }
    anagrams = [ ...new Set(anagrams)]; // Deduplicate entires
    return anagrams.filter(a => a !== parentWord);
}

// Generates the power set of letters from the supplied  string
// Preserves the order of the original string in the substrings
// Written as a generator so that we don't have to keep the whole
// power set in memory at once.
function* generatePowerSetStrings(set) {
    for (let flags = 1; flags < (1 << set.length); flags++) {
        let subset = '';
        for (let index = 0; index < set.length; index++) {
            if (flags & (1 << index)) {
                subset += set[index];
            }
        }
        yield subset;
      }
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
