import { useRef, useState, useCallback } from 'react';
import { useCrossword } from '../../state/CrosswordContext';
import './Grid.css';

const SIZES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

export default function Grid() {
  const { state, dispatch } = useCrossword();
  const { grid } = state;
  const size = grid.length;

  const [hideLetters, setHideLetters] = useState(false);
  const [currentRow, setCurrentRow] = useState<number | null>(null);
  const [currentCol, setCurrentCol] = useState<number | null>(null);

  // 2D array of refs to TD elements for programmatic focus
  const cellRefs = useRef<(HTMLTableCellElement | null)[][]>([]);

  // Ensure cellRefs has the right dimensions
  if (cellRefs.current.length !== size) {
    cellRefs.current = Array.from({ length: size }, () => Array(size).fill(null));
  }

  function focusCell(row: number, col: number) {
    const bounded_row = Math.max(0, Math.min(size - 1, row));
    const bounded_col = Math.max(0, Math.min(size - 1, col));
    setCurrentRow(bounded_row);
    setCurrentCol(bounded_col);
    cellRefs.current[bounded_row]?.[bounded_col]?.focus();
  }

  function handleFocus(row: number, col: number) {
    setCurrentRow(row);
    setCurrentCol(col);
  }

  const handleKeyDown = useCallback(
    (row: number, col: number, event: React.KeyboardEvent<HTMLTableCellElement>) => {
      if (event.metaKey || event.ctrlKey) return;
      event.preventDefault();

      switch (event.key) {
        case ' ':
          dispatch({ type: 'TOGGLE_CELL', row, col });
          break;
        case 'Backspace':
        case 'Delete':
          dispatch({ type: 'SET_CELL_LETTER', row, col, letter: '' });
          break;
        case 'ArrowUp':
          focusCell((currentRow ?? row) - 1, currentCol ?? col);
          break;
        case 'ArrowDown':
          focusCell((currentRow ?? row) + 1, currentCol ?? col);
          break;
        case 'ArrowLeft':
          focusCell(currentRow ?? row, (currentCol ?? col) - 1);
          break;
        case 'ArrowRight':
          focusCell(currentRow ?? row, (currentCol ?? col) + 1);
          break;
        default:
          if (/^[a-z]$/i.test(event.key)) {
            dispatch({
              type: 'SET_CELL_LETTER',
              row,
              col,
              letter: event.key.toUpperCase(),
            });
          }
      }
    },
    [currentRow, currentCol, dispatch, size]
  );

  function handleSizeChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const newSize = parseInt(event.target.value);
    dispatch({ type: 'SET_SIZE', size: newSize });
  }

  return (
    <div>
      <p className="grid-settings dont-print">
        <span className="grid-setting">
          Size:{' '}
          <select value={size} onChange={handleSizeChange}>
            {SIZES.map(s => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </span>
        <span className="grid-setting">
          Hide answers:{' '}
          <input
            type="checkbox"
            checked={hideLetters}
            onChange={e => setHideLetters(e.target.checked)}
          />
        </span>
      </p>

      <table className="grid-table">
        <tbody>
          {grid.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td
                  key={colIndex}
                  tabIndex={0}
                  className={`cell ${cell.isWhite ? 'cell-white' : 'cell-black'}`}
                  onFocus={() => handleFocus(rowIndex, colIndex)}
                  onKeyDown={e => handleKeyDown(rowIndex, colIndex, e)}
                  ref={el => {
                    if (!cellRefs.current[rowIndex]) {
                      cellRefs.current[rowIndex] = Array(size).fill(null);
                    }
                    cellRefs.current[rowIndex][colIndex] = el;
                  }}
                >
                  {cell.isWhite && (
                    <div className="cell-layout">
                      <div className="cell-number">{cell.cellNumber ?? ''}</div>
                      {!hideLetters && (
                        <div className="cell-letter">{cell.letter}</div>
                      )}
                    </div>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
