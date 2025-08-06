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
    MaterialRecipeCache
    MaterialCastingLookup
*/

const DetailedBase = {

    MAX_HEIGHT: 72,

    /**
     * @param {number} startH
     * @param {number} beginNumber
     * @param {RecipeDisplay} display
     * @param {Internal.ArrayList<Internal.BookElement>[]} pages
     * @param {Internal.MaterialId} materialId
     * @param {(infer R)[]} recipes
     * @ param {(elements: Internal.List<Internal.BookElement>, recipe: (infer R)) => number} recipeDrawer
     * @param {string} recipeDrawer
     * @param {Internal.ArrayList<Internal.BookElement>[]}
     * - - - - -
     * @returns {{newH: number, newRecipeCount: number}}
     */
    recipeDrawerBase: (startH, beginNumber, displayer, pages, materialId, recipes, recipeDrawer) => {
        let page = pages.length - 1;
        let tempList = Utils.newList();
        let totalRecipes = beginNumber;
        let h = startH;
        recipes.forEach(recipe => {
            h += displayer[recipeDrawer](tempList, recipe);
            totalRecipes ++;
            if (h > DetailedBase.MAX_HEIGHT) {
                page += 1;
                displayer.y = RecipeDisplay.DEFAULT_Y;
                tempList.clear();
                h = displayer[recipeDrawer](tempList, recipe);
                pages.push(Utils.newList());
            }
            let recipeNumber = BookTextData.literal(totalRecipes.toFixed());
            recipeNumber.color = "gray";
            pages[page].add(BookElement.text(totalRecipes > 99 ? -2 : 0, h + 1, 16, 16, [recipeNumber]));
            pages[page].addAll(tempList);
            displayer.y = h + RecipeDisplay.DEFAULT_Y;
        });
        return {
            newH: h,
            newRecipeCount: totalRecipes
        };
    },

    /**
     * @param {Internal.ArrayList<Internal.BookElement>} elements 
     * @param {Internal.MaterialId} materialId 
     * @param {number} curPage
     */
    drawRecipe: (elements, materialId, curPage) => {
        let partBuilderRecipes = MaterialRecipesHelper.getPartBuilderRecipeOf(materialId);
        // let materialCastingRecipes = MaterialCastingLookup.getCastingFluids(MaterialRecipeCache.getVariants(materialId));
        /** @type {Internal.Map<Internal.MaterialVariantId, Internal.MaterialFluidRecipe[]>} */
        let materialCastingRecipes = Utils.newMap();
        MaterialRecipeCache.getVariants(materialId).forEach(variant => {
            materialCastingRecipes.put(variant, MaterialCastingLookup.getCastingFluids(variant).toArray());
        });
        let displayer = new RecipeDisplay(undefined, undefined);
        let h = 0;
        /** @type {Internal.ArrayList<Internal.BookElement>[]} */
        let recipePages = [Utils.newList()];
        let totalRecipes = 0;

        // Draw Part Builder recipes
        if (partBuilderRecipes != null) {
            partBuilderRecipes.forEach((variantId, recipes) => {
                let {newH, newRecipeCount} = DetailedBase.recipeDrawerBase(h, totalRecipes, displayer, recipePages, materialId, recipes, "partBuilder");
                h = newH;
                totalRecipes = newRecipeCount;
            });
        }

        // Draw casting recipes
        materialCastingRecipes.forEach((variant, recipes) => {
            let {newH, newRecipeCount} = DetailedBase.recipeDrawerBase(h, totalRecipes, displayer, recipePages, materialId, recipes, "casting");
            h = newH;
            totalRecipes = newRecipeCount;
        }); 
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
    },

    /**
     * 
     * 
     */    

};