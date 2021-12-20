<script lang="ts">
    import { Grid } from "../modules/Grid";

    let gridSize = 11;
    let grid = new Grid(gridSize);
    let clickType: "fill" | "text" = "fill";
    let currentCellRow = 0;
    let currentCellColumn = 0;

    function cellClickHandler(rowIndex: number, columnIndex: number) {
        if (clickType === "fill") {
            grid = grid.toggleCell(rowIndex, columnIndex);
        } else {
            currentCellRow = rowIndex;
            currentCellColumn = columnIndex;
        }
    }

    function cellKeyDownHandler(rowIndex: number, columnIndex: number, event: KeyboardEvent) {
        event.preventDefault();
        if (event.key === "Backspace" || event.key === "Delete") {
            grid = grid.setCellLetter(rowIndex, columnIndex, "");
        }
        else if (event.key.match(/[a-z]/i)) {
            grid = grid.setCellLetter(rowIndex, columnIndex, event.key.toUpperCase());
        }
    }

    function sizeChangeHandler() {
        grid = grid.sizeGrid(gridSize);
    }
</script>

<div class="content-block">
    <p>Size: <select bind:value={gridSize} on:change={sizeChangeHandler}>
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
    </p>
    <fieldset>
        <legend>Click behaviour</legend>
        Fill <input type="radio" bind:group={clickType} value="fill"/>
        Text <input type="radio" bind:group={clickType} value="text"/>
    </fieldset>
    <table class="grid">
        <tbody>
            {#each grid.Cells as row, rowIndex}
                <tr>
                    {#each row as cell, columnIndex}
                        {#if cell.IsWhite}
                            <td class="cell white {clickType === "text" && rowIndex === currentCellRow && columnIndex === currentCellColumn ? "active" : ""}"
                                on:click={() => cellClickHandler(rowIndex, columnIndex)}>
                                <div class="cell-layout">
                                    <div class="cell-number" >
                                        {cell.CellNumber ?? ""}
                                    </div>
                                    <div class="cell-letter">
                                        {#if clickType === "text" && rowIndex === currentCellRow && columnIndex === currentCellColumn}
                                            <input id="cellInput" autofocus value="{cell.AnswerLetter}" on:keydown={(ev) => cellKeyDownHandler(rowIndex, columnIndex, ev)} />
                                        {:else}
                                            {cell.AnswerLetter}
                                        {/if}
                                    </div>
                                </div>
                            </td>
                        {:else}
                            <td class="cell black" on:click={() => cellClickHandler(rowIndex, columnIndex)} />
                        {/if}
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<style lang="scss">
    fieldset {
        display: inline-block;
        margin-bottom: 10px;
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
        position: relative;
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
        input {
            font-family: Verdana;
            font-size: 30px;
            text-align: center;
        }
    }
    .white {
        background-color: white;
        &.active {
            background-color: rgb(158, 217, 235);
            input {
                height: 100%;
                width: 100%;
                border: 0;
                padding: 0;
                margin: 0;
                position: absolute;
                top: 0;
                left: 0;
            }
        }
    }
    .black {
        background-color: black;
    }
</style>