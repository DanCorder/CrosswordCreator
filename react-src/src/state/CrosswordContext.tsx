import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { CrosswordState } from '../types/crossword';
import type { Action } from './actions';
import { crosswordReducer, createInitialState } from './crosswordReducer';

interface CrosswordContextValue {
  state: CrosswordState;
  dispatch: React.Dispatch<Action>;
}

const CrosswordContext = createContext<CrosswordContextValue | null>(null);

export function CrosswordProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(crosswordReducer, undefined, createInitialState);

  return (
    <CrosswordContext.Provider value={{ state, dispatch }}>
      {children}
    </CrosswordContext.Provider>
  );
}

export function useCrossword(): CrosswordContextValue {
  const ctx = useContext(CrosswordContext);
  if (!ctx) throw new Error('useCrossword must be used within CrosswordProvider');
  return ctx;
}
