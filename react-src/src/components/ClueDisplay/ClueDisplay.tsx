import { useCrossword } from '../../state/CrosswordContext';
import { getAnswerLength } from '../../logic/answerLength';
import './ClueDisplay.css';

export default function ClueDisplay() {
  const { state } = useCrossword();
  const { acrossClues, downClues } = state;

  return (
    <div className="clue-display">
      <h2>Across</h2>
      <ul>
        {acrossClues.map(c => (
          <li key={c.answerPosition.number}>
            {c.answerPosition.number}. {c.clue} ({getAnswerLength(c.answer) || '?'})
          </li>
        ))}
      </ul>
      <h2>Down</h2>
      <ul>
        {downClues.map(c => (
          <li key={c.answerPosition.number}>
            {c.answerPosition.number}. {c.clue} ({getAnswerLength(c.answer) || '?'})
          </li>
        ))}
      </ul>
    </div>
  );
}
