<script lang="ts">
    import type { ClueAndAnswer } from "../modules/ClueAndAnswer";

    export let state: ClueAndAnswer;
</script>

<div class="clue-input">
    <label>Clue:<textarea bind:value={state.clue} /></label><br/>
    <label>Answer:<input bind:value={state.answer} /></label><br/>
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