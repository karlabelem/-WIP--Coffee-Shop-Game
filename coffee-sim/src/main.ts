// src/main.ts
import "./style.css";

enum Ingredient {
  Espresso = "espresso",
  Milk = "milk",
  Foam = "foam",
  Chocolate = "chocolate",
}

interface Recipe {
  name: string;
  ingredients: Ingredient[];
}

interface Level {
  id: number;
  recipe: Recipe;
}

interface GameState {
  currentLevel: number;
  chosenIngredients: Ingredient[];
  score: number;
  timer: number;
  mode: "competitive" | "freestyle";
}

const levels: Level[] = [
  { id: 1, recipe: { name: "Latte",      ingredients: [Ingredient.Espresso, Ingredient.Milk, Ingredient.Foam] } },
  { id: 2, recipe: { name: "Cappuccino", ingredients: [Ingredient.Espresso, Ingredient.Milk, Ingredient.Foam] } },
  { id: 3, recipe: { name: "Mocha",      ingredients: [Ingredient.Espresso, Ingredient.Milk, Ingredient.Chocolate] } },
];

const gameState: GameState = {
  currentLevel: 0,
  chosenIngredients: [],
  score: 0,
  timer: 60,
  mode: "freestyle",
};

// Elements
const cup         = document.getElementById("cup")         as HTMLElement;
const orderBox    = document.getElementById("order")       as HTMLElement;
const scoreBox    = document.getElementById("score")       as HTMLElement;
const timerBox    = document.getElementById("timer")       as HTMLElement;
const resultBox   = document.getElementById("result")      as HTMLElement;
const startButton = document.getElementById("start-game")  as HTMLButtonElement;
const submitButton= document.getElementById("submit-order")as HTMLButtonElement;

// Start a level
function startLevel() {
  const level = levels[gameState.currentLevel];
  gameState.chosenIngredients = [];
  orderBox.textContent = `Order: Make a ${level.recipe.name} (${level.recipe.ingredients.join(" + ")})`;
  cup.innerHTML = `<img src="/assets/coffee-cup.png" alt="Cup Base" class="cup-base">`;
  resultBox.textContent = "";
}

// Setup drag & click on tray items
const ingredients = document.querySelectorAll(".ingredient");
ingredients.forEach((el) => {
  const ingredientEl = el as HTMLElement;

  // Ensure the tray item itself is draggable (not just the inner img)
  ingredientEl.setAttribute("draggable", "true");

  // DRAG START — use currentTarget to get the id from the .ingredient div
  ingredientEl.addEventListener("dragstart", (e) => {
    const ev = e as DragEvent;
    const id = (ev.currentTarget as HTMLElement).id; // ✅ key fix
    if (!id || !ev.dataTransfer) return;
    ev.dataTransfer.setData("text/plain", id);
    ev.dataTransfer.setData("text", id); // some browsers still look at "text"
    console.log("Dragging:", id);
  });

  // CLICK-TO-ADD fallback (also useful on touch devices)
  ingredientEl.addEventListener("click", () => {
    addIngredientToCup(ingredientEl.id as Ingredient, ingredientEl);
  });
});

// Allow drop on cup
cup.addEventListener("dragover", (e) => e.preventDefault());

// Handle drop
cup.addEventListener("drop", (e) => {
  e.preventDefault();
  const dt = e.dataTransfer;
  const id = (dt?.getData("text/plain") || dt?.getData("text")) as Ingredient;
  if (!id) {
    console.warn("No ingredient id found on drop");
    return;
  }
  console.log("Dropped:", id);
  const ingredientEl = document.getElementById(id) as HTMLElement | null;
  if (!ingredientEl) {
    console.error("No tray element with id:", id);
    return;
  }
  addIngredientToCup(id, ingredientEl);
});

// Add ingredient icon to cup + update state
function addIngredientToCup(id: Ingredient, ingredientEl: HTMLElement) {
  gameState.chosenIngredients.push(id);

  const trayImg = ingredientEl.querySelector("img") as HTMLImageElement | null;
  if (!trayImg) {
    console.error("No <img> inside ingredient:", id);
    return;
  }

  // Clone the tray image so filenames/paths never matter
  const icon = trayImg.cloneNode(true) as HTMLImageElement;
  icon.width = 40;
  icon.removeAttribute("draggable"); // prevent re-dragging from cup area
  cup.appendChild(icon);

  console.log("Added to cup:", id, "src:", icon.src);
}

// Check order (via Submit button)
function checkOrder() {
  const level = levels[gameState.currentLevel];
  const required = [...level.recipe.ingredients].sort();
  const chosen = [...gameState.chosenIngredients].sort();

  if (JSON.stringify(required) === JSON.stringify(chosen)) {
    resultBox.textContent = `Correct! You made a ${level.recipe.name}! 🎉`;
    gameState.score += 10;
    gameState.currentLevel++;
    if (gameState.currentLevel < levels.length) {
      startLevel();
    } else {
      resultBox.textContent = "You completed all levels! 🎊";
      startButton.disabled = false;
      submitButton.disabled = true;
    }
  } else {
    resultBox.textContent = "Incorrect! Try again.";
  }

  scoreBox.textContent = `Score: ${gameState.score}`;
}

// Timer (competitive mode)
function startTimer() {
  if (gameState.mode !== "competitive") return;

  const interval = setInterval(() => {
    gameState.timer--;
    timerBox.textContent = `Time Left: ${gameState.timer}s`;

    if (gameState.timer <= 0) {
      clearInterval(interval);
      resultBox.textContent = "Time's up! Game over.";
      startButton.disabled = false;
      submitButton.disabled = true;
    }
  }, 1000);
}

// Start & Submit
startButton.addEventListener("click", () => {
  gameState.currentLevel = 0;
  gameState.score = 0;
  gameState.timer = 60;
  gameState.mode = "competitive";
  startButton.disabled = true;
  submitButton.disabled = false;
  startLevel();
  startTimer();
});

submitButton.addEventListener("click", () => {
  console.log("Submit clicked");
  checkOrder();
});
