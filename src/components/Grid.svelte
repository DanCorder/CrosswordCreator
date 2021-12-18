<script lang="ts">
    import { Grid } from "../modules/Grid";

    let gridSize = 11;
    let grid = new Grid(gridSize);

    function cellClickHandler(rowIndex: number, columnIndex: number) {
        grid = grid.toggleCell(rowIndex, columnIndex);
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
    <table class="grid">
        <tbody>
            {#each grid.Cells as row, rowIndex}
                <tr>
                    {#each row as cell, columnIndex}
                        <td class="cell {cell.IsWhite ? "white" : "black"}" on:click={() => cellClickHandler(rowIndex, columnIndex)}>
                            {cell.CellNumber ?? ""}
                        </td>
                    {/each}
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<style>
    .grid {
        border-collapse: collapse;
    }
    .cell {
        height: 50px;
        width: 50px;
        border: solid 2px black;
        font-size: 11px;
        vertical-align: top;
    }
    .white {
        background-color: white;
    }
    .black {
        background-color: black;
    }
</style>