import { useRef } from 'react';
import { useCrossword } from './state/CrosswordContext';
import { exportToBlob, loadFromFile } from './logic/saveLoad';
import Grid from './components/Grid/Grid';
import CluePanel from './components/CluePanel/CluePanel';
import ClueDisplay from './components/ClueDisplay/ClueDisplay';
import WordFitPanel from './components/WordFit/WordFitPanel';
import AnagramsPanel from './components/Anagrams/AnagramsPanel';
import Settings from './components/Settings/Settings';
import Title from './components/Title/Title';
import Help from './components/Help/Help';
import Credits from './components/Credits/Credits';

export default function App() {
  const { state, dispatch } = useCrossword();
  const filenameRef = useRef('crossword.json');

  function save() {
    const blob = exportToBlob(state);
    if (window.navigator && (window.navigator as unknown as { msSaveBlob?: unknown }).msSaveBlob) {
      (window.navigator as unknown as { msSaveBlob: (b: Blob, n: string) => void }).msSaveBlob(
        blob,
        filenameRef.current
      );
    } else {
      const link = document.createElement('a');
      link.style.display = 'none';
      link.href = URL.createObjectURL(blob);
      link.download = filenameRef.current;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    }
  }

  function upload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    filenameRef.current = file.name;
    loadFromFile(file).then(loaded => dispatch({ type: 'LOAD_STATE', state: loaded }));
  }

  return (
    <div className="app-main">
      <div className="content-block dont-print">
        <h1>Under Construction</h1>
        This site is still under active development so saved files may become incompatible
        without warning. Use at your own risk.
      </div>

      <div className="content-block app-header dont-print">
        <h1>Cryptic Crossword Creator</h1>
        <div className="header-links dont-print">
          <div className="content-section header-section">
            <div className="content-section">
              <Help />
            </div>
            <div className="content-section">
              <Credits />
            </div>
          </div>
          <div className="content-section header-section">
            <div className="content-section">
              <button onClick={save}>Save</button>
            </div>
            <div className="content-section">
              Load <input type="file" id="file-selector" onChange={upload} />
            </div>
          </div>
        </div>
      </div>

      <div className="tools">
        <div className="left-column">
          <div className="content-block dont-print">
            <Settings
              title={state.title}
              author={state.author}
              onTitleChange={t => dispatch({ type: 'SET_TITLE', title: t })}
              onAuthorChange={a => dispatch({ type: 'SET_AUTHOR', author: a })}
            />
          </div>

          <div className="content-block">
            <Title title={state.title} author={state.author} />
            <Grid />
            <br />
            <ClueDisplay />
          </div>

          <div className="content-block dont-print">
            <WordFitPanel />
          </div>

          <div className="content-block dont-print">
            <h2>External Tools</h2>
            <ul>
              <li>
                <a href="https://www.wordplays.com/anagrammer" target="_blank" rel="noreferrer">
                  Anagrams
                </a>
              </li>
              <li>
                <a href="https://www.dictionary.com/" target="_blank" rel="noreferrer">
                  Free dictionary
                </a>
              </li>
              <li>
                <a href="https://www.thesaurus.com/" target="_blank" rel="noreferrer">
                  Free thesaurus
                </a>
              </li>
              <li>
                <a
                  href="https://puzzling.stackexchange.com/questions/45984/cryptic-clue-guide"
                  target="_blank"
                  rel="noreferrer"
                >
                  Different clue types 1
                </a>
              </li>
              <li>
                <a
                  href="https://en.wikipedia.org/wiki/Cryptic_crossword#Types_of_cryptic_clues"
                  target="_blank"
                  rel="noreferrer"
                >
                  Different clue types 2
                </a>
              </li>
              <li>
                <a
                  href="https://en.wikipedia.org/wiki/Crossword_abbreviations"
                  target="_blank"
                  rel="noreferrer"
                >
                  Clues for letters
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="right-column dont-print">
          <CluePanel />
          <AnagramsPanel />
        </div>
      </div>
    </div>
  );
}
