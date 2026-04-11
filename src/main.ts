import './style.css'
import './components/display/sevenSegments.css'
import {createSevenSegmentDisplay} from "./components/display/sevenSegments.ts";
//import {createMenu} from "./components/menu/menu.ts";
import {DifficultConfigs, DifficultLevel, type DifficultSettings} from "./constants/gameConfig.ts";
import {createBoard} from "./core/boardGenerator.ts";
import {plantBombs} from "./utils/bombGenerator.ts";
import {checkWin, revealAllBombs, revealEmptyCells, toggleFlag} from "./core/gameLogic.ts";
import type {Cell} from "./types/cell.ts";

const gameContainer = document.getElementById("game")!;
const resetButton = document.getElementById("reset")!;

const timerDisplay = createSevenSegmentDisplay(document.getElementById('timer')!, 3);
const flagDisplay = createSevenSegmentDisplay(document.getElementById('flags')!, 3);

// Game
let board: Cell[][] = [];
let cellElements: HTMLElement[][] = [];
let isGameStarted = false;
let isGameOver = false;
let currentDiff: DifficultSettings;

let explodedCell : Cell | null = null;
let currentLevel: DifficultLevel = DifficultLevel.BEGINNER;

// Timer
let secondsElapsed = 0;
let timeInterval: number | null = null;

// Flags
let remainingFlags = 0;

function createGame(){
    //celebrateWin(); for tests
    stopTimer();
    timerDisplay.update(0);
    secondsElapsed = 0;
    resetButton.textContent = "🙂";
    explodedCell = null;

    currentDiff = DifficultConfigs[currentLevel];

    remainingFlags = currentDiff.bombCount;
    flagDisplay.update(remainingFlags);

    isGameStarted = false;
    isGameOver = false;
    board = createBoard(currentDiff);
    cellElements = [];

    gameContainer.style.gridTemplateColumns = `repeat(${currentDiff.columns}, 34px)`
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
                    explodedCell = clickedCell;
                    resetButton.textContent = "😵";

                    stopTimer();
                    revealAllBombs(board);
                    updateUI()
                } else {
                    revealEmptyCells(board, rowIndex, columnIndex);
                    updateUI();
                    // Check win
                    if (checkWin(board, currentDiff.bombCount)) {
                        isGameOver = true;
                        resetButton.textContent = "😎";

                        stopTimer();
                        celebrateWin();
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
                    element.classList.add("bomb");

                    if (cell === explodedCell) {
                        element.textContent = "💥";
                        element.classList.add("exploded");
                    }
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
                    element.style.background = "#fae6a8"
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

function celebrateWin() {
    // @ts-ignore
    const count = 400;
    const defaults = {
        origin: { y: 0.9 },
        spread: 80,
        ticks: 200,
        gravity: 0.6,
        //colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'] // rgb+ default
        //colors: ['#D4AF37', '#F5E6A3', '#C9A227', '#FFFFFF', '#A8A8A8'] // luxury colors
        colors: ['#B8963A', '#8C6A3B', '#3B6E8F', '#A0A4A8', '#3A3F45'] // dark
    };
    // @ts-ignore Left side
    confetti({
        ...defaults,
        particleCount: count,
        angle: 80,
        origin: { x: 0.1, y: 1.1 }
    });
    // @ts-ignore Right side
    confetti({
        ...defaults,
        particleCount: count,
        angle: 100,
        origin: { x: 0.9, y: 1.1 }
    });
}

resetButton.addEventListener("click", createGame);

document.querySelectorAll('.diff-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const target = e.target as HTMLButtonElement;

        const levelKey = target.getAttribute('data-level') as keyof typeof DifficultLevel;
        currentLevel = DifficultLevel[levelKey];

        document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
        target.classList.add('active');

        createGame();
    });
});

//createMenu();
createGame();
