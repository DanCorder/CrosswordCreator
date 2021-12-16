<script lang="ts">
    import type { AnagramResult } from "../modules/Anagramer";

    export let result: AnagramResult;

    const dictionaryUrlPrefix = 'https://www.dictionary.com/browse/';
</script>

<div>
    {#each result as wordSet}
        <ul>
            {#each wordSet as word}
                <li><a href="{dictionaryUrlPrefix}{word}" target="_blank">{word}</a></li>
            {/each}
        </ul>
    {/each}
</div>

<style>
    div {
        display: flex;
        flex-direction: row;
        margin-top: 0.5em;
    }

    ul {
        background-color: #ffe7ff;
        list-style-type: none;
        padding: 0.3em;
        border-radius: 2px;
        margin: 0.2em;
        box-shadow: 2px 2px 1px 1px rgba(0,0,0,0.1);
    }
</style>