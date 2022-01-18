<script lang="ts">
    import type { ClueAndAnswer } from "../modules/ClueAndAnswer";
    import { CrosswordStateStore } from "../modules/CrosswordStateStore";

    export let state: ClueAndAnswer;

    function showAddToGridButton(state: ClueAndAnswer): boolean {
        return state.answerPosition.letters.toLowerCase() !== state.answer.toLowerCase() &&
            state.answerPosition.matchesAnswer(state.answer);
    }
</script>

<div class="clue-container">
    <div class="clue-row">
        {state.answerPosition.number}
        <textarea bind:value={state.clue} on:blur="{() => CrosswordStateStore.setClueText(state.answerPosition.number, state.answerPosition.direction, state.clue)}" />
    </div>
    <div class="clue-row">
        <label>Answer: <input bind:value={state.answer} on:blur="{() => CrosswordStateStore.setAnswerText(state.answerPosition.number, state.answerPosition.direction, state.answer)}" /></label>
        {#if showAddToGridButton(state)}
            <button on:click="{() =>
                CrosswordStateStore.setGridLetters(
                    state.answerPosition.row,
                    state.answerPosition.column,
                    state.answerPosition.direction,
                    state.answer)}">Add to grid</button>
        {/if}
    </div>
    <div class="clue-row">
        Grid letters: {state.answerPosition.letters}<br/>
    </div>
</div>

<style lang="scss">
    .clue-container {
        font-size: 12px;
        margin-bottom: 1em;
        width: 320px;
    }

    .clue-row {
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        textarea {
            height: 55px;
            width: 300px;
        }
            
        input {
            width: 170px;
        }
    }


</style>