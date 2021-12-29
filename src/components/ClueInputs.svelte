<script lang="ts">
    import { ClueAndAnswer } from "../modules/ClueAndAnswer";

    let clueAndAnswers:ClueAndAnswer[] = [new ClueAndAnswer()];

    function addNewClue() {
        clueAndAnswers = clueAndAnswers.concat([new ClueAndAnswer()]);
    }

    function removeClue(indexToRemove: number) {
        clueAndAnswers = clueAndAnswers.filter((clueAndAnswers, index) => index != indexToRemove)
    }
</script>

<div class="content-block">
    <h2>Clues and Answers</h2>
    {#each clueAndAnswers as clueAndAnswer, index}
        <div class="clue-input">
            <label for="clueText_{index}">Clue:</label><textarea id="clueText_{index}" bind:value={clueAndAnswer.Clue} />
            <label for="answer_{index}">Answer:</label><input id="answer_{index}" bind:value={clueAndAnswer.Answer} />
            <button on:click={() => removeClue(index)}>Delete</button>
        </div>
    {/each}
    <button on:click={addNewClue}>Add</button>
</div>


<style lang="scss">
    $clue-width: 400px;
    $answer-width: 15em;

    .clue-input {
        display: grid;
        grid-template-columns: 5em $answer-width calc($clue-width - $answer-width);
        grid-template-rows: 55px 2em;
        row-gap: 3px;
        column-gap: 3px;
        margin-bottom: 1em;
    }
    textarea {
        height: 55px;
        width: $clue-width;
        grid-column: 2 / 4;
    }
    input {
        width: $answer-width;
    }
</style>