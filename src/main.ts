import './style.css'
import {DifficultConfigs, DifficultLevel, type DifficultSettings} from "./constants/gameConfig.ts";
import { createBoard } from "./core/boardGenerator.ts";
import { plantBombs } from "./utils/bombGenerator.ts";
import { checkWin, revealAllBombs, revealEmptyCells, toggleFlag } from "./core/gameLogic.ts";
import type { Cell } from "./types/cell.ts";

const gameContainer = document.getElementById("game")!;
const resetButton = document.getElementById("reset")!;
const diffSelected = document.getElementById("gameDifficult") as HTMLSelectElement;

let board: Cell[][] = [];
let cellElements: HTMLElement[][] = [];
let isGameStarted = false;
let isGameOver = false;
let currentDiff: DifficultSettings;

function createGame(){
    const selectedDiff = diffSelected.value as DifficultLevel;
    currentDiff = DifficultConfigs[selectedDiff];

    isGameStarted = false;
    isGameOver = false;
    board = createBoard(currentDiff);
    cellElements = [];

    gameContainer.style.gridTemplateColumns = `repeat(${currentDiff.columns}, 40px)`
    gameContainer.innerHTML = "";

    renderGameLogic();
}

function renderGameLogic() {
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
                    plantBombs(board, rowIndex, columnIndex, currentDiff.bombCount);
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
                    if (checkWin(board, currentDiff.bombCount)) {
                        isGameOver = true;
                        setTimeout(() => alert("Congratulations! You Win!"), 100);
                    }
                }
            })
            // Right click logic / Flag logic
            cellElement.addEventListener("contextmenu", (e) => {
                e.preventDefault(); // Prevents opening the OS menu.

                if (isGameOver || !isGameStarted) return;

                toggleFlag(cellData);
                updateUI();
            })
        })
        cellElements.push(elementRow);
    })
}

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

resetButton.addEventListener("click", createGame);
diffSelected.addEventListener("change", createGame)

createGame();