import { writable } from 'svelte/store';
import { WordListStore } from "./WordListStore";
import { findMatchingWords, PatternPosition, AlternateLetterMatch } from './WordFit';
import type { WordList } from './SharedTypes';

const wordFitState: { pattern: string, matches: string[], patternPosition: PatternPosition, alternatingLetters: boolean } = {
    pattern: "",
    patternPosition: PatternPosition.Exact,
    alternatingLetters: false,
    matches: [],
}

function createWordFitStore() {
	const { subscribe, set, update } = writable(wordFitState);

    let wordList: WordList;
    WordListStore.subscribe(wl => wordList = wl);

	return {
		subscribe,
        set,
        setOptionsAndFindWords: (pattern: string, patternPosition: PatternPosition, alternatingLetters: AlternateLetterMatch) =>
            update(wfs => {
                wfs.pattern = pattern;
                wfs.patternPosition = patternPosition;
                wfs.alternatingLetters = alternatingLetters === AlternateLetterMatch.Alternate;
                wfs.matches = findMatchingWords(wfs.pattern, wfs.patternPosition, wfs.alternatingLetters ? AlternateLetterMatch.Alternate : AlternateLetterMatch.DontAlternate, wordList);
                return wfs;
            }),
        findWords: () =>
            update(wfs => {
                wfs.matches = findMatchingWords(wfs.pattern, wfs.patternPosition, wfs.alternatingLetters ? AlternateLetterMatch.Alternate : AlternateLetterMatch.DontAlternate, wordList);
                return wfs;
            }),
	};
}

export const WordFitStore = createWordFitStore();