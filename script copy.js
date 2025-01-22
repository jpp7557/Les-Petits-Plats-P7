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
/*function updateIngredientLabels(filteredRecipes) {
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

    // Create "ingredientList": container for ingredients 
    const ingredientList = document.createElement('div');
    ingredientList.classList.add('ingredient-list');
    dropdownContent.appendChild(ingredientList);
    
    // Function pour afficher les ingredients correspondants aux critères de tri
    function displayIngredients(filtered) {
        console.log("***  displayIngredients");
        ingredientList.innerHTML = ''; // Clear existing list

        console.log("*** displayIngredients, length BEFORE filter:",filtered.length);
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
                    addSelectedIngredientTag(ingredient); // Ajouter un tag (box) avec l'ingredient selectionné
                }
            } else {
                // Retirer l'ingrédient s'il est décoché
                selectedIngredients = selectedIngredients.filter(item => item !== ingredient);
                removeSelectedIngredientTag(ingredient); // Supprimer le tag (box) correspondant
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
    console.log("In updateIngredientLabels: displayIngredients(uniqueIngredients)",uniqueIngredients.length);
    displayIngredients(uniqueIngredients);

    // Add event listener for ingredient search input
    ingredientSearch.addEventListener('keyup', (e) => {
        console.log("ingredient keyup for ingredient search input");
        const query = e.target.value.toLowerCase();
        const filtered = uniqueIngredients.filter(ingredient =>
            ingredient.toLowerCase().includes(query)
        );
        console.log("Event keyup: displayIngredients(filtered)", filtered.length);
        displayIngredients(filtered); // Update displayed list
    });
}
*/
// Refactore 20/01/2025 Mettre des ingredients dans dropdownContent 
function updateIngredientLabels(filteredRecipes) {
    console.log("*** updateIngredientLabels");

    const dropdownContent = document.querySelector('.ingredients-content');
    dropdownContent.innerHTML = ''; // Clear previous labels

    // Create the search bar
    const ingredientSearch = createSearchBar('ingredient-search', dropdownContent);

    // Get unique ingredients from recipes
    const uniqueIngredients = getUniqueIngredients(filteredRecipes);

    // Create the ingredient list container
    const ingredientList = document.createElement('div');
    ingredientList.classList.add('ingredient-list');
    dropdownContent.appendChild(ingredientList);

    // Display all ingredients initially
    displayItems(uniqueIngredients, ingredientList, 'ingredient');

    // Add event listener for search input
    setupSearchBar(ingredientSearch, uniqueIngredients, ingredientList, 'ingredient');
}

function createSearchBar(className, parentElement) {
    const searchBar = document.createElement('input');
    searchBar.className = className;
    searchBar.type = 'text';
    parentElement.appendChild(searchBar);
    return searchBar;
}

function getUniqueIngredients(filteredRecipes) {
    const allIngredients = filteredRecipes.flatMap(recipe =>
        recipe.ingredients.map(item => item.ingredient)
    );
    return [...new Set(allIngredients)]; // Remove duplicates
}

function displayItems(items, container, itemType) {
    container.innerHTML = ''; // Clear existing list

    items.forEach(item => {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = item;

        // Mark as selected if applicable
        if (selectedIngredients.includes(item)) {
            checkbox.checked = true;
            label.style.backgroundColor = '#f3bd1f';
        }

        // Handle checkbox click events
        checkbox.addEventListener('click', () => handleCheckboxClick(item, itemType, checkbox));

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(` ${item}`));
        container.appendChild(label);
    });
}

function handleCheckboxClick(item, itemType, checkbox) {
    if (checkbox.checked) {
        // Add item if not already selected
        if (!selectedIngredients.includes(item)) {
            selectedIngredients.push(item);
            addSelectedIngredientTag(item);
        }
    } else {
        // Remove item if unchecked
        selectedIngredients = selectedIngredients.filter(selected => selected !== item);
        removeSelectedIngredientTag(item);
    }
    updateRecipesAndIngredients(); // Update recipes and ingredients
    toggleDropdown(); // Close dropdown
}

function setupSearchBar(searchInput, items, container, itemType) {
    searchInput.addEventListener('keyup', (e) => {
        console.log(`Search input for ${itemType}`);
        const query = e.target.value.toLowerCase();
        const filteredItems = items.filter(item => item.toLowerCase().includes(query));
        displayItems(filteredItems, container, itemType);
    });
}

// Fin Refactore 20/01/2025 Mettre des ingredients dans dropdownContent 


