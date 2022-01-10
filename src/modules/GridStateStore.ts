import { writable } from 'svelte/store';
import { GridState } from './GridState';

function createGridStateStore() {
	const { subscribe, set, update } = writable(new GridState);

	return {
		subscribe,
        set,
        setAnswer: (row: number, column: number, direction: "a"|"d", answer: string ) =>
            update(g => g.setAnswer(row, column, direction, answer)),
        toggleCellX: (rowIndex: number, columnIndex: number) =>
            update(g => g.toggleCell(rowIndex, columnIndex)),
        setCellLetter: (rowIndex: number, columnIndex: number, letter: string) =>
            update(g => g.setCellLetter(rowIndex, columnIndex, letter)),
        sizeGrid: (newSize: number) =>
            update(g => g.sizeGrid(newSize))
	};
}

export const GridStateStore = createGridStateStore();


// qq: Put syncCluesAndGridLogic into clue input class