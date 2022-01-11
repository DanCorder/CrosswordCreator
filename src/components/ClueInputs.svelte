<script lang="ts">
    import type { ClueState } from "../modules/ClueState";
    import type { CrosswordState } from "../modules/CrosswordState";
    import ClueInput from "./ClueInput.svelte";

    export let crosswordState: CrosswordState;
    export let state: ClueState;

</script>

<div class="content-block">
    <h2>Clues and Answers</h2>
    <h3>Across</h3>
    {#each state.acrossClues as clueAndAnswer}
        <ClueInput state={clueAndAnswer} bind:crosswordState={crosswordState} />
    {/each}
    <h3>Down</h3>
    {#each state.downClues as clueAndAnswer}
        <ClueInput state={clueAndAnswer} bind:crosswordState={crosswordState} />
    {/each}
    <h3>Unassigned</h3>
    {#each state.unassignedClues as clueAndAnswer, index}
        <div class="clue-input">
            <label for="clueText_{index}">Clue:</label><textarea id="clueText_{index}" bind:value={clueAndAnswer.clue} /><br/>
            <label for="answer_{index}">Answer:</label><input id="answer_{index}" bind:value={clueAndAnswer.answer} />
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
