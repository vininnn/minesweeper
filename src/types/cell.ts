/**
 * Represents a single cell on the Minesweeper board.
 */
export type Cell = {
  isBomb: boolean,
  count: number, // Number of adjacent bombs
  isRevealed: boolean,
  isFlagged: boolean,
};

