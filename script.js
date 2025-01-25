// Charger les recettes

// Référence aux éléments HTML
const searchBarInput = document.getElementById('search-bar-input');
const recipesContainer = document.getElementById('recipes-container');
const nbRecettesTrouvees = document.getElementById('nbRecettes');
//const selectedIngredientsContainer = document.getElementById('selected-ingredients-container');
//const selectedUstensilsContainer = document.getElementById('selected-ustensils-container');
//const selectedAppliancesContainer = document.getElementById('selected-appliances-container');
const selectedItemsContainer = document.getElementById('selected-items-container');


nbRecettesTrouvees.textContent = `${recipes.length} Recettes`;
let selectedIngredients = []; // Liste des ingrédients selectionnes
let selectedUstensils = []; // Liste des ingrédients selectionnes
let selectedAppliances = []; // Liste des ingrédients selectionnes

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
    return !selectedItemsContainer.hasChildNodes();
}

/* *********** */
/*  Refactore  */
/* *************/

// 2. fonction pour afficher le DOM des ingrédients dans le dropdown  
/*function renderIngredientList(ingredientList, ingredients, selectedIngredients) {*/

// 3. Event de la barre de recherche dans le dropdown list des ingrédients
/*function setupIngredientSearch(ingredientSearch, ingredientList, uniqueIngredients, selectedIngredients) */

// updateIngredientLabels refactorisee
/*function updateIngredientLabels(filteredRecipes) */


// updateItemLabels refactorisee
function createItemLabelsDOM(itemType) {
    console.log("*** createItemLabels",itemType);
    const dropdownContent = document.querySelector(`.${itemType}s-content`);
    dropdownContent.innerHTML = ''; // Vider les anciens labels

    // Créer la barre de recherche
    const itemSearch = document.createElement('input');
    itemSearch.className = `${itemType}-search`;
    itemSearch.type = 'text';
    itemSearch.placeholder = `Search ${itemType}s ...`;
    dropdownContent.appendChild(itemSearch);

    // Créer le conteneur pour les ingrédients
    const itemList = document.createElement('div');
    itemList.classList.add(`${itemType}-list`);
    dropdownContent.appendChild(itemList);
}

function setItemLabelsContent(itemList, itemSearch, itemType, filteredRecipes) {
    let uniqueItems, selectedItems;


    if (itemType === 'ingredient') {
        uniqueItems = getUniqueIngredients(filteredRecipes);
        selectedItems = selectedIngredients;
    } else if (arg === 'appliance') {
        uniqueItems = getUniqueAppliances(filteredRecipes);
        selectedItems = selectedAppliances;
    } else if (arg === 'ustensil') {
        uniqueItems = getUniqueUstensils(filteredRecipes);
        selectedItems = selectedUstensils;
    }

    itemSearch.addEventListener('keyup', (e) => {
        e.stopPropagation(); // Empêche la fermeture immédiate

        const query = e.target.value.toLowerCase();
        const filteredItems = uniqueItems.filter(item =>
            item.toLowerCase().includes(query)
        );
        console.log("23/01/25:  settingItemList dans setItemLabelsContent ")
        // Mettre à jour la liste des ingrédients affichés    
        // Render the item list
        settingItemList(itemList, filteredItems, selectedItems, itemType);
    })
}

/////  modifs suggérées BEGIN

