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
        // Ajout dynamique des ingrédients à la liste
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

function addIngredientsToList(filteredRecipes) {
    const ingregientsUl = document.querySelector('.ingredientsUL');
    const ingredientLi = document.createElement('li');

    const allIngredients = filteredRecipes.flatMap(recipe => 
        recipe.ingredients.map(item => item.ingredient)
    );
    console.log("Les ingrédients de toutes les recelltes sont :", allIngredients);
    let newList = [...new Set(allIngredients)];
    console.log("Les ingrédients sans doublons de toutes les recelltes :", newList);
    return newList;

}

// sur la barre de recherche
searchBarInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();
    if (query.length >= 3) {
        const filteredRecipes = filterRecipes(query);
        nbRecettesTrouvees.textContent = `${filteredRecipes.length} Recettes`;
        displayRecipes(filteredRecipes);
        console.log("**** filteredRecipes : ", filteredRecipes);
        console.log("list des ingrédients SANS doublons: ", addIngredientsToList(filteredRecipes));
    } else {
        nbRecettesTrouvees.textContent = `${recipes.length} Recettes`;
        displayRecipes(recipes); // Affiche toutes les recettes si moins de 3 caractères
    }
});

// Initialisation - Affiche toutes les recettes au chargement
displayRecipes(recipes);

const dropdownButton = document.querySelector('.dropdown-button');
const dropdownContent = document.querySelector('.dropdown-content');

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