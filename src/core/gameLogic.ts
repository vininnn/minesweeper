import type { Cell } from "../types/cell.ts";

/**
 * Flood fill algorithm to recursively reveal connected empty cells.
 * Stops when it hits a cell with a number (count > 0).
 * @param board
 * @param row
 * @param column
 */
export function revealEmptyCells(board: Cell[][], row: number, column: number) {
    const rows = board.length;
    const columns = board[0].length;

    // Out of limits
    if (row < 0 || row >= rows || column < 0 || column >= columns) return;

    const cell = board[row][column];
    // Already processed or restricted
    if (cell.isRevealed || cell.isFlagged || cell.isBomb) return;

    cell.isRevealed = true;

    // If count > 0, stop
    if (cell.count > 0) return;

    // If count = 0, look the neighbors (recursion)
    for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
            if (dr === 0 && dc === 0) continue;
            revealEmptyCells(board, row + dr, column +dc);
        }
    }
}

/**
 * Toggles the flagged state of an unrevealed cell.
 * @param cell
 */
export function toggleFlag(cell: Cell) {
    if (cell.isRevealed) return;
    cell.isFlagged = !cell.isFlagged;
}

/**
 * Reveals all unflagged bombs. Triggered on Game Over.
 * @param board
 */
export function revealAllBombs(board: Cell[][]) {
    const rows = board.length;
    const columns = board[0].length;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c< columns; c++) {
            const cell = board[r][c];
            if (cell.isBomb && !cell.isFlagged) {
                cell.isRevealed = true;
            }
        }
    }
}

/**
 * Checks if the win condition is met (all non-bombs cells are revealed).
 * @param board
 * @param totalBombs
 */
export function checkWin(board: Cell[][], totalBombs: number): boolean {
    let revealedCells = 0;
    const totalCells = board.length * board[0].length;

    for (let r = 0; r < board.length; r++) {
        for (let c = 0; c < board[0].length; c++) {
            if (board[r][c].isRevealed) {
                revealedCells++;
            }
        }
    }

    return revealedCells === totalCells - totalBombs;
}
