# Crossword Creator

Currently under construction

This project creates a static site containing tools to help with creating cryptic crosswords.

This site is hosted on Github pages, but as it doesn't use Jekyll you should be able to upload the final files to any static web host. No server side processing is needed.

Planned tools:
* [ ] Grid creation
  * [x] Display grid of given size
  * [x] Colour squares
  * [ ] Symmetry
  * [x] Clue numbering
  * [ ] Fill grid with random words
    * [ ] Use words from supplied list
  * [ ] Random grid creation
  * [x] Write letters in cells
  * [x] Navigate cells with arrow keys
* [ ] Area for notes
* [x] Area for clues and answers
  * [x] Automatic matching of answers to grid answers
* [x] Find words to fit with existing clues
* [ ] Find words containing other words
* [ ] Find words that match alternating letters
* [ ] Anagram generation
  * [x] Same length word
  * [x] Multiple shorter words
  * [x] Fix some words
  * [x] Exclude some words
  * [x] Find all single words within the letters
  * [x] Minimum word length
  * [ ] Allow choice of dictionary
  * [ ] Allow users to upload replacement dictionary
  * [ ] Allow users to upload additional words
  * [ ] Get more results for long words
  * [ ] Improve performance for long words
* [ ] Reference pages
  * [ ] letter clues
  * [ ] keywords
  * [x] help page
* [x] Print out
* [x] Saving/loading crosswords
  * [ ] Save with same filename as loaded
* [x] Title and author

## Word List

The word list used by this site is generated from http://app.aspell.net/create using SCOWL

To download a new word list to `src/data`:
* Install [node.js](https://nodejs.org/en/)
* Switch to the `src/buildScripts` directory
* `node getWordList.js`

If you want a different word list you can edit `getWordList.js` or manually download a new list from http://app.aspell.net/create and save it over `src/data/wordList.txt`.

## Development

The javascript and most of the CSS on the site is built using [Svelte](https://svelte.dev/), [TypeScript](https://www.typescriptlang.org/), and [SASS](https://sass-lang.com/).

### Running locally

* Open a command prompt in the project's root directory
* Before running for the first time run `npm install`
* `npm run dev`
* View the site at http://localhost:5000/

### Releases

To release:
* Merge the main branch into the release branch
* Stop the dev server if it's running
* Delete the contents of `docs/build`
* On the release branch run `npm run build`
* Commit and push the release branch to Github
* (If you've forked this project you'll need to configure your [Github pages](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages) appropriately)
