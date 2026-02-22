import type { CrosswordState, GridCell, ClueEntry, UnassignedClue, Direction } from '../types/crossword';
import { numberCells, findAnswers } from './gridAnswers';
import { syncCluesToGrid } from './clueSync';

// Matches the existing v2 save file format for compatibility
interface SavedPosition {
  r: number;
  c: number;
  n: number;
  d: string;
  a: string;
}
interface SavedClue {
  c: string;
  a: string;
  p: SavedPosition | null;
}
interface SaveFile {
  version: number;
  crosswordState: {
    grid: { w: boolean; n: number | null; l: string }[][];
    clues: { a: SavedClue[]; d: SavedClue[]; u: SavedClue[] };
    settings: { author: string; title: string };
  };
}

export function exportToBlob(state: CrosswordState): Blob {
  const saveFile: SaveFile = {
    version: 2,
    crosswordState: {
      grid: state.grid.map(row =>
        row.map(cell => ({ w: cell.isWhite, n: cell.cellNumber, l: cell.letter }))
      ),
      clues: {
        a: state.acrossClues.map(c => ({
          c: c.clue,
          a: c.answer,
          p: {
            r: c.answerPosition.row,
            c: c.answerPosition.column,
            n: c.answerPosition.number,
            d: c.answerPosition.direction,
            a: c.answerPosition.letters,
          },
        })),
        d: state.downClues.map(c => ({
          c: c.clue,
          a: c.answer,
          p: {
            r: c.answerPosition.row,
            c: c.answerPosition.column,
            n: c.answerPosition.number,
            d: c.answerPosition.direction,
            a: c.answerPosition.letters,
          },
        })),
        u: state.unassignedClues.map(c => ({ c: c.clue, a: c.answer, p: null })),
      },
      settings: { author: state.author, title: state.title },
    },
  };

  return new Blob([JSON.stringify(saveFile)], { type: 'application/json;charset=utf-8;' });
}

export function parseSaveFile(data: unknown): CrosswordState {
  const saveFile = data as SaveFile;
  const { grid: gridData, clues: cluesData, settings } = saveFile.crosswordState;

  // Rebuild grid from saved cell data
  const rawGrid: GridCell[][] = gridData.map(row =>
    row.map(cell => ({
      isWhite: cell.w,
      letter: cell.l ?? '',
      cellNumber: cell.n ?? null,
    }))
  );

  const numberedGrid = numberCells(rawGrid);
  const gridAnswers = findAnswers(numberedGrid);

  // Build ClueEntry objects from saved assigned clues
  const savedAcross: ClueEntry[] = cluesData.a
    .filter(c => c.p !== null)
    .map(c => ({
      clue: c.c,
      answer: c.a,
      answerPosition: {
        row: c.p!.r,
        column: c.p!.c,
        number: c.p!.n,
        direction: c.p!.d as Direction,
        letters: c.p!.a,
      },
    }));

  const savedDown: ClueEntry[] = cluesData.d
    .filter(c => c.p !== null)
    .map(c => ({
      clue: c.c,
      answer: c.a,
      answerPosition: {
        row: c.p!.r,
        column: c.p!.c,
        number: c.p!.n,
        direction: c.p!.d as Direction,
        letters: c.p!.a,
      },
    }));

  const savedUnassigned: UnassignedClue[] = cluesData.u.map(c => ({
    clue: c.c,
    answer: c.a,
    possiblePositions: [],
  }));

  // Sync loaded clues against the current (renumbered) grid
  const clueState = syncCluesToGrid(savedAcross, savedDown, savedUnassigned, gridAnswers);

  return {
    grid: numberedGrid,
    ...clueState,
    title: settings?.title ?? '',
    author: settings?.author ?? '',
  };
}

export function loadFromFile(file: File): Promise<CrosswordState> {
  return file
    .text()
    .then(content => parseSaveFile(JSON.parse(content)))
    .catch(reason => {
      alert("Couldn't understand save file: " + reason);
      throw reason;
    });
}
