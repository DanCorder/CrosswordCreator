// Make the crossword state available globally so we don't have to pass it down everywhere
import { writable } from 'svelte/store';
import type { AnswerPosition } from './AnswerPosition';
import type { ClueAndAnswer } from './ClueAndAnswer';
import { CrosswordState } from './CrosswordState';

function createCrosswordStateStore() {
	const { subscribe, set, update } = writable(new CrosswordState);

	return {
		subscribe,
        set,
        assignClue: (position: AnswerPosition, clue: ClueAndAnswer) =>
            update(s => s.assignClue(position, clue)),
        refresh: () => update(s => s.refresh()),
        setGridLetters: (row: number, column: number, direction: "a"|"d", answer: string ) =>
            update(s => s.setGridLetters(row, column, direction, answer)),
        toggleCell: (rowIndex: number, columnIndex: number) =>
            update(s => s.toggleCell(rowIndex, columnIndex)),
        setCellLetter: (rowIndex: number, columnIndex: number, letter: string) =>
            update(s => s.setCellLetter(rowIndex, columnIndex, letter)),
        sizeGrid: (newSize: number) =>
            update(s => s.sizeGrid(newSize)),
	};
}

export const CrosswordStateStore = createCrosswordStateStore();
