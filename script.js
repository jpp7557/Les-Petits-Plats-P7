// Charger les recettes

// Référence aux éléments HTML
const searchBarInput = document.getElementById('search-bar-input');
const recipesContainer = document.getElementById('recipes-container');
const nbRecettesTrouvees = document.getElementById('nbRecettes');
const selectedIngredientsContainer = document.getElementById('selected-ingredients-container');
const selectedUstensilesContainer = document.getElementById('selected-ustensiles-container');
const selectedAppareilsContainer = document.getElementById('selected-appareils-container');

nbRecettesTrouvees.textContent = `${recipes.length} Recettes`;
let selectedIngredients = []; // Liste des ingrédients selectionnes

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


/*
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

/* *********** */
/*  Refactore  */
/* *************/

// 2. fonction pour afficher le DOM des ingrédients dans le dropdown  
function renderIngredientList(ingredientList, ingredients, selectedIngredients) {
    ingredientList.innerHTML = ''; // Vider la liste actuelle

    ingredients.forEach(ingredient => {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = ingredient;

        // Si l'ingrédient est sélectionné, cochez la case
        if (selectedIngredients.includes(ingredient)) {
            checkbox.checked = true;
            label.style.backgroundColor = '#f3bd1f';
        }

        // Event clic sur le checkbox
        checkbox.addEventListener('click', () => {
            if (checkbox.checked) {
                // Ajouter l'ingrédient s'il n'est pas déjà sélectionné
                if (!selectedIngredients.includes(ingredient)) {
                    selectedIngredients.push(ingredient);
                    addSelectedIngredientTag(ingredient);
                }
            } else {
                // Retirer l'ingrédient s'il est décoché
                selectedIngredients = selectedIngredients.filter(item => item !== ingredient);
                removeSelectedIngredientTag(ingredient);
            }

            // MAJ des recettes et ingrédients
            updateRecipesAndIngredients();
        });

        // Ajouter le checkbox et l'ingrédient dans "ingredientList" 
        // ** ingredientList sera intégré comme suit :
        //        dropdownContent.appendChild(ingredientList);

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(` ${ingredient}`));
        ingredientList.appendChild(label);
    });
}

// 3. Event de la barre de recherche dans le dropdown list des ingrédients
function setupIngredientSearch(ingredientSearch, ingredientList, uniqueIngredients, selectedIngredients) {
    ingredientSearch.addEventListener('keyup', (e) => {
        const query = e.target.value.toLowerCase();
        const filteredIngredients = uniqueIngredients.filter(ingredient =>
            ingredient.toLowerCase().includes(query)
        );

        // Mettre à jour la liste des ingrédients affichés
        renderIngredientList(ingredientList, filteredIngredients, selectedIngredients);
    });
}

// updateIngredientLabels refactorisee
function updateIngredientLabels(filteredRecipes) {
    console.log("*** updateIngredientLabels");
    const dropdownContent = document.querySelector('.ingredients-content');
    dropdownContent.innerHTML = ''; // Vider les anciens labels

    // Créer la barre de recherche
    const ingredientSearch = document.createElement('input');
    ingredientSearch.className = 'ingredient-search';
    ingredientSearch.type = 'text';
    ingredientSearch.placeholder = 'Search ingredients...';
    dropdownContent.appendChild(ingredientSearch);

    // Créer le conteneur pour les ingrédients
    const ingredientList = document.createElement('div');
    ingredientList.classList.add('ingredient-list');
    dropdownContent.appendChild(ingredientList);

    // Récupérer les ingrédients uniques
    const uniqueIngredients = getUniqueIngredients(filteredRecipes);

    // Afficher tous les ingrédients au départ
    renderIngredientList(ingredientList, uniqueIngredients, selectedIngredients);

    // Connecter la barre de recherche pour filtrer les ingrédients
    setupIngredientSearch(ingredientSearch, ingredientList, uniqueIngredients, selectedIngredients);
}

/* ***************** */
/* Fin de refactore  */
/* ***************** */



function getUniqueAppliance(filteredRecipes) {
    // Récupérer tous les ingrédients avec des doublons
    const allAppliances = filteredRecipes.flat(recipe => recipe.appliance);

    // Retourner la liste des ingrédients sans doublon
    return [...new Set(allAppliances)];
}

// 2. fonction pour afficher le DOM des ingrédients dans le dropdown 
//function renderIngredientList(ingredientList, ingredients, selectedIngredients) {

