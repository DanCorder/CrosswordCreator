import type { WordList } from "./WordList";

export class AnagramList {
    wordsByLength: AnagramEntry[][];
}

class AnagramEntry {
    letters: string;
    words: string[];
}

function sortString(str: string): string {
    var arr = str.split('');
    var sorted = arr.sort();
    return sorted.join('');
}

// Generates the power set of letters from the supplied string
// Preserves the order of the original string in the substrings
// Written as a generator so that we don't have to keep the whole power set in memory at once.
function* generatePowerSetStrings(letters: string) {
    for (let flags = 1; flags < (1 << letters.length); flags++) {
        let subset = '';
        for (let index = 0; index < letters.length; index++) {
            if (flags & (1 << index)) {
                subset += letters[index];
            }
        }
        yield subset;
      }
}

export function createAnagramList(wordList: WordList): AnagramList {
    const maxWordLength = 15;
    const ret = new AnagramList();

    for (let i = 1; i <= maxWordLength; i++) {
        const words = wordList[i];
        const processed: { [index: string]: string[] } = {};
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
        }).map(x => { return { letters: x[0], words: x[1].sort() } } );
    }

    return ret;
}

export function findAllSingleWordAnagrams(parentWord: string, anagramList: AnagramList) {
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