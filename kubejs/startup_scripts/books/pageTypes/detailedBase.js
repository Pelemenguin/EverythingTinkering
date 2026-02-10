// priority: 5000

// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Base page builder for detailed information.
 * @author Pelemenguin
 */

/* global
    global: writable
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
    $ItemStack
    NBT
    $MaterialVariantId
    JavaUtils
*/

const DetailedBase = {

    MAX_HEIGHT: 72,

    /**
     * @param {number} startH
     * @param {number} beginNumber
     * @param {RecipeDisplay} displayer
     * @param {Internal.ArrayList<Internal.BookElement>[]} pages
     * @param {Internal.MaterialId} materialId
     * @param {(infer R)[]} recipes
     * @ param {(elements: Internal.List<Internal.BookElement>, recipe: (infer R)) => number} recipeDrawer
     * @param {string} recipeDrawer
     * @param {Internal.BookDataJS} book
     * - - - - -
     * @returns {{newH: number, newRecipeCount: number}}
     */
    recipeDrawerBase: (startH, beginNumber, displayer, pages, materialId, recipes, recipeDrawer, book) => {
        let page = pages.length - 1;
        let tempList = Utils.newList();
        let totalRecipes = beginNumber;
        let h = startH;
        recipes.forEach(recipe => {
            let previousH = h;
            h += displayer[recipeDrawer](tempList, recipe, book);
            totalRecipes ++;
            if (h > DetailedBase.MAX_HEIGHT + RecipeDisplay.DEFAULT_Y) {
                page += 1;
                displayer.y = RecipeDisplay.DEFAULT_Y;
                tempList.clear();
                previousH = displayer.y;
                h = displayer.y + displayer[recipeDrawer](tempList, recipe, book);
                pages.push(Utils.newList());
            }
            let recipeNumber = BookTextData.literal(totalRecipes.toFixed());
            recipeNumber.color = "gray";
            pages[page].add(BookElement.text(totalRecipes > 99 ? -2 : 0, previousH + 1, 16, 16, [recipeNumber]));
            pages[page].addAll(tempList);
            displayer.y = h;
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
     * @param {Internal.BookDataJS} book
     */
    drawRecipe: (elements, materialId, curPage, book) => {
        let displayer = new RecipeDisplay(undefined, undefined);
        let h = 18;
        /** @type {Internal.ArrayList<Internal.BookElement>[]} */
        let recipePages = [Utils.newList()];
        let totalRecipes = 0;

        /** @type {Internal.MaterialVariantId[]} */
        let allVariants = MaterialRecipeCache.getVariants(materialId).toArray();
        allVariants = allVariants.sort((a, b) => {
            return a.getVariant() > b.getVariant() ? 1 : -1;
        });

        // Draw Part Builder recipes
        // let partBuilderRecipes = MaterialRecipesHelper.getPartBuilderRecipeOf(materialId);
        let usedPartBuilderRecipes = [];
        allVariants.forEach(variant => {
            let recipes = [];
            MaterialRecipeCache.getRecipes(variant).toArray().forEach((/** @type {Internal.MaterialRecipe} */ recipe) => {
                if (recipe.getIngredient().itemTypes.isEmpty()) return;
                if (usedPartBuilderRecipes.indexOf(recipe.getId()) == -1) {
                    usedPartBuilderRecipes.push(recipe.getId());
                    recipes.push(recipe);
                }
            });
            let {newH, newRecipeCount} = DetailedBase.recipeDrawerBase(h, totalRecipes, displayer, recipePages, materialId, recipes, "partBuilder", book);
            h = newH;
            totalRecipes = newRecipeCount;
        });

        // Draw casting recipes
        /** @type {Internal.Map<Internal.MaterialVariantId, Internal.MaterialFluidRecipe[]>} */
        let materialCastingRecipes = Utils.newMap();
        allVariants.forEach(variant => {
            materialCastingRecipes.put(variant, MaterialCastingLookup.getCastingFluids(variant).toArray());
        });
        materialCastingRecipes.forEach((variant, recipes) => {
            let {newH, newRecipeCount} = DetailedBase.recipeDrawerBase(h, totalRecipes, displayer, recipePages, materialId, recipes, "casting", book);
            h = newH;
            totalRecipes = newRecipeCount;
        });

        // Draw composite recipes
        /** @type {number[]} */
        let drawnCompositeRecipes = [];
        allVariants.forEach(variant => {
            let recipes = MaterialCastingLookup.getCompositeFluids(variant).toArray().filter((/** @type {Internal.MaterialFluidRecipe} */ recipe) => {
                if (recipe.getFluids().isEmpty()) return false;
                let hashCode = recipe.hashCode();
                let result = drawnCompositeRecipes.indexOf(hashCode) == -1;
                if (result) drawnCompositeRecipes.push(hashCode);
                return result;
            });
            let {newH, newRecipeCount} = DetailedBase.recipeDrawerBase(h, totalRecipes, displayer, recipePages, materialId, recipes, "composite", book);
            recipes = drawnCompositeRecipes.concat(recipes);
            h = newH;
            totalRecipes = newRecipeCount;
        });

        // Draw deploying recipes
        let deployingRecipes = global.BatchMaterialRecipes.Deploying.CACHE.get(materialId);
        if (deployingRecipes != null) {
            let {newH, newRecipeCount} = DetailedBase.recipeDrawerBase(h, totalRecipes, displayer, recipePages, materialId, deployingRecipes, "deploying", book);
            h = newH;
            totalRecipes = newRecipeCount;
        }

        // Draw sequenced assembly recipes
        let sequencedAssemblyRecipes = global.BatchMaterialRecipes.SequencedAssembly.CACHE.get(materialId);
        if (sequencedAssemblyRecipes != null) {
            let {newH, newRecipeCount} = DetailedBase.recipeDrawerBase(h, totalRecipes, displayer, recipePages, materialId, sequencedAssemblyRecipes, "sequencedAssembly", book);
            h = newH;
            totalRecipes = newRecipeCount;
        }

        // Draw fluid infusing recipes
        let fluidInfusingRecipes = global.BatchMaterialRecipes.FluidInfusion.CACHE.get(materialId);
        if (fluidInfusingRecipes != null) {
            let {newH, newRecipeCount} = DetailedBase.recipeDrawerBase(h, totalRecipes, displayer, recipePages, materialId, fluidInfusingRecipes, "fluidInfusing", book);
            h = newH;
            totalRecipes = newRecipeCount;
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
     * @param {Internal.MaterialVariantId[]} defaultMaterials
     * @param {Internal.ItemObject<Internal.Item>[]} tools
     */
    drawExampleTools: (elements, materialId, defaultMaterials, tools) => {
        let x = BookScreen.PAGE_WIDTH - 16;
        tools.forEach((tool, index) => {
            let item = tool.getOrNull();
            if (item == null) return;
            let y = index * 16;

            let materialBuilder = MaterialNBT.builder();

            /** @type {Internal.List<Internal.MaterialStatsId>} */
            let requirements = ToolMaterialHook.stats(item.getToolDefinition());
            let anyUsed = false;
            requirements.forEach(part => {
                if (part.canUseMaterial(materialId)) {
                    materialBuilder["add(slimeknights.tconstruct.library.materials.definition.MaterialVariantId)"]($MaterialVariantId["tryParse(java.lang.String)"](materialId.toString()));
                    anyUsed = true;
                } else {
                    if (defaultMaterials.length == 0) materialBuilder["add(slimeknights.tconstruct.library.materials.definition.MaterialVariantId)"]($MaterialVariantId["tryParse(java.lang.String)"](materialId.toString()));
                    let index = 0;
                    while (index < defaultMaterials.length && !part.canUseMaterial(defaultMaterials[index])) {
                        index ++;
                    }
                    if (index == defaultMaterials.length) materialBuilder["add(slimeknights.tconstruct.library.materials.definition.MaterialVariantId)"]($MaterialVariantId["tryParse(java.lang.String)"](materialId.toString()));
                    else materialBuilder["add(slimeknights.tconstruct.library.materials.definition.MaterialVariantId)"](defaultMaterials[index]);
                }
            });

            let itemStack;
            if (anyUsed) itemStack = ToolStack.createTool(item, item.getToolDefinition(), materialBuilder.build()).createStack();
            else itemStack = new $ItemStack(item, 1, {tic_display: NBT.byteTag(1)});
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
    },
    
    description: (materialId, suffix, isEncyclopedia) => {
        if (!isEncyclopedia) return Component.translatable("book.kubejs.material.flavor_format", Component.translatable('material.' + materialId.toString().replace(':', '.').replace('#', '.') + '.flavor').italic()).darkGray();
        let key = 'material.' + materialId.toString().replace(':', '.').replace('#', '.') + '.' + suffix;
        let result = Component.translatable(key).darkGray();
        if (result.getString() == key) return Component.translatable('material.' + materialId.toString().replace(':', '.').replace('#', '.') + '.encyclopedia');
        return result;
    },

    /**
     * - Page builder base.
     * - 基类书页构建器。
     * - - - - -
     * @param {Internal.ArrayList<Internal.BookElement>} elements
     * @param {Internal.BookDataJS} book
     * @param {BookArguments.MaterialPageRight} pageArguments
     * @param {{
     *     tools: Internal.ItemObject<Internal.Item>[],
     *     translationSuffix: string
     * }} displayArguments
     */
    build: (elements, book, pageArguments, displayArguments) => {

        let {
            materialId,
            isEncyclopedia,
            defaultMaterials
        } = pageArguments;

        DetailedBase.drawRecipe(elements, materialId, 0, book);

        // elements.add(isEncyclopedia
        //     ? BookElement.textComponent(0, 92, BookScreen.PAGE_WIDTH - 18, BookScreen.PAGE_HEIGHT - 90,
        //         BookTextComponentData.of(DetailedBase.description(materialId, displayArguments.translationSuffix, isEncyclopedia))
        //     )
        //     : BookElement.textComponent(0, 92, BookScreen.PAGE_WIDTH - 18, BookScreen.PAGE_HEIGHT - 90,
        //         BookTextComponentData.of()
        //     )
        // );
        elements.add(BookElement.textComponent(0, 92, BookScreen.PAGE_WIDTH - 18, BookScreen.PAGE_HEIGHT - 90,
            BookTextComponentData.of(DetailedBase.description(materialId, displayArguments.translationSuffix, isEncyclopedia))
        ));

        let parsedDefaultMaterials = new Array(defaultMaterials.length);
        defaultMaterials.forEach((m, i) => {
            parsedDefaultMaterials[i] = $MaterialVariantId["tryParse(java.lang.String)"](m.toString());
        });

        DetailedBase.drawExampleTools(elements, materialId, parsedDefaultMaterials, displayArguments.tools);
    }

};