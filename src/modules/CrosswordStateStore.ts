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
        setAnswerText: (clueNumber: number, direction: "a"|"d", answerText: string) =>
            update(g => g.setAnswerText(clueNumber, direction, answerText)),
        setClueText: (clueNumber: number, direction: "a"|"d", clueText: string) =>
            update(g => g.setClueText(clueNumber, direction, clueText)),
        setCellLetter: (rowIndex: number, columnIndex: number, letter: string) =>
            update(g => g.setCellLetter(rowIndex, columnIndex, letter)),
        sizeGrid: (newSize: number) =>
            update(g => g.sizeGrid(newSize)),
	};
}

export const CrosswordStateStore = createCrosswordStateStore();
