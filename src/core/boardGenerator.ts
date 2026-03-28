import type { Cell } from "../types/cell.ts";
import type { DifficultSettings } from "../constants/gameConfig.ts";

export function createBoard(settings: DifficultSettings): Cell[][] {
    const board: Cell[][] = [];
    const { rows, columns, bombCount } = settings;

    for (let i=0; i<rows; i++) {
        for (let j=0; j<columns; j++) {

        }
    }

    let bombPlaced = 0;
    while (bombPlaced < bombCount) {}

    return board;
}