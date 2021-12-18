export class Grid {
    // Due to the way Svelte binds values we need to index cells by row then column (y then x).
    Cells: GridCell[][] = [];

    constructor() {
        const initialSize = 11;

        for (let y = 0; y < initialSize; y++) {
            const row: GridCell[] = [];
            for (let x = 0; x < initialSize; x++) {
                row.push(new GridCell());
            }
            this.Cells.push(row);
        }
        this.numberCells();
    }

    toggleCell(rowIndex: number, columnIndex: number): Grid {
        this.Cells[rowIndex][columnIndex].IsWhite = !this.Cells[rowIndex][columnIndex].IsWhite;
        this.numberCells();
        return this;
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
            }
        }
    }
}

class GridCell {
    IsWhite = true;
    CellNumber: number = null;
}