function addSelectedItemTag(item, itemType) {
    console.log(`*** addSelectedItemTag for ${itemType}`);

    // Créer le tag pour l'élément sélectionné
    const itemTag = document.createElement('div');
    //itemTag.classList.add(`selected-${itemType}-tag`);
    itemTag.classList.add(`selected-items-tag`);
    itemTag.textContent = item;

    // creation d'une croix pour supprimer le tag
    const removeButton = document.createElement('button');
    removeButton.textContent = 'X';

    removeButton.addEventListener('click', () => {
        console.log(`"22/01: CLICK on X Event, Removing ${itemType}: ${item}`);

        // liste des items sélectionnés affichés dans recherche avancée
        if (itemType === 'ingredient') {
            selectedIngredients = selectedIngredients.filter(selected => selected !== item);
        } else if (itemType === 'ustensil') {
            selectedUstensils = selectedUstensils.filter(selected => selected !== item);
        } else if (itemType === 'appliance') {
            selectedAppliances = selectedAppliances.filter(selected => selected !== item);
        }
        // Supprimer le tag dans recherche avancée
        itemTag.remove();

        // Mettre à jour les recettes et ingrédients/ustensils/appareils
        console.log(`Updating recipes after removing ${itemType}`);
        filteredRecipes = selectedRecette(selectedIngredients, selectedUstensils, selectedAppliances);
        console.log("22/01: filteredRecipes", filteredRecipes.length);
        updateItemLabels(filteredRecipes); // Mise à jour de la liste des ingrédients
        //updateRecipesAndIngredients(); // Mise à jour globale
        updateRecipesAndItems(item,itemType); // Mise à jour globale
    });

    // Ajouter le bouton de suppression au tag
        //ingredientTag.appendChild(removeButton); remplacé par :
    itemTag.appendChild(removeButton);

    // Ajouter le tag dans le conteneur 
    selectedItemsContainer.appendChild(itemTag); 
}

/////  modifs suggérées AJOUT
function removeSelectedItemTag(item,itemType) {
    console.log("24/01  removeSelectedItemTag",item, itemType);
    const ingreTags = selectedItemsContainer.querySelectorAll('.selected-items-tag');
    ingreTags.forEach(param => {
        if (param.textContent.trim().startsWith(item)) {
            param.remove();
            console.log(item,"tag removed");
        }
    });
}

function removeSelectedItemFromList(item,itemType,myList) {
    console.log("myList")
    let listUpdated ;
    switch (itemType) {
        case 'ingredient' :
            selectedIngredients = myList.filter(param => param !== item);
            listUpdated = selectedIngredients;
            break;
        case 'appliance':
            selectedAppliances = myList.filter(param => param !== item);
            listUpdated = selectedAppliances;
            break;
        case 'ustensil':
            selectedUstensils = myList.filter(param => param !== item);
            listUpdated = selectedUstensils;
            break;
        default:
            break;
    }
    console.log("24/01/2025: list Updated",listUpdated);
}

// MAJ de Array des recettes en fonction des selectedIngredients (Array des ingrédients selectionnés)
function selectedRecette(selectedIngredients, selectedUstensils, selectedAppliances) {
    let selectedRecipes = recipes;

    // Filter by search bar input
    if (searchBarInput.value.length >= 3) {
        const query = searchBarInput.value.toLowerCase();
        console.log("Filtering by search input:", query);
        selectedRecipes = filterRecipes(query, selectedRecipes);
        console.log("Remaining recipes after filtering by search input:", selectedRecipes.length);
    }

    // Filter by selected ingredients
    if (selectedIngredients && selectedIngredients.length > 0) {
        console.log("Filtering by selectedIngredients:", selectedIngredients.length);
        selectedRecipes = selectedRecipes.filter(recette =>
            selectedIngredients.every(selectedIngredient =>
                recette.ingredients.some(item => item.ingredient === selectedIngredient)
            )
        );
        console.log("Remaining recipes after filtering ingredients:", selectedRecipes.length);
    }

    // Filter by selected utensils
    if (selectedUstensils && selectedUstensils.length > 0) {
        console.log("Filtering by selectedUstensils:", selectedUstensils.length);
        selectedRecipes = selectedRecipes.filter(recette =>
            selectedUstensils.every(selectedUstensil =>
                recette.ustensils.includes(selectedUstensil)
            )
        );
        console.log("Remaining recipes after filtering utensils:", selectedRecipes.length);
    }

    // Filter by selected appliances
    if (selectedAppliances && selectedAppliances.length > 0) {
        console.log("Filtering by selectedAppliances:", selectedAppliances.length);
        selectedRecipes = selectedRecipes.filter(recette =>
            selectedAppliances.every(selectedAppliance =>
                recette.appliance === selectedAppliance
            )
        );
        console.log("Remaining recipes after filtering appliances:", selectedRecipes.length);
    }

    return selectedRecipes;
}

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
    const allItems = filteredRecipes.flatMap(recipe => recipe.ustensils);
    // Retourner la liste des items sans doublon
    return [...new Set(allItems)];
}