// Ajouter une div pour afficher le tag de l'ingrédient sélectionné
function addSelectedIngredientTag(ingredient) {

    console.log("***addSelectedIngredientTag");
    const dropdownContent = document.querySelector('.ingredients-content');
    const ingredientTag = document.createElement('div');
    ingredientTag.classList.add('selected-ingredient-tag');
    ingredientTag.textContent = ingredient;

    // Ajouter une croix pour supprimer le tag de l'ingrédient
    const removeButton = document.createElement('button');
    removeButton.textContent = 'X';
    removeButton.addEventListener('click', () => {
///////////
//// selectedIngredients sont des ingredients choisis
        selectedIngredients = selectedIngredients.filter(item => item !== ingredient);
        ingredientTag.remove(); // Supprimer le tag
        console.log("In addSelectedIngredientTag: after Tag.remove call selectedRecette(selectedIngredients)");
        filteredRecipes = selectedRecette(selectedIngredients);
        console.log("In addSelectedIngredientTag: updateIngredientLabels");
        updateIngredientLabels(filteredRecipes);
///////////    
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
            console.log(item,"removed");
        }
    });
}

// MAJ de Array des recettes en fonction des selectedIngredients (Array des ingrédients selectionnés)
function selectedRecette(selectedIngredients) {
    let result = recipes;
    //let recettes = recipes;
    let selectedRecipes = result;

    if (searchBarInput.value.length >= 3) {
        query = searchBarInput.value;
        console.log("In selectedRecette: filterRecipes 1")
        selectedRecipes = filterRecipes(query,recipes);
        console.log("In selectedRecette, result length 1er pass:",selectedRecipes.length);
    }
    console.log(" In selectedRecette, search input :", searchBarInput.value.length, searchBarInput.value);
    console.log(" In selectedRecette, selectedIngredients:", selectedIngredients);
    if (selectedIngredients !== null) {
        result = selectedRecipes.filter(recette =>
            selectedIngredients.every(selectedIngredient =>
                recette.ingredients.some(item => item.ingredient === selectedIngredient) // item étant l'ensemble des ingrédients d'une recette
            )
        );
        console.log("In selectedRecette, result length last pass:",result.length);
    }
    return result;
}

// Fonction de MAJ des recettes et ingrédients en fonction des critères sélectionnés
function updateRecipesAndIngredients() {
    console.log("*** updateRecipesAndIngredients");

    // Filtrer les recettes en fonction des ingrédients sélectionnés
    console.log("In updateRecipesAndIngredients: call selectedRecette(selectedIngredients)");
    filteredRecipes = selectedRecette(selectedIngredients);

    console.log("in updateRecipesAndIngredients(): filteredRecipes length :", filteredRecipes.length);

    // Afficher les recettes filtrées
    console.log("In updateRecipesAndIngredients: displayRecipes");
    displayRecipes(filteredRecipes);

    // Mettre à jour les ingrédients dans la liste déroulante
    console.log("In updateRecipesAndIngredients: updateIngredientLabels");
    updateIngredientLabels(filteredRecipes);

}

// Event 3 carac. sur la barre de recherche
searchBarInput.addEventListener('input', (e) => {
    console.log("*** Event searchBarInput")
    const query = e.target.value.trim();
    let argRecettes = [];
    let filteredRecipes = [];

    filteredRecipes = recipes;

    if (query.length >= 3 && isIngredientTagsEmpty()) {
        console.log("In Event searchBar : filterRecipes 1")
        ////////////////////
        console.time("Excution Time");
        filteredRecipes = filterRecipes(query,recipes);
        console.timeEnd("Excution Time");
        ///////////////////
        console.log("query >=3 **** call updateIngredientLabels");
        updateIngredientLabels(filteredRecipes); // Met à jour les labels
    } else if (!isIngredientTagsEmpty()) {
            console.log("query else >= 3, Tag Not Empty, call selectedRecette(selectedIngredients) ");
            filteredRecipes = selectedRecette(selectedIngredients)
    }
    console.log("Event searchBar: call displayRecipes with filteredRecipes.length:",filteredRecipes.length);
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

console.log("DEBUT de Programme: calling displayRecipes")
displayRecipes(recipes);
console.log("calling updateIngredientLabels");
updateIngredientLabels(recipes); // Mettre les ingredients dans la list 
console.log("sortie de updateIngredientLabels");
// Effacer le contenu de la barre input
searchBarInput.value = '';

