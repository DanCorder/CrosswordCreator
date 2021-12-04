# Crossword Creator

Currently under construction

This project creates a github pages site containing tools to help with creating cryptic crosswords.

This site is designed to be hosted on Github pages, but you can use Jekyll to create the final static pages and upload them anywhere. No server side processing is needed.

Planned tools:
* [ ] Grid creation
  * [ ] Symmetry
  * [ ] Clue numbering
  * [ ] Fill grid with random words
    * [ ] Use words from supplied list
* [ ] Area for notes
* [x] Find words to fit with existing clues
* [ ] Anagram generation
  * [x] Same length word
  * [ ] Multiple shorter words
  * [ ] Fix some words
  * [ ] Exclude some words
  * [x] Find all single words within the letters
  * [ ] Allow choice of dictionary
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

### Running locally

* Install Jekyll
* Switch to the root directory of this project
* `bundle exec jekyll serve`
