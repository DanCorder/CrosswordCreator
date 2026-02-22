import type { GridCell, AnswerPosition, Direction } from '../types/crossword';

export const WILDCARD = '_';

export function createGrid(size: number): GridCell[][] {
  return Array.from({ length: size }, () =>
    Array.from({ length: size }, () => ({ isWhite: true, letter: '', cellNumber: null }))
  );
}

export function resizeGrid(grid: GridCell[][], newSize: number): GridCell[][] {
  const oldSize = grid.length;
  if (oldSize === newSize) return grid;

  if (oldSize < newSize) {
    const newGrid = grid.map(row => {
      const newRow = [...row];
      for (let c = oldSize; c < newSize; c++) {
        newRow.push({ isWhite: true, letter: '', cellNumber: null });
      }
      return newRow;
    });
    for (let r = oldSize; r < newSize; r++) {
      newGrid.push(
        Array.from({ length: newSize }, () => ({ isWhite: true, letter: '', cellNumber: null }))
      );
    }
    return newGrid;
  } else {
    return grid.slice(0, newSize).map(row => row.slice(0, newSize));
  }
}

export function numberCells(grid: GridCell[][]): GridCell[][] {
  const size = grid.length;
  let clueNumber = 1;

  return grid.map((row, rowIndex) =>
    row.map((cell, columnIndex) => {
      if (!cell.isWhite) return { ...cell, cellNumber: null };

      const startsDown =
        (rowIndex === 0 || !grid[rowIndex - 1][columnIndex].isWhite) &&
        rowIndex !== size - 1 &&
        grid[rowIndex + 1][columnIndex].isWhite;

      const startsAcross =
        (columnIndex === 0 || !grid[rowIndex][columnIndex - 1].isWhite) &&
        columnIndex !== size - 1 &&
        grid[rowIndex][columnIndex + 1].isWhite;

      if (startsDown || startsAcross) {
        return { ...cell, cellNumber: clueNumber++ };
      }
      return { ...cell, cellNumber: null };
    })
  );
}

export function findAnswers(grid: GridCell[][]): AnswerPosition[] {
  const size = grid.length;
  const answers: AnswerPosition[] = [];

  for (let rowIndex = 0; rowIndex < size; rowIndex++) {
    for (let columnIndex = 0; columnIndex < size; columnIndex++) {
      const cell = grid[rowIndex][columnIndex];
      if (!cell.cellNumber) continue;

      // Check for across run starting here
      const hasWhiteRight = columnIndex < size - 1 && grid[rowIndex][columnIndex + 1].isWhite;
      const noWhiteLeft = columnIndex === 0 || !grid[rowIndex][columnIndex - 1].isWhite;
      if (hasWhiteRight && noWhiteLeft) {
        let letters = cell.letter || WILDCARD;
        for (let c = columnIndex + 1; c < size; c++) {
          if (!grid[rowIndex][c].isWhite) break;
          letters += grid[rowIndex][c].letter || WILDCARD;
        }
        answers.push({
          row: rowIndex,
          column: columnIndex,
          number: cell.cellNumber,
          direction: 'a',
          letters,
        });
      }

      // Check for down run starting here
      const hasWhiteBelow = rowIndex < size - 1 && grid[rowIndex + 1][columnIndex].isWhite;
      const noWhiteAbove = rowIndex === 0 || !grid[rowIndex - 1][columnIndex].isWhite;
      if (hasWhiteBelow && noWhiteAbove) {
        let letters = cell.letter || WILDCARD;
        for (let r = rowIndex + 1; r < size; r++) {
          if (!grid[r][columnIndex].isWhite) break;
          letters += grid[r][columnIndex].letter || WILDCARD;
        }
        answers.push({
          row: rowIndex,
          column: columnIndex,
          number: cell.cellNumber,
          direction: 'd',
          letters,
        });
      }
    }
  }

  return answers;
}

export function matchesAnswer(position: AnswerPosition, answer: string): boolean {
  if (position.letters.length !== answer.length) return false;
  return [...position.letters].every(
    (letter, index) =>
      letter === WILDCARD || letter.toLowerCase() === answer[index].toLowerCase()
  );
}

export function toggleCell(grid: GridCell[][], row: number, col: number): GridCell[][] {
  return grid.map((r, rowIndex) =>
    r.map((cell, colIndex) =>
      rowIndex === row && colIndex === col ? { ...cell, isWhite: !cell.isWhite } : cell
    )
  );
}

export function setCellLetter(
  grid: GridCell[][],
  row: number,
  col: number,
  letter: string
): GridCell[][] {
  return grid.map((r, rowIndex) =>
    r.map((cell, colIndex) =>
      rowIndex === row && colIndex === col ? { ...cell, letter } : cell
    )
  );
}

export function setLetters(
  grid: GridCell[][],
  row: number,
  col: number,
  direction: Direction,
  answer: string
): GridCell[][] {
  let result = grid;
  let currentRow = row;
  let currentCol = col;

  for (const letter of answer.toUpperCase()) {
    if (currentRow >= grid.length || currentCol >= grid.length) break;
    result = setCellLetter(result, currentRow, currentCol, letter);
    if (direction === 'a') {
      currentCol++;
    } else {
      currentRow++;
    }
  }

  return result;
}
