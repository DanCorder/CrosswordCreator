import { useWordFit } from '../../state/wordFitContext';
import { PatternPosition } from '../../logic/WordFit';
import './WordFitPanel.css';

const DICTIONARY_PREFIX = 'https://www.dictionary.com/browse/';

export default function WordFitPanel() {
  const {
    pattern,
    patternPosition,
    alternatingLetters,
    matches,
    setPattern,
    setPatternPosition,
    setAlternatingLetters,
    search,
  } = useWordFit();

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') search();
  }

  return (
    <div className="word-fit-panel">
      <h2>Find Words That Fit</h2>
      <p>
        Enter the pattern to match below. Use letters where you have them and &apos;.&apos; or
        space for empty spaces
      </p>
      <div className="content-section">
        <p>
          <input
            value={pattern}
            onChange={e => setPattern(e.target.value)}
            onKeyDown={handleKeyDown}
          />{' '}
          <button onClick={search}>Search</button>
        </p>
        <p>
          <label>
            Exact match{' '}
            <input
              type="radio"
              name="position"
              checked={patternPosition === PatternPosition.Exact}
              onChange={() => setPatternPosition(PatternPosition.Exact)}
            />
          </label>
          <br />
          <label>
            Pattern at the beginning of results{' '}
            <input
              type="radio"
              name="position"
              checked={patternPosition === PatternPosition.Beginning}
              onChange={() => setPatternPosition(PatternPosition.Beginning)}
            />
          </label>
          <br />
          <label>
            Pattern in the middle of results{' '}
            <input
              type="radio"
              name="position"
              checked={patternPosition === PatternPosition.Middle}
              onChange={() => setPatternPosition(PatternPosition.Middle)}
            />
          </label>
          <br />
          <label>
            Pattern at the end of results{' '}
            <input
              type="radio"
              name="position"
              checked={patternPosition === PatternPosition.End}
              onChange={() => setPatternPosition(PatternPosition.End)}
            />
          </label>
        </p>
        <p>
          <label>
            Pattern letters should alternate in results?{' '}
            <input
              type="checkbox"
              checked={alternatingLetters}
              onChange={e => setAlternatingLetters(e.target.checked)}
            />
          </label>
        </p>
      </div>
      <div className="content-section">
        {matches.length === 0 ? (
          <div className="no-results">No results</div>
        ) : (
          matches.map(word => (
            <div key={word} className="word-result">
              <a href={`${DICTIONARY_PREFIX}${word}`} target="_blank" rel="noreferrer">
                {word}
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
