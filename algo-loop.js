//
// fichier algo-loop.js
//
function filterRecipes(query) {
    let resultat = []; // Initialize an empty array to store the filtered recipes
    query = query.toLowerCase();

    for (let i = 0; i < recipes.length; i++) {
        const recipe = recipes[i];
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
    return resultat;
}
