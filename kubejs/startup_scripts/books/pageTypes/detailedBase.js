// priority: 5000

/**
 * @fileoverview Base page builder for detailed information.
 * - - - - -
 * @copyright Pelemenguin 2025
 * @license LGPL-3.0-or-later
 * This file is part of EverythingTinkering.
 * Full license see file `COPYING.LESSER`
 * - - - - -
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * - - - - -
 * @author Pelemenguin
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
    ToolStack
    TinkerItemElement
    MaterialNBT
    ToolMaterialHook
    ItemStack
    MaterialVariantId
    JavaUtils
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
        let displayer = new RecipeDisplay(undefined, undefined);
        let h = 0;
        /** @type {Internal.ArrayList<Internal.BookElement>[]} */
        let recipePages = [Utils.newList()];
        let totalRecipes = 0;

        // Draw Part Builder recipes
        let partBuilderRecipes = MaterialRecipesHelper.getPartBuilderRecipeOf(materialId);
        if (partBuilderRecipes != null) {
            partBuilderRecipes.forEach((variantId, recipes) => {
                let {newH, newRecipeCount} = DetailedBase.recipeDrawerBase(h, totalRecipes, displayer, recipePages, materialId, recipes, "partBuilder");
                h = newH;
                totalRecipes = newRecipeCount;
            });
        }

        // Draw casting recipes
        /** @type {Internal.Map<Internal.MaterialVariantId, Internal.MaterialFluidRecipe[]>} */
        let materialCastingRecipes = Utils.newMap();
        MaterialRecipeCache.getVariants(materialId).forEach(variant => {
            materialCastingRecipes.put(variant, MaterialCastingLookup.getCastingFluids(variant).toArray());
        });
        materialCastingRecipes.forEach((variant, recipes) => {
            let {newH, newRecipeCount} = DetailedBase.recipeDrawerBase(h, totalRecipes, displayer, recipePages, materialId, recipes, "casting");
            h = newH;
            totalRecipes = newRecipeCount;
        });

        // Draw composite recipes
        /** @type {number[]} */
        let drawnCompositeRecipes = [];
        MaterialRecipeCache.getVariants(materialId).forEach(variant => {
            let recipes = MaterialCastingLookup.getCompositeFluids(variant).toArray().filter((/** @type {Internal.MaterialFluidRecipe} */ recipe) => {
                if (recipe.getFluids().isEmpty()) return false;
                let hashCode = recipe.hashCode();
                let result = drawnCompositeRecipes.indexOf(hashCode) == -1;
                if (result) drawnCompositeRecipes.push(hashCode);
                return result;
            });
            let {newH, newRecipeCount} = DetailedBase.recipeDrawerBase(h, totalRecipes, displayer, recipePages, materialId, recipes, "composite");
            recipes = drawnCompositeRecipes.concat(recipes);
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
     * @param {Internal.ArrayList<Internal.BookElement>} elements
     * @param {Internal.MaterialId} materialId
     * @param {Internal.MaterialVariantId} defaultMaterial
     * @param {Internal.ItemObject<Internal.ModifiableItem>[]} tools
     */
    drawExampleTools: (elements, materialId, defaultMaterial, tools) => {
        let x = BookScreen.PAGE_WIDTH - 16;
        tools.forEach((tool, index) => {
            let item = tool.getOrNull();
            if (item == null) return;
            let y = 18 + index * 16;

            let materialBuilder = MaterialNBT.builder();

            /** @type {Internal.List<Internal.MaterialStatsId>} */
            let requirements = ToolMaterialHook.stats(item.getToolDefinition());
            let anyUsed = false;
            requirements.forEach(part => {
                if (part.canUseMaterial(materialId)) {
                    materialBuilder["add(slimeknights.tconstruct.library.materials.definition.MaterialVariantId)"](MaterialVariantId["tryParse(java.lang.String)"](materialId.toString()));
                    anyUsed = true;
                } else {
                    materialBuilder["add(slimeknights.tconstruct.library.materials.definition.MaterialVariantId)"](defaultMaterial);
                }
            });

            let itemStack;
            if (anyUsed) itemStack = ToolStack.createTool(item, item.getToolDefinition(), materialBuilder.build()).createStack();
            else itemStack = new ItemStack(item, 1, {});
            let itemElement = new TinkerItemElement(itemStack);
            itemElement.x = x;
            itemElement.y = y;
            if (!anyUsed) {
                let translation = 'material.' + materialId.toString().replace(':', '.');
                itemElement.tooltip = JavaUtils.ArrayList["of(java.lang.Object[])"]([
                    Component.translatable("book.kubejs.material.tool.missing", itemStack.getHoverName(), Component.translatable(translation).underlined()).gray()
                ]);
            }
            elements.add(itemElement);
        });
    }

};