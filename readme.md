# Crossword Creator

Currently under construction

This project creates a static site containing tools to help with creating cryptic crosswords.

This site is hosted on Github pages, but as it doesn't use Jekyll you should be able to upload the final files to any static web host. No server side processing is needed.

Planned tools:
* [ ] Grid creation
  * [ ] Display grid of given size
  * [x] Colour squares
  * [ ] Symmetry
  * [x] Clue numbering
  * [ ] Fill grid with random words
    * [ ] Use words from supplied list
  * [ ] Random grid creation  
* [ ] Area for notes
* [x] Find words to fit with existing clues
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
* [ ] Print out
* [ ] Saving/loading crosswords

## Word List

The word list used by this site is generated from http://app.aspell.net/create using SCOWL

To download a new word list to `src/data`:
* Install [node.js](https://nodejs.org/en/)
* Switch to the `src/buildScripts` directory
* `node getWordList.js`

If you want a different word list you can edit `getWordList.js` or manually download a new list from http://app.aspell.net/create and save it over `src/data/wordList.txt`.

## Development

The javascript and most of the CSS on the site is built using (Svelte)[https://svelte.dev/]

### Running locally

* Open a command prompt in the project's root directory
* Before running for the first time run `npm install`
* `npm run dev`
* View the site at http://localhost:5000/

### Releases

The code built by the dev server will run fine if released accidentally, it will just time out trying to find a live update script.
To build for release run: `npm run build`
To deploy simply push to the main branch and Github Pages will update from the docs directory (assuming you have configured Github pages :))