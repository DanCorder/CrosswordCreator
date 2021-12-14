<script lang="ts">
    import type { WordList } from "./modules/WordList";
    import { AnagramList, createAnagramList } from "./modules/AnagramList";
	import WordFit from './components/WordFit.svelte';

    let wordList: WordList = null;
    let anagramList: AnagramList = null;

    fetch('assets/js/processedWordList.json')
        .then(response => response.json())
        .then(data => {
            wordList = data;
            anagramList = createAnagramList(wordList);
        });
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

    <WordFit {wordList} />

    <div class="content-block">
        <h2>Find Anagrams</h2>
        <p>All single letters can be considered words in some way. To reduce the number of results we limit single letter words to just 'a' and 'I'.</p>
        <p>Find up to 1000 results</p>
        <input id="findAnagramsInput" /> <button id="findAnagramsButton">Search</button> Exclude these letters <input id="findAnagramsExclude" />
        <div id="findAnagramsOutput"></div>
    </div>

    <div class="content-block">
        <h2>Find Single Anagrams</h2>
        <p>Find all single word anagrams within the input, not necessarily using all letters</p>
        <input id="findSingleAnagramsInput" /> <button id="findSingleAnagramsButton">Search</button>
        <div id="findSingleAnagramsOutput"></div>
    </div>

    <div class="content-block">
        <a href="/CrosswordCreator/credits">Credits/Copyright</a>
    </div>
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