// 2. fonction pour afficher le DOM des ingrédients dans le dropdown 
//function renderIngredientList(ingredientList, ingredients, selectedIngredients) {

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


function createSearchBar(className, parentElement) {
    const searchBar = document.createElement('input');
    searchBar.className = className;
    searchBar.type = 'text';
    parentElement.appendChild(searchBar);
    return searchBar;
}

function handleCheckboxClick(item, itemType, checkbox) {
    if (checkbox.checked) {
        // Add item if not already selected
        if (!selectedIngredients.includes(item)) {
            console.log("addSelectedItemTag in handleCheckboxClick");
            selectedIngredients.push(item);
            addSelectedItemTag(item);
        }
    } else {
        // Remove item if unchecked
        selectedIngredients = selectedIngredients.filter(selected => selected !== item);
        removeSelectedItemTag(item);
    }
    updateRecipesAndItems(item,itemType); // Update recipes and ingredients
}


function displayItems(items, container, itemType) {
    container.innerHTML = ''; // Clear existing list
console.log("****  22/01 displayItems non utilisé")
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

function setupSearchBar(searchInput, items, container, itemType) {
    searchInput.addEventListener('keyup', (e) => {
        console.log(`Search input for ${itemType}`);
        const query = e.target.value.toLowerCase();
        const filteredItems = items.filter(item => item.toLowerCase().includes(query));
        displayItems(filteredItems, container, itemType);
    });
}


// Ajouter une div pour afficher le tag de l'item sélectionné
function addSelectedIngredientTag(ingredient) {

    console.log("***add SelectedIngredientTag");
    const ingredientTag = document.createElement('div');
    ingredientTag.classList.add('selected-ingredient-tag');
    ingredientTag.textContent = ingredient;

    // Ajouter une croix pour supprimer le tag de l'item dans la barre "selectedItemsContainer"
    const removeButton = document.createElement('button');
    ingredientTag.appendChild(removeButton);
    selectedItemsContainer.appendChild(ingredientTag);
    removeButton.textContent = 'X'; ////  le bouton 'X' pour deleter l'element 

    //// click Event pour le bouton 'X' 
    removeButton.addEventListener('click', () => {
//// selectedIngredients sont des ingredients choisis
        let itemType = 'ingredient';
        selectedIngredients = selectedIngredients.filter(item => item !== ingredient);
        ingredientTag.remove(); // Supprimer le tag
        console.log("In add SelectedIngredientTag: Tag.remove call then ..");
        //filteredRecipes = selectedRecette(selectedIngredients);
        filteredRecipes = selectedRecette(selectedIngredients, selectedUstensils, selectedAppliances);
        console.log("In add SelectedIngredientTag: updateIngredientLabels");
        updateIngredientLabels(filteredRecipes);
        console.log("After updateIngredientLabels:",ingredient);
        updateRecipesAndItems(ingredient,itemType) ; // Mettre à jour les recettes et ingrédients
    });
}

//  21/01 
// 2. fonction pour afficher les ingrédients dans le DOM
function renderIngredientList(ingredientList, ingredients, selectedIngredients,type) {
    console.log("******** in renderIngredientList");
    ingredientList.innerHTML = ''; // Vider la liste actuelle

    ingredients.forEach(ingredient => {
        const label = document.createElement('label');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = ingredient;
        let item = ingredient;
        let itemType = 'ingredient';

        // Ajouter le checkbox et le texte à l'étiquette
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(` ${ingredient}`));
        ingredientList.appendChild(label);
        
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
                    console.log("addSelectedItemTag in checkbox CLICK Event in renderIngredientList");
                    addSelectedItemTag(ingredient,itemType);
                }
            } else {
                // Retirer l'ingrédient s'il est décoché
                selectedIngredients = selectedIngredients.filter(item => item !== ingredient);
                removeSelectedItemTag(ingredient,itemType);
            }

            // Mettre à jour les recettes et ingrédients
            updateRecipesAndItems(item,itemType);
        });
    });
} 

