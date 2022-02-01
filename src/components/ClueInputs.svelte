<script lang="ts">
    import type { ClueState } from "../modules/ClueState";
    import ClueInput from "./ClueInput.svelte";
    import UnassignedClueInput from "./UnassignedClueInput.svelte";

    export let state: ClueState;

</script>

<div class="content-block">
    <h2>Clues and Answers</h2>
    <div class="column-container">
        <div>
            <h3>Across</h3>
            {#each state.acrossClues as clueAndAnswer}
                <ClueInput state={clueAndAnswer} />
            {/each}
        </div>
        <div>
            <h3>Down</h3>
            {#each state.downClues as clueAndAnswer}
                <ClueInput state={clueAndAnswer} />
            {/each}
        </div>
        {#if state.unassignedClues.length > 0}
            <div>
                <h3>Unassigned</h3>
                {#each state.unassignedClues as clueAndAnswer, index}
                    <UnassignedClueInput state={clueAndAnswer} />
                {/each}
            </div>
        {/if}
    </div>
</div>

<style lang="scss">
    h3 {
        font-size: 15px;
        margin-bottom: 8px;
    }

    .column-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
    }
</style>