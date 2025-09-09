import "./style.css"; // gameplay styles

export enum Ingredient {
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
  intervalId?: number;
}

const levels: Level[] = [
  { id: 1, recipe: { name: "Latte", ingredients: [Ingredient.Espresso, Ingredient.Milk, Ingredient.Foam] } },
  { id: 2, recipe: { name: "Cappuccino", ingredients: [Ingredient.Espresso, Ingredient.Milk, Ingredient.Foam] } },
  { id: 3, recipe: { name: "Mocha", ingredients: [Ingredient.Espresso, Ingredient.Milk, Ingredient.Chocolate] } },
];

export function startGame(mode: "competitive" | "freestyle") {
  // Elements
  const gameContainer = document.getElementById("game-container") as HTMLElement;
  const cup = document.getElementById("cup") as HTMLElement;
  const orderBox = document.getElementById("order") as HTMLElement;
  const scoreBox = document.getElementById("score") as HTMLElement;
  const timerBox = document.getElementById("timer") as HTMLElement;
  const resultBox = document.getElementById("result") as HTMLElement;
  const startButton = document.getElementById("start-game") as HTMLButtonElement;
  const submitButton = document.getElementById("submit-order") as HTMLButtonElement;

  gameContainer.style.display = "block";

  // Game state
  const gameState: GameState = {
    currentLevel: 0,
    chosenIngredients: [],
    score: 0,
    timer: 60,
    mode,
  };

  // --- Functions ---

  function startLevel() {
    const level = levels[gameState.currentLevel];
    gameState.chosenIngredients = [];
    orderBox.textContent = `Order: Make a ${level.recipe.name} (${level.recipe.ingredients.join(" + ")})`;
    cup.innerHTML = `<img src="assets/coffee-cup.png" alt="Cup Base" class="cup-base">`;
    if (resultBox) resultBox.textContent = "";
  }

  function addIngredientToCup(id: Ingredient, ingredientElement: HTMLElement) {
    gameState.chosenIngredients.push(id);
    const img = ingredientElement.querySelector("img") as HTMLImageElement;
    if (img) {
      const icon = document.createElement("img");
      icon.src = img.src;
      icon.alt = img.alt;
      icon.width = 40;
      cup.appendChild(icon);
    }
  }

  function checkOrder() {
    const level = levels[gameState.currentLevel];
    const required = [...level.recipe.ingredients].sort();
    const chosen = [...gameState.chosenIngredients].sort();

    if (JSON.stringify(required) === JSON.stringify(chosen)) {
      if (resultBox) resultBox.textContent = `Correct! You made a ${level.recipe.name}! 🎉`;
      gameState.score += 10;
      gameState.currentLevel++;
      if (gameState.currentLevel < levels.length) {
        startLevel();
      } else {
        if (resultBox) resultBox.textContent = "You completed all levels! 🎊";
        startButton.disabled = false;
        submitButton.disabled = true;
      }
    } else {
      if (resultBox) resultBox.textContent = "Incorrect! Try again.";
    }

    scoreBox.textContent = `Score: ${gameState.score}`;
  }

  function startTimer() {
    if (gameState.mode === "competitive") {
      gameState.intervalId = window.setInterval(() => {
        gameState.timer--;
        timerBox.textContent = `Time Left: ${gameState.timer}s`;

        if (gameState.timer <= 0) {
          clearInterval(gameState.intervalId);
          if (resultBox) resultBox.textContent = "Time's up! Game over.";
          startButton.disabled = false;
          submitButton.disabled = true;
        }
      }, 1000);
    } else {
      timerBox.textContent = "Free Play Mode 🎨";
    }
  }

  // --- Event listeners ---

  const ingredients = document.querySelectorAll(".ingredient");
  ingredients.forEach(ingredient => {
    // drag start
    ingredient.addEventListener("dragstart", (e) => {
      const event = e as DragEvent;
      const target = event.target as HTMLElement | null;
      if (target && target.id) {
        event.dataTransfer?.setData("text/plain", target.id);
      }
    });

    // click support
    ingredient.addEventListener("click", () => {
      const id = ingredient.id as Ingredient;
      addIngredientToCup(id, ingredient);
    });
  });

  cup.addEventListener("dragover", e => e.preventDefault());
  cup.addEventListener("drop", e => {
    e.preventDefault();
    const id = e.dataTransfer?.getData("text/plain") as Ingredient;
    if (id) {
      const ingredient = document.getElementById(id) as HTMLElement;
      addIngredientToCup(id, ingredient);
    }
  });

  startButton.addEventListener("click", () => {
    gameState.currentLevel = 0;
    gameState.score = 0;
    gameState.timer = 60;
    startButton.disabled = true;
    submitButton.disabled = false;
    startLevel();
    startTimer();
  });

  submitButton.addEventListener("click", () => checkOrder());

  // initialize first level
  startButton.disabled = false;
  submitButton.disabled = true;
  startLevel();
}
