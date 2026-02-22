import { useState, useEffect } from 'react';
import { useWordList } from '../../state/wordListContext';
import {
  createAnagramList,
  findAllSingleWordAnagrams,
  findAnagrams,
  type AnagramList,
  type AnagramResult,
} from '../../logic/Anagramer';
import './AnagramsPanel.css';

const DICTIONARY_PREFIX = 'https://www.dictionary.com/browse/';

export default function AnagramsPanel() {
  const wordList = useWordList();
  const [anagramList, setAnagramList] = useState<AnagramList | null>(null);
  const [results, setResults] = useState<AnagramResult[]>([]);
  const [letters, setLetters] = useState('');
  const [minimumWordLength, setMinimumWordLength] = useState(3);
  const [excludedWordsString, setExcludedWordsString] = useState('');
  const [includedWordsString, setIncludedWordsString] = useState('');

  useEffect(() => {
    setAnagramList(createAnagramList(wordList));
  }, [wordList]);

  const excludedWords = excludedWordsString.split('\n').filter(w => w !== '');
  const includedWords = includedWordsString.split('\n').filter(w => w !== '');

  function findSingleWords() {
    if (!anagramList) {
      alert('Word list not downloaded yet, please try again');
      return;
    }
    setResults(findAllSingleWordAnagrams(letters, anagramList, minimumWordLength, excludedWords));
  }

  function findAll() {
    if (!anagramList) {
      alert('Word list not downloaded yet, please try again');
      return;
    }
    setResults(findAnagrams(letters, anagramList, minimumWordLength, excludedWords, includedWords));
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') findAll();
  }

  return (
    <div className="anagrams-panel content-block">
      <h2>Find Anagrams</h2>
      <div className="content-section">
        <p>
          <input value={letters} onChange={e => setLetters(e.target.value)} onKeyDown={handleKeyDown} />
          {' '}Minimum word length{' '}
          <select
            value={minimumWordLength}
            onChange={e => setMinimumWordLength(parseInt(e.target.value))}
          >
            {[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </p>
        <p>
          <button onClick={findSingleWords}>Find single words</button>{' '}
          Find all single word anagrams within the input, not necessarily using all letters
        </p>
        <p>
          <button onClick={findAll}>Find full anagrams</button>{' '}
          Find full multi-word anagrams (up to 1000 results)
        </p>
        <p>
          <textarea
            value={excludedWordsString}
            onChange={e => setExcludedWordsString(e.target.value)}
          />{' '}
          Excluded words (one per line)
        </p>
        <p>
          <textarea
            value={includedWordsString}
            onChange={e => setIncludedWordsString(e.target.value)}
          />{' '}
          Included words (one per line)
        </p>
      </div>
      <div className="content-section">
        {results.length === 0 ? (
          <div className="no-results">No results</div>
        ) : (
          results.map((result, i) => (
            <div key={i} className="anagram-result">
              {result.map((wordSet, j) => (
                <ul key={j}>
                  {wordSet.map(word => (
                    <li key={word}>
                      <a href={`${DICTIONARY_PREFIX}${word}`} target="_blank" rel="noreferrer">
                        {word}
                      </a>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
