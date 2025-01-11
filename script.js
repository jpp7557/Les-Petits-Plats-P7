// Charger les recettes

// Référence aux éléments HTML
const searchBarInput = document.getElementById('search-bar-input');
const recipesContainer = document.getElementById('recipes-container');
const nbRecettesTrouvees = document.getElementById('nbRecettes');

nbRecettesTrouvees.textContent = `${recipes.length} Recettes`;

// Fonction pour afficher les recettes
function displayRecipes(filteredRecipes) {
    recipesContainer.innerHTML = ''; // Vider le conteneur
    if (filteredRecipes.length === 0) {
        nbRecettesTrouvees.textContent = "0 Recettes";
        recipesContainer.innerHTML = '<p>Aucune recette trouvée.</p>';
        return;
    }
    filteredRecipes.forEach(recipe => {        
        
        imgsource = recipe.id < 10 ? `Recette0${recipe.id}.jpg` : `Recette${recipe.id}.jpg`

        let recipeHTML = `
            <div class="recette-card">
                <img class="img-recette" src="../Newphotos/recipes/${imgsource}" alt="${recipe.name}">
                <h2>${recipe.name}</h2>
                <h3 class="recette">RECETTE</h3>
                <p>${recipe.description}</p>
                <h3>INGREDIENTS</h3>
                <ul class="ingredients-list">
            `;
        // Ajout dynamique des ingrédients à la carte
                recipe.ingredients.forEach(item => {
                    let unitSiExist;
                    let quantitySiExist;
                    
                    if (!item.unit) { // Vérifie si item.unit existe ou undefined
                        unitSiExist = ""; // item.unit n'existe pas, chaîne vide
                    } else {
                        unitSiExist =  item.unit;
                    }

                    quantitySiExist = (!item.quantity) ? "" : item.quantity;
                    recipeHTML += `<li><span class="ingredient-name">${item.ingredient}</span><br>${quantitySiExist} ${unitSiExist}</li>`;
                });
        // Ajout dynamique des ingrédients à la dropdown list ingredientsUL

        // Fermeture de la liste et du conteneur
        recipeHTML += `
                    </ul>
            </div>
            `;
        // Ajouter la carte complète dans le conteneur
        recipesContainer.innerHTML += recipeHTML;    
    });

}

// Fonction pour filtrer les recettes
function filterRecipes(query) {
    let resultat;
    query = query.toLowerCase();

    resultat = recipes.filter(recipe => {
        const nameMatch = recipe.name.toLowerCase().includes(query);
        const descriptionMatch = recipe.description.toLowerCase().includes(query);
        const ingredientsMatch = recipe.ingredients.some(item => 
            item.ingredient.toLowerCase().includes(query)
        );
        return nameMatch || descriptionMatch || ingredientsMatch;
    });
    console.log("resultat de filterRecipes", resultat);
    return resultat;
}

///////////////////////////////////////////////////////////////////////

//// 2.0  open
const selectedIngredientsContainer = document.getElementById('selected-ingredients-container');
let selectedIngredients = []; // Stocke les ingrédients choisis
//// 2.0  close

// Mettre des ingredients dans dropdownContent 
function updateIngredientLabels(filteredRecipes) {
    const dropdownContent = document.querySelector('.ingredients-content');
    dropdownContent.innerHTML = ''; // Vider les anciens labels

    // Récupérer tous les ingrédients, il peut y avoir des doublons dans cette liste
    const allIngredients = filteredRecipes.flatMap(recipe => 
        recipe.ingredients.map(item => item.ingredient)
    );
    const uniqueIngredients = [...new Set(allIngredients)]; // Supprime les doublons

    // Générer les labels dynamiquement pour dropdownContent
    uniqueIngredients.forEach(ingredient => {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = ingredient;

//// 2.0  open

////// 3.0 Open
        // Si l'ingrédient est déjà sélectionné, cochez la case
        if (selectedIngredients.includes(ingredient)) {
            checkbox.checked = true;
        }
////// 3.0 close

      // Gestion du clic sur un ingrédient
      checkbox.addEventListener('click', () => {
////// 3.0 Open     
      if (checkbox.checked) {
        // Ajouter l'ingrédient s'il n'est pas déjà sélectionné
        if (!selectedIngredients.includes(ingredient)) {
            selectedIngredients.push(ingredient);
            addSelectedIngredientBox(ingredient); // Ajouter la boîte correspondante
        }
    } else {
        // Retirer l'ingrédient s'il est décoché
        selectedIngredients = selectedIngredients.filter(item => item !== ingredient);
        removeSelectedIngredientBox(ingredient); // Supprimer la boîte correspondante
    }
    updateRecipesAndIngredients(); // Mettre à jour les recettes et les ingrédients
});
////// 3.0 close

/*////// 3.0 Open 
      checkbox.addEventListener('click', () => {
        if (!selectedIngredients.includes(ingredient)) {
            selectedIngredients.push(ingredient); // Ajouter l'ingrédient au tableau
            addSelectedIngredientBox(ingredient); // Ajouter la boîte correspondante
            updateRecipesAndIngredients(); // Mettre à jour les recettes et les ingrédients
        }
        toggleDropdown(); // Fermer la liste déroulante
    });
//// 2.0 close
*/

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(` ${ingredient}`));
        dropdownContent.appendChild(label);
    });
}

