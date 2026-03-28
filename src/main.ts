import './style.css'
//import { createBoard } from "./core/boardGenerator.ts";

const game = document.getElementById("game")!;
const size = 10;

for (let row = 0; row<size; row++) {
    for (let col = 0; col<size; col++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");

        game.appendChild(cell);

        cell.addEventListener("click", () => {
            cell.style.background = "#999";
        })
    }
}