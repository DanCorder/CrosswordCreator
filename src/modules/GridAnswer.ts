export class GridAnswer {
    public row: number;
    public column: number;
    public number: number;
    public direction: "a"|"d";
    public answer: string;

    toObject() {
        return {
            r: this.row,
            c: this.column,
            n: this.number,
            d: this.direction,
            a: this.answer
        }
    }

    constructor(data: ReturnType<GridAnswer["toObject"]> = null) {
        if (!!data) {
            this.row = data.r;
            this.column = data.c;
            this.number = data.n;
            this.direction = data.d;
            this.answer = data.a;
        }
    }

    matchesAnswer(answer: string): boolean {
        if (this.answer.length !== answer.length) {
            return false;
        }

        let lettersMatch = true;

        [...this.answer].forEach((char, index) => {
            if (char !== "_" && char.toLowerCase() !== answer[index].toLowerCase()) {
                lettersMatch = false;
            }
        });

        return lettersMatch;
    }
}