export class GridCell {
    isWhite = true;
    cellNumber: number = null;
    answerLetter: string = "";

    constructor(object: ReturnType<GridCell["toObject"]> = null) {
        if (!!object) {
            this.isWhite = object.w;
            this.cellNumber = object.n;
            this.answerLetter = object.l;
        }
    }

    toObject() {
        return {
            w: this.isWhite,
            n: this.cellNumber,
            l: this.answerLetter
        }
    }
}