//  21/01 
// 3. Event de la barre de recherche dans le dropdown list des ingrédients
function setupitemSearch(itemSearch, itemList, uniqueItems, selectedItems) {
    console.log("22/01:  add Event to itemSearch setupItemSearch ")

    itemSearch.addEventListener('keyup', (e) => {
        e.stopPropagation(); // Empêche la fermeture immédiate

        const query = e.target.value.toLowerCase();
        const filteredItems = uniqueItems.filter(item =>
            item.toLowerCase().includes(query)
        );
        console.log("23/01/25:  settingItemList dans setupItemSearch ")
        // Mettre à jour la liste des ingrédients affichés
        settingItemList(itemList, filteredItems, selectedItems,);
    });
}

// 22/01 BEGIN
//  la barre de recherche des items doit gerer 2 sortes d'Events:
//      1. cliquer dessus pour qu'ensuite
//      2. entrer le nom de item recherché
//
function itemBarSearchEvents(itemSearch, itemList, uniqueItems, selectedItems, type) {
    itemSearch.addEventListener('click', (e) => {
        e.stopPropagation(); // Empêche la fermeture immédiate de la list dropdown
        console.log(`Search bar clicked for type: ${type}`);
    });

    itemSearch.addEventListener('keyup', (e) => {
        const query = e.target.value.toLowerCase();
        const filteredItems = uniqueItems.filter(item =>
            item.toLowerCase().includes(query)
        );
        console.log("23/01/25:  settingItemList dans itemBarSearchEvents ")
        console.log(`23/01/25:  Keyup in search bar for ${type}: ${query}`);
        // Logic for keyup
        settingItemList(itemList, filteredItems, selectedItems, type);
    });
}
// 22/01 END

function updateItemLabels(filteredRecipes) {    
    console.log("*** updateItemLabels");

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
        console.log("23/01/25:  settingItemList dans updateItemLabels, puis  ")
        console.log(`settingItemList dans updateItemLabels pout ${type}`);
        settingItemList(itemList, uniqueItems, selectedItems, type);

        // Connecter la barre de recherche pour filtrer les ingrédients
        itemBarSearchEvents(itemSearch, itemList, uniqueItems, selectedItems, type);
    })

}

function updateRecipesAndItems(item,itemType) {
    console.log("*** updateRecipesAndItemssSSSSS");

    // Filtrer les recettes en fonction des ingrédients sélectionnés
    console.log("In updateRecipesAndItems: call selectedRecette(selectedIngredients etc)");
    filteredRecipes = selectedRecette(selectedIngredients, selectedUstensils, selectedAppliances);

    console.log("in updateRecipesAndItems(): filteredRecipes length :", filteredRecipes.length);

    // Afficher les recettes filtrées
    console.log("In updateRecipesAndItems: displayRecipes");
    displayRecipes(filteredRecipes);

    // Mettre à jour les ingrédients dans la liste déroulante
    console.log("In updateRecipesAndItems: calling updateItemLabels",item,itemType);
    updateItemLabels(filteredRecipes);
}

// Event 3 carac. sur la barre de recherche
searchBarInput.addEventListener('input', (e) => {
    console.log("*** Event searchBarInput")
    const query = e.target.value.trim();
    let argRecettes = [];
    let filteredRecipes = [];

    filteredRecipes = recipes;

    ////////////////////
    console.time("Excution Time");
    filteredRecipes = selectedRecette(selectedIngredients, selectedUstensils, selectedAppliances);
    console.timeEnd("Excution Time");
    ////////////////////

    displayRecipes(filteredRecipes);
});

