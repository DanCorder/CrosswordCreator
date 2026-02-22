import type { CrosswordState, Direction } from '../types/crossword';

export type Action =
  | { type: 'SET_SIZE'; size: number }
  | { type: 'TOGGLE_CELL'; row: number; col: number }
  | { type: 'SET_CELL_LETTER'; row: number; col: number; letter: string }
  | { type: 'SET_GRID_LETTERS'; row: number; col: number; direction: Direction; answer: string }
  | { type: 'UPDATE_CLUE'; direction: Direction; number: number; clue: string; answer: string }
  | { type: 'UPDATE_UNASSIGNED_CLUE'; index: number; clue: string; answer: string }
  | { type: 'ASSIGN_CLUE'; unassignedIndex: number; position: { number: number; direction: Direction } }
  | { type: 'DELETE_CLUE'; index: number }
  | { type: 'SET_TITLE'; title: string }
  | { type: 'SET_AUTHOR'; author: string }
  | { type: 'LOAD_STATE'; state: CrosswordState };
