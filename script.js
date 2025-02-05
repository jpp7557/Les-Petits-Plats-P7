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

// Fonction pour afficher les recette-card

function displayRecipes(filteredRecipes) {
    console.log("***28/01/2025:  NEW displayRecipes");
    let debugTrace = false;
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
        // for DEBUG
            debugTrace && console.log(" AFTER join() recipe :  ", recipe.name, "\n              ingredients:", ingredientsHTML);

        //2. For each recipe, return the created DOM below; The "join()" method is used to Join all recipes into one string.

        debugTrace && console.log("to be return for :",recipe.name,          // for DEBUG
                `<div class="recette-card">
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

    return  `<div class="recette-card">
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

    // Update the DOM once for all recipes inside the "filteredRecipes"
    recipesContainer.innerHTML = recipesHTML;

    // Update the recipe count
    nbRecettesTrouvees.textContent = `${filteredRecipes.length} Recettes`;
}

function isIngredientTagsEmpty() {
    return !selectedItemsContainer.hasChildNodes();
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
        // Mettre à jour la liste des items affichés    
        settingItemList(itemList, filteredItems, selectedItems, itemType);
    })
}

function addSelectedItemTag(item, itemType) {

    let debugTrace = false;
    debugTrace &&  console.log(`*** addSelectedItemTag for ${itemType}`);

    // Créer le tag pour l'élément sélectionné
    const itemTag = document.createElement('div');
    //itemTag.classList.add(`selected-${itemType}-tag`);
    itemTag.classList.add(`selected-items-tag`);
    itemTag.textContent = item;

    // creation d'une croix pour supprimer le tag
    const removeButton = document.createElement('button');
    removeButton.textContent = 'X';

    removeButton.addEventListener('click', () => {
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
        console.log(`Updating recipes after removing ${item}`);
        console.log(" filteredRecipes", filteredRecipes.length);
        //04/02
        updateRecipesAndItems(item,itemType); // Mise à jour globale
        //04/02
    });

    // Ajouter le bouton de suppression au tag
    itemTag.appendChild(removeButton);

    // Ajouter le tag dans le conteneur 
    selectedItemsContainer.appendChild(itemTag); 
}

function removeSelectedItemTag(item,itemType) {
    const ingreTags = selectedItemsContainer.querySelectorAll('.selected-items-tag');
    ingreTags.forEach(param => {
        if (param.textContent.trim().startsWith(item)) {
            param.remove();
            console.log(item,"tag removed");
        }
    });
}

function resetHightlight(item,itemType,targetList) {
    let listUpdated ;  // useless, only for console.log
    switch (itemType) {
        case 'ingredient' :
            selectedIngredients = targetList.filter(param => param !== item);
            listUpdated = selectedIngredients;
            break;
        case 'appliance':
            selectedAppliances = targetList.filter(param => param !== item);
            listUpdated = selectedAppliances;
            break;
        case 'ustensil':
            selectedUstensils = targetList.filter(param => param !== item);
            listUpdated = selectedUstensils;
            break;
        default:
            break;
    }
}

// MAJ des recettes en fonction des selectedIngredients... (Array des items selectionnés)
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
    const allItems = filteredRecipes.map(recipe => recipe.appliance); 
    return [...new Set(allItems)];
}

// 1 ter. fonction pour traiter les données
function getUniqueUstensils(filteredRecipes) {
    const allItems = filteredRecipes.flatMap(recipe => recipe.ustensils);
    return [...new Set(allItems)];
}

// 2. fonction pour mettre des elements(tag) dans la dropdown 
//  04.02.2025 BEGIN
function settingItemList(itemList, filtered, selectedItems, itemType) {

    let debugTrace = false;

    console.log(`[04/02/2025 Start] Setting list for: ${itemType}`);

    itemList.innerHTML = ''; // Vider la liste actuelle

    const fragment = document.createDocumentFragment(); // Use DocumentFragment for performance

    filtered.forEach(item => {
        debugTrace && console.log("[04/02/2025]  settingItemList pour ", item);

        const itemListLi = highlightListElement(item, selectedItems);

        // Attach event once per item
        itemListLi.addEventListener('click', (e) => {
            e.stopPropagation();
            handleLiState(e.target, item, itemType, selectedItems);
            updateRecipesAndItems(item, itemType);
        });

        fragment.appendChild(itemListLi); // Append to fragment instead of directly modifying DOM
    });

    itemList.appendChild(fragment); // Batch append to DOM once
}

function highlightListElement(item, selectedItems) {
    const itemListLi = document.createElement('li');
    itemListLi.textContent = ` ${item}`;

    if (selectedItems.includes(item)) {
        itemListLi.classList.add('highlight'); // Highlight selected items
    }

    return itemListLi;
}
//  04.02.2025 END



