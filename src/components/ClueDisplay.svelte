<script lang="ts">
    import type { ClueState } from "../modules/ClueState";

    export let clueState: ClueState;
</script>

<div class="content-block clue-container">
    <h2>Across</h2>
    <ul>
        {#each clueState.acrossClues as clue }
            <li>{clue.answerPosition.number}. {clue.clue} ({clue.answerLength || "?"})</li>
        {/each}
    </ul>
    <h2>Down</h2>
    <ul>
        {#each clueState.downClues as clue }
            <li>{clue.answerPosition.number}. {clue.clue} ({clue.answerLength || "?"})</li>
        {/each}
    </ul>
</div>

<style lang="scss">
    .clue-container {
        column-count: 2;
    }
    h2 {
        font-size: 15px;
        margin-bottom: 3px;
    }
    ul {
        list-style-type: none;
        padding: 0;
        font-size: 12px;
    }
</style>
