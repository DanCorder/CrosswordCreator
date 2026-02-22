import { useState, useEffect } from 'react';
import type { ClueEntry } from '../../types/crossword';
import { useCrossword } from '../../state/CrosswordContext';
import { useWordFit } from '../../state/wordFitContext';
import { PatternPosition, AlternateLetterMatch } from '../../logic/WordFit';
import { WILDCARD } from '../../logic/gridAnswers';
import { strippedAnswer } from '../../logic/clueSync';
import { matchesAnswer } from '../../logic/gridAnswers';

interface Props {
  entry: ClueEntry;
}

export default function ClueInput({ entry }: Props) {
  const { dispatch } = useCrossword();
  const { setAndSearch } = useWordFit();

  const [localClue, setLocalClue] = useState(entry.clue);
  const [localAnswer, setLocalAnswer] = useState(entry.answer);

  // Reset local state if the entry changes externally (e.g. load file)
  useEffect(() => {
    setLocalClue(entry.clue);
    setLocalAnswer(entry.answer);
  }, [entry.clue, entry.answer]);

  function handleBlur() {
    dispatch({
      type: 'UPDATE_CLUE',
      direction: entry.answerPosition.direction,
      number: entry.answerPosition.number,
      clue: localClue,
      answer: localAnswer,
    });
  }

  const stripped = strippedAnswer(localAnswer);
  const canAddToGrid =
    stripped.toLowerCase() !== entry.answerPosition.letters.toLowerCase() &&
    matchesAnswer(entry.answerPosition, stripped);

  const hasPartialLetters =
    entry.answerPosition.letters.includes(WILDCARD) &&
    entry.answerPosition.letters.split('').some(c => c !== WILDCARD);

  function handleFindPossibilities() {
    setAndSearch(
      entry.answerPosition.letters.replaceAll(WILDCARD, '.'),
      PatternPosition.Exact,
      AlternateLetterMatch.DontAlternate
    );
  }

  return (
    <div className="clue-container content-section">
      <div className="clue-row">
        <span>{entry.answerPosition.number}</span>
        <textarea
          value={localClue}
          onChange={e => setLocalClue(e.target.value)}
          onBlur={handleBlur}
        />
      </div>
      <div className="clue-row">
        <label>
          Answer:{' '}
          <input
            type="text"
            value={localAnswer}
            onChange={e => setLocalAnswer(e.target.value)}
            onBlur={handleBlur}
          />
        </label>
        {canAddToGrid && (
          <button
            onClick={() =>
              dispatch({
                type: 'SET_GRID_LETTERS',
                row: entry.answerPosition.row,
                col: entry.answerPosition.column,
                direction: entry.answerPosition.direction,
                answer: stripped,
              })
            }
          >
            Add to grid
          </button>
        )}
      </div>
      <div className="clue-row">
        <span>Grid letters: {entry.answerPosition.letters}</span>
        {hasPartialLetters && (
          <button onClick={handleFindPossibilities}>Find possibilities</button>
        )}
      </div>
    </div>
  );
}
