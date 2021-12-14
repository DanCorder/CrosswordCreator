<script lang="ts">
    import type { WordList } from "../modules/WordList";
    import { AnagramList, createAnagramList, findAllSingleWordAnagrams } from "../modules/AnagramList";

    export let wordList: WordList;
    let anagramList: AnagramList;
    $: anagramList = !wordList ? null : createAnagramList(wordList);

    let results: string[] = [];
    let letters = "";

    function handleClick () {
        if (!wordList) {
            alert("Word list not downloaded yet, please try again");
        }
        results = findAllSingleWordAnagrams(letters, anagramList);
	}
</script>

<div class="content-block">
    <h2>Find Single Anagrams</h2>
    <p>Find all single word anagrams within the input, not necessarily using all letters</p>
    <input bind:value={letters} /> <button on:click={handleClick}>Search</button>
    <div>
        {#each results as result}
            {result}
        {/each}
    </div>
</div>