function renderItemList(itemList, items, selectedAppliances) {
    itemList.innerHTML = ''; // Vider la liste actuelle

    items.forEach(item => {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = item;

        // Si l'ingrédient est sélectionné, cochez la case
        if (selectedAppliances.includes(item)) {
            checkbox.checked = true;
            label.style.backgroundColor = '#f3bd1f';
        }

        // Event clic sur le checkbox
        checkbox.addEventListener('click', () => {
            if (checkbox.checked) {
                // Ajouter l'ingrédient s'il n'est pas déjà sélectionné
                if (!selectedAppliances.includes(item)) {
                    selectedAppliances.push(item);
                    addSelectedApplianceTag(item);
                }
            } else {
                // Retirer l'ingrédient s'il est décoché
                selectedAppliances = selectedAppliances.filter(param => param !== item);
                removeSelectedApplianceTag(item);
            }

            // MAJ des recettes et ingrédients
            updateRecipesAndAppliances();
        });

        // Ajouter le checkbox et l'ingrédient dans "ingredientList" 
        // ** ingredientList sera intégré comme suit :
        //        dropdownContent.appendChild(ingredientList);

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(` ${item}`));
        itemList.appendChild(label);
    });
}

// 3. Event de la barre de recherche dans le dropdown list des ingrédients
function setupItemSearch(itemSearch, itemList, uniqueItems, selectedItems) {
    itemSearch.addEventListener('keyup', (e) => {
        const query = e.target.value.toLowerCase();
        const filteredItems = uniqueItems.filter(param =>
            param.toLowerCase().includes(query)
        );

        // Mettre à jour la liste des ingrédients affichés
        renderItemList(itemList, filteredItems, selectedItems);
    });
}
// updateItemLabels refactorisee
function updateLabels(itemType,filteredRecipes) {
    console.log("*** updateIngredientLabels");
    let uniqueItems = [];
    let selectedItems = [];
    const dropdownContent = document.querySelector(`.${item}-content`);
    dropdownContent.innerHTML = ''; // Vider les anciens labels

    // Créer la barre de recherche
    const itemSearch = document.createElement('input');
    itemSearch.className = `${item}-search`;
    itemSearch.type = 'text';
    itemSearch.placeholder = `Search ${item}s ...`;
    dropdownContent.appendChild(itemSearch);

    // Créer le conteneur pour les ingrédients
    const itemList = document.createElement('div');
    itemList.classList.add(`${item}-list`);
    dropdownContent.appendChild(itemList);

    // Récupérer un array sans doublon
    if (itemType === 'ingredient') {
        uniqueItems = getUniqueIngredients(filteredRecipes); // passer en param ? 
    } else if (itemType === 'appareil') {
        uniqueItems = getUniqueAppliances(filteredRecipes);
    } else if (itemType === 'ustensile') {
        uniqueItems = getUniqueUstensils(filteredRecipes);
    }
    // Afficher tous les ingrédients au départ
    renderItemList(itemList, uniqueItems, selectedAppliances);

    // Connecter la barre de recherche pour filter les items
    setupItemSearch(itemSearch, itemList, uniqueItems, selectedItems);
}

/* *************************** */
/* Fin de refactore Appliance */
/* ************************** */

/////////////////////////////
/*     refactore Items     */
/////////////////////////////


// Ajouter une div pour afficher le tag de l'ingrédient sélectionné
function addSelectedItemTag(item,selectedItems) {

    console.log("***addSelectedItemTag");
    const itemTag = document.createElement('div');
    itemTag.classList.add(`selected-${item}-tag`);
    itemTag.textContent = `${item}`;

    // Ajouter une croix pour supprimer le tag de l'ingrédient
    const removeButton = document.createElement('button');
    removeButton.textContent = 'X';
    removeButton.addEventListener('click', () => {
///////////
//// selectedIngredients sont des ingredients choisis
        selectedItems = selectedItems.filter(item => item !== item);
        itemTag.remove(); // Supprimer le tag
        console.log("In addSelectedItemTag: Tag.remove call then ..");
        filteredRecipes = selectedRecette(selectedIngredients);
        console.log("In addSelectedItemTag: updateIngredientLabels");
        updateIngredientLabels(filteredRecipes);
///////////    
        updateRecipesAndIngredients(); // Mettre à jour les recettes et ingrédients
    });

    itemTag.appendChild(removeButton);
    selectedIngredientsContainer.appendChild(itemTag);
}

/////  modifs suggérées BEGIN

