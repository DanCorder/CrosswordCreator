class GridCell {
    IsWhite = true;
    CellNumber: number = null;
    AnswerLetter: string = "";
}

export class GridState {
    // Due to the way Svelte binds values we need to index cells by row then column (y then x).
    Cells: GridCell[][] = [];
    get Size() {
        return this.Cells.length;
    }

    constructor(size: number) {
        this.resizeGrid(size);
        this.numberCells();
    }

    toggleCell(rowIndex: number, columnIndex: number): GridState {
        this.Cells[rowIndex][columnIndex].IsWhite = !this.Cells[rowIndex][columnIndex].IsWhite;
        this.numberCells();
        return this;
    }

    setCellLetter(rowIndex: number, columnIndex: number, letter: string): GridState {
        if (letter.length > 1) {
            throw "Can't put more than one letter in a cell";
        }
        if (!this.Cells[rowIndex][columnIndex].IsWhite) {
            throw "Can't set a letter on a black square";
        }
        this.Cells[rowIndex][columnIndex].AnswerLetter = letter;
        return this;
    }

    sizeGrid(newSize: number): GridState {
        this.resizeGrid(newSize);
        this.numberCells();
        return this;
    }

    private resizeGrid(newSize: number) {
        const cells = this.Cells;
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
                    this.Cells.push(row);
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

    private numberCells() {
        const cells = this.Cells;
        const size = cells.length;
        let clueNumber = 1;
        for (let rowIndex = 0; rowIndex < size; rowIndex++) {
            for (let columnIndex = 0; columnIndex < size; columnIndex++) {
                if (cells[rowIndex][columnIndex].IsWhite) {
                    if ((rowIndex === 0 || !cells[rowIndex - 1][columnIndex].IsWhite)
                        && rowIndex !== (size - 1) && cells[rowIndex + 1][columnIndex].IsWhite) {
                        cells[rowIndex][columnIndex].CellNumber = clueNumber;
                        clueNumber++;
                    }
                    else if ((columnIndex === 0 || !cells[rowIndex][columnIndex - 1].IsWhite)
                        && columnIndex !== (size - 1) && cells[rowIndex][columnIndex + 1].IsWhite) {
                        cells[rowIndex][columnIndex].CellNumber = clueNumber;
                        clueNumber++;
                    }
                    else {
                        cells[rowIndex][columnIndex].CellNumber = null;
                    }
                }
                else {
                    cells[rowIndex][columnIndex].CellNumber = null;
                }
            }
        }
    }
}
