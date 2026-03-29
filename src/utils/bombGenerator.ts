import type { Cell } from "../types/cell.ts";

export function plantBombs(board: Cell[][], clickedRow: number, clickedColumn: number, bombCount: number) {
    const rows = board.length;
    const columns = board[0].length;
    const safeZone = new Set<number>();

    // Safe zone (click + 8 neighboring cells)
    for (let  r = clickedRow - 1; r <= clickedRow + 1; r++) {
        for (let  c = clickedColumn - 1; c <= clickedColumn + 1; c++) {
            // Checking limits
            if (r >= 0 && r < rows && c >= 0 && c < columns) {
                // Converting to linear indexes ex.:(row 1, column 2) = 1 * 10(on beginner) + 2 = 12
                safeZone.add(r * columns + c);
            }
        }
    }

    // Bomb placed
    let bombsPlaced = 0;
    while (bombsPlaced < bombCount) {
        const randomRow = Math.floor(Math.random()*rows);
        const randomColumn = Math.floor(Math.random()*columns);
        // Linear index
        const index = randomRow *  columns + randomColumn;

        if (!safeZone.has(index) && !board[randomRow][randomColumn].isBomb) {
            board[randomRow][randomColumn].isBomb = true;
            bombsPlaced++;
        }
    }

    calculateNeighborCounts(board);
}

function calculateNeighborCounts(board: Cell[][]) {
    const rows = board.length;
    const columns = board[0].length;

    for (let  r = 0; r < rows; r++) {
        for (let  c = 0; c < columns; c++) {
            if (board[r][c].isBomb) continue;

            let count = 0;
            // Check on neighbors
            // dr = delta row
            // dc = delta column
            for (let dr = -1; dr <= 1; dr++){
                for (let dc = -1; dc <= 1; dc++) {
                    // nr = neighbor row
                    // nc = neighbor column
                    const nr = r + dr;
                    const nc = c + dc;
                    // Checking limits and bombs
                    if (nr >= 0 && nr < rows && nc >= 0 && nc < columns && board[nr][nc].isBomb) {
                        count++;
                    }
                }
            }
            board[r][c].count = count
        }
    }
}
