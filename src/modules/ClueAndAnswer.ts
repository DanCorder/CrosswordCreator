import { GridAnswer } from "./GridAnswer";

export class ClueAndAnswer {
    clue: string = "";
    answer: string = "";
    answerPosition: GridAnswer = null;

    constructor(object: ReturnType<ClueAndAnswer["toObject"]> = null) {
        if (!!object) {
            this.clue = object.c;
            this.answer = object.a;
            this.answerPosition = object.p == null ? null : new GridAnswer(object.p);
        }
    }

    toObject() {
        return {
            c: this.clue,
            a: this.answer,
            p: this.answerPosition === null ? null : this.answerPosition.toObject()
        }
    }

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
}
