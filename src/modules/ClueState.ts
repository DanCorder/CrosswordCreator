export class ClueAndAnswer {
    Clue:string;
    Answer:string;
}

export class ClueState {
    CluesAndAnswers: ClueAndAnswer[] = [];

    AddNewClue() {
        this.CluesAndAnswers.push(new ClueAndAnswer());
        return this;
    }

    RemoveClue(indexToRemove: number) {
        this.CluesAndAnswers.splice(indexToRemove, 1);
        return this;
    }
}