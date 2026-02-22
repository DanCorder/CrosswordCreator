import type { CrosswordState, ClueEntry, UnassignedClue } from '../types/crossword';
import type { Action } from './actions';
import {
  resizeGrid,
  numberCells,
  findAnswers,
  toggleCell,
  setCellLetter,
  setLetters,
  matchesAnswer,
} from '../logic/gridAnswers';
import { syncCluesToGrid, strippedAnswer } from '../logic/clueSync';
import { createGrid } from '../logic/gridAnswers';

export function createInitialState(): CrosswordState {
  const grid = numberCells(createGrid(11));
  const gridAnswers = findAnswers(grid);
  const clueState = syncCluesToGrid([], [], [], gridAnswers);
  return { grid, ...clueState, title: '', author: '' };
}

function rebuildAfterGridChange(state: CrosswordState, newRawGrid: CrosswordState['grid']): CrosswordState {
  const numberedGrid = numberCells(newRawGrid);
  const gridAnswers = findAnswers(numberedGrid);
  const clueState = syncCluesToGrid(
    state.acrossClues,
    state.downClues,
    state.unassignedClues,
    gridAnswers
  );
  return { ...state, grid: numberedGrid, ...clueState };
}

export function crosswordReducer(state: CrosswordState, action: Action): CrosswordState {
  switch (action.type) {
    case 'SET_SIZE': {
      const resized = resizeGrid(state.grid, action.size);
      return rebuildAfterGridChange(state, resized);
    }

    case 'TOGGLE_CELL': {
      const newGrid = toggleCell(state.grid, action.row, action.col);
      return rebuildAfterGridChange(state, newGrid);
    }

    case 'SET_CELL_LETTER': {
      const newGrid = setCellLetter(state.grid, action.row, action.col, action.letter);
      return rebuildAfterGridChange(state, newGrid);
    }

    case 'SET_GRID_LETTERS': {
      const newGrid = setLetters(
        state.grid,
        action.row,
        action.col,
        action.direction,
        action.answer
      );
      return rebuildAfterGridChange(state, newGrid);
    }

    case 'UPDATE_CLUE': {
      const clueList = action.direction === 'a' ? state.acrossClues : state.downClues;
      const newClueList = clueList.map(c =>
        c.answerPosition.number === action.number
          ? { ...c, clue: action.clue, answer: action.answer }
          : c
      );
      const newState =
        action.direction === 'a'
          ? { ...state, acrossClues: newClueList }
          : { ...state, downClues: newClueList };

      // Re-sync in case the answer no longer fits the grid slot
      const gridAnswers = findAnswers(state.grid);
      const clueState = syncCluesToGrid(
        newState.acrossClues,
        newState.downClues,
        newState.unassignedClues,
        gridAnswers
      );
      return { ...newState, ...clueState };
    }

    case 'UPDATE_UNASSIGNED_CLUE': {
      const newUnassigned = state.unassignedClues.map((uc, i) =>
        i === action.index ? { ...uc, clue: action.clue, answer: action.answer } : uc
      );
      const gridAnswers = findAnswers(state.grid);
      const clueState = syncCluesToGrid(
        state.acrossClues,
        state.downClues,
        newUnassigned,
        gridAnswers
      );
      return { ...state, ...clueState };
    }

    case 'ASSIGN_CLUE': {
      const { unassignedIndex, position } = action;
      const unassignedClue = state.unassignedClues[unassignedIndex];
      const { number, direction } = position;

      const gridAnswers = findAnswers(state.grid);
      const gridAnswer = gridAnswers.find(
        ga => ga.number === number && ga.direction === direction
      );
      if (!gridAnswer) return state;

      const isAcross = direction === 'a';
      const clueList = isAcross ? state.acrossClues : state.downClues;

      // Remove the unassigned clue from the unassigned list
      let newUnassigned: UnassignedClue[] = state.unassignedClues.filter(
        (_, i) => i !== unassignedIndex
      );

      // The new assigned entry
      const newEntry: ClueEntry = {
        clue: unassignedClue.clue,
        answer: unassignedClue.answer,
        answerPosition: gridAnswer,
      };

      // Replace (or add) the entry at this position, displacing the old clue to unassigned
      const existingIdx = clueList.findIndex(c => c.answerPosition.number === number);
      let newClueList: ClueEntry[];

      if (existingIdx !== -1) {
        const displaced = clueList[existingIdx];
        if (displaced.clue.trim() !== '' || displaced.answer.trim() !== '') {
          newUnassigned = [
            ...newUnassigned,
            { clue: displaced.clue, answer: displaced.answer, possiblePositions: [] },
          ];
        }
        newClueList = clueList.map((c, i) => (i === existingIdx ? newEntry : c));
      } else {
        newClueList = [...clueList, newEntry];
      }

      newClueList.sort((a, b) => a.answerPosition.number - b.answerPosition.number);

      const newAcross = isAcross ? newClueList : state.acrossClues;
      const newDown = isAcross ? state.downClues : newClueList;

      // Sync to update possible positions on remaining unassigned clues
      const clueState = syncCluesToGrid(newAcross, newDown, newUnassigned, gridAnswers);
      return { ...state, ...clueState };
    }

    case 'DELETE_CLUE': {
      return {
        ...state,
        unassignedClues: state.unassignedClues.filter((_, i) => i !== action.index),
      };
    }

    case 'SET_TITLE':
      return { ...state, title: action.title };

    case 'SET_AUTHOR':
      return { ...state, author: action.author };

    case 'LOAD_STATE':
      return action.state;

    default:
      return state;
  }
}
