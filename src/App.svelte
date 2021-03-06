<script lang="ts">
    import { getSaveData, parseSaveData } from "./modules/AppState";
    import { CrosswordStateStore } from "./modules/CrosswordStateStore";
    import Credits from './components/Credits.svelte';
    import Grid from './components/Grid.svelte';
    import WordFit from './components/WordFit.svelte';
    import Anagrams from './components/Anagrams.svelte';
    import ClueInputs from "./components/ClueInputs.svelte";
    import ClueDisplay from "./components/ClueDisplay.svelte";
    import Help from "./components/Help.svelte";
    import Title from "./components/Title.svelte";
    import Settings from "./components/Settings.svelte";

    let filename: string = "crossword.json";

    function save() {
        const saveData = getSaveData();

        if(window.navigator && window.navigator.msSaveBlob) {
            window.navigator.msSaveBlob(saveData, filename);
        }
        else {
            const link = window.document.createElement('a');
            link.style.display = "none";
            link.href = window.URL.createObjectURL(saveData);
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
        filename = file.name;
        parseSaveData(file);
    }
</script>

<div class='main'>
    <div class="content-block dont-print">
        <h1>Under Construction</h1>
        This site is still under active development so saved files may become incompatible without warning. Use at your own risk.<br/>
    </div>
    <div class="content-block header dont-print">
        <h1>Cryptic Crossword Creator</h1>
        <div class="header-links dont-print">
            <div class="content-section header-section">
                <div class="content-section"><Help /></div>
                <div class="content-section"><Credits /></div>
            </div>
            <div class="content-section header-section">
                <div class="content-section"><button on:click="{save}">Save</button></div>
                <div class="content-section">Load <input type="file" id="file-selector" on:change="{upload}"></div>
            </div>
        </div>
    </div>

    <div class="tools">
        <div class="left-column">
            <div class="content-block dont-print">
                <Settings bind:author={$CrosswordStateStore.settings.author} bind:title={$CrosswordStateStore.settings.title} />
            </div>

            <div class="content-block">
                <Title author="{$CrosswordStateStore.settings.author}" title="{$CrosswordStateStore.settings.title}"/>
                <Grid state="{$CrosswordStateStore.grid}" />
                <br/>
                <ClueDisplay clueState="{$CrosswordStateStore.clues}" />
            </div>

            <div class="content-block dont-print">
                <WordFit />
            </div>

            <div class="content-block dont-print">
                <h2>External Tools</h2>
                <ul>
                    <li><a href="https://www.wordplays.com/anagrammer" target="_blank">Anagrams</a></li>
                    <li><a href="https://www.dictionary.com/" target="_blank">Free dictionary</a></li>
                    <li><a href="https://www.thesaurus.com/" target="_blank">Free thesaurus</a></li>
                    <li><a href="https://puzzling.stackexchange.com/questions/45984/cryptic-clue-guide" target="_blank">Different clue types 1</a></li>
                    <li><a href="https://en.wikipedia.org/wiki/Cryptic_crossword#Types_of_cryptic_clues" target="_blank">Different clue types 2</a></li>
                    <li><a href="https://en.wikipedia.org/wiki/Crossword_abbreviations" target="_blank">Clues for letters</a></li>
                </ul>
            </div>
        </div>

        <div class="right-column dont-print">
            <ClueInputs state="{$CrosswordStateStore.clues}" />

            <Anagrams />
        </div>
    </div>
</div>

<style lang="scss">
    :global(.content-block) {
        background-color: $text-background-colour;
        margin: $content-margin;
        padding: 20px;
        border-radius: 4px;
        box-shadow: 4px 4px 2px 2px rgba(0,0,0,0.1);

        @media print {
            margin: 0;
            padding: 0;
            box-shadow: none;
            border-radius: 0;
        }
    }

    :global(.content-section) {
        background-color: rgba(0,0,0,0.1);
        padding: 10px;
        border-radius: 4px;
    }

    :global(a),
    :global(.link) {
        color: $darker-colour;
        text-decoration: underline;
        cursor: pointer;
        &:visited {
            color: $medium-colour;
        }
    }

    :global(.dont-print),
    :global(.dont-print>*) {
        @media print {
            display: none !important; // Yuck :(
        }
    }

    .header {
        display: flex;
        align-items: center;

        h1 {
            margin-right: 20px;
            margin-bottom: 0;
        }

        .content-section:not(:last-child) {
            margin-right: 10px;
        }
    }

    .header-links {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .header-section {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .tools {
        display: flex;
    }

    .left-column {
        display: flex;
        flex-direction: column;
        width: 810px;
    }

    .right-column {
        display: flex;
        flex-direction: column;
        min-width: 760px;
    }
</style>