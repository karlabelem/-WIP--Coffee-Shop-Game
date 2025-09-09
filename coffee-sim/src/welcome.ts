import "./welcome.css";          
import { startGame } from "./main"; 
import "./style.css";

const welcomeScreen = document.getElementById("welcome-screen") as HTMLElement;
const gameContainer = document.getElementById("game-container") as HTMLElement;

const timedBtn = document.getElementById("timed-mode") as HTMLButtonElement;
const freeBtn = document.getElementById("free-mode") as HTMLButtonElement;

function handleStart(mode: "competitive" | "freestyle") {
  welcomeScreen.style.display = "none";  // hide welcome
  gameContainer.style.display = "block"; // show game
  startGame(mode);                        // run the game
}

timedBtn.addEventListener("click", () => handleStart("competitive"));
freeBtn.addEventListener("click", () => handleStart("freestyle"));
