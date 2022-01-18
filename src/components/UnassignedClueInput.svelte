<script lang="ts">
    import type { ClueAndAnswer } from "../modules/ClueAndAnswer";

    export let state: ClueAndAnswer;
</script>

<div class="clue-container">
    <div class="clue-row">
        ? <textarea bind:value={state.clue} />
    </div>
    <div class="clue-row">
        <label>Answer:<input bind:value={state.answer} /></label>
    </div>
</div>

<style lang="scss">
    .clue-container {
        font-size: 12px;
        margin-bottom: 15px;
        width: 320px;
    }

    .clue-row {
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        textarea {
            height: 55px;
            width: 300px;
        }
            
        input {
            width: 170px;
        }
    }
</style>