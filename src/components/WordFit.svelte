<script lang="ts">
    import { PatternPosition } from "../modules/WordFit";
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

<div>
    <h2>Find Words That Fit</h2>
    <p>Enter the pattern to match below. Use letters where you have them and '.' or space for empty spaces</p>
    <div class="content-section">
        <p><input bind:value={$WordFitStore.pattern} on:keydown={handleKeyDown}/> <button on:click={handleClick}>Search</button></p>
        <p>
            <label>Exact match <input type=radio bind:group="{$WordFitStore.patternPosition}" name="position" value="{PatternPosition.Exact}"></label><br/>
            <label>Pattern at the beginning of results <input type=radio bind:group="{$WordFitStore.patternPosition}" name="position" value="{PatternPosition.Beginning}"></label><br/>
            <label>Pattern in the middle of results <input type=radio bind:group="{$WordFitStore.patternPosition}" name="position" value="{PatternPosition.Middle}"></label><br/>
            <label>Pattern at the end of results <input type=radio bind:group="{$WordFitStore.patternPosition}" name="position" value="{PatternPosition.End}"></label><br/>
        </p>
        <p><label>Pattern letters should alternate in results? <input type="checkbox" bind:checked="{$WordFitStore.alternatingLetters}" /></label>
    </div>
    <div class="content-section">
        {#each $WordFitStore.matches as result}
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