function addSelectedItemTag(item, itemType) {
    console.log(`*** addSelectedItemTag for ${itemType}`);

    // Créer le tag pour l'élément sélectionné
    const itemTag = document.createElement('div');
    itemTag.classList.add(`selected-${itemType}-tag`);
    itemTag.textContent = item;

    // Ajouter un bouton pour supprimer le tag
    const removeButton = document.createElement('button');
    removeButton.textContent = 'X';
    removeButton.addEventListener('click', () => {
        console.log(`Removing ${itemType}: ${item}`);

        // Supprimer l'élément de la liste des sélectionnés
        if (itemType === 'ingredient') {
            selectedIngredients = selectedIngredients.filter(selected => selected !== item);
        } else if (itemType === 'ustensile') {
            selectedUstensiles = selectedUstensiles.filter(selected => selected !== item);
        } else if (itemType === 'appareil') {
            selectedAppareils = selectedAppareils.filter(selected => selected !== item);
        }

        // Supprimer le tag de l'interface
        itemTag.remove();

        // Mettre à jour les recettes et ingrédients/ustensiles/appareils
        console.log(`Updating recipes after removing ${itemType}`);
        filteredRecipes = selectedRecette(selectedIngredients, selectedUstensiles, selectedAppareils);
        updateIngredientLabels(filteredRecipes); // Mise à jour de la liste des ingrédients
        updateRecipesAndIngredients(); // Mise à jour globale
    });

    // Ajouter le bouton de suppression au tag
    itemTag.appendChild(removeButton);

    // Ajouter le tag dans le conteneur correspondant
    if (itemType === 'ingredient') {
        selectedIngredientsContainer.appendChild(itemTag);
    } else if (itemType === 'ustensile') {
        selectedUstensilesContainer.appendChild(itemTag);
    } else if (itemType === 'appareil') {
        selectedAppareilsContainer.appendChild(itemTag);
    }
}

/////  modifs suggérées AJOUT
function removeSelectedItemTag(item,itemType) {

    // chercher le tag dans le conteneur correspondant
    if (itemType === 'ingredient') {
        selectedItemsContainer = selectedIngredientsContainer;
    } else if (itemType === 'ustensile') {
        selectedItemsContainer = selectedUstensilesContainer;
    } else if (itemType === 'appareil') {
        selectedItemsContainer = selectedAppareilsContainer;
    }
    const ingreTags = selectedItemsContainer.querySelectorAll(`.selected-${item}-tag`);
    ingreTags.forEach(param => {
        if (param.textContent.trim().startsWith(item)) {
            param.remove();
            console.log(param,"removed");
        }
    });
}

// MAJ de Array des recettes en fonction des selectedIngredients (Array des ingrédients selectionnés)
//function selectedRecette(selectedIngredients) {
function selectedRecette(selectedIngredients, selectedUstensiles, selectedAppareils) {

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
                recette.ingredients.some(item => item.ingredient === selectedIngredient) // item étant l'Array des ingrédients d'une recette
            )
        );
        console.log("In selectedRecette, selectedIngredients result length last pass:",result.length);
    } else if ( selectedUstensiles !== null) {
        result = selectedRecipes.filter(recette =>
            selectedUstensiles.every(selectedUstensile =>
                recette.ingredients.some(item => item.ingredient === selectedUstensile) // item étant l'Array des ingrédients d'une recette
            )
        );
        console.log("In selectedRecette, selectedUstensiles result length last pass:",result.length);
    } else if ( selectedAppareils !== null) {
        result = selectedRecipes.filter(recette =>
            selectedAppareils.every(selectedAppareil =>
                recette.ingredients.some(item => item.ingredient === selectedAppareil) // item étant l'Array des ingrédients d'une recette
            )
        );
        console.log("In selectedRecette, selectedAppareils result length last pass:",result.length);
    }
    return result;
}


/////  modifs suggérées END


// 1. fonction pour traiter les données
function getUniqueIngredients(filteredRecipes) {
    // Récupérer tous les ingrédients avec de possibles doublons 
    const allItems = filteredRecipes.flatMap(recipe =>
        recipe.ingredients.map(item => item.ingredient));
    // Retourner la liste des ingrédients sans doublon
    return [...new Set(allItems)];
}

// 1 bis. fonction pour traiter les données
function getUniqueAppliances(filteredRecipes) {
    // Récupérer tous les items avec de possibles doublons
    const allItems = filteredRecipes.map(recipe => recipe.appliance); 
    // Retourner la liste des items sans doublon
    return [...new Set(allItems)];
}

