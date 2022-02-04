import { writable } from 'svelte/store';
import { WordListStore } from "./WordListStore";
import { WordFit } from './WordFit';
import type { WordList } from './SharedTypes';

function createWordFitStore() {
	const { subscribe, set, update } = writable(new WordFit);
    let wordList: WordList;
    WordListStore.subscribe(wl => wordList = wl);

	return {
		subscribe,
        set,
        findWords: () =>
            update(wf => wf.findMatchingWords(wordList)),
	};
}

export const WordFitStore = createWordFitStore();