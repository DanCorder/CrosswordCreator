<script lang="ts">
    import type { GridState } from "../modules/GridState";

    export let state:GridState;

    $: gridSizeInput = state.size;
    let hideLetters = false;
    let currentCellRow: number = null;
    let currentCellColumn: number = null;
    let cells: HTMLTableCellElement[][] = [];
    initialiseCells();

    function initialiseCells() {
        for (let i = 0; i < state.size; i++) {
            cells.push([])
        }
    }

    function cellFocusHandler(rowIndex: number, columnIndex: number) {
        currentCellRow = rowIndex;
        currentCellColumn = columnIndex;
    }

    function cellKeyDownHandler(rowIndex: number, columnIndex: number, event: KeyboardEvent) {
        event.preventDefault();
        switch (event.key) {
            case " ":
                state = state.toggleCell(rowIndex, columnIndex);
                break;
            case "Backspace":
            case "Delete":
                state = state.setCellLetter(rowIndex, columnIndex, "");
                break;
            case "ArrowUp":
                currentCellRow = Math.max(0, currentCellRow - 1);
                break;
            case "ArrowDown":
                currentCellRow = Math.min(state.size - 1, currentCellRow + 1);
                break;
            case "ArrowLeft":
                currentCellColumn = Math.max(0, currentCellColumn - 1);
                break;
            case "ArrowRight":
                currentCellColumn = Math.min(state.size - 1, currentCellColumn + 1);
                break;
            default:
                if (event.key.match(/[a-z]/i)) {
                    state = state.setCellLetter(rowIndex, columnIndex, event.key.toUpperCase());
                }
        }
        cells[currentCellRow][currentCellColumn].focus();
    }

    function sizeChangeHandler() {
        state = state.sizeGrid(gridSizeInput);
        currentCellRow = Math.min(currentCellRow, gridSizeInput - 1);
        currentCellColumn = Math.min(currentCellColumn, gridSizeInput - 1);

        initialiseCells();
    }
</script>

<div class="content-block">
    <h2>Grid</h2>
    <p>Click to select a cell. Type to enter letters, use space to toggle black/white, move with arrow keys. Clue numbers will update automatically.</p>
    <p>
        <span class="grid-setting">
            Size: <select bind:value={gridSizeInput} on:change={sizeChangeHandler}>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
                <option value={6}>6</option>
                <option value={7}>7</option>
                <option value={8}>8</option>
                <option value={9}>9</option>
                <option value={10}>10</option>
                <option value={11}>11</option>
                <option value={12}>12</option>
                <option value={13}>13</option>
                <option value={14}>14</option>
                <option value={15}>15</option>
            </select>
        </span>
        <span class="grid-setting">
            Hide answers: <input type="checkbox" bind:checked={hideLetters} />
        </span>
    </p>
    <table class="grid">
        <tbody>
            {#each state.cells as row, rowIndex}
                <tr>
                    {#each row as cell, columnIndex}
                        <td tabindex="0"
                            class="cell {cell.isWhite ? "white" : "black"}"
                            on:focus={() => cellFocusHandler(rowIndex, columnIndex)}
                            on:keydown={(ev) => cellKeyDownHandler(rowIndex, columnIndex, ev)}
                            bind:this={cells[rowIndex][columnIndex]}>
                            {#if cell.isWhite}
                                <div class="cell-layout">
                                    <div class="cell-number" >
                                        {cell.cellNumber ?? ""}
                                    </div>
                                    {#if !hideLetters}
                                        <div class="cell-letter">
                                            {cell.answerLetter}
                                        </div>
                                    {/if}
                                </div>
                            {/if}
                        </td>
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<style lang="scss">
    .grid-setting {
        margin-right: 1.5em;
    }
    .grid {
        border-collapse: collapse;
    }
    .cell {
        padding: 0;
        height: 50px;
        width: 50px;
        border: solid 2px black;
    }
    .cell-layout {
        display: grid;
        grid-template-columns: 14px 34px;
        grid-template-rows: 14px 34px;
    }
    .cell-number {
        font-size: 11px;
        grid-row: 1 / 2;
        grid-column: 1 / 2;
        z-index: 1;
    }
    .cell-letter {
        text-align: center;
        line-height: 48px;
        grid-row: 1 / 3;
        grid-column: 1 / 3;
        font-size: 30px;
    }
    .white {
        background-color: white;
        &:focus {
            background-color: rgb(158, 217, 235);
        }
    }
    .black {
        background-color: black;
        &:focus {
            background-color: rgb(80, 107, 116);
        }
    }
</style>