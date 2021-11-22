# Crossword Creator

Currently under construction

This project creates github pages site containing tools to help with creating cryptic crosswords.

Planned tools:
* [ ] Grid creation
  * [ ] Symmetry
  * [ ] Clue numbering
* [ ] Area for notes
* [x] Find words to fit with existing clues
* [ ] Anagram generation
  * [ ] Same length word
  * [ ] Multiple shorter words
  * [ ] Fix some words
* [ ] Reference pages
  * [ ] letter clues
  * [ ] keywords
* [ ] Print out
* [ ] Saving/loading crosswords

## Word List

The word list used by this site is generated from http://app.aspell.net/create using SCOWL

To download a new word list to `src/data`:
* Install [node.js](https://nodejs.org/en/)
* Switch to the `src` directory
* `node getWordList.js`

If you want a different word list you can edit `getWordList.js` or manually download a new list from http://app.aspell.net/create and save it over `src/data/wordList.txt`.
