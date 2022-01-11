import type { GridAnswer } from "./GridAnswer";
import { ClueAndAnswer } from "./ClueAndAnswer";

export class ClueState {
    acrossClues: ClueAndAnswer[] = [];
    downClues: ClueAndAnswer[] = [];
    unassignedClues: ClueAndAnswer[] = [];

    constructor(data: ReturnType<ClueState["toObject"]> = null) {
        if (!!data) {
            data.a.forEach(clueAndAnswerObject =>
                this.acrossClues.push(new ClueAndAnswer(clueAndAnswerObject)));
            data.d.forEach(clueAndAnswerObject =>
                this.downClues.push(new ClueAndAnswer(clueAndAnswerObject)));
            data.u.forEach(clueAndAnswerObject =>
                this.unassignedClues.push(new ClueAndAnswer(clueAndAnswerObject)));
        }
    }

    toObject() {
        return {
            a: this.acrossClues.map(ca => ca.toObject()),
            d: this.downClues.map(ca => ca.toObject()),
            u: this.unassignedClues.map(ca => ca.toObject())
        };
    }

    syncToGrid(gridAnswers: GridAnswer[]) {
        const gridAcross = gridAnswers.filter(ga => ga.direction === "a");
        const gridDown = gridAnswers.filter(ga => ga.direction === "d");

        const newAcross: ClueAndAnswer[] = [];
        const newDown: ClueAndAnswer[] = [];
        const newUnassigned: ClueAndAnswer[] = [...this.unassignedClues];

        gridAcross.forEach(ga => this.updateClues(ga, this.acrossClues, newAcross));
        newUnassigned.push(...this.acrossClues);

        gridDown.forEach(ga => this.updateClues(ga, this.downClues, newDown));
        newUnassigned.push(...this.downClues);

        newUnassigned.forEach(ca => { ca.answerPosition = null });

        this.acrossClues = newAcross;
        this.downClues = newDown;
        // Remove empty clues
        this.unassignedClues = newUnassigned.filter(ca => ca.clue.trim() !== "" || ca.answer.trim() !== "");
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

        return clueAndAnswer.answer.trim() === "" || gridAnswer.matchesAnswer(clueAndAnswer.answer);
    }
}