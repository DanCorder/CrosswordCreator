<script lang="ts">
    import type { WordList } from "../modules/WordList";
    import { AnagramList, AnagramResult, createAnagramList, findAllSingleWordAnagrams, findAnagrams } from "../modules/Anagramer";
    import Result from './AnagramResult.svelte';

    export let wordList: WordList;
    let anagramList: AnagramList;
    $: anagramList = !wordList ? null : createAnagramList(wordList);

    let results: AnagramResult[] = [];
    let letters = "";
    let minimumWordLength = 3;
    let excludedWordsString = "";
    let excludedWords: string[];
    $: excludedWords = excludedWordsString.split("\n").filter(w => w !== "");
    let includedWordsString = "";
    let includedWords: string[];
    $: includedWords = includedWordsString.split("\n").filter(w => w !== "");

    function findSingleWordAnagrams () {
        if (!wordList) {
            alert("Word list not downloaded yet, please try again");
        }
        results = findAllSingleWordAnagrams(letters, anagramList, minimumWordLength, excludedWords);
	}

    function findAllAnagrams () {
        if (!wordList) {
            alert("Word list not downloaded yet, please try again");
        }
        results = findAnagrams(letters, anagramList, minimumWordLength, excludedWords, includedWords);
	}

    function handleKeyDownAll(event: KeyboardEvent) {
        if (event.key === "Enter") {
            findAllAnagrams();
        }
    }
</script>

<div class="content-block">
    <h2>Find Anagrams</h2>
    <p>
        <input bind:value={letters} on:keydown={handleKeyDownAll} />
        Minimum word length
        <select bind:value={minimumWordLength}>
            <option value={1}>1</option>
            <option value={2}>2</option>
            <option value={3}>3</option>
            <option value={4}>4</option>
            <option value={5}>5</option>
            <option value={6}>6</option>
            <option value={7}>7</option>
            <option value={8}>8</option>
            <option value={9}>9</option>
            <option value={10}>10</option>
            <option value={11}>11</option>
            <option value={12}>12</option>
            <option value={13}>13</option>
            <option value={14}>14</option>
            <option value={15}>15</option>
        </select>
    </p>
    <p><button on:click={findSingleWordAnagrams}>Find single words</button> Find all single word anagrams within the input, not necessarily using all letters</p>
    <p><button on:click={findAllAnagrams}>Find full anagrams</button> Find full multi-word anagrams (up to 1000 results)</p>
    <p><textarea bind:value={excludedWordsString}></textarea> Excluded words (one per line)</p>
    <p><textarea bind:value={includedWordsString}></textarea> Included words (one per line)</p>
    <div>
        {#if results.length > 0}
            {#each results as result}
                <Result {result} />
            {/each}
        {:else}
            <div class="no-results">No results</div>
        {/if}
    </div>
</div>

<style>
    div.no-results {
        margin-top: 0.5em;
    }
</style>
