export const WILDCARD = '_';

export type Direction = 'a' | 'd';

export type WordList = { [index: number]: { [word: string]: string[] } };

export interface GridCell {
  isWhite: boolean;
  letter: string;
  cellNumber: number | null;
}

export interface AnswerPosition {
  row: number;
  column: number;
  number: number;
  direction: Direction;
  /** Current letters in this grid slot. Uses WILDCARD ('_') for empty cells. */
  letters: string;
}

export interface ClueEntry {
  clue: string;
  answer: string;
  answerPosition: AnswerPosition;
}

export interface UnassignedClue {
  clue: string;
  answer: string;
  possiblePositions: { number: number; direction: Direction }[];
}

export interface CrosswordState {
  grid: GridCell[][];
  acrossClues: ClueEntry[];
  downClues: ClueEntry[];
  unassignedClues: UnassignedClue[];
  title: string;
  author: string;
}
