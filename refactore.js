
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
            label.appendChild(document.createTextNode( ${ingredient}));
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


//      Etapes pour refactoriser la fonction updateIngredientLabels
//
// 1. fonction pour traiter les données
function getUniqueIngredients(filteredRecipes) {
    // Récupérer tous les ingrédients avec des doublons
    const allIngredients = filteredRecipes.flatMap(recipe =>
        recipe.ingredients.map(item => item.ingredient)
    );

    // Retourner la liste unique des ingrédients
    return [...new Set(allIngredients)];
}

// 2. fonction pour afficher les ingrédients dans le DOM 
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

        // Gérer le clic sur la case à cocher
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

            // Mettre à jour les recettes et ingrédients
            updateRecipesAndIngredients();
        });

        // Ajouter le checkbox et le texte à l'étiquette
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

function settingItemList(itemList, filtered, selectedItems, itemType) {
    console.log("************ oh là là settingItemList **************")
    itemList.innerHTML = ''; // Vider la liste actuelle

    filtered.forEach(item => {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = item;

        // Si l'ingrédient est sélectionné (dans la liste selectedItems), cochez la case
        if (selectedItems.includes(item)) {
            console.log("********includes ", item, "checked ?", checkbox.checked);
            checkbox.checked = true;
            label.style.backgroundColor = '#f3bd1f';
            console.log("********includes ", item, "checked ?", checkbox.checked);
        }

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(` ${item}`));
        itemList.appendChild(label);

    /////// Event clic sur le checkbox
        checkbox.addEventListener('click', (e) => {
            e.stopPropagation(); // Empêche la fermeture immédiate de la list dropdown
            const clickedCheckbox = e.target;
            console.log("25/01/2025:  cliked checkbox target",clickedCheckbox);

            console.log("24/01/2025 selectedItems in heck box click Event", selectedItems);
            console.log("22/01 $ or not?  check box Event");
            if (clickedCheckbox.checked) {
                console.log("22/01 $ or not?  checkbox Event",item, "checked ?", clickedCheckbox.checked);
                // Ajouter l'item s'il n'est pas déjà sélectionné
                if (!selectedItems.includes(item)) {
                    selectedItems.push(item);
                    addSelectedItemTag(item,itemType);
                    console.log("check box push", item, "selectedItems length", selectedItems.length);
                }
            } else {
                // Retirer l'item s'il est décoché
                removeSelectedItemFromList(item,itemType,selectedItems);
                console.log("22/01 $ or not?  checkbox Event is ",item, "checked ?", clickedCheckbox.checked);
                console.log("23/01/25 Removed", item, "selectedItems length", selectedItems.length);
                removeSelectedItemTag(item,itemType);
            }
            updateRecipesAndItems(item,itemType);
        });
    });
}

// Final Implementation  the complete code structure:
/*
<div class="dropdown">
    <button class="dropdown-button">Ingredients</button>
    <div class="dropdown-content">
        <label><input type="checkbox" value="Beurre"> Beurre</label>
        <label><input type="checkbox" value="Lait"> Lait</label>
    </div>
</div>
<div class="dropdown">
    <button class="dropdown-button">Appliances</button>
    <div class="dropdown-content">
        <label><input type="checkbox" value="Oven"> Oven</label>
    </div>
</div>
<div class="dropdown">
    <button class="dropdown-button">Ustensils</button>
    <div class="dropdown-content">
        <label><input type="checkbox" value="Knife"> Knife</label>
    </div>
</div>
*/

// JavaScript:
// Toggle dropdown on button click
document.querySelectorAll('.dropdown-button').forEach(button => {
    button.addEventListener('click', (event) => {
        const dropdown = button.closest('.dropdown');
        const dropdownContent = dropdown.querySelector('.dropdown-content');

        // Toggle current dropdown
        const isOpen = dropdownContent.classList.toggle('open');

        // Close all other dropdowns
        document.querySelectorAll('.dropdown-content').forEach(content => {
            if (content !== dropdownContent) {
                content.classList.remove('open');
            }
        });

        event.stopPropagation(); // Prevent global listener from closing this dropdown
    });
});

// Close all dropdowns when clicking outside
document.addEventListener('click', () => {
    document.querySelectorAll('.dropdown-content').forEach(content => {
        content.classList.remove('open');
    });
});

// Prevent dropdown from closing when clicking inside its content
document.querySelectorAll('.dropdown-content').forEach(content => {
    content.addEventListener('click', (event) => {
        event.stopPropagation();
    });
});

// Handle checkbox clicks
document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('click', (event) => {
        console.log(`${checkbox.value} is now ${checkbox.checked ? 'checked' : 'unchecked'}`);
        event.stopPropagation(); // Prevent click from closing dropdown
    });
});

// changer <label> en <li>
function settingItemList(itemList, filtered, selectedItems, itemType) {
    console.log(`[Start] Setting item list for type: ${itemType}`);

    itemList.innerHTML = ''; // Vider la liste actuelle

    filtered.forEach(item => {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = item;

        // Si l'ingrédient est sélectionné (dans la liste selectedItems), cochez la case
        if (selectedItems.includes(item)) {
            checkbox.checked = true;
            label.classList.add('highlighted');  // choisir '#f3bd1f'
        }

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(` ${item}`));
        itemList.appendChild(label);

        checkbox.addEventListener('click', (e) => {
            e.stopPropagation();
            handleCheckboxStateChange(e.target.checked, item, itemType, selectedItems);
            updateRecipesAndItems(item, itemType);
        });
    });
}

function updateItemLabels(filteredRecipes) {    
    console.log("23/01/25:  *** updateItemLabels");

    const constituant = ['ingredient', 'appliance', 'ustensil'];
    let uniqueItems = []; 
    let dropdownContent;
    let paramRecipes = filteredRecipes;

    constituant.forEach(type => {
        if (type === 'ingredient') {
            uniqueItems = getUniqueIngredients(paramRecipes);  // Récupérer les items (ingredients) sans doublon
            dropdownContent = document.getElementById(`${type}-content`); // Sélectionner le contenu associé
            selectedItems = selectedIngredients;
        } else if (type === 'appliance') {
            uniqueItems = getUniqueAppliances(paramRecipes)  // Récupérer les items (appliances) sans doublon
            dropdownContent = document.getElementById(`${type}-content`); // Sélectionner le contenu associé
            selectedItems = selectedAppliances;
        } else if (type === 'ustensil') {
            uniqueItems = getUniqueUstensils(paramRecipes) // Récupérer les items (ustensiles) sans doublon
            dropdownContent = document.getElementById(`${type}-content`); // Sélectionner le contenu associé
            selectedItems = selectedUstensils;
        }

        //console.log("24/01/2025 in updateItemLabels dropdownContent has", dropdownContent.childNodes.length," children");
        dropdownContent.innerHTML = ''; // Vider les anciens labels

        // Créer item la barre de recherche
        const itemSearch = document.createElement('input');
        itemSearch.className = `${type}-search`;
        itemSearch.type = 'text';
        itemSearch.placeholder = `Search ${type}s...`;
        dropdownContent.appendChild(itemSearch);

        // Créer le conteneur pour les items (ingrédients, appliances ...)
        const itemList = document.createElement('div');
        itemList.classList.add(`${type}-list`);
        dropdownContent.appendChild(itemList);

        // Mettre à jour la liste des ingrédients affichés
        console.log(`23/01/25:  settingItemList dans updateItemLabels pout ${type}`);
        settingItemList(itemList, uniqueItems, selectedItems, type);

        // Connecter la barre de recherche pour filtrer les ingrédients
        itemBarSearchEvents(itemSearch, itemList, uniqueItems, selectedItems, type);
    })

}