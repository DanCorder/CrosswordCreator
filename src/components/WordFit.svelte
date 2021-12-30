<script lang="ts">
    import type { WordList } from "../modules/WordList";
    import { findMatchingWords } from "../modules/WordList";
    import Result from "./WordResult.svelte";

    export let wordList: WordList;

    let results: string[] = [];
    let pattern = "";

    function handleClick () {
        if (!wordList) {
            alert("Word list not downloaded yet, please try again");
        }
        results = findMatchingWords(pattern, wordList);
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
    <input bind:value={pattern} on:keydown={handleKeyDown}/> <button on:click={handleClick}>Search</button>
    <div>
        {#each results as result}
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