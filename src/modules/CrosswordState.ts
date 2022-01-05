import { ClueState } from "./ClueState";
import { GridState } from "./GridState";

export class CrosswordState {
    grid = new GridState();
    clues = new ClueState();

    constructor(jsonData: string = null) {
        if (!!jsonData) {
            this.hydrate(jsonData);
        }
        else {
            this.syncCluesAndGrid();
        }
    }

    toggleCell(rowIndex: number, columnIndex: number): CrosswordState {
        this.grid.toggleCell(rowIndex, columnIndex);
        this.syncCluesAndGrid();
        return this;
    }

    setCellLetter(rowIndex: number, columnIndex: number, letter: string): CrosswordState {
        this.grid.setCellLetter(rowIndex, columnIndex, letter);
        this.syncCluesAndGrid();
        return this;
    }

    sizeGrid(newSize: number): CrosswordState {
        this.grid.sizeGrid(newSize);
        this.syncCluesAndGrid();
        return this;
    }

    syncCluesAndGrid(): CrosswordState {
        this.clues.syncToGrid(this.grid.findAnswers());
        return this;
    }

    addAnswerToGrid(row: number, column: number, direction: "a"|"d", answer: string ) {
        this.grid.setAnswer(row, column, direction, answer);
        this.syncCluesAndGrid();
        return this;
    }

    serialize(): string {
        return JSON.stringify(this.toObject());
    }

    private hydrate(jsonData: string): CrosswordState {
        const data: ReturnType<CrosswordState["toObject"]> = JSON.parse(jsonData);

        this.clues = new ClueState(data.clues);
        this.grid = new GridState(data.grid);

        return this;
    }

    private toObject() {
        return {
            clues: this.clues.toObject(),
            grid: this.grid.toObject()
        };
    }
}