//
// fichier algo-array.js
//

function filterRecipes(query,argListRecettes) {    
        let debugTrace = false;
        let nameMatch;
        let descriptionMatch;
        let ingredientsMatch;
        let resultat = argListRecettes; // at init: all recipes
        query = query.toLowerCase();
    
        // Filtrer les recettes en fonction des ingrédients sélectionnés
        /*
        debugTrace && console.log("[IN filterRecipes ARRAY]");
        if (selectedIngredients.length > 0) {
            resultat = argListRecettes.filter(recette =>
                selectedIngredients.every(selectedIngredient =>
                    recette.ingredients.some(item => 
                        item.ingredient === selectedIngredient) // item étant l'ensemble des ingrédients d'une recette
                )
            );
        }
        */
        resultat = resultat.filter(recipe => {
            if (nameMatch = recipe.name.toLowerCase().includes(query)) {
                return nameMatch;
            } else if (descriptionMatch = recipe.description.toLowerCase().includes(query)) {
                return descriptionMatch;
            } else {
                return ingredientsMatch = recipe.ingredients.some(item => 
                        item.ingredient.toLowerCase().includes(query));
            }
        });
        console.log("*** Algo array, Nb RECETTES: ", resultat.length);
        return resultat;
    }    