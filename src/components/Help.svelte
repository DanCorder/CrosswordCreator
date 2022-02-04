<script lang="ts">
    import Overlay from "./Overlay.svelte";
</script>

<Overlay>
    <span slot="linkText">Help</span>
    <span slot="content">
        <h2>Grid</h2>
        <p>Click in the grid to select a cell. You can use the arrow keys to change the selected cell.<br/>
        Type to enter letters and use space to toggle cells between black/white.<br/>
        Clue numbers will update automatically.<br/>
        The size dropdown will change the size of the grid up to a maximum of 15x15</p>

        <h2>Clues and Answers</h2>
        <p>Entries are automatically created for all answers in the grid.<br/>
        If an answer is entered that doesn't fit that space in the grid, or the grid changes so the answer no longer fits,
        the clue will be moved to the "Unassigned" section. Unassigned clues have a dropdown to assign them to any space in
        grid where the answer will fit.</p>

        <h2>Find Words That Fit</h2>
        <p>This tool searches for words that are compatible with with one or more fixed letters</p>

        <h2>Anagrams</h2>
        <h3>Single Words</h3>
        <p>This search will find single words that can be made using some or all of the given letters. This can be useful
        for finding interesting words as the results don't contain any repetition.</p>
        <h3>Full Anagrams</h3>
        <p>This search returns sets of words using all of the given letters. The included and excluded word boxes can be
        used to make sure that the search results do or don't contain specific words.<br/>
        If a subset of letters can make multiple words then those words are grouped together into a single search result
        e.g. "actor" contains a single result for "cor/ocr/roc/orc" + "at/ta" instead of eight results</p>

        <h2>Dictionary</h2>
        <p>The dictionary used on this site contains abbreviations and other strange words that you may not want to use.
        Unfortunately finding a free, open source word list is tricky and this one seems overall pretty good. Please see
        the credits page for more information on the word list.</p>

        <h2>External Links</h2>
        <p>Search result words are automatically linked to <a href="https://www.dictionary.com" target="_blank">www.dictionary.com</a>.
        Note that no checks are made before creating the link, so it's possible that Dictionary.com won't actually have a
        definition.</p>

        <h2>Printing</h2>
        <p>For now you can use the "Hide answers" checkbox on the grid to make it suitable for printing. A better solution
        is in the works.</p>

        <h2>Development</h2>
        <p>This site is still under development so things may break from time to time please feel free to raise an 
        <a href="https://github.com/DanCorder/CrosswordCreator/issues" target="_blank">issue on github</a>.
        If you have a great idea for a feature, or comments on the existing features you can also raise an issue.
        The <a href="https://github.com/DanCorder/CrosswordCreator" target="_blank">readme</a> for this project 
        includes a list possible future features if you're interested.</p>
    </span>
</Overlay>