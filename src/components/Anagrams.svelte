<script lang="ts">
    import type { WordList } from "../modules/WordList";
    import { AnagramList, AnagramResult, createAnagramList, findAllSingleWordAnagrams, findAnagrams } from "../modules/Anagramer";
    import Result from './Result.svelte';

    export let wordList: WordList;
    let anagramList: AnagramList;
    $: anagramList = !wordList ? null : createAnagramList(wordList);

    let results: AnagramResult[] = [];
    let letters = "";

    function findSingleWordAnagrams () {
        if (!wordList) {
            alert("Word list not downloaded yet, please try again");
        }
        results = findAllSingleWordAnagrams(letters, anagramList);
	}

    function findAllAnagrams () {
        if (!wordList) {
            alert("Word list not downloaded yet, please try again");
        }
        results = findAnagrams(letters, anagramList);
	}
</script>

<div class="content-block">
    <h2>Find Anagrams</h2>
    <p><button on:click={findSingleWordAnagrams}>Find single words</button> Find all single word anagrams within the input, not necessarily using all letters</p>
    <p><button on:click={findAllAnagrams}>Find full anagrams</button> Find full multi-word anagrams (up to 1000 results)</p>
    <input bind:value={letters} />
    <div>
        {#each results as result}
            <Result {result} />
        {/each}
    </div>
</div>