// ouvrir/fermer la liste déroulante
function toggleDropdown(dropdownContent,dropdownItem,associatedArrow) {
    const isOpen = dropdownContent.classList.contains('open'); // isOpen toggles false/true
    dropdownContent.classList.toggle('open');  // toggles adding/removing the "open" class
    associatedArrow === "" ? "" : associatedArrow.classList.toggle('open');
    dropdownContent.setAttribute('aria-hidden', isOpen);  // aria-hidedn toggles true/false
    dropdownItem.classList.toggle('open');
    console.log("togleDropdown isOpen:",!isOpen);

}

// 25/01/21  BEGIN
// Fonction pour fermer tous les dropdowns
function closeAllDropdowns() {
    document.querySelectorAll('.dropdown-content').forEach(content => {
        content.classList.remove('open');
        content.setAttribute('aria-hidden', 'true');
    });
}

// "clic à l'extérieur de la list" declenche la fermeture
document.addEventListener('click', (e) => {
        e.stopPropagation(); // Empêche la fermeture immédiate de la list dropdown
        const inCheckList = document.querySelector('input[type="checkbox"]');
        console.log("25/01/2025  outside target",e.target);
        if (!(e.target === inCheckList) ) {
            closeAllDropdowns();
        }
});

// 25/01/21  END


const dropdownArrows = document.querySelectorAll('.dropdown-arrow');
dropdownArrows.forEach(arrow => {
    arrow.addEventListener('click', (event) => {
        event.stopPropagation(); // Empêche la fermeture immédiate

        // Récupérer l'élément cliqué
        const clickedArrow = event.target;

        // Rechercher le parent associé .dropdown à l'element cliqué, puis rechercher .dropdown-content sous ce parent
        const dropdownContent = clickedArrow.closest('.dropdown').querySelector('.dropdown-content');
        console.log("** Event dropdownArrow CLICK");
        console.log("Clicked Arrow:", clickedArrow); // Affiche l'élément exact
        console.log("Associated Dropdown:", dropdownContent); // Affiche le parent dropdown

        // Appeler une fonction avec l'élément cliqué
        toggleDropdown(dropdownContent,clickedArrow,"");
    });
});

const dropdownButtons = document.querySelectorAll('.dropdown-button');
dropdownButtons.forEach(item => {
    item.addEventListener('click', (event) => {
        event.stopPropagation(); // Empêche la fermeture immédiate

        // Récupérer l'élément cliqué
        const clickedItem = event.target;

        // Optionnel : Identifier le parent associé (par exemple, la liste dropdown)
        const dropdownContent = clickedItem.closest('.dropdown').querySelector('.dropdown-content');
        const associatedArrow = clickedItem.closest('.dropdown').querySelector('.dropdown-arrow');
        console.log("** Event dropdownButton CLICK");
        console.log("Clicked Button:", clickedItem); // Affiche l'élément exact
        console.log("Associated Dropdown:", dropdownContent); // Affiche le parent dropdown

        // Appeler une fonction avec l'élément cliqué
        toggleDropdown(dropdownContent,clickedItem,associatedArrow);
    });
});

/////////////////////////////////////////////////////////////////
//
// Initialisation - Affiche toutes les recettes au chargement
//
/////////////////////////////////////////////////////////////////

const constituant = ['ingredient', 'appliance', 'ustensil'];
console.log("DEBUT de Programme: calling displayRecipes")
displayRecipes(recipes);

// Initialisation pour chaque liste déroulante
constituant.forEach(type => {
    console.log(`Init: calling updateItemLabels for ${type}`); // Mettre les items dans la dropdown list 
    updateItemLabels(recipes);
}); 
console.log("Init: sortie de updateItemLabels");
// Effacer le contenu de la barre input
searchBarInput.value = '';




