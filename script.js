document.addEventListener('DOMContentLoaded', () => {
  const ingredients = document.querySelectorAll('.ingredient');
  const cup = document.getElementById('cup');
  const chosenIngredients = [];
  let score = 0; // Initialize score as a number

  // Dragstart event: Set the ingredient ID in the dataTransfer object
  ingredients.forEach(ingredient => {
    ingredient.addEventListener('dragstart', e => {
      const target = e.target;
      if (target && target.id) {
        e.dataTransfer.setData('text/plain', target.id);
      }
    });
  });

  // Dragover event: Allow dropping by preventing the default behavior
  cup.addEventListener('dragover', e => {
    e.preventDefault();
  });

  // Drop event: Append the dragged ingredient to the cup
  cup.addEventListener('drop', e => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    const ingredient = document.getElementById(id);

    if (ingredient) {
      chosenIngredients.push(id);

      // Create a copy of the ingredient image and append it to the cup
      const icon = document.createElement('img');
      icon.src = ingredient.querySelector('img').src;
      icon.alt = ingredient.id;
      icon.width = 40;
      cup.appendChild(icon);
    }
  });

  // Expose chosenIngredients globally for debugging
  window.chosenIngredients = chosenIngredients;
});

function checkOrder() {
  const correctRecipe = ["espresso", "milk", "foam"];
  const resultBox = document.getElementById("result");
  const scoreBox = document.getElementById("score");

  // Sort both arrays before comparing
  const sortedChosen = [...window.chosenIngredients].sort();
  const sortedCorrect = [...correctRecipe].sort();

  if (JSON.stringify(sortedChosen) === JSON.stringify(sortedCorrect)) {
    resultBox.textContent = "Perfect Latte! 🎉";
    window.score = (window.score || 0) + 10;
  } else {
    resultBox.textContent = "Oops! That's not a latte 😅";
  }

  // Update the score display
  scoreBox.textContent = `Score: ${window.score || 0}`;

  // Reset the cup and chosen ingredients for the next order
  window.chosenIngredients = [];
  const cup = document.getElementById("cup");
  cup.innerHTML = `<img src="assets/coffee-cup.png" alt="Cup Base" class="cup-base">`;
}
