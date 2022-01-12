export const wildcardChar = "_";

export class GridAnswer {
    public row: number;
    public column: number;
    public number: number;
    public direction: "a"|"d";
    public letters: string;

    constructor(data: ReturnType<GridAnswer["toObject"]> = null) {
        if (!!data) {
            this.row = data.r;
            this.column = data.c;
            this.number = data.n;
            this.direction = data.d;
            this.letters = data.a;
        }
    }

    toObject() {
        return {
            r: this.row,
            c: this.column,
            n: this.number,
            d: this.direction,
            a: this.letters
        }
    }

    matchesAnswer(answer: string): boolean {
        if (this.letters.length !== answer.length) {
            return false;
        }

        let lettersMatch = true;

        [...this.letters].forEach((letter, index) => {
            if (letter !== wildcardChar && letter.toLowerCase() !== answer[index].toLowerCase()) {
                lettersMatch = false;
            }
        });

        return lettersMatch;
    }
}
