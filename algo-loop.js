//
// fichier algo-loop.js
//


//// objectif: filtrer les recettes qui comporte un ingredient dans "selectedIngredients"  
//// algorithme: parcourir recipes, on filtre celles qui ont un ingredient qui se trouve dans "selectedIngredients"
//// etape 1: verifie si pour chaque "selectedIngredient" qui se trouvent dans selectedIngredients, 
//// étape 2: il y en a un qui est égale à un ingredient parmi tous les ingredients de "recipe"

/*
function ingreTagFilter(rList) {
    let filteredRecipes = recipes;

    let resultat = [];

        for (let i = 0; i < rList.length; i++) {
            const recipe = rList[i];
            let ingredientsMatch = false;

            // Check if a selectedIngredients[k] is in any of the ingredients of a given recipe.ingredients[j]
            for (let j = 0; j < recipe.ingredients.length; j++) {
                const ingredient = recipe.ingredients[j].ingredient;
                for (let k = 0; k < selectedIngredients.length; k++) {
                        if (ingredient === selectedIngredients[k]) {
                            ingredientsMatch = true;
                            console.log("push ",recipe.name, "into resultat");
                            resultat.push(recipe);
                            break;
                        }
                }
                if (ingredientsMatch) break; // Stop checking further ingredients if a match is found
            }
        }

    filteredRecipes = resultat;  // if ingredient tags is not empty, 

    console.log("in ingreTagFilter, filteredRecipes length :", filteredRecipes.length);

    for (let i = 0; i < filteredRecipes.length; i++) {
        console.log("         ", filteredRecipes[i].name);
    }

    if (searchBarInput.value.length >= 3) {
        query = searchBarInput.value;
        console.log("in ingreTagFilter, query value:", searchBarInput.value);
        resultat = filterRecipes(query,filteredRecipes);
    }
    return resultat;
}
*/

function filterRecipes(query,argListRecettes) {
    let resultat = []; // Initialize an empty array to store the filtered recipes
    query = query.toLowerCase();

    console.log("in filterRecipes, isIngredientTagsEmpty() =", isIngredientTagsEmpty());
    for (let i = 0; i < argListRecettes.length; i++) {
        const recipe = argListRecettes[i];
        let nameMatch = false;
        let descriptionMatch = false;
        let ingredientsMatch = false;

        // Check if the query is in the recipe name
        for (let j = 0; j <= recipe.name.length - query.length; j++) {
            if (recipe.name.substring(j, j + query.length).toLowerCase() === query) {
                nameMatch = true;
                break;
            }
        }

        // Check if the query is in the recipe description
        for (let j = 0; j <= recipe.description.length - query.length; j++) {
            if (recipe.description.substring(j, j + query.length).toLowerCase() === query) {
                descriptionMatch = true;
                break;
            }
        }

        // Check if the query is in any of the ingredients
        for (let j = 0; j < recipe.ingredients.length; j++) {
            const ingredient = recipe.ingredients[j].ingredient;
            for (let k = 0; k <= ingredient.length - query.length; k++) {
                if (ingredient.substring(k, k + query.length).toLowerCase() === query) {
                    ingredientsMatch = true;
                    break;
                }
            }
            if (ingredientsMatch) break; // Stop checking further ingredients if a match is found
        }

        // Add the recipe to the result if any match is found
        if (nameMatch || descriptionMatch || ingredientsMatch) {
            resultat.push(recipe);
        }
    }

    console.log("algo loop filterRecipes Nb RECETTE :", resultat.length);
    //filteredRecipes = resultat;  // update filteredRecipes
    return resultat;
}


/*
function filterRecipes(query) {
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
    console.log("*** Algo array, Nb RECETTES: ", resultat.length);
    return resultat;
}
*/    
