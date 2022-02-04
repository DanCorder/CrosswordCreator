import type { WordList } from "./SharedTypes";

export class WordFit {
    pattern: string;
    matches: string[] = [];

    findMatchingWords(wordList: WordList) {
        this.matches = [];
        if (this.pattern === '') {
            return this;
        }

        const wordsOfSameLength = wordList[this.pattern.length];
        const regex = new RegExp(this.pattern.toLowerCase().replaceAll('.', '\\w').replaceAll(' ', '\\w'));

        Object.keys(wordsOfSameLength).forEach(candidate => {
            if (regex.test(candidate)) {
                this.matches = this.matches.concat(wordsOfSameLength[candidate]);
            }
        });

        return this;
    }
}