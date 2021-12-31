<script lang="ts">
    import type { ClueState } from "../modules/ClueState";
    import { GridState } from "../modules/GridState";

    export let gridState: GridState;
    export let clueState: ClueState;

    $: clues = generateClues(gridState, clueState);

    type diplayClue = {
        number: number;
        clue: string;
        answerLength: string;
    }

    function generateClues(gridState: GridState, clueState: ClueState) {
        const across: diplayClue[] = [];
        const down: diplayClue[] = [];

        const cells = gridState.cells;
        const size = gridState.cells.length;
        
        for (let rowIndex = 0; rowIndex < size; rowIndex++) {
            for (let columnIndex = 0; columnIndex < size; columnIndex++) {
                const cell = cells[rowIndex][columnIndex];
                if (!!cell.acrossAnswer) {
                    across.push({
                        number: cell.cellNumber,
                        clue: "test clue", // qq:DCC
                        answerLength: cell.acrossAnswer.length.toString() // qq:DCC
                    });
                }
                if (!!cell.downAnswer) {
                    down.push({
                        number: cell.cellNumber,
                        clue: "test clue", // qq:DCC
                        answerLength: cell.downAnswer.length.toString() // qq:DCC
                    });
                }
            }
        }
        
        return {
            across: across,
            down: down
        };
    }
</script>

<div class="content-block">
    <h2>Across</h2>
    <div>
        <ul>
            {#each clues.across as clue }
                <li>{clue.number}. {clue.clue} ({clue.answerLength})</li>
            {/each}
        </ul>
    </div>
    <h2>Down</h2>
    <div>
        <ul>
            {#each clues.down as clue }
                <li>{clue.number}. {clue.clue} ({clue.answerLength})</li>
            {/each}
        </ul>
    </div>
</div>
