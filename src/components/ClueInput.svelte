<script lang="ts">
    import type { ClueAndAnswer } from "../modules/ClueAndAnswer";
    import type { CrosswordState } from "../modules/CrosswordState";

    export let state: ClueAndAnswer;
    export let crosswordState: CrosswordState;

    function showAddToGridButton(state: ClueAndAnswer): boolean {
        return state.answerPosition.answer.toLowerCase() !== state.answer.toLowerCase() &&
            state.answerPosition.matchesAnswer(state.answer);
    }
</script>

<div class="clue-input">
    {state.answerPosition.number}<br/>
    Grid answer: {state.answerPosition.answer}<br/>
    <label>Clue:<textarea bind:value={state.clue} /></label><br/>
    <label>Answer:<input bind:value={state.answer} on:blur="{() => crosswordState = crosswordState.syncCluesAndGrid()}" /></label><br/>
    {#if showAddToGridButton(state)}
        <button on:click="{() =>
            crosswordState = crosswordState.addAnswerToGrid(
                state.answerPosition.row,
                state.answerPosition.column,
                state.answerPosition.direction,
                state.answer)}">Add to grid</button>
    {/if}
</div>

<style lang="scss">
    // qq:DCC sort out styling
    $clue-width: 400px;
    $answer-width: 15em;

    .clue-input {
        margin-bottom: 1em;
    }
    textarea {
        height: 55px;
        width: $clue-width;
    }
    input {
        width: $answer-width;
    }
</style>