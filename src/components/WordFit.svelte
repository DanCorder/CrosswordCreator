<script lang="ts">
    import type { WordList } from "../modules/WordList";
    import { findMatchingWords } from "../modules/WordList";

    export let wordList: WordList;

    let results: string[] = [];
    let pattern = "";

    function handleClick () {
        if (!wordList) {
            alert("Word list not downloaded yet, please try again");
        }
        results = findMatchingWords(pattern, wordList);
	}
</script>

<div class="content-block">
    <h2>Find Words That Fit</h2>
    <p>Enter the pattern to match below. Use letters where you have them and '.' or space for empty spaces</p>
    <input bind:value={pattern} /> <button on:click={handleClick}>Search</button>
    <div>
        {#each results as result}
            {result}
        {/each}
    </div>
</div>