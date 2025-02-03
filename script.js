// Charger les recettes

// Référence aux éléments HTML
const searchBarInput = document.getElementById('search-bar-input');
const recipesContainer = document.getElementById('recipes-container');
const nbRecettesTrouvees = document.getElementById('nbRecettes');
const selectedItemsContainer = document.getElementById('selected-items-container');


nbRecettesTrouvees.textContent = `${recipes.length} Recettes`;
let selectedIngredients = []; // Liste des ingrédients selectionnes
let selectedUstensils = []; // Liste des ingrédients selectionnes
let selectedAppliances = []; // Liste des ingrédients selectionnes

// Fonction pour afficher les recettes

function displayRecipes(filteredRecipes) {
    console.log("***28/01/2025:  NEW displayRecipes");
    
    // vider le container
    recipesContainer.innerHTML = '';
    
    // Handle empty recipe list
    if (filteredRecipes.length === 0) {
        nbRecettesTrouvees.textContent = "0 Recettes";
        recipesContainer.innerHTML = '<p>Aucune recette trouvée.</p>';
        return;
    }

    //1. using map() and join() to Create a single string for ingredients of each recipe
    const recipesHTML = filteredRecipes.map(recipe => {
        const imgSource = recipe.id < 10 
            ? `Recette0${recipe.id}.jpg` 
            : `Recette${recipe.id}.jpg`;

        let ingredientsHTML = recipe.ingredients.map(item => {
            const unit = item.unit || ""; // Default to empty if unit is missing
            const quantity = item.quantity || ""; // Default to empty if quantity is missing
            return `
                <li>
                    <span class="ingredient-name">${item.ingredient}</span><br>
                    ${quantity} ${unit}
                </li>
            `;
        }) 
        ingredientsHTML = ingredientsHTML.join(''); // Join all ingredients into one string
        // comment to keep
            //console.log(" AFTER join() recipe :  ", recipe.name, "\n              ingredients:", ingredientsHTML);
        // comment to keep END
    //2. For each recipe, return the created DOM below; The "join()" method is used to Join all recipes into one string.
    /*
    console.log("to be return for :",recipe.name,
             `
                <div class="recette-card">
                    <img 
                        class="img-recette" 
                        src="../Newphotos/recipes/${imgSource}" 
                        alt="Photo de la recette ${recipe.name}">
                    <p class=duree>${recipe.time}min</p>
                    <h2>${recipe.name}</h2>
                    <h3 class="recette">RECETTE</h3>
                    <p>${recipe.description}</p>
                    <h3>INGREDIENTS</h3>
                    <ul class="ingredients-list">
                        ${ingredientsHTML}
                    </ul>
                </div>
            `);
    */
    return `
            <div class="recette-card">
                <img 
                    class="img-recette" 
                    src="../Newphotos/recipes/${imgSource}" 
                    alt="Photo de la recette ${recipe.name}">
                <p class=duree>${recipe.time}min</p>
                <h2>${recipe.name}</h2>
                <h3 class="recette">RECETTE</h3>
                <p>${recipe.description}</p>
                <h3>INGREDIENTS</h3>
                <ul class="ingredients-list">
                    ${ingredientsHTML}
                </ul>
            </div>
        `;
    }).join(''); // Join all recipes into one string

    //console.log("recipesHTML final :",recipesHTML);

    // Update the DOM once for all recipes inside the "filteredRecipes"
    recipesContainer.innerHTML = recipesHTML;

    // Update the recipe count
    nbRecettesTrouvees.textContent = `${filteredRecipes.length} Recettes`;
}

//  /01/02/2025 BEGIN

