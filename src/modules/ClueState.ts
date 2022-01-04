// qq:DCC sort out class structure
import { GridAnswer } from "./GridState";

export class ClueAndAnswer {
    clue:string = "";
    answer:string = "";
    answerPosition: GridAnswer = null;

    get answerLength(): string {
        const parts: (number|string)[] = [];
        const chars = [...this.answer];
        chars.forEach(char => {
            if (char === " ") {
                parts.push(",");
            }
            else if (char === "-") {
                parts.push("-");
            }
            else {
                if (parts.length === 0 || parts[parts.length - 1] === "," || parts[parts.length - 1] === "-") {
                    parts.push(1);
                }
                else {
                    parts[parts.length - 1] = (parts[parts.length - 1] as number) + 1;
                }
            }
        });
        return parts.join("");
    }

    get strippedAnswer() {
        return this.answer.replaceAll(/[- ]/g, "");
    }

    constructor(object: ReturnType<ClueAndAnswer["toObject"]> = null) {
        if (!!object) {
            this.clue = object.c;
            this.answer = object.a;
            this.answerPosition = new GridAnswer(object.p);
        }
    }

    toObject() {
        return {
            c: this.clue,
            a: this.answer,
            p: this.answerPosition.toObject()
        }
    }
}

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
            || gridAnswer.row !== clueAndAnswer.answerPosition.row
            || gridAnswer.answer.length !== clueAndAnswer.answer.length) {
                return false;
            }

        let lettersMatch = true;
        [...gridAnswer.answer].forEach((char, index) => {
            if (char !== "_" && char.toLowerCase() !== clueAndAnswer.answer[index].toLowerCase()) {
                lettersMatch = false;
            }
        });

        return lettersMatch;
    }
}