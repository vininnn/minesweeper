import './style.css'
import { DifficultConfigs, DifficultLevel } from "./constants/gameConfig.ts";
import { createBoard } from "./core/boardGenerator.ts";
import { plantBombs } from "./utils/bombGenerator.ts";
import {checkWin, revealAllBombs, revealEmptyCells, toggleFlag} from "./core/gameLogic.ts";

const gameContainer = document.getElementById("game")!;
const diffConfig = DifficultConfigs[DifficultLevel.BEGINNER];
const board = createBoard(diffConfig);
const cellElements: HTMLElement[][] = [];

let isGameStarted = false;
let isGameOver = false;

gameContainer.style.gridTemplateColumns = `repeat(${diffConfig.columns}, 40px)`
gameContainer.innerHTML = "";

board.forEach((row, rowIndex) => {
    const elementRow: HTMLElement[] = [];
    row.forEach((cellData, columnIndex) => {
        const cellElement = document.createElement("div");
        cellElement.classList.add("cell");

        gameContainer.appendChild(cellElement)
        elementRow.push(cellElement);

        // Left click logic
        cellElement.addEventListener("click", () => {
            if (isGameOver) return;

            if (!isGameStarted) {
                plantBombs(board, rowIndex, columnIndex, diffConfig.bombCount);
                isGameStarted = true;
            }

            const clickedCell = board[rowIndex][columnIndex];
            if (clickedCell.isRevealed || clickedCell.isFlagged) return;
            // Lose
            if (clickedCell.isBomb) {
                clickedCell.isRevealed = true;
                isGameOver = true;
                revealAllBombs(board);
                updateUI()
                setTimeout(() => alert("Not this time... Try again!"), 100);
            } else {
                revealEmptyCells(board, rowIndex, columnIndex);
                updateUI();
                // Check win
                if (checkWin(board, diffConfig.bombCount)) {
                    isGameOver = true;
                    setTimeout(() => alert("Congratulations! You Win!"), 100);
                }
            }
        })
        cellElement.addEventListener("contextmenu", (e) => {
            e.preventDefault(); // Prevents opening the OS menu.

            if (isGameOver || !isGameStarted) return;

            toggleFlag(cellData);
            updateUI();
        })
    })
    cellElements.push(elementRow);
})

function updateUI() {
    board.forEach((row, r) => {
        row.forEach((cell, c) => {
            const element = cellElements[r][c];

            if (cell.isRevealed) {
                element.classList.add("revealed");
                if (cell.isBomb) {
                    element.textContent = "B";
                    element.style.background = "red";
                } else {
                    element.textContent = cell.count > 0 ? cell.count.toString() : "";
                }
            } else if (cell.isFlagged) {
                // Lose and put a wrong flag
                if (isGameOver && !cell.isBomb) {
                    element.textContent = "not F";
                    element.style.background = "yellow"
                }
                else {
                    element.textContent = "F";
                }
            } else {
                element.textContent = ""; // Clear flag
            }
        })
    })
}
