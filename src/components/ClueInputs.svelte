<script lang="ts">
    import type { ClueState } from "../modules/ClueState";
    import ClueInput from "./ClueInput.svelte";
    import UnassignedClueInput from "./UnassignedClueInput.svelte";

    export let state: ClueState;

</script>

<div class="content-block">
    <h2>Clues and Answers</h2>
    <h3>Across</h3>
    {#each state.acrossClues as clueAndAnswer}
        <ClueInput state={clueAndAnswer} />
    {/each}
    <h3>Down</h3>
    {#each state.downClues as clueAndAnswer}
        <ClueInput state={clueAndAnswer} />
    {/each}
    <h3>Unassigned</h3>
    {#each state.unassignedClues as clueAndAnswer, index}
        <UnassignedClueInput state={clueAndAnswer} />
    {/each}
</div>
