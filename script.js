// Charger les recettes

// Référence aux éléments HTML
const searchBarInput = document.getElementById('search-bar-input');
const recipesContainer = document.getElementById('recipes-container');
const nbRecettesTrouvees = document.getElementById('nbRecettes');

nbRecettesTrouvees.textContent = `${recipes.length} Recettes`;

// Fonction pour afficher les recettes
function displayRecipes(filteredRecipes) {
    console.log("*** displayRecipes");
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
                    
                    if (!item.unit) { // Vérifie si le champ unité (ex: kg,ml,mn ... ) existe
                        unitSiExist = ""; // le champ unité n'existe pas, mettre une chaîne vide dans unitSiExist
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
    nbRecettesTrouvees.textContent = `${filteredRecipes.length} Recettes`;
}

function isIngredientTagsEmpty() {
    return !selectedIngredientsContainer.hasChildNodes();
}

//////////////////////
// Fonction pour filtrer les recettes
/*function filterRecipes(query) {
    console.log("*** Algorithm filterRecipes");
    let resultat;
    let recipesList = recipes;
    query = query.toLowerCase();
    // Filtrer les recettes en fonction des ingrédients sélectionnés
    console.log("IN filterRecipes tags Not EMPTY ? ", !isIngredientTagsEmpty());
    if (!isIngredientTagsEmpty()) {
        const filteredRecipes = recipes.filter(recette =>
            selectedIngredients.every(selectedIngredient =>
                recette.ingredients.some(item => item.ingredient === selectedIngredient) // item étant l'ensemble des ingrédients d'une recette
            )
        );
        recipesList = filteredRecipes;
    }
    resultat = recipesList.filter(recipe => {
        const nameMatch = recipe.name.toLowerCase().includes(query);
        const descriptionMatch = recipe.description.toLowerCase().includes(query);
        const ingredientsMatch = recipe.ingredients.some(item => 
            item.ingredient.toLowerCase().includes(query)
        );
        return nameMatch || descriptionMatch || ingredientsMatch;
    });
    console.log("    ** Result Nb RECETTES: ", resultat.length);
    return resultat;
}
*/
///////////////////////

const selectedIngredientsContainer = document.getElementById('selected-ingredients-container');
let selectedIngredients = []; // Liste des ingrédients selectionnes


// Mettre des ingredients dans dropdownContent 
function updateIngredientLabels(filteredRecipes) {
    console.log("*** updateIngredientLabels")
    const dropdownContent = document.querySelector('.ingredients-content');

    dropdownContent.innerHTML = ''; // Vider les anciens labels

    // create the search bar for ingredients
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
        console.log("*** displayIngredients");
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
                label.style.backgroundColor = '#f3bd1f';
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
    const ingreTags = selectedIngredientsContainer.querySelectorAll('.selected-ingredient-tag');
    ingreTags.forEach(item => {
        if (item.textContent.trim().startsWith(ingredient)) {
            item.remove();
        }
    });
}


// Mettre à jour les recettes et ingrédients en fonction des critères sélectionnés
function updateRecipesAndIngredients() {
    console.log("*** updateRecipesAndIngredients");
    // Filtrer les recettes en fonction des ingrédients sélectionnés
    const filteredRecipes = recipes.filter(recette =>
        selectedIngredients.every(selectedIngredient =>
            recette.ingredients.some(item => item.ingredient === selectedIngredient) // item étant l'ensemble des ingrédients d'une recette
        )
    );

    // Afficher les recettes filtrées
    displayRecipes(filteredRecipes);

    // Mettre à jour les ingrédients dans la liste déroulante
    updateIngredientLabels(filteredRecipes);

}

// Event 3 carac. sur la barre de recherche
searchBarInput.addEventListener('input', (e) => {
    console.log("*** Event searchBarInput")
    const query = e.target.value.trim();
////////////////////
console.time("Excution Time");
        const filteredRecipes = filterRecipes(query);
console.timeEnd("Excution Time");
///////////////////
    if (query.length >= 3) {
        console.log("query >=3 **** call updateIngredientLabels ");
        updateIngredientLabels(filteredRecipes); // Met à jour les labels
    } else {
        console.log("query else < 3 **** fait rien");
    }
    displayRecipes(filteredRecipes);
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
    console.log("** Event dropdownButton CLICK, before toggleDropdown");
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

