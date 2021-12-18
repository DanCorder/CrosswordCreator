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
    }
}

export class GridCell {
    IsWhite = true;
    CellNumber: number = null;
}