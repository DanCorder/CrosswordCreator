<script lang="ts">
import type { ClueAndAnswer } from "../modules/ClueAndAnswer";

    import type { CrosswordState } from "../modules/CrosswordState";

    export let state: CrosswordState;

    function syncWithGrid() {
        state = state.syncCluesAndGrid();
    }

    function showAddToGridButton(clueAndAnswer: ClueAndAnswer): boolean {
        return clueAndAnswer.answerPosition.answer.toLowerCase() !== clueAndAnswer.answer.toLowerCase() &&
            clueAndAnswer.answerPosition.matchesAnswer(clueAndAnswer.answer);
    }
</script>

<div class="content-block">
    <h2>Clues and Answers</h2>
    <h3>Across</h3>
    {#each state.clues.acrossClues as clueAndAnswer, index}
        <div class="clue-input">
            {clueAndAnswer.answerPosition.number}<br/>
            Grid answer: {clueAndAnswer.answerPosition.answer}<br/>
            <label for="clueText_{index}">Clue:</label><textarea id="clueText_{index}" bind:value={clueAndAnswer.clue} /><br/>
            <label for="answer_{index}">Answer:</label><input id="answer_{index}" bind:value={clueAndAnswer.answer} on:blur="{syncWithGrid}" /><br/>
            {#if showAddToGridButton(clueAndAnswer)}
                <button on:click="{() =>
                    state = state.addAnswerToGrid(
                        clueAndAnswer.answerPosition.row,
                        clueAndAnswer.answerPosition.column,
                        "a",
                        clueAndAnswer.answer)}">Add to grid</button>
            {/if}
        </div>
    {/each}
    <h3>Down</h3>
    {#each state.clues.downClues as clueAndAnswer, index}
        <div class="clue-input">
            {clueAndAnswer.answerPosition.number}<br/>
            Grid answer: {clueAndAnswer.answerPosition.answer}<br/>
            <label for="clueText_{index}">Clue:</label><textarea id="clueText_{index}" bind:value={clueAndAnswer.clue} /><br/>
            <label for="answer_{index}">Answer:</label><input id="answer_{index}" bind:value={clueAndAnswer.answer} on:blur="{syncWithGrid}" /><br/>
            {#if showAddToGridButton(clueAndAnswer)}
                <button on:click="{() =>
                    state = state.addAnswerToGrid(
                        clueAndAnswer.answerPosition.row,
                        clueAndAnswer.answerPosition.column,
                        "d",
                        clueAndAnswer.answer)}">Add to grid</button>
            {/if}
        </div>
    {/each}
    <h3>Unassigned</h3>
    {#each state.clues.unassignedClues as clueAndAnswer, index}
        <div class="clue-input">
            <span>???</span><span>???</span><span></span>
            <label for="clueText_{index}">Clue:</label><textarea id="clueText_{index}" bind:value={clueAndAnswer.clue} />
            <label for="answer_{index}">Answer:</label><input id="answer_{index}" bind:value={clueAndAnswer.answer} on:blur={syncWithGrid} />
        </div>
    {/each}
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