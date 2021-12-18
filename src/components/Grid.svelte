<script lang="ts">
    import { Grid } from "../modules/Grid";

    let grid = new Grid();

    function cellClickHandler(rowIndex: number, columnIndex: number) {
        grid = grid.toggleCell(rowIndex, columnIndex);
    }
</script>

<div class="content-block">
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