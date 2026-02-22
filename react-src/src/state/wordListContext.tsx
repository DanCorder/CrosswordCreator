import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { WordList } from '../types/crossword';

const WordListContext = createContext<WordList | null>(null);

export function WordListProvider({ children }: { children: ReactNode }) {
  const [wordList, setWordList] = useState<WordList | null>(null);

  useEffect(() => {
    fetch('assets/js/processedWordList.json')
      .then(res => res.json())
      .then(data => setWordList(data as WordList))
      .catch(err => console.warn('Could not load word list:', err));
  }, []);

  return <WordListContext.Provider value={wordList}>{children}</WordListContext.Provider>;
}

export function useWordList(): WordList | null {
  return useContext(WordListContext);
}
