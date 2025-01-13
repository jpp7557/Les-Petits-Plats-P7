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
    console.log("filterRecipes result :", resultat);
    return resultat;
}


const selectedIngredientsContainer = document.getElementById('selected-ingredients-container');
let selectedIngredients = []; // Stocke les ingrédients choisis


// Mettre des ingredients dans dropdownContent 
function updateIngredientLabels(filteredRecipes) {
    console.log("*** updateIngredientLabels")
    const dropdownContent = document.querySelector('.ingredients-content');

    dropdownContent.innerHTML = ''; // Vider les anciens labels

    // create the search bar
    const ingredientSearch = document.createElement('input');
    ingredientSearch.class = 'ingredient-search';
    ingredientSearch.type = 'text';

    // Add the search bar to dropdownContent
    dropdownContent.appendChild(ingredientSearch);


    // Récupérer tous les ingrédients, il peut y avoir des doublons dans cette liste
    const allIngredients = filteredRecipes.flatMap(recipe => 
        recipe.ingredients.map(item => item.ingredient)
    );
    const uniqueIngredients = [...new Set(allIngredients)]; // Supprime les doublons

//  BEGIN  /////////////////////////////////////////////////////////

    // Create a container for ingredients
    const ingredientList = document.createElement('div');
    ingredientList.classList.add('ingredient-list');
    dropdownContent.appendChild(ingredientList);
    
    // Function pour afficher les ingredients correspondants aux critères de tri
    function displayIngredients(filtered) {
        ingredientList.innerHTML = ''; // Clear existing list

        // Generate labels for filtered ingredients
        filtered.forEach(ingredient => {
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = ingredient;

            // Si l'ingrédient est déjà sélectionné, cochez la case
            if (selectedIngredients.includes(ingredient)) {
                checkbox.checked = true;
            }

            // Handle click event for the checkbox
            // Gestion du clic sur un ingrédient ou son checkbox
            checkbox.addEventListener('click', () => {
            if (checkbox.checked) {
                // Ajouter l'ingrédient s'il n'est pas déjà sélectionné
                if (!selectedIngredients.includes(ingredient)) {
                    selectedIngredients.push(ingredient);
                    addSelectedIngredientTag(ingredient); // Ajouter un box avec l'ingredient selectionné
                }
            } else {
                // Retirer l'ingrédient s'il est décoché
                selectedIngredients = selectedIngredients.filter(item => item !== ingredient);
                removeSelectedIngredientTag(ingredient); // Supprimer le tag correspondante
            }
            updateRecipesAndIngredients(); // Mettre à jour les recettes et les ingrédients

                toggleDropdown(); // Close the dropdown
            });

            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(` ${ingredient}`));
            ingredientList.appendChild(label);
        });
    }

    // Display all ingredients initially
    displayIngredients(uniqueIngredients);

    // Add event listener for ingredient search input
    ingredientSearch.addEventListener('keyup', (e) => {
        console.log("ingredient keyup");
        const query = e.target.value.toLowerCase();
        const filtered = uniqueIngredients.filter(ingredient =>
            ingredient.toLowerCase().includes(query)
        );
        displayIngredients(filtered); // Update displayed list
    });
}



// Ajouter une div pour afficher le tag de l'ingrédient sélectionné
function addSelectedIngredientTag(ingredient) {

    console.log("***addSelectedIngredientTag");
    const ingredientTag = document.createElement('div');
    ingredientTag.classList.add('selected-ingredient-tag');
    ingredientTag.textContent = ingredient;

    // Ajouter une croix pour supprimer le tag de l'ingrédient
    const removeButton = document.createElement('button');
    removeButton.textContent = 'X';
    removeButton.addEventListener('click', () => {
        selectedIngredients = selectedIngredients.filter(item => item !== ingredient);
        ingredientTag.remove(); // Supprimer le tag
        updateRecipesAndIngredients(); // Mettre à jour les recettes et ingrédients
    });

    ingredientTag.appendChild(removeButton);
    selectedIngredientsContainer.appendChild(ingredientTag);
}


function removeSelectedIngredientTag(ingredient) {
    const boxes = selectedIngredientsContainer.querySelectorAll('.selected-ingredient-tag');
    boxes.forEach(box => {
        if (box.textContent.trim().startsWith(ingredient)) {
            box.remove();
        }
    });
}


// Mettre à jour les recettes et ingrédients en fonction des critères sélectionnés
function updateRecipesAndIngredients() {
    console.log("*** updateRecipesAndIngredients");
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

// Evenement 3 carac. sur la barre de recherche
searchBarInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    if (query.length >= 3) {
        const filteredRecipes = filterRecipes(query);
        nbRecettesTrouvees.textContent = `${filteredRecipes.length} Recettes`;
    ////////////////////
    console.time("Excution Time");
        displayRecipes(filteredRecipes);
    console.timeEnd("Excution Time");
    ///////////////////
        console.log("query >=3 **** filteredRecipes : ", filteredRecipes);
        updateIngredientLabels(filteredRecipes); // Met à jour les labels
    } else {
        nbRecettesTrouvees.textContent = `${recipes.length} Recettes`;
        displayRecipes(recipes); // Affiche toutes les recettes si moins de 3 caractères
    }
});

const dropdownButton = document.querySelector('.dropdown-button');
const dropdownContent = document.querySelector('.ingredients-content');

// ouvrir/fermer la liste déroulante
function toggleDropdown() {
    const isOpen = dropdownContent.classList.contains('open'); // isOpen toggles false/true
    dropdownContent.classList.toggle('open');  // toggles adding/removing the "open" class
    dropdownContent.setAttribute('aria-hidden', !isOpen);  // aria-hidedn toggles true/false
}

// fermer la liste si on clique à l'extérieur
function closeDropdown(event) {
    console.log("closeDropdown CALLED");
    if (!dropdownContent.contains(event.target) && !dropdownButton.contains(event.target)) {
        dropdownContent.classList.remove('open');
        dropdownContent.setAttribute('aria-hidden', true);
    }
}

// Ajoute l'événement de clic au bouton dropdown
dropdownButton.addEventListener('click', (event) => {
    event.stopPropagation(); // Empêche la fermeture immédiate
    console.log("** CLICK, before toggleDropdown");
    toggleDropdown();
});

// "clic à l'extérieur de la list" declenche la fermeture
document.addEventListener('click', closeDropdown);

/////////////////////////////////////////////////////////////////
//
// Initialisation - Affiche toutes les recettes au chargement
//
/////////////////////////////////////////////////////////////////

console.log("DEBUT de Programme:")
displayRecipes(recipes);
console.log("calling updateIngredientLabels");
updateIngredientLabels(recipes); // Mettre les ingredients dans la list 
console.log("sortie de updateIngredientLabels");
// Effacer le contenu de la barre input
searchBarInput.value = '';