/*function displayRecipes(filteredRecipes) {
    console.log("***28/01/2025:  NEW displayRecipes");
    
    // vider le container
    recipesContainer.innerHTML = '';
    
    // Handle empty recipe list
    if (filteredRecipes.length === 0) {
        nbRecettesTrouvees.textContent = "0 Recettes";
        recipesContainer.innerHTML = '<p>Aucune recette trouvée.</p>';
        return;
    }

    //1. using map() and join() to Create a single string for ingredients of each recipe
    const recipesHTML = filteredRecipes.map(recipe => {
        const imgSource = recipe.id < 10 
            ? `Recette0${recipe.id}.jpg` 
            : `Recette${recipe.id}.jpg`;

        let ingredientsHTML = recipe.ingredients.map(item => {
            const unit = item.unit || ""; // Default to empty if unit is missing
            const quantity = item.quantity || ""; // Default to empty if quantity is missing
            return `
                <li>
                    <span class="ingredient-name">${item.ingredient}</span><br>
                    ${quantity} ${unit}
                </li>
            `;
        }) 
        ingredientsHTML = ingredientsHTML.join(''); // Join all ingredients into one string
        // comment to keep
            console.log(" AFTER join() recipe :  ", recipe.name, "\n              ingredients:", ingredientsHTML);
        // comment to keep END
    //2. For each recipe, return the created DOM below; The "join()" method is used to Join all recipes into one string.
    return `
                <div class="recette-card">
                    <img 
                        class="img-recette" 
                        src="../Newphotos/recipes/${imgSource}" 
                        alt="Photo de la recette ${recipe.name}">
                    <p class=duree>${recipe.time}min</p>
                    <h2>${recipe.name}</h2>
                    <h3 class="recette">RECETTE</h3>
                    <p>${recipe.description}</p>
                    <h3>INGREDIENTS</h3>
                    <ul class="ingredients-list">
                        ${ingredientsHTML}
                    </ul>
                </div>
            `;
    }).join(''); // Join all recipes into one string

    // Update the DOM once
    recipesContainer.innerHTML = recipesHTML;

    // Update the recipe count
    nbRecettesTrouvees.textContent = `${filteredRecipes.length} Recettes`;
}*/
//  01/02/2025 END



function isIngredientTagsEmpty() {
    return !selectedItemsContainer.hasChildNodes();
}

/* *********** */
/*  Refactore  */
/* *************/

/*
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
    const itemList = document.createElement('ul');
    itemList.classList.add(`${itemType}-list`);
    dropdownContent.appendChild(itemList);
}
*/
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

function resetHightlight(item,itemType,myList) {
    console.log("myList")
    let listUpdated ;  // useless, only for console.log
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

// MAJ des recettes en fonction des selectedIngredients... (Array des ingrédients selectionnés)
function selectedRecette(selectedIngredients, selectedUstensils, selectedAppliances) {
    let selectedRecipes = recipes;

    // Filter by search bar input
    if (searchBarInput.value.length >= 3) {
        let query = searchBarInput.value
        .replace(/[^a-zA-ZÀ-ÿ0-9\s'-]/g, '"') // Remplace les caractères non autorisés par le tréma: '"'
        .slice(0, searchBarMaxLength);        // Limite la longueur
        query = query.toLowerCase();
        console.log("Filtering by search input:", query);
        selectedRecipes = filterRecipes(query, selectedRecipes);
        console.log("Remaining recipes after filtering by search input:", selectedRecipes.length);
    }

    // Filter by selected ingredients
    if (selectedIngredients && selectedIngredients.length > 0) {
        //console.log("Filtering by selectedIngredients:", selectedIngredients.length);
        selectedRecipes = selectedRecipes.filter(recette =>
            selectedIngredients.every(selectedIngredient =>
                recette.ingredients.some(item => item.ingredient === selectedIngredient)
            )
        );
        console.log("Remaining recipes after filtering ingredients:", selectedRecipes.length);
    }

    // Filter by selected utensils
    if (selectedUstensils && selectedUstensils.length > 0) {
        //console.log("Filtering by selectedUstensils:", selectedUstensils.length);
        selectedRecipes = selectedRecipes.filter(recette =>
            selectedUstensils.every(selectedUstensil =>
                recette.ustensils.includes(selectedUstensil)
            )
        );
        console.log("Remaining recipes after filtering utensils:", selectedRecipes.length);
    }

    // Filter by selected appliances
    if (selectedAppliances && selectedAppliances.length > 0) {
        //console.log("Filtering by selectedAppliances:", selectedAppliances.length);
        selectedRecipes = selectedRecipes.filter(recette =>
            selectedAppliances.every(selectedAppliance =>
                recette.appliance === selectedAppliance
            )
        );
        console.log("Remaining recipes after filtering appliances:", selectedRecipes.length);
    }
    updateItemLabels(selectedRecipes);
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
    console.log(`[Start] Setting item list for type: ${itemType}`);

    itemList.innerHTML = ''; // Vider la liste actuelle

    filtered.forEach(item => {
        const itemListLi = document.createElement('li');  //itemListLi: label
        //itemListLi.textContent = item;

        // Si l'item (ingredient,appareil,ustensile) est sélectionné (dans la liste selectedItems), cochez la case
        if (selectedItems.includes(item)) {
            itemListLi.classList.add('highlighted');  // choisir '#f3bd1f'
        }

        itemListLi.appendChild(document.createTextNode(` ${item}`));
        itemList.appendChild(itemListLi);
        // add Event qd on clique sur un item dans une des listes déroullantes 
        itemListLi.addEventListener('click', (e) => {
            e.stopPropagation();
            handleLiState(e.target, item, itemType, selectedItems);
            updateRecipesAndItems(item, itemType);
        });
    });
}

function handleLiState(target, item, itemType, selectedItems) {
    if (target.querySelector('.highlighted') === null) {  //select the item: hightlight it
        if (!selectedItems.includes(item)) {
            selectedItems.push(item);
            addSelectedItemTag(item, itemType);
        } else {     //case when item is already selected (hightlighted): reset the selection
            resetHightlight(item, itemType, selectedItems);
            removeSelectedItemTag(item, itemType);
        }
    }
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

/*
// 25/01/2025 BEGIN
*/

function setupSearchBar(searchInput, items, container, itemType) {
    searchInput.addEventListener('keyup', (e) => {
        console.log(`Search input for ${itemType}`);
        const query = e.target.value.toLowerCase();
        const filteredItems = items.filter(item => item.toLowerCase().includes(query));
        displayItems(filteredItems, container, itemType);
    });
}


// Ajouter une div pour afficher le tag de l'item sélectionné
//function addSelectedIngredientTag(ingredient) 

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
        console.log("[03/02/2025]  ***** updateItemLabels",type,uniqueItems.length) ;

        //console.log("24/01/2025 in updateItemLabels dropdownContent has", dropdownContent.childNodes.length," children");
        dropdownContent.innerHTML = ''; // Vider les anciens labels

        // Créer item la barre de recherche
        const itemSearch = document.createElement('input');
        itemSearch.className = `${type}-search`;
        itemSearch.type = 'text';
        itemSearch.placeholder = `Search ${type}s...`;
        dropdownContent.appendChild(itemSearch);

        // Créer le conteneur pour les items (ingrédients, appliances ...)
        const itemList = document.createElement('ul');
        itemList.classList.add(`${type}-list`);
        dropdownContent.appendChild(itemList);

        // Mettre à jour la liste des ingrédients affichés
        console.log(`23/01/25:  settingItemList dans updateItemLabels pout ${type}`);
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

searchBarInput.addEventListener('click', (e) => {
    e.stopPropagation();

});

// Event 3 carac. sur la barre de recherche
searchBarInput.addEventListener('input', (e) => {
    console.log("*** Event searchBarInput")
    //const query = e.target.value.trim();
    //const query = e.target.value.replace(/[^a-zA-Z0-9 ]/g, '').slice(0, searchBarMaxLength);

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
    dropdownItem.classList.toggle('open');
    console.log("togleDropdown isOpen:",!isOpen);

}

// Prevent dropdown from closing when clicking inside its content
document.querySelectorAll('.dropdown-content').forEach(content => {
    content.addEventListener('click', (event) => {
        event.stopPropagation();
    });
});


// Close all dropdowns and setting all arrows up when clicking outside
document.addEventListener('click', () => {
    console.log("27/01/2025:  ******* CLICK Received ")
    document.querySelectorAll('.dropdown-content').forEach(content => {
        content.classList.remove('open');
    });
    document.querySelectorAll('.dropdown-arrow').forEach(arrow => {
        arrow.classList.remove('open');
    })
    document.querySelectorAll('.dropdown-button').forEach(button => {
        button.classList.remove('open');
    })
});


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
        const clickedSpan = event.target;
        // Optionnel : Identifier le parent associé (par exemple, la liste dropdown)
        const clickedButton = clickedSpan.closest('.dropdown-button');
        //clickedButton.classList.toggle('open');

        const dropdownContent = clickedSpan.closest('.dropdown').querySelector('.dropdown-content');
        const associatedArrow = clickedSpan.closest('.dropdown').querySelector('.dropdown-arrow');
        console.log("** Event dropdownButton CLICK");
        console.log("Clicked Button:", clickedButton); // Affiche l'élément exact
        console.log("Clicked button span title:", clickedSpan); // Affiche l'élément exact
        console.log("Associated Dropdown:", dropdownContent); // Affiche le parent dropdown

        // Appeler une fonction avec l'élément cliqué
        toggleDropdown(dropdownContent,clickedButton,associatedArrow);
    });
});

/////////////////////////////////////////////////////////////////
//
// Initialisation - Affiche toutes les recettes au chargement
//
/////////////////////////////////////////////////////////////////

const searchBarMaxLength = 20;
const constituant = ['ingredient', 'appliance', 'ustensil'];
console.log("DEBUT de Programme: calling displayRecipes")
displayRecipes(recipes);

// Initialisation pour chaque liste déroulante avec updateItemLabels
console.log("Init: calling updateItemLabels(recipes)"); // Mettre les items dans la dropdown list 
updateItemLabels(recipes);

console.log("Init: sortie de updateItemLabels");
// Effacer le contenu de la barre input
searchBarInput.value = '';




function liveIngredientAdding (recipe,recipeHTML) { 
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
}
