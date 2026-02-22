import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { WordListProvider } from './state/wordListContext';
import { WordFitProvider } from './state/wordFitContext';
import { CrosswordProvider } from './state/CrosswordContext';
import App from './App';
import './App.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WordListProvider>
      <WordFitProvider>
        <CrosswordProvider>
          <App />
        </CrosswordProvider>
      </WordFitProvider>
    </WordListProvider>
  </StrictMode>
);
