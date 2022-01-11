<script lang="ts">
    import type { WordList } from "./modules/WordList";
    import { CrosswordState } from "./modules/CrosswordState";
    import { CrosswordStateStore } from "./modules/CrosswordStateStore";
    import Credits from './components/Credits.svelte';
    import Grid from './components/Grid.svelte';
    import WordFit from './components/WordFit.svelte';
    import Anagrams from './components/Anagrams.svelte';
    import ClueInputs from "./components/ClueInputs.svelte";
    import ClueDisplay from "./components/ClueDisplay.svelte";

    let wordList: WordList = null;

    fetch('assets/js/processedWordList.json')
        .then(response => response.json())
        .then(data => {
            wordList = data;
        });

    function save() {
        const filename = "crossword.json";
        const data = $CrosswordStateStore.serialize();
        const blob = new Blob([data], {type: 'application/json;charset=utf-8;'});

        if(window.navigator && window.navigator.msSaveBlob) {
            window.navigator.msSaveBlob(blob, filename);
        }
        else {
            const link = window.document.createElement('a');
            link.style.display = "none";
            link.href = window.URL.createObjectURL(blob);
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        }
    }

    function upload(event: Event) {
        const target = event.target as HTMLInputElement;
        const file = target.files[0];
        file.text().then(text => {
            CrosswordStateStore.set(new CrosswordState(text));
        })
        .catch(reason => alert("Upload failed: " + reason));
    }
</script>

<div class='main'>
    <div class="content-block">
        <h1>Tools for cryptic crossword creation - under construction</h1>
        <ul>
            <li><a href="https://www.wordplays.com/anagrammer" target="_blank">Anagrams</a></li>
            <li><a href="https://www.dictionary.com/" target="_blank">Free dictionary</a></li>
            <li><a href="https://www.thesaurus.com/" target="_blank">Free thesaurus</a></li>
            <li><a href="https://puzzling.stackexchange.com/questions/45984/cryptic-clue-guide|" target="_blank">Different clue types</a></li>
            <li><a href="https://en.wikipedia.org/wiki/Crossword_abbreviations" target="_blank">Clues for letters</a></li>
        </ul>
    </div>

    <div class="content-block">
        <h2>Save / Load Data</h2>
        Download current grid and clues as file: <button on:click="{save}">Save</button><br/>
        Load save file: <input type="file" id="file-selector" on:change="{upload}">
    </div>

    <Grid state="{$CrosswordStateStore.grid}" />

    <ClueDisplay bind:gridState="{$CrosswordStateStore.grid}" bind:clueState="{$CrosswordStateStore.clues}" />

    <ClueInputs state="{$CrosswordStateStore.clues}" />

    <WordFit {wordList} />

    <Anagrams {wordList} />

    <Credits />
</div>

<style lang="scss">
    :global(.content-block) {
        background-color: $text-background-colour;
        margin: $content-margin calc($content-margin / 2);
        padding: 20px;
        border-radius: 4px;
        box-shadow: 4px 4px 2px 2px rgba(0,0,0,0.1);
    }

    :global(a) {
        color: $darker-colour;
        &:visited {
            color: $medium-colour;
        }
    }
</style>