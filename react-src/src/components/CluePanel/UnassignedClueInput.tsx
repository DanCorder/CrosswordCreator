import { useState, useEffect } from 'react';
import type { UnassignedClue, Direction } from '../../types/crossword';
import { useCrossword } from '../../state/CrosswordContext';

interface Props {
  entry: UnassignedClue;
  index: number;
}

export default function UnassignedClueInput({ entry, index }: Props) {
  const { dispatch } = useCrossword();
  const [localClue, setLocalClue] = useState(entry.clue);
  const [localAnswer, setLocalAnswer] = useState(entry.answer);

  useEffect(() => {
    setLocalClue(entry.clue);
    setLocalAnswer(entry.answer);
  }, [entry.clue, entry.answer]);

  function handleBlur() {
    dispatch({
      type: 'UPDATE_UNASSIGNED_CLUE',
      index,
      clue: localClue,
      answer: localAnswer,
    });
  }

  function handleAssign(event: React.ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value;
    if (!value) return;
    const [numStr, dir] = value.split('-');
    dispatch({
      type: 'ASSIGN_CLUE',
      unassignedIndex: index,
      position: { number: parseInt(numStr), direction: dir as Direction },
    });
    // Reset select back to placeholder (the component will unmount after dispatch anyway)
    event.target.value = '';
  }

  return (
    <div className="clue-container content-section">
      <div className="clue-row">
        <span>?</span>
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
      </div>
      <div className="clue-row">
        <span>
          Assign to:{' '}
          <select defaultValue="" onChange={handleAssign}>
            <option value="">--------</option>
            {entry.possiblePositions.map(pos => (
              <option key={`${pos.number}-${pos.direction}`} value={`${pos.number}-${pos.direction}`}>
                {pos.number} {pos.direction === 'a' ? 'across' : 'down'}
              </option>
            ))}
          </select>
        </span>
        <button onClick={() => dispatch({ type: 'DELETE_CLUE', index })}>Delete</button>
      </div>
    </div>
  );
}
