<script lang="ts">
    import type { AnswerPosition } from "../modules/SharedTypes";
    import type { ClueAndAnswer } from "../modules/ClueAndAnswer";
    import { CrosswordStateStore } from "../modules/CrosswordStateStore";

    export let state: ClueAndAnswer;
    let selectedPosition: AnswerPosition;

    function assign() {
        CrosswordStateStore.assignClue(selectedPosition, state);
        selectedPosition = null;
    }

    function deleteClue() {
        CrosswordStateStore.deleteClue(state);
    }
</script>

<div class="clue-container">
    <div class="clue-row">
        ? <textarea bind:value={state.clue} on:blur={CrosswordStateStore.refresh} />
    </div>
    <div class="clue-row">
        <label>Answer: <input bind:value={state.answer} on:blur={CrosswordStateStore.refresh} /></label>
    </div>
    <div class="clue-row">
        <span>Assign to:
            <select bind:value={selectedPosition} on:change={assign}>
                <option value={null}>--------</option>
                {#each state.possiblePositions as position }
                    <option value={position}>{position.number} {position.direction === "a" ? "across" : "down" }</option>
                {/each}
            </select>
        </span>
        <button on:click="{deleteClue}">Delete</button>
    </div>
</div>

<style lang="scss">
    .clue-container {
        font-size: 12px;
        margin-bottom: 1em;
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