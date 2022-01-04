<script lang="ts">
    import type { ClueState } from "../modules/ClueState";

    export let state: ClueState;
</script>

<div class="content-block">
    <h2>Clues and Answers</h2>
    <h3>Across</h3>
    {#each state.acrossClues as clueAndAnswer, index}
        <div class="clue-input">
            <span>{clueAndAnswer.answerPosition.number}</span><span>{clueAndAnswer.answerPosition.answer}</span><span></span>
            <label for="clueText_{index}">Clue:</label><textarea id="clueText_{index}" bind:value={clueAndAnswer.clue} />
            <label for="answer_{index}">Answer:</label><input id="answer_{index}" bind:value={clueAndAnswer.answer} />
        </div>
    {/each}
    <h3>Down</h3>
    {#each state.downClues as clueAndAnswer, index}
        <div class="clue-input">
            <span>{clueAndAnswer.answerPosition.number}</span><span>{clueAndAnswer.answerPosition.answer}</span><span></span>
            <label for="clueText_{index}">Clue:</label><textarea id="clueText_{index}" bind:value={clueAndAnswer.clue} />
            <label for="answer_{index}">Answer:</label><input id="answer_{index}" bind:value={clueAndAnswer.answer} />
        </div>
    {/each}
    <h3>Unknown</h3>
    {#each state.unknownClues as clueAndAnswer, index}
        <div class="clue-input">
            <span>???</span><span>???</span><span></span>
            <label for="clueText_{index}">Clue:</label><textarea id="clueText_{index}" bind:value={clueAndAnswer.clue} />
            <label for="answer_{index}">Answer:</label><input id="answer_{index}" bind:value={clueAndAnswer.answer} />
        </div>
    {/each}
</div>


<style lang="scss">
    $clue-width: 400px;
    $answer-width: 15em;

    .clue-input {
        display: grid;
        grid-template-columns: 5em $answer-width calc($clue-width - $answer-width);
        grid-template-rows: 2em 55px 2em;
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