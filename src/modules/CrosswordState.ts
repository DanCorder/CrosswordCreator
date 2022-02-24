import type { AnswerPosition } from "./SharedTypes";
import type { ClueAndAnswer } from "./ClueAndAnswer";
import { ClueState } from "./ClueState";
import { GridState } from "./GridState";
import { SettingsState } from "./SettingsState";

export class CrosswordState {
    grid = new GridState();
    clues = new ClueState();
    settings = new SettingsState();

    constructor(data: ReturnType<CrosswordState["toObject"]> = null) {
        if (!!data) {
            this.clues = new ClueState(data.clues);
            this.grid = new GridState(data.grid);
            this.settings = new SettingsState(data.settings);
            this.clues.syncToGrid(this.grid.findAnswers());
        }
        else {
            this.syncCluesAndGrid();
        }
    }

    serialize(): string {
        return JSON.stringify(this.toObject());
    }

    assignClue(position: AnswerPosition, clue: ClueAndAnswer): CrosswordState {
        const gridAnswers = this.grid.findAnswers();
        const gridAnswer = gridAnswers.find(ga => ga.direction === position.direction && ga.number === position.number);
        this.clues.assignClue(gridAnswer, clue);
        return this;
    }

    deleteClue(clue: ClueAndAnswer): CrosswordState {
        this.clues.deleteClue(clue);
        return this;
    }

    refresh() {
        this.syncCluesAndGrid();
        return this;
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

    setGridLetters(row: number, column: number, direction: "a"|"d", answer: string ): CrosswordState {
        this.grid.setLetters(row, column, direction, answer);
        this.syncCluesAndGrid();
        return this;
    }

    setClueText(clueNumber: number, direction: "a"|"d", clueText: string): CrosswordState {
        const clues = direction === "a" ? this.clues.acrossClues : this.clues.downClues;
        const clue = clues.find(c => c.answerPosition.number === clueNumber);
        clue.clue = clueText;
        return this;
    }

    setAnswerText(clueNumber: number, direction: "a"|"d", answerText: string): CrosswordState {
        const clues = direction === "a" ? this.clues.acrossClues : this.clues.downClues;
        const clue = clues.find(c => c.answerPosition.number === clueNumber);
        clue.answer = answerText
        this.syncCluesAndGrid();
        return this;
    }

    private syncCluesAndGrid(): CrosswordState {
        this.clues.syncToGrid(this.grid.findAnswers());
        return this;
    }

    toObject() {
        return {
            clues: this.clues.toObject(),
            grid: this.grid.toObject(),
            settings: this.settings.toObject(),
        };
    }
}
