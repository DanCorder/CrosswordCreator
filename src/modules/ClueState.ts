export class ClueAndAnswer {
    clue:string = "";
    answer:string = "";

    get answerLength() {
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
        }
    }

    toObject() {
        return {
            c: this.clue,
            a: this.answer
        }
    }
}

export class ClueState {
    cluesAndAnswers: ClueAndAnswer[] = [];

    constructor(data: ReturnType<ClueAndAnswer["toObject"]>[] = []) {
        data.forEach(clueAndAnswerObject =>
            this.cluesAndAnswers.push(new ClueAndAnswer(clueAndAnswerObject)));
    }

    toObject(): ReturnType<ClueAndAnswer["toObject"]>[] {
        return this.cluesAndAnswers.map(ca => ca.toObject());
    }

    addNewClue(): ClueState {
        this.cluesAndAnswers.push(new ClueAndAnswer());
        return this;
    }

    removeClue(indexToRemove: number): ClueState {
        this.cluesAndAnswers.splice(indexToRemove, 1);
        return this;
    }
}