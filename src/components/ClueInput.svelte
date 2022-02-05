<script lang="ts">
    import type { ClueAndAnswer } from "../modules/ClueAndAnswer";
    import { CrosswordStateStore } from "../modules/CrosswordStateStore";
    import { wildcardChar } from "../modules/GridAnswer";
    import { WordFitStore } from "../modules/WordFitStore";

    export let state: ClueAndAnswer;

    function showAddToGridButton(state: ClueAndAnswer): boolean {
        return state.answerPosition.letters.toLowerCase() !== state.strippedAnswer.toLowerCase() &&
            state.answerPosition.matchesAnswer(state.strippedAnswer);
    }
</script>

<div class="clue-container content-section">
    <div class="clue-row">
        {state.answerPosition.number}
        <textarea bind:value={state.clue} on:blur={CrosswordStateStore.refresh} />
    </div>
    <div class="clue-row">
        <label>Answer: <input bind:value={state.answer} on:blur={CrosswordStateStore.refresh} /></label>
        {#if showAddToGridButton(state)}
            <button on:click="{() =>
                CrosswordStateStore.setGridLetters(
                    state.answerPosition.row,
                    state.answerPosition.column,
                    state.answerPosition.direction,
                    state.strippedAnswer)}">Add to grid</button>
        {/if}
    </div>
    <div class="clue-row">
        <span>Grid letters: {state.answerPosition.letters}</span>
        {#if state.answerPosition.letters.split("").some(c => c === "_") 
            && state.answerPosition.letters.split("").some(c => c !== "_") }
            <button on:click="{() => {
                $WordFitStore.pattern = state.answerPosition.letters.replaceAll(wildcardChar, ".");
                WordFitStore.findWords();
            }}">Find possibilities</button>
        {/if}
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
            margin-left: 0.7em;
        }

        input {
            width: 170px;
        }
    }


</style>
