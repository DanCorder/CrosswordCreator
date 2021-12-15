import type { WordList } from "./WordList";

export class AnagramList {
    wordsByLength: AnagramListEntry[][];
}

class AnagramListEntry {
    letters: string;
    words: string[];
}

export type AnagramResult = string[][];

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

export function findAllSingleWordAnagrams(parentWord: string, anagramList: AnagramList): AnagramResult[] {
    const parentLetters = sortString(parentWord);
    let anagrams: string[] = [];
    for (let letters of generatePowerSetStrings(parentLetters)) {
        const result = anagramList[letters.length].find(a => a.letters === letters);
        if (result !== undefined) {
            anagrams = anagrams.concat(result.words);
        }
    }
    anagrams = [ ...(new Set(anagrams)) ]; // Deduplicate entires
    return anagrams
        .filter(a => a !== parentWord)
        .map(r => [[r]]);
}

// For e.g. "look" returns results like:
// [
//   [ [ "loo" ], [ "k" ] ]
//   [ [ "ko", "ok"], [ "lo" ] ]
//   [ [ "kolo" ] ]
// ]
export function findAnagrams(
    letters: string,
    anagramList: AnagramList,
    maxResults = 1000,
    ignoreWeirdSingleLetters = true): AnagramResult[] {

    const sortedLetters = sortString(letters);
    const results = [];
    for (const letterGroups of generateAllLetterCombinations(sortedLetters)) {
        const result = [];
        let foundResult = true;
        for (let i = 0; i < letterGroups.length; i++) {
            const letterGroup = letterGroups[i];
            if (ignoreWeirdSingleLetters
                && letterGroup.length === 1
                && letterGroup[0] !== 'a'
                && letterGroup[0] !== 'i') {
                    foundResult = false;
                    break;
            }
            const anagrams = anagramList[letterGroup.length].find(x => x.letters === letterGroup);
            if (anagrams === undefined) {
                // We can't anagram all of the groups so move on to the next set of groups
                foundResult = false;
                break;
            }
            const filteredWords = anagrams.words.filter(x => x !== letters);
            if (filteredWords.length === 0) {
                foundResult = false;
                break;
            }
            result.push(anagrams.words.filter(x => x !== letters));
        }

        if (foundResult) {
            result.sort(sortResultByLengthThenAlphabetically);
            let foundDuplicate = false;
            for (let i = 0; i < results.length; i++) {
                const savedResult = results[i];
                if (savedResult.length !== result.length) {
                    continue;
                }
                let areIdentical = true;
                for (let j = 0; j < savedResult.length; j++) {
                    if (savedResult[j][0] !== result[j][0]) {
                        areIdentical = false;
                        break;
                    }
                }
                if (areIdentical) {
                    foundDuplicate = true;
                    break;
                }
            }
            if (!foundDuplicate) {
                results.push(result);
            }
        }

        if (results.length >= maxResults) {
            break;
        }
    }
    return results;
}

function sortResultByLengthThenAlphabetically(first, second) {
    if (second[0].length !== first[0].length) {
        return second[0].length - first[0].length;
    }
    if (second[0] > first[0]) {
        return -1;
    }
    return 1;
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

// Generate all sub groupings of letters
function* generateAllLetterCombinations(letters: string) {
    for (let restrictedGrowthString of generateRestrictedGrowthStrings(letters.length)) {
        const letterGroups = [];
        for (let i = 0; i < letters.length; i++) {
            const set = restrictedGrowthString[i];
            if (letterGroups[set] === undefined) {
                letterGroups[set] = "";
            }
            letterGroups[set] += letters[i];
        }
        yield letterGroups;
    }
}

// Generate all set partitions for a set of a given length. Yields an array of integers
// representing the sets that each letter at that index belongs to.
// Implementation of algorithm from "The Art Of Computer Programming" by Donald E. Knuth
// with some refactoring
function* generateRestrictedGrowthStrings(length: number) {
    let restrictedGrowthString = [];
    let maxValues = [];
    for (let i = 0; i < length; i++) {
        restrictedGrowthString.push(0);
        maxValues.push(1);
    }
    const lastIndex = length - 1;

    while(true) {
        yield restrictedGrowthString;
        if (restrictedGrowthString[lastIndex] === maxValues[lastIndex]) {
            // Find the first value from the right in restrictedGrowthString that is below its maximum
            let j = lastIndex - 1;
            while (restrictedGrowthString[j] === maxValues[j]) {
                j--;
            }

            // If the only value left is the first then we are done as that value always belongs to
            // set 0
            if (j === 0) {
                return;
            }
            // Otherwise increment it
            restrictedGrowthString[j] += 1;

            // If restrictedGrowthString[j] has reached its maximum then the digits to the right will
            // need a maximum one higher so they can belong to a new set.
            const newMax = maxValues[j] + (restrictedGrowthString[j] === maxValues[j] ? 1 : 0);

            // Reset all the elements to the right
            j++;
            for (; j < length; j++) {
                restrictedGrowthString[j] = 0;
                maxValues[j] = newMax;
            }
        }
        else {
            restrictedGrowthString[lastIndex] += 1;
        }
    }
}