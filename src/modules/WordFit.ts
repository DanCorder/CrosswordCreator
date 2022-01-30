import type { WordList } from "./SharedTypes";

export function findMatchingWords(pattern: string, wordList: WordList) {
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