// 1 ter. fonction pour traiter les données
function getUniqueUstensils(filteredRecipes) {
    // Récupérer tous les items avec de possibles doublons
    allIngredients = filteredRecipes.flatMap(recipe => recipe.ustensils);
    // Retourner la liste des items sans doublon
    return [...new Set(allItems)];
}

/*
function getUniqueItems(filteredRecipes) {
    // Récupérer tous les items avec des doublons
    const allItems = filteredRecipes.flatMap(recipe =>
        recipe.ingredients.map(item => item.ingredient)
    );

    // Retourner la liste des ingrédients sans doublon
    return [...new Set(allItems)];
}
*/

// 2. fonction pour afficher le DOM des ingrédients dans le dropdown 
//function renderIngredientList(ingredientList, ingredients, selectedIngredients) {

function renderItemList(itemList, items, selectedItems) {
    itemList.innerHTML = ''; // Vider la liste actuelle

    items.forEach(item => {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = item;

        // Si l'ingrédient est sélectionné, cochez la case
        if (selectedItems.includes(item)) {
            checkbox.checked = true;
            label.style.backgroundColor = '#f3bd1f';
        }

        // Event clic sur le checkbox
        checkbox.addEventListener('click', () => {
            if (checkbox.checked) {
                // Ajouter l'ingrédient s'il n'est pas déjà sélectionné
                if (!selectedItems.includes(item)) {
                    selectedItems.push(item);
                    addSelectedItemTag(item,selectedItems);
                }
            } else {
                // Retirer l'ingrédient s'il est décoché
                selectedItems = selectedItems.filter(param => param !== item);
                removeSelectedItemTag(item);
            }

            // MAJ des recettes et ingrédients
            updateRecipesAndIngredients();
        });

        // Ajouter le checkbox et l'ingrédient dans "ingredientList" 
        // ** ingredientList sera intégré comme suit :
        //        dropdownContent.appendChild(ingredientList);

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(` ${item}`));
        itemList.appendChild(label);
    });
}

// 3. Event de la barre de recherche dans le dropdown list des ingrédients
function setupItemSearch(itemSearch, itemList, uniqueItems, selectedItems) {
    `${itemSearch}`.addEventListener('keyup', (e) => {
        const query = e.target.value.toLowerCase();
        const filteredItems = `${uniqueItems}`.filter(param =>
            param.toLowerCase().includes(query)
        );

        // Mettre à jour la liste des ingrédients affichés
        renderIngredientList(itemList, filteredItems, selectedItems);
    });
}



// updateIngredientLabels refactorisee
function updateIngredientLabels(filteredRecipes) {
    console.log("*** updateIngredientLabels");
    const dropdownContent = document.querySelector('.ingredients-content');
    dropdownContent.innerHTML = ''; // Vider les anciens labels

    // Créer la barre de recherche
    const ingredientSearch = document.createElement('input');
    ingredientSearch.className = 'ingredient-search';
    ingredientSearch.type = 'text';
    ingredientSearch.placeholder = 'Search ingredients...';
    dropdownContent.appendChild(ingredientSearch);

    // Créer le conteneur pour les ingrédients
    const ingredientList = document.createElement('div');
    ingredientList.classList.add('ingredient-list');
    dropdownContent.appendChild(ingredientList);

    // Récupérer les ingrédients uniques
    const uniqueIngredients = getUniqueIngredients(filteredRecipes);

    // Afficher tous les ingrédients au départ
    renderIngredientList(ingredientList, uniqueIngredients, selectedIngredients);

    // Connecter la barre de recherche pour filtrer les ingrédients
    setupIngredientSearch(ingredientSearch, ingredientList, uniqueIngredients, selectedIngredients);
}


//////////////////////////////
/*  Fin refactore Items     */
//////////////////////////////

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
///////////
//// selectedIngredients sont des ingredients choisis
        selectedIngredients = selectedIngredients.filter(item => item !== ingredient);
        ingredientTag.remove(); // Supprimer le tag
        console.log("In addSelectedIngredientTag: Tag.remove call then ..");
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
                recette.ingredients.some(item => item.ingredient === selectedIngredient) // item étant l'Array des ingrédients d'une recette
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
    dropdownArrow.classList.toggle('open');
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

const dropdownArrow = document.querySelector('.ingredients-dropdown-arrow');
dropdownArrow.addEventListener('click', (event) => {
    event.stopPropagation(); // Empêche la fermeture immédiate
    console.log("** Event dropownArrow CLICK");
    toggleDropdown();
});

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

// Initialisation pour chaque liste déroulante



