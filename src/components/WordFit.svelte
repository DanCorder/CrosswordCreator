<script lang="ts">
    import { WordFitStore } from "../modules/WordFitStore";
    import Result from "./WordResult.svelte";

    function handleClick () {
        WordFitStore.findWords();
	}

    function handleKeyDown(event: KeyboardEvent) {
        if (event.key === "Enter") {
            handleClick();
        }
    }
</script>

<div class="content-block">
    <h2>Find Words That Fit</h2>
    <p>Enter the pattern to match below. Use letters where you have them and '.' or space for empty spaces</p>
    <input bind:value={$WordFitStore.pattern} on:keydown={handleKeyDown}/> <button on:click={handleClick}>Search</button>
    <div>
        {#each $WordFitStore.matches as result}
            <Result {result} />
        {:else}
            <div class="no-results">No results</div>
        {/each}
    </div>
</div>

<style lang="scss">
    div.no-results {
        margin-top: 0.5em;
    }
</style>