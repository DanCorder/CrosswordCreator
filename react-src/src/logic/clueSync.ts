import type { ClueEntry, UnassignedClue, AnswerPosition, Direction } from '../types/crossword';
import { matchesAnswer } from './gridAnswers';

export function strippedAnswer(answer: string): string {
  return answer.replace(/[- ]/g, '');
}

function matchesClue(gridAnswer: AnswerPosition, clue: ClueEntry): boolean {
  if (
    gridAnswer.column !== clue.answerPosition.column ||
    gridAnswer.row !== clue.answerPosition.row
  ) {
    return false;
  }
  const stripped = strippedAnswer(clue.answer);
  return stripped === '' || matchesAnswer(gridAnswer, stripped);
}

export function syncCluesToGrid(
  acrossClues: ClueEntry[],
  downClues: ClueEntry[],
  unassignedClues: UnassignedClue[],
  gridAnswers: AnswerPosition[]
): { acrossClues: ClueEntry[]; downClues: ClueEntry[]; unassignedClues: UnassignedClue[] } {
  const gridAcross = gridAnswers.filter(ga => ga.direction === 'a');
  const gridDown = gridAnswers.filter(ga => ga.direction === 'd');

  let remainingAcross = [...acrossClues];
  let remainingDown = [...downClues];

  const newAcross: ClueEntry[] = [];
  const newDown: ClueEntry[] = [];
  const displaced: UnassignedClue[] = [];

  // Match across clues to grid answers
  for (const ga of gridAcross) {
    const idx = remainingAcross.findIndex(c => matchesClue(ga, c));
    if (idx !== -1) {
      const clue = remainingAcross.splice(idx, 1)[0];
      newAcross.push({ ...clue, answerPosition: ga });
    } else {
      newAcross.push({ clue: '', answer: '', answerPosition: ga });
    }
  }

  // Match down clues to grid answers
  for (const ga of gridDown) {
    const idx = remainingDown.findIndex(c => matchesClue(ga, c));
    if (idx !== -1) {
      const clue = remainingDown.splice(idx, 1)[0];
      newDown.push({ ...clue, answerPosition: ga });
    } else {
      newDown.push({ clue: '', answer: '', answerPosition: ga });
    }
  }

  // Unmatched assigned clues get moved to unassigned
  for (const clue of remainingAcross) {
    if (clue.clue.trim() !== '' || clue.answer.trim() !== '') {
      displaced.push({ clue: clue.clue, answer: clue.answer, possiblePositions: [] });
    }
  }
  for (const clue of remainingDown) {
    if (clue.clue.trim() !== '' || clue.answer.trim() !== '') {
      displaced.push({ clue: clue.clue, answer: clue.answer, possiblePositions: [] });
    }
  }

  // Combine all unassigned clues and filter empty ones
  const allUnassigned = [...unassignedClues, ...displaced];
  const filteredUnassigned = allUnassigned
    .filter(uc => uc.clue.trim() !== '' || uc.answer.trim() !== '')
    .map(uc => ({
      ...uc,
      possiblePositions: gridAnswers
        .filter(ga => {
          const stripped = strippedAnswer(uc.answer);
          return stripped !== '' && matchesAnswer(ga, stripped);
        })
        .map(ga => ({ number: ga.number, direction: ga.direction as Direction })),
    }));

  // Sort by number
  newAcross.sort((a, b) => a.answerPosition.number - b.answerPosition.number);
  newDown.sort((a, b) => a.answerPosition.number - b.answerPosition.number);

  return {
    acrossClues: newAcross,
    downClues: newDown,
    unassignedClues: filteredUnassigned,
  };
}
