// Make the crossword state available globally so we don't have to pass it down everywhere
import { writable } from 'svelte/store';
import { CrosswordState } from './CrosswordState';

function createCrosswordStateStore() {
	const { subscribe, set, update } = writable(new CrosswordState);

	return {
		subscribe,
        set,
        setGridLetters: (row: number, column: number, direction: "a"|"d", answer: string ) =>
            update(g => g.setGridLetters(row, column, direction, answer)),
        toggleCell: (rowIndex: number, columnIndex: number) =>
            update(g => g.toggleCell(rowIndex, columnIndex)),
        setCellLetter: (rowIndex: number, columnIndex: number, letter: string) =>
            update(g => g.setCellLetter(rowIndex, columnIndex, letter)),
        sizeGrid: (newSize: number) =>
            update(g => g.sizeGrid(newSize)),
        syncCluesAndGrid: () =>
            update(g => g.syncCluesAndGrid())
	};
}

export const CrosswordStateStore = createCrosswordStateStore();
