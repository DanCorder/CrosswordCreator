class GridCell {
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
}

export class GridState {
    // Due to the way Svelte binds values we need to index cells by row then column (y then x).
    cells: GridCell[][] = [];

    get size() {
        return this.cells.length;
    }

    constructor(data: ReturnType<GridCell["toObject"]>[][] = null) {
        if (!data) {
            this.resizeGrid(11);
            this.numberCells();
        }
        else {
            data.forEach(rowData => {
                const row = [];
                rowData.forEach(cellData => row.push(new GridCell(cellData)));
                this.cells.push(row);
            })
            this.findAnswers();
        }
    }

    toObject() {
        return this.cells.map(row => row.map(cell => cell.toObject()));
    }

    toggleCell(rowIndex: number, columnIndex: number): GridState {
        this.cells[rowIndex][columnIndex].isWhite = !this.cells[rowIndex][columnIndex].isWhite;
        this.numberCells();
        return this;
    }

    setCellLetter(rowIndex: number, columnIndex: number, letter: string): GridState {
        if (letter.length > 1) {
            throw "Can't put more than one letter in a cell";
        }
        if (!this.cells[rowIndex][columnIndex].isWhite) {
            throw "Can't set a letter on a black square";
        }
        this.cells[rowIndex][columnIndex].answerLetter = letter;
        return this;
    }

    sizeGrid(newSize: number): GridState {
        this.resizeGrid(newSize);
        this.numberCells();
        return this;
    }

    private resizeGrid(newSize: number) {
        const cells = this.cells;
        const oldSize = cells.length;
        if (oldSize === newSize) {
            return this;
        }
        if (oldSize < newSize) {
            for (let rowIndex = 0; rowIndex < newSize; rowIndex++) {
                const createNewRow = rowIndex >= oldSize;
                const row: GridCell[] = createNewRow ? [] : cells[rowIndex];
                for (let columnIndex = createNewRow ? 0 : oldSize; columnIndex < newSize; columnIndex++) {
                    row.push(new GridCell());
                }
                if (createNewRow) {
                    this.cells.push(row);
                }
            }
        }
        else {
            cells.splice(newSize, oldSize - newSize);
            for (let rowIndex = 0; rowIndex < newSize; rowIndex++) {
                cells[rowIndex].splice(newSize, oldSize - newSize);
            }
        }
    }

    // This function depends on the cells already being numbered correctly.
    public findAnswers(): GridAnswer[] {
        const cells = this.cells;
        const size = cells.length;
        const answers: GridAnswer[] = [];
        for (let rowIndex = 0; rowIndex < size; rowIndex++) {
            for (let columnIndex = 0; columnIndex < size; columnIndex++) {
                const cell = cells[rowIndex][columnIndex];
                if (!cell.cellNumber) {
                    continue;
                }

                if ((columnIndex < size - 1 && cells[rowIndex][columnIndex + 1].isWhite)
                    && (columnIndex === 0 || !cells[rowIndex][columnIndex - 1].isWhite)) {
                    let acrossAnswer = cell.answerLetter;
                    for (let columnCursor = columnIndex + 1; columnCursor < size; columnCursor++) {
                        const cursorCell = cells[rowIndex][columnCursor];
                        if (!cursorCell.isWhite) {
                            break;
                        }
                        if (!cursorCell.answerLetter) {
                            acrossAnswer += "_";
                        }
                        else {
                            acrossAnswer += cursorCell.answerLetter;
                        }
                    }
                    const newAnswer = new GridAnswer();
                    newAnswer.row = rowIndex;
                    newAnswer.column = columnIndex;
                    newAnswer.number = cell.cellNumber;
                    newAnswer.direction = "a";
                    newAnswer.answer = acrossAnswer;
                    answers.push(newAnswer);
                }
                if ((rowIndex < size - 1 && cells[rowIndex + 1][columnIndex].isWhite)
                    && (rowIndex === 0 || !cells[rowIndex - 1][columnIndex].isWhite)) {
                    let downAnswer = cell.answerLetter;
                    for (let rowCursor = rowIndex + 1; rowCursor < size; rowCursor++) {
                        const cursorCell = cells[rowCursor][columnIndex];
                        if (!cursorCell.isWhite) {
                            break;
                        }
                        if (!cursorCell.answerLetter) {
                            downAnswer += "_";
                        }
                        else {
                            downAnswer += cursorCell.answerLetter;
                        }
                    }
                    const newAnswer = new GridAnswer();
                    newAnswer.row = rowIndex;
                    newAnswer.column = columnIndex;
                    newAnswer.number = cell.cellNumber;
                    newAnswer.direction = "d";
                    newAnswer.answer = downAnswer;
                    answers.push(newAnswer);
                }
            }
        }
        return answers;
    }

    private numberCells() {
        const cells = this.cells;
        const size = cells.length;
        let clueNumber = 1;
        for (let rowIndex = 0; rowIndex < size; rowIndex++) {
            for (let columnIndex = 0; columnIndex < size; columnIndex++) {
                if (cells[rowIndex][columnIndex].isWhite) {
                    if ((rowIndex === 0 || !cells[rowIndex - 1][columnIndex].isWhite)
                        && rowIndex !== (size - 1) && cells[rowIndex + 1][columnIndex].isWhite) {
                        cells[rowIndex][columnIndex].cellNumber = clueNumber;
                        clueNumber++;
                    }
                    else if ((columnIndex === 0 || !cells[rowIndex][columnIndex - 1].isWhite)
                        && columnIndex !== (size - 1) && cells[rowIndex][columnIndex + 1].isWhite) {
                        cells[rowIndex][columnIndex].cellNumber = clueNumber;
                        clueNumber++;
                    }
                    else {
                        cells[rowIndex][columnIndex].cellNumber = null;
                    }
                }
                else {
                    cells[rowIndex][columnIndex].cellNumber = null;
                }
            }
        }
    }
}
