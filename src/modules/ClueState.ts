import type { GridAnswer } from "./GridAnswer";
import { ClueAndAnswer } from "./ClueAndAnswer";

export class ClueState {
    acrossClues: ClueAndAnswer[] = [];
    downClues: ClueAndAnswer[] = [];
    unknownClues: ClueAndAnswer[] = [];

    constructor(data: ReturnType<ClueState["toObject"]> = null) {
        if (!!data) {
            data.across.forEach(clueAndAnswerObject =>
                this.acrossClues.push(new ClueAndAnswer(clueAndAnswerObject)));
            data.down.forEach(clueAndAnswerObject =>
                this.downClues.push(new ClueAndAnswer(clueAndAnswerObject)));
            data.unknown.forEach(clueAndAnswerObject =>
                this.unknownClues.push(new ClueAndAnswer(clueAndAnswerObject)));
        }
    }

    toObject() {
        return {
            across: this.acrossClues.map(ca => ca.toObject()),
            down: this.downClues.map(ca => ca.toObject()),
            unknown: this.unknownClues.map(ca => ca.toObject())
        };
    }

    syncToGrid(gridAnswers: GridAnswer[]) {
        const gridAcross = gridAnswers.filter(ga => ga.direction === "a");
        const gridDown = gridAnswers.filter(ga => ga.direction === "d");

        const newAcross: ClueAndAnswer[] = [];
        const newDown: ClueAndAnswer[] = [];
        const newUnkown: ClueAndAnswer[] = [...this.unknownClues];

        gridAcross.forEach(ga => this.updateClues(ga, this.acrossClues, newAcross));
        newUnkown.push(...this.acrossClues);

        gridDown.forEach(ga => this.updateClues(ga, this.downClues, newDown));
        newUnkown.push(...this.downClues);

        newUnkown.forEach(ca => { ca.answerPosition = null });

        this.acrossClues = newAcross;
        this.downClues = newDown;
        // Remove empty clues
        this.unknownClues = newUnkown.filter(ca => ca.clue.trim() !== "");;
    }

    private updateClues(gridAnswer: GridAnswer, existingClues: ClueAndAnswer[], newClues: ClueAndAnswer[]) {
        const existingIndex = existingClues.findIndex(ca => this.isMatch(gridAnswer, ca));
        let newClue: ClueAndAnswer;
        if (existingIndex === -1) {
            newClue = new ClueAndAnswer()
        }
        else {
            newClue = existingClues.splice(existingIndex, 1)[0];
        }
        newClue.answerPosition = gridAnswer;
        newClues.push(newClue);
    }

    private isMatch(gridAnswer: GridAnswer, clueAndAnswer: ClueAndAnswer): boolean {
        if (gridAnswer.column !== clueAndAnswer.answerPosition.column
            || gridAnswer.row !== clueAndAnswer.answerPosition.row) {
                return false;
            }

        return gridAnswer.matchesAnswer(clueAndAnswer.answer);
    }
}