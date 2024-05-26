document.addEventListener("DOMContentLoaded", () => {
  const recipeForm = document.getElementById("add-recipe-form");
  const recipeList = document.getElementById("recipes");
  const notificationContainer = document.createElement("div");
  notificationContainer.id = "notification-container";
  document.body.appendChild(notificationContainer);

  let recipes = JSON.parse(localStorage.getItem("recipes")) || [];
  let editingIndex = null;

  const renderRecipes = () => {
    recipeList.innerHTML = "";
    recipes.forEach((recipe, index) => {
      const recipeItem = document.createElement("li");
      recipeItem.classList.add(
        "list-group-item",
        "d-flex",
        "justify-content-between",
        "align-items-center"
      );
      recipeItem.innerHTML = `
        <div>
          <h5>${recipe.name}</h5>
          <p><strong>Ingredients:</strong> ${recipe.ingredients}</p>
          <p><strong>Instructions:</strong> ${recipe.instructions}</p>
        </div>
        <div>
          <button class="btn btn-success me-2" data-index="${index}" onclick="favoriteRecipe(${index})">
            <i class="bi ${recipe.favorite ? "bi-star-fill" : "bi-star"}"></i>
          </button>
          <button class="btn btn-warning me-2" data-index="${index}" onclick="editRecipe(${index})">
            <i class="bi bi-pencil-square"></i>
          </button>
          <button class="btn btn-danger" data-index="${index}" onclick="deleteRecipe(${index})">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      `;
      recipeList.appendChild(recipeItem);
    });
  };

  const addRecipe = (recipe) => {
    recipes.push(recipe);
    localStorage.setItem("recipes", JSON.stringify(recipes));
    renderRecipes();
    showNotification("Przepis dodany!", "success");
  };

  const updateRecipe = (index, recipe) => {
    recipes[index] = recipe;
    localStorage.setItem("recipes", JSON.stringify(recipes));
    renderRecipes();
    showNotification("Przepis zaktualizowany!", "info");
  };

  const deleteRecipe = (index) => {
    recipes.splice(index, 1);
    localStorage.setItem("recipes", JSON.stringify(recipes));
    renderRecipes();
    showNotification("Przepis usunięty!", "danger");
  };

  const favoriteRecipe = (index) => {
    recipes[index].favorite = !recipes[index].favorite;
    localStorage.setItem("recipes", JSON.stringify(recipes));
    renderRecipes();
    showNotification("Przepis dodany do ulubionych!", "warning");
  };

  const editRecipe = (index) => {
    const recipe = recipes[index];
    document.getElementById("recipe-name").value = recipe.name;
    document.getElementById("recipe-ingredients").value = recipe.ingredients;
    document.getElementById("recipe-instructions").value = recipe.instructions;

    editingIndex = index;
  };

  recipeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("recipe-name").value;
    const ingredients = document.getElementById("recipe-ingredients").value;
    const instructions = document.getElementById("recipe-instructions").value;

    const newRecipe = {
      name,
      ingredients,
      instructions,
      favorite: false,
    };

    if (editingIndex !== null) {
      updateRecipe(editingIndex, newRecipe);
      editingIndex = null;
    } else {
      addRecipe(newRecipe);
    }

    recipeForm.reset();
  });

  const showNotification = (message, type) => {
    const notification = document.createElement("div");
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed bottom-0 start-0 m-3`;
    notification.style.zIndex = 1000;
    notification.innerHTML = `
      <strong>${message}</strong>
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    notificationContainer.appendChild(notification);

    setTimeout(() => {
      notification.classList.remove("show");
      notification.classList.add("hide");
      setTimeout(() => notification.remove(), 500);
    }, 3000);
  };

  renderRecipes();

  // Assign functions to global scope for button onclick attributes
  window.favoriteRecipe = favoriteRecipe;
  window.editRecipe = editRecipe;
  window.deleteRecipe = deleteRecipe;
});
