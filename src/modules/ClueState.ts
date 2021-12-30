export class ClueAndAnswer {
    clue:string = "";
    answer:string = "";

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