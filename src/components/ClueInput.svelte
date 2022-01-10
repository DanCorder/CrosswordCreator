<script lang="ts">
    import type { ClueAndAnswer } from "../modules/ClueAndAnswer";

    export let clueAndAnswer: ClueAndAnswer;

    function showAddToGridButton(clueAndAnswer: ClueAndAnswer): boolean {
        return clueAndAnswer.answerPosition.answer.toLowerCase() !== clueAndAnswer.answer.toLowerCase() &&
            clueAndAnswer.answerPosition.matchesAnswer(clueAndAnswer.answer);
    }
</script>

<div class="clue-input">
    {clueAndAnswer.answerPosition.number}<br/>
    Grid answer: {clueAndAnswer.answerPosition.answer}<br/>
    <label>Clue:<textarea bind:value={clueAndAnswer.clue} /></label><br/>
    <label>Answer:<input bind:value={clueAndAnswer.answer} on:blur="{syncWithGrid}" /></label><br/>
    {#if showAddToGridButton(clueAndAnswer)}
        <button on:click="{() =>
            state = state.addAnswerToGrid(
                clueAndAnswer.answerPosition.row,
                clueAndAnswer.answerPosition.column,
                clueAndAnswer.answerPosition.direction,
                clueAndAnswer.answer)}">Add to grid</button>
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