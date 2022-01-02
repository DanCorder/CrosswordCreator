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
                    const clue = clueState.cluesAndAnswers.find(caa =>
                        caa.strippedAnswer.toLowerCase() === cell.acrossAnswer.toLowerCase());
                    across.push({
                        number: cell.cellNumber,
                        clue: clue?.clue || "???",
                        answerLength: clue?.answerLength || cell.acrossAnswer.length.toString()
                    });
                }
                if (!!cell.downAnswer) {
                    const clue = clueState.cluesAndAnswers.find(caa =>
                        caa.strippedAnswer.toLowerCase() === cell.downAnswer.toLowerCase());
                    down.push({
                        number: cell.cellNumber,
                        clue: clue?.clue || "???",
                        answerLength: clue?.answerLength || cell.downAnswer.length.toString()
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

<div class="content-block clue-container">
    <h2>Across</h2>
    <ul>
        {#each clues.across as clue }
            <li>{clue.number}. {clue.clue} ({clue.answerLength})</li>
        {/each}
    </ul>
    <h2>Down</h2>
    <ul>
        {#each clues.down as clue }
            <li>{clue.number}. {clue.clue} ({clue.answerLength})</li>
        {/each}
    </ul>
</div>

<style lang="scss">
    .clue-container {
        column-count: 2;
    }
    h2 {
        font-size: 15px;
        margin-bottom: 3px;
    }
    ul {
        list-style-type: none;
        padding: 0;
        font-size: 12px;
    }
</style>