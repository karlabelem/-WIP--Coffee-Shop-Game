// main code

// Ingredient type as an enum
enum Ingredient {
  Espresso = "espresso",
  Milk = "milk",
  Foam = "foam",
  Chocolate = "chocolate",
}

// Recipe type
interface Recipe {
  name: string;
  ingredients: Ingredient[];
}

// Level type
interface Level {
  id: number;
  recipe: Recipe;
}

// Game state
interface GameState {
  currentLevel: number;
  chosenIngredients: Ingredient[];
  score: number;
  timer: number;
  mode: "competitive" | "freestyle";
}

// Levels
const levels: Level[] = [
  { id: 1, recipe: { name: "Latte", ingredients: [Ingredient.Espresso, Ingredient.Milk, Ingredient.Foam] } },
  { id: 2, recipe: { name: "Cappuccino", ingredients: [Ingredient.Espresso, Ingredient.Milk, Ingredient.Foam] } },
  { id: 3, recipe: { name: "Mocha", ingredients: [Ingredient.Espresso, Ingredient.Milk, Ingredient.Chocolate] } },
];

// Initialize game state
const gameState: GameState = {
  currentLevel: 0,
  chosenIngredients: [],
  score: 0,
  timer: 60,
  mode: "freestyle", // Default mode
};

// Elements
const cup = document.getElementById("cup") as HTMLElement;
const orderBox = document.getElementById("order") as HTMLElement;
const scoreBox = document.getElementById("score") as HTMLElement;
const timerBox = document.getElementById("timer") as HTMLElement;
const resultBox = document.getElementById("result") as HTMLElement;
const startButton = document.getElementById("start-game") as HTMLButtonElement;

// Start a new level
function startLevel() {
  const level = levels[gameState.currentLevel];
  gameState.chosenIngredients = [];
  orderBox.textContent = `Order: Make a ${level.recipe.name} (${level.recipe.ingredients.join(" + ")})`;
  cup.innerHTML = `<img src="assets/coffee-cup.png" alt="Cup Base" class="cup-base">`;
}

// Drag-and-drop setup
const ingredients = document.querySelectorAll(".ingredient");
ingredients.forEach(ingredient => {
  ingredient.addEventListener("dragstart", (e) => {
    const event = e as DragEvent; // Explicitly cast the event to DragEvent
    const target = event.target as HTMLElement | null; // Ensure the target is an HTMLElement
    if (target && target.id) {
      console.log("Dragging:", target.id); // Debugging
      event.dataTransfer?.setData("text/plain", target.id); // Set the ingredient ID
    }
  });
});

cup.addEventListener("dragover", e => e.preventDefault());

cup.addEventListener("drop", e => {
  e.preventDefault();
  const id = e.dataTransfer?.getData("text/plain") as Ingredient;
  console.log("Dropped:", id); // Debugging
  if (id) {
    gameState.chosenIngredients.push(id);

    // Add ingredient image to the cup
    const ingredient = document.getElementById(id) as HTMLElement;
    const img = ingredient.querySelector("img") as HTMLImageElement;
    if (img) {
      console.log("Image Source:", img.src); // Debugging
      const icon = document.createElement("img");
      icon.src = img.src; // Use the source of the dragged ingredient's image
      icon.alt = img.alt;
      icon.width = 40;
      cup.appendChild(icon);
    }
  }
});

// Check the order
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
    }
  } else {
    resultBox.textContent = "Incorrect! Try again.";
  }

  scoreBox.textContent = `Score: ${gameState.score}`;
}

// Timer for competitive mode
function startTimer() {
  if (gameState.mode === "competitive") {
    console.log("Timer started!"); // Debugging
    const interval = setInterval(() => {
      gameState.timer--;
      timerBox.textContent = `Time Left: ${gameState.timer}s`;

      if (gameState.timer <= 0) {
        clearInterval(interval); // Stop the timer
        resultBox.textContent = "Time's up! Game over.";
        startButton.disabled = false; // Re-enable the start button
      }
    }, 1000); // Update every second
  }
}

// Start the game
startButton.addEventListener("click", () => {
  gameState.currentLevel = 0;
  gameState.score = 0;
  gameState.timer = 60; // Reset timer
  gameState.mode = "competitive"; // Set mode to competitive
  startButton.disabled = true; // Disable the button during the game
  startLevel(); // Start the first level
  startTimer(); // Start the timer
});
