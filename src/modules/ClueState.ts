export class ClueAndAnswer {
    clue:string;
    answer:string;
}

export class ClueState {
    cluesAndAnswers: ClueAndAnswer[] = [];

    addNewClue(): ClueState {
        this.cluesAndAnswers.push(new ClueAndAnswer());
        return this;
    }

    removeClue(indexToRemove: number): ClueState {
        this.cluesAndAnswers.splice(indexToRemove, 1);
        return this;
    }
}