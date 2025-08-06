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
    Client
    BookElement
    Component
    BookTextComponentData
    BookTextData
    SimpleSoundInstance
    BookScreen
*/

const DetailedBase = {

    MAX_HEIGHT: 72,

    /**
     * @param {Internal.ArrayList<Internal.BookElement>} elements 
     * @param {Internal.MaterialId} materialId 
     * @param {number} curPage
     */
    drawRecipe: (elements, materialId, curPage) => {
        let recipes = MaterialRecipesHelper.getPartBuilderRecipeOf(materialId);
        let displayer = new RecipeDisplay(undefined, undefined);
        let h = 0;
        let page = 0;
        /** @type {Internal.ArrayList<Internal.BookElement>[]} */
        let recipePages = [Utils.newList()];
        let totalRecipes = 0;
        if (recipes != null) {
            recipes.forEach((variantId, recipes) => {
                /**
                 * @todo As a test, we use the first recipe.
                 * Should add more recipes later.
                 */ /** */
                /** @type {Internal.ArrayList<Internal.BookElement>} */
                let tempList = Utils.newList();
                recipes.forEach(recipe => {
                    h += displayer.partBuilder(tempList, recipe);
                    totalRecipes ++;
                    if (h > DetailedBase.MAX_HEIGHT) {
                        page += 1;
                        displayer.y = RecipeDisplay.DEFAULT_Y;
                        tempList.clear();
                        h = displayer.partBuilder(tempList, recipe);
                        recipePages.push(Utils.newList());
                    }
                    let recipeNumber = BookTextData.literal(totalRecipes.toFixed());
                    recipeNumber.color = "gray";
                    recipePages[page].add(BookElement.text(totalRecipes > 99 ? -2 : 0, h + 1, 16, 16, [recipeNumber]));
                    recipePages[page].addAll(tempList);
                    displayer.y = h + RecipeDisplay.DEFAULT_Y;
                });
            });
        }
        elements.addAll(recipePages[0]);

        let currentRecipePageIndicator = DetailedBase.updateRecipePageIndicator(totalRecipes, 1, recipePages.length);
        elements.add(currentRecipePageIndicator);

        let leftButton = BookElement.arrow(BookScreen.PAGE_WIDTH - 80, 2, "left", 0xFFFFFF, 0xFF0000, () => {
            if (curPage == 0) {
                Client.getSoundManager().play(SimpleSoundInstance.forUI("minecraft:ui.button.click", 1.2));
                return;
            } else if (curPage == 1) {
                elements.remove(leftButton);
            }
            if (curPage == recipePages.length - 1) {
                elements.add(rightButton);
            }
            Client.getSoundManager().play(SimpleSoundInstance.forUI("minecraft:ui.button.click", 1));
            let oldElements = recipePages[curPage];
            /** @type {Internal.ArrayList<Internal.BookElement>} */
            let newElements = recipePages[-- curPage];
            newElements.forEach((element) => {
                element.parent = Client.currentScreen;
            });
            elements.removeAll(oldElements);
            elements.addAll(newElements);

            let newPageCount = DetailedBase.updateRecipePageIndicator(totalRecipes, curPage + 1, recipePages.length);
            elements.remove(currentRecipePageIndicator);
            currentRecipePageIndicator = newPageCount;
            elements.add(currentRecipePageIndicator);
        });
        leftButton.parent = Client.currentScreen;
        // elements.add(leftButton);
        // Do not add left function at first
        let rightButton = BookElement.arrow(BookScreen.PAGE_WIDTH - 60, 2, "right", 0xFFFFFF, 0xFF0000, () => {
            if (curPage == recipePages.length - 1) {
                Client.getSoundManager().play(SimpleSoundInstance.forUI("minecraft:ui.button.click", 1.2));
                return;
            } else if (curPage == recipePages.length - 2) {
                elements.remove(rightButton);
            }
            if (curPage == 0) {
                elements.add(leftButton);
            }
            Client.getSoundManager().play(SimpleSoundInstance.forUI("minecraft:ui.button.click", 1));
            let oldElements = recipePages[curPage];
            /** @type {Internal.ArrayList<Internal.BookElement>} */
            let newElements = recipePages[++ curPage];
            newElements.forEach((element) => {
                element.parent = Client.currentScreen;
            });
            elements.removeAll(oldElements);
            elements.addAll(newElements);

            let newPageCount = DetailedBase.updateRecipePageIndicator(totalRecipes, curPage + 1, recipePages.length);
            elements.remove(currentRecipePageIndicator);
            currentRecipePageIndicator = newPageCount;
            elements.add(currentRecipePageIndicator);
        });
        rightButton.parent = Client.currentScreen;
        if (recipePages.length > 1) elements.add(rightButton);
    },

    /**
     * @param {number} totalRecipes
     * @param {number} curPage
     * @param {number} totalPages
     * - - - - -
     * @returns {Internal.TextComponentElement}
     */
    updateRecipePageIndicator: (totalRecipes, curPage, totalPages) => {
        return BookElement.textComponent(0, -2, 100, 18,
            BookTextComponentData.of(Component.translatable("book.kubejs.material.recipes.page", curPage.toFixed(), totalPages.toFixed())),
            BookTextComponentData.LINEBREAK,
            BookTextComponentData.of(Component.translatable("book.kubejs.material.recipes.count", totalRecipes.toFixed()))
        );
    }

};