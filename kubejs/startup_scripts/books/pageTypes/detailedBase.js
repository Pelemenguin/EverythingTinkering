// priority: 5000

/**
 * @fileoverview Base page builder for detailed information.
 * 
 * @author Pelemenguin
 * @license CC-BY-NC-SA-4.0
 */

/* global
    MaterialRecipesHelper
    RecipeDisplay
    Utils
*/

const DetailedBase = {

    MAX_HEIGHT: 72,

    /**
     * 
     * @param {Internal.ArrayList<Internal.BookElement>} elements 
     * @param {Internal.MaterialId} materialId 
     */
    drawRecipe: (elements, materialId) => {
        let recipes = MaterialRecipesHelper.getPartBuilderRecipeOf(materialId);
        let displayer = new RecipeDisplay(undefined, undefined);
        let h = 0;
        let finished = false;
        if (recipes != null) {
            recipes.forEach((variantId, recipes) => {
                if (finished) return;
                /**
                 * @todo As a test, we use the first recipe.
                 * Should add more recipes later.
                 */ /** */
                /** @type {Internal.ArrayList<Internal.BookElement>} */
                let tempList = Utils.newList();
                recipes.forEach(recipe => {
                    if (finished) return;
                    h += displayer.partBuilder(tempList, recipe);
                    if (h > DetailedBase.MAX_HEIGHT) {
                        finished = true;
                        return;
                    }
                    elements.addAll(tempList);
                    displayer.y = h + RecipeDisplay.DEFAULT_Y;
                });
            });
        }
    }

};