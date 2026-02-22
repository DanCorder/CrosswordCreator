import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import {
  PatternPosition,
  AlternateLetterMatch,
  findMatchingWords,
} from '../logic/WordFit';
import { useWordList } from './wordListContext';

interface WordFitContextValue {
  pattern: string;
  patternPosition: PatternPosition;
  alternatingLetters: boolean;
  matches: string[];
  setPattern: (pattern: string) => void;
  setPatternPosition: (pos: PatternPosition) => void;
  setAlternatingLetters: (alt: boolean) => void;
  search: () => void;
  /** Pre-populate pattern and immediately search — called from ClueInput */
  setAndSearch: (
    pattern: string,
    patternPosition: PatternPosition,
    alternatingLetters: AlternateLetterMatch
  ) => void;
}

const WordFitContext = createContext<WordFitContextValue | null>(null);

export function WordFitProvider({ children }: { children: ReactNode }) {
  const wordList = useWordList();
  const [pattern, setPattern] = useState('');
  const [patternPosition, setPatternPosition] = useState<PatternPosition>(
    PatternPosition.Exact
  );
  const [alternatingLetters, setAlternatingLetters] = useState(false);
  const [matches, setMatches] = useState<string[]>([]);

  const search = useCallback(() => {
    if (!wordList) return;
    setMatches(
      findMatchingWords(
        pattern,
        patternPosition,
        alternatingLetters ? AlternateLetterMatch.Alternate : AlternateLetterMatch.DontAlternate,
        wordList
      )
    );
  }, [pattern, patternPosition, alternatingLetters, wordList]);

  const setAndSearch = useCallback(
    (
      newPattern: string,
      newPatternPosition: PatternPosition,
      alternating: AlternateLetterMatch
    ) => {
      setPattern(newPattern);
      setPatternPosition(newPatternPosition);
      setAlternatingLetters(alternating === AlternateLetterMatch.Alternate);
      if (!wordList) return;
      setMatches(findMatchingWords(newPattern, newPatternPosition, alternating, wordList));
    },
    [wordList]
  );

  return (
    <WordFitContext.Provider
      value={{
        pattern,
        patternPosition,
        alternatingLetters,
        matches,
        setPattern,
        setPatternPosition,
        setAlternatingLetters,
        search,
        setAndSearch,
      }}
    >
      {children}
    </WordFitContext.Provider>
  );
}

export function useWordFit(): WordFitContextValue {
  const ctx = useContext(WordFitContext);
  if (!ctx) throw new Error('useWordFit must be used within WordFitProvider');
  return ctx;
}