////// 3.0 open

function removeSelectedIngredientBox(ingredient) {
    const boxes = selectedIngredientsContainer.querySelectorAll('.selected-ingredient-box');
    boxes.forEach(box => {
        if (box.textContent.trim().startsWith(ingredient)) {
            box.remove();
        }
    });
}
////// 3.0 close

//// 2.0 open

// Ajouter une boîte pour afficher un ingrédient sélectionné
function addSelectedIngredientBox(ingredient) {
    const ingredientBox = document.createElement('div');
    ingredientBox.classList.add('selected-ingredient-box');
    ingredientBox.textContent = ingredient;

    // Ajouter un bouton pour supprimer l'ingrédient
    const removeButton = document.createElement('button');
    removeButton.textContent = 'X';
    removeButton.addEventListener('click', () => {
        selectedIngredients = selectedIngredients.filter(item => item !== ingredient);
        ingredientBox.remove(); // Supprimer la boîte
        updateRecipesAndIngredients(); // Mettre à jour les recettes et ingrédients
    });

    ingredientBox.appendChild(removeButton);
    selectedIngredientsContainer.appendChild(ingredientBox);
}

// Mettre à jour les recettes et ingrédients en fonction des critères sélectionnés
function updateRecipesAndIngredients() {
    // Filtrer les recettes en fonction des ingrédients sélectionnés
    const filteredRecipes = recipes.filter(recipe =>
        selectedIngredients.every(selectedIngredient =>
            recipe.ingredients.some(item => item.ingredient === selectedIngredient)
        )
    );
        // Afficher les recettes filtrées
        nbRecettesTrouvees.textContent = `${filteredRecipes.length} Recettes`;
        displayRecipes(filteredRecipes);

        // Mettre à jour les ingrédients dans la liste déroulante
        updateIngredientLabels(filteredRecipes);

    }

//// 2.0 close


////////////////////////////////////////////////////////////////////////

// sur la barre de recherche
searchBarInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    if (query.length >= 3) {
        const filteredRecipes = filterRecipes(query);
        nbRecettesTrouvees.textContent = `${filteredRecipes.length} Recettes`;
        displayRecipes(filteredRecipes);
        console.log("**** filteredRecipes : ", filteredRecipes);
        ////////////////////
        updateIngredientLabels(filteredRecipes); // Met à jour les labels
        ///////////////////
    } else {
        nbRecettesTrouvees.textContent = `${recipes.length} Recettes`;
        displayRecipes(recipes); // Affiche toutes les recettes si moins de 3 caractères
    }
});

const dropdownButton = document.querySelector('.dropdown-button');
const dropdownContent = document.querySelector('.ingredients-content');

// ouvrir/fermer la liste déroulante
function toggleDropdown() {
    dropdownContent.classList.toggle('open');
    const isOpen = dropdownContent.classList.contains('open');
    dropdownContent.setAttribute('aria-hidden', !isOpen);
}


// fermer la liste si on clique à l'extérieur
function closeDropdown(event) {
    if (!dropdownContent.contains(event.target) && !dropdownButton.contains(event.target)) {
        dropdownContent.classList.remove('open');
        dropdownContent.setAttribute('aria-hidden', true);
    }
}

// Ajoute l'événement de clic au bouton
dropdownButton.addEventListener('click', (event) => {
    event.stopPropagation(); // Empêche la fermeture immédiate
    console.log("** CLICK, **CLICK");
    toggleDropdown();
});

// "clic à l'extérieur de la list" declenche la fermeture
document.addEventListener('click', closeDropdown);

// Initialisation - Affiche toutes les recettes au chargement
displayRecipes(recipes);
updateIngredientLabels(recipes); // Mettre les ingredients dans la list 

// Effacer le contenu de la barre input
searchBarInput.value = '';

