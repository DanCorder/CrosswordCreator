const maxWordLength = 15;
const anagramList = {};

// Creates a data structure in the form:
// {
//    4: [ 
//      { letters: "aprt", words: [ "part", "tarp", "trap" ] },
//      { letters: "arst", words: [ "tars", "rats", "star", "arts" ] },
//    ]
// }
// Entries are alphabetically ordered by the "letters" value
function populateAnagramList(wordList) {
    for (let i = 1; i <= maxWordLength; i++) {
        const words = wordList[i];
        const processed = {};
        Object.keys(words).forEach(word => {
            const sortedLetters = sortString(word);
            if (!processed.hasOwnProperty(sortedLetters)) {
                processed[sortedLetters] = [];
            }
            processed[sortedLetters].push(word);
        });
        anagramList[i] = Object.entries(processed).sort(function(x, y) {
            if (x[0] < y[0]) {
                return -1;
            }
            if (x[0] > y[0]) {
                return 1;
            }
            return 0;
        }).map(x => { return { letters: x[0], words: x[1] } } );
    }
}

function findAnagrams(letters) {
    const sortedLetters = sortString(letters);
    const anagrams = anagramList[sortedLetters.length].find(x => x.letters === sortedLetters);

    if (anagrams === undefined) {
        return [];
    }

    return anagrams.words.filter(x => x !== letters);
}

function findAllSingleWordAnagrams(parentWord) {
    const parentLetters = sortString(parentWord);
    let anagrams = [];
    for (let letters of generatePowerSetStrings(parentLetters)) {
        const result = anagramList[letters.length].find(a => a.letters === letters);
        if (result !== undefined) {
            anagrams = anagrams.concat(result.words);
        }
    }
    anagrams = [ ...(new Set(anagrams)) ]; // Deduplicate entires
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

function sortString(str) {
    var arr = str.split('');
    var sorted = arr.sort();
    return sorted.join('');
}

export { populateAnagramList, findAnagrams, findAllSingleWordAnagrams };