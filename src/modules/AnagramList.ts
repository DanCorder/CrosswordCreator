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