// add the selected item in "selectedItems" list
function handleLiState(target, item, itemType, selectedItems) {
    if (target.querySelector('.highlight') === null) {  // if the selected item is not hightlighted and 
        if (!selectedItems.includes(item)) {              // and if the selected item is not yet in the "selectedItems"
            selectedItems.push(item);                     // then add it in "selectedItems"
            addSelectedItemTag(item, itemType);
        } else {     //case when item is already selected (hightlighted): reset the selection
            resetHightlight(item, itemType, selectedItems);
            removeSelectedItemTag(item, itemType);
        }
    }
}

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

        dropdownContent.innerHTML = ''; // Vider les anciens labels

        const searchWrapper = document.createElement('div');
        searchWrapper.className = 'search-wrapper'; 
        // Créer la barre de recherche
        const itemSearch = document.createElement('input');
        itemSearch.className = `${type}-search`;
        itemSearch.type = 'text';
        itemSearch.placeholder = ``;

        // Create the SVG icon
        const searchIcon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        searchIcon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        searchIcon.setAttribute('viewBox', '0 0 24 24');
        searchIcon.setAttribute('fill', 'none');
        searchIcon.setAttribute('stroke', 'currentColor');
        searchIcon.setAttribute('stroke-width', '1');
        searchIcon.setAttribute('stroke-linecap', 'round');
        searchIcon.setAttribute('stroke-linejoin', 'round');
        searchIcon.classList.add('itemSearch-icon');

        // Create the `<circle>` and `<line>` inside the SVG
        searchIcon.innerHTML = `
            <circle cx="11" cy="11" r="8" fill="none"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        `;

        searchWrapper.appendChild(itemSearch);
        searchWrapper.appendChild(searchIcon);
        dropdownContent.appendChild(searchWrapper);

        // Créer le conteneur pour les items (ingrédients, appliances ...)
        const itemList = document.createElement('ul');
        itemList.classList.add(`${type}-list`);
        dropdownContent.appendChild(itemList);

        // Mettre à jour la liste des items affichés
        debugTrace && console.log(`23/01/25:  settingItemList dans updateItemLabels pout ${type}`);
        settingItemList(itemList, uniqueItems, selectedItems, type);

        // Event de la barre de recherche pour filtrer les items
        itemBarSearchEvents(itemSearch, itemList, uniqueItems, selectedItems, type);
    })

}

function updateRecipesAndItems(item,itemType) {

    // Filtrer les recettes en fonction des ingrédients sélectionnés
    console.log("In updateRecipesAndItems: call selectedRecette(selectedIngredients etc)");
    filteredRecipes = selectedRecette(selectedIngredients, selectedUstensils, selectedAppliances);

    debugTrace &&  console.log("in updateRecipesAndItems(): filteredRecipes length :", filteredRecipes.length);

    // Afficher les recettes filtrées
    console.log("In updateRecipesAndItems: displayRecipes");
    displayRecipes(filteredRecipes);

    // Mettre à jour les ingrédients dans la liste déroulante
    console.log("In updateRecipesAndItems: calling updateItemLabels",item,itemType);
    updateItemLabels(filteredRecipes);
}

// Event click sur la barre de recherche
searchBarInput.addEventListener('click', (e) => {
    e.stopPropagation();

});

// Event input sur la barre de recherche
searchBarInput.addEventListener('input', () => {
    console.log("*** Event searchBarInput")

    let filteredRecipes = [];

    filteredRecipes = recipes;

    ////////////////////
    console.time("Excution Time");
    filteredRecipes = selectedRecette(selectedIngredients, selectedUstensils, selectedAppliances);
    console.timeEnd("Excution Time");
    ////////////////////
    displayRecipes(filteredRecipes);
    //04/02 
    updateItemLabels(filteredRecipes);
    //04/02 

});

// ouvrir/fermer la liste déroulante
function toggleDropdown(dropdownContent,dropdownItem,associatedArrow) {
    debugTrace && console.log("[04/02/2025]** In toggleDropdown, dropdownItem, associatedArrow", dropdownItem,associatedArrow);

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
        debugTrace && console.log("Clicked Arrow:", clickedArrow); // Affiche l'élément exact
        debugTrace && console.log("Associated Dropdown:", dropdownContent); // Affiche le parent dropdown

        // Appeler toggleDropdown avec l'élément cliqué
        toggleDropdown(dropdownContent,clickedArrow,"");
    });
});

const dropdownButtons = document.querySelectorAll('.dropdown-button');
dropdownButtons.forEach(item => {
    item.addEventListener('click', (event) => {
        event.stopPropagation(); // Empêche la fermeture immédiate
        // Récupérer l'élément cliqué
        const clickedSpan = event.target;
        // Identifier le parent associé 
        const clickedButton = clickedSpan.closest('.dropdown-button');

        const dropdownContent = clickedSpan.closest('.dropdown').querySelector('.dropdown-content');
        const associatedArrow = clickedSpan.closest('.dropdown').querySelector('.dropdown-arrow');
        console.log("** Event dropdownButton CLICK");
        debugTrace && console.log("Clicked Button:", clickedButton); // Affiche l'élément exact
        debugTrace && console.log("Clicked button span title:", clickedSpan); // Affiche l'élément exact
        debugTrace && console.log("Associated Dropdown:", dropdownContent); // Affiche le parent dropdown

        // Appeler toggleDropdown avec l'élément cliqué 
        toggleDropdown(dropdownContent,clickedButton,associatedArrow);
    });
});

/////////////////////////////////////////////////////////////////
//
// Initialisation - Affiche toutes les recettes au chargement
//
/////////////////////////////////////////////////////////////////
let debugTrace = false;
const searchBarMaxLength = 20;
const constituant = ['ingredient', 'appliance', 'ustensil'];
// Effacer le contenu de la barre input
searchBarInput.value = '';

console.log("DEBUT de Programme: calling displayRecipes")
displayRecipes(recipes);

// Initialisation pour chaque liste déroulante avec updateItemLabels
debugTrace && console.log("Init: calling updateItemLabels(recipes)"); // Mettre les items dans la dropdown list 
updateItemLabels(recipes);

debugTrace && console.log("Init: sortie de updateItemLabels");
