<script lang="ts">
    import type { ClueAndAnswer } from "../modules/ClueAndAnswer";
    import { CrosswordStateStore } from "../modules/CrosswordStateStore";

    export let state: ClueAndAnswer;

    function showAddToGridButton(state: ClueAndAnswer): boolean {
        return state.answerPosition.letters.toLowerCase() !== state.answer.toLowerCase() &&
            state.answerPosition.matchesAnswer(state.answer);
    }
</script>

<div class="clue-input">
    {state.answerPosition.number}<br/>
    Grid answer: {state.answerPosition.letters}<br/>
    <label>Clue:<textarea bind:value={state.clue} on:blur="{() => CrosswordStateStore.setClueText(state.answerPosition.number, state.answerPosition.direction, state.clue)}" /></label><br/>
    <label>Answer:<input bind:value={state.answer} on:blur="{() => CrosswordStateStore.setAnswerText(state.answerPosition.number, state.answerPosition.direction, state.answer)}" /></label><br/>
    {#if showAddToGridButton(state)}
        <button on:click="{() =>
            CrosswordStateStore.setGridLetters(
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