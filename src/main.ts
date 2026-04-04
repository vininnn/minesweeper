import './style.css'
import './components/sevenSegments.css'
import { createSevenSegmentDisplay } from "./components/sevenSegments.ts";
import { DifficultConfigs, DifficultLevel, type DifficultSettings } from "./constants/gameConfig.ts";
import { createBoard } from "./core/boardGenerator.ts";
import { plantBombs } from "./utils/bombGenerator.ts";
import { checkWin, revealAllBombs, revealEmptyCells, toggleFlag } from "./core/gameLogic.ts";
import type { Cell } from "./types/cell.ts";

const gameContainer = document.getElementById("game")!;
const resetButton = document.getElementById("reset")!;
const diffSelected = document.getElementById("game-difficult") as HTMLSelectElement;

const timerDisplay = createSevenSegmentDisplay(document.getElementById('timer')!, 3);
const flagDisplay = createSevenSegmentDisplay(document.getElementById('flags')!, 3);

// Game
let board: Cell[][] = [];
let cellElements: HTMLElement[][] = [];
let isGameStarted = false;
let isGameOver = false;
let currentDiff: DifficultSettings;

// Timer
let secondsElapsed = 0;
let timeInterval: number | null = null;

// Flags
let remainingFlags = 0;

function createGame(){
    stopTimer();
    timerDisplay.update(0);

    const selectedDiff = diffSelected.value as DifficultLevel;
    currentDiff = DifficultConfigs[selectedDiff];

    flagDisplay.update(currentDiff.bombCount);

    isGameStarted = false;
    isGameOver = false;
    board = createBoard(currentDiff);
    cellElements = [];

    gameContainer.style.gridTemplateColumns = `repeat(${currentDiff.columns}, 35px)`
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
                    startTimer();
                    plantBombs(board, rowIndex, columnIndex, currentDiff.bombCount);
                    isGameStarted = true;
                }

                const clickedCell = board[rowIndex][columnIndex];
                if (clickedCell.isRevealed || clickedCell.isFlagged) return;
                // Lose
                if (clickedCell.isBomb) {
                    clickedCell.isRevealed = true;
                    isGameOver = true;
                    stopTimer();
                    revealAllBombs(board);
                    updateUI()
                    setTimeout(() => alert("Not this time... Try again!"), 100);
                } else {
                    revealEmptyCells(board, rowIndex, columnIndex);
                    updateUI();
                    // Check win
                    if (checkWin(board, currentDiff.bombCount)) {
                        isGameOver = true;
                        stopTimer();
                        setTimeout(() => alert("Congratulations! You Win!"), 100);
                    }
                }
            })
            // Right click logic / Flag logic
            cellElement.addEventListener("contextmenu", (e) => {
                e.preventDefault(); // Prevents opening the OS menu.

                if (isGameOver || cellData.isRevealed) return;

                updateFlagCount(cellData.isFlagged);
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

            element.className = "cell";

            if (cell.isRevealed) {
                element.classList.add("revealed");
                if (cell.isBomb) {
                    element.textContent = "💣";
                    element.classList.add("bomb")
                } else {
                    if (cell.count > 0) {
                        element.textContent = cell.count.toString();
                        element.classList.add(`n-${cell.count}`);
                    } else {
                    element.textContent = "";
                    }
                }
            } else if (cell.isFlagged) {
                // Lose and put a wrong flag
                if (isGameOver && !cell.isBomb) {
                    element.textContent = "❌";
                    element.style.background = "yellow"
                }
                else {
                    element.textContent = "🚩";
                }
            } else {
                element.textContent = ""; // Clear flag
            }
        })
    })
}

function startTimer() {
    if (timeInterval) return;

    // Timer up to 999
    timeInterval = setInterval(() => {
        if (secondsElapsed < 999) {
            secondsElapsed++;
            timerDisplay.update(secondsElapsed);
        } else {
            stopTimer();
        }
    }, 1000);
}

function stopTimer() {
    if (timeInterval) {
        clearInterval(timeInterval);
        timeInterval = null;
    }
}

function updateFlagCount(wasFlagged: boolean) {
    if (!wasFlagged) {
        remainingFlags--;
    } else {
        remainingFlags++;
    }

    //flagElement!.textContent = remainingFlags.toString().padStart(3, "0")

    // If negative, format as -0X, otherwise, 00X
    flagDisplay.update(remainingFlags);
}

resetButton.addEventListener("click", createGame);
diffSelected.addEventListener("change", createGame)

createGame();