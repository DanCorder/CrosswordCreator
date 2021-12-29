export class ClueAndAnswer {
    clue:string;
    answer:string;
}

export class ClueState {
    cluesAndAnswers: ClueAndAnswer[] = [];

    AddNewClue() {
        this.cluesAndAnswers.push(new ClueAndAnswer());
        return this;
    }

    RemoveClue(indexToRemove: number) {
        this.cluesAndAnswers.splice(indexToRemove, 1);
        return this;
    }
}