import './style.css'
import { DifficultConfigs, DifficultLevel } from "./constants/gameConfig.ts";
import { createBoard } from "./core/boardGenerator.ts";
import { plantBombs } from "./utils/bombGenerator.ts";
import type { Cell } from "./types/cell.ts";

const gameContainer = document.getElementById("game")!;
const diffConfig = DifficultConfigs[DifficultLevel.BEGINNER];
const board = createBoard(diffConfig);

let isGameStarted = false;

gameContainer.style.gridTemplateColumns = `repeat(${diffConfig.columns}, 40px)`
gameContainer.innerHTML = "";

board.forEach((row, rowIndex) => {
    row.forEach((cellData, columnIndex) => {
        const cellElement = document.createElement("div");
        cellElement.classList.add("cell");

        gameContainer.appendChild(cellElement)

        cellElement.addEventListener("click", () => {
            if (!isGameStarted) {
                plantBombs(board, rowIndex, columnIndex, diffConfig.bombCount);
                isGameStarted = true;
            }
            revealCell(cellData, cellElement)
        })
    })
})

function revealCell(cell: Cell, element: HTMLElement) {
    if (cell.isRevealed || cell.isFlagged) return;

    cell.isRevealed = true;
    element.classList.add("revealed");

    if (cell.isBomb) {
        element.textContent = "B";
        element.style.background = "red";
    } else if (cell.count > 0) {
        element.textContent = cell.count.toString()
    }
}