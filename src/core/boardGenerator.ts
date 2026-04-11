import type { Cell } from "../types/cell.ts";
import type { DifficultSettings } from "../constants/gameConfig.ts";

/**
 * Initializes an empty game board grid bases on the given difficult settings.
 * All cells start unrevealed, unflagged and without bombs.
 * @param settings
 */
export function createBoard(settings: DifficultSettings): Cell[][] {
    const board: Cell[][] = [];
    const { rows, columns } = settings;

    for (let i=0; i<rows; i++) {
        const currentRow: Cell[] = [];

        for (let j=0; j<columns; j++) {
            currentRow.push({
               isBomb: false,
               count: 0,
               isRevealed: false,
               isFlagged: false,
            });
        }
        board.push(currentRow);
    }

    return board;
}