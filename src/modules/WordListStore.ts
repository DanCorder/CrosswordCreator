import { writable } from 'svelte/store';
import type { WordList } from './SharedTypes';

function createWordListStore() {

    let wordList: WordList = null;
    let store = writable(wordList);

    fetch('assets/js/processedWordList.json')
        .then(response => response.json())
        .then(data => {
            store.set(data);
        });

    return store;
}

export const WordListStore = createWordListStore();
