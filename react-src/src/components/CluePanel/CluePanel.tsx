import { useCrossword } from '../../state/CrosswordContext';
import ClueInput from './ClueInput';
import UnassignedClueInput from './UnassignedClueInput';
import './CluePanel.css';

export default function CluePanel() {
  const { state } = useCrossword();
  const { acrossClues, downClues, unassignedClues } = state;

  return (
    <div className="clue-panel content-block">
      <h2>Clues and Answers</h2>
      <div className="column-container">
        <div className="content-section">
          <h3>Across</h3>
          {acrossClues.map(entry => (
            <ClueInput
              key={`${entry.answerPosition.number}-a`}
              entry={entry}
            />
          ))}
        </div>
        <div className="content-section">
          <h3>Down</h3>
          {downClues.map(entry => (
            <ClueInput
              key={`${entry.answerPosition.number}-d`}
              entry={entry}
            />
          ))}
        </div>
        {unassignedClues.length > 0 && (
          <div className="content-section">
            <h3>Unassigned</h3>
            {unassignedClues.map((entry, index) => (
              <UnassignedClueInput key={index} entry={entry} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
