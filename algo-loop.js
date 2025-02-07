//
// fichier algo-loop.js
//


function filterRecipes(query,argListRecettes) {
console.time("Loop Excution Time");

    let debugTrace = false;
    let resultat = []; // empty array at init
    query = query.toLowerCase();
    debugTrace && console.log("[filterRecipes] called");

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

    //debugTrace && console.log("algo loop filterRecipes Nb RECETTE :", resultat.length);
console.timeEnd("Loop Excution Time");

    return resultat;
}



function filterRecipesArray(query,argListRecettes) {
console.time("ARRAY Excution Time");

    let debugTrace = false;

    let resultat = argListRecettes; // at init: all recipes
    query = query.toLowerCase();

    // Filtrer les recettes en fonction des ingrédients sélectionnés
    debugTrace && console.log("[IN filterRecipes ARRAY]");
    if (selectedIngredients.length > 0) {
        resultat = argListRecettes.filter(recette =>
            selectedIngredients.every(selectedIngredient =>
                recette.ingredients.some(item => item.ingredient === selectedIngredient) // item étant l'ensemble des ingrédients d'une recette
            )
        );
    }
    resultat = resultat.filter(recipe => {
        const nameMatch = recipe.name.toLowerCase().includes(query);
        const descriptionMatch = recipe.description.toLowerCase().includes(query);
        const ingredientsMatch = recipe.ingredients.some(item => 
            item.ingredient.toLowerCase().includes(query)
        );
        return nameMatch || descriptionMatch || ingredientsMatch;
    });
    console.log("*** Algo array, Nb RECETTES: ", resultat.length);
console.timeEnd("ARRAY Excution Time");
    return resultat;
}
    
