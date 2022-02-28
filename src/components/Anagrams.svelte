<script lang="ts">
    import { AnagramList, AnagramResult, createAnagramList, findAllSingleWordAnagrams, findAnagrams } from "../modules/Anagramer";
    import Result from './AnagramResult.svelte';
    import { WordListStore } from "../modules/WordListStore";

    let anagramList: AnagramList = null;
    WordListStore.subscribe(wl => anagramList = createAnagramList(wl));

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
        if (!anagramList) {
            alert("Word list not downloaded yet, please try again");
        }
        results = findAllSingleWordAnagrams(letters, anagramList, minimumWordLength, excludedWords);
	}

    function findAllAnagrams () {
        if (!anagramList) {
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
    <div class="content-section">
        <p>
            <input bind:value={letters} on:keydown={handleKeyDownAll} />
            Minimum word length
            <select bind:value={minimumWordLength}>
                <option>{2}</option>
                <option>{3}</option>
                <option>{4}</option>
                <option>{5}</option>
                <option>{6}</option>
                <option>{7}</option>
                <option>{8}</option>
                <option>{9}</option>
                <option>{10}</option>
                <option>{11}</option>
                <option>{12}</option>
                <option>{13}</option>
                <option>{14}</option>
                <option>{15}</option>
            </select>
        </p>
        <p><button on:click={findSingleWordAnagrams}>Find single words</button> Find all single word anagrams within the input, not necessarily using all letters</p>
        <p><button on:click={findAllAnagrams}>Find full anagrams</button> Find full multi-word anagrams (up to 1000 results)</p>
        <p><textarea bind:value={excludedWordsString}></textarea> Excluded words (one per line)</p>
        <p><textarea bind:value={includedWordsString}></textarea> Included words (one per line)</p>
    </div>
    <div class="content-section">
        {#each results as result}
            <Result {result} />
        {:else}
            <div class="no-results">No results</div>
        {/each}
    </div>
</div>

<style lang="scss">
    .content-section:not(:last-child) {
        margin-bottom: 15px;
    }
</style>
