// priority: 10000

/**
 * @fileoverview Part Builder recipes lookup | 部件制造台配方查找
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
    Utils
    MaterialRecipeCache
*/

let initialized = false;

/**
 * @type {Internal.Map<Internal.MaterialId, Internal.Map<Internal.MaterialVariantId, Internal.MaterialRecipe[]>>}
 */
let materialRecipesCache = Utils.newMap();

/**
 * 
 * @param {Internal.RegistryAccess} access 
 */
let initialize = () => {
    /** @type {Internal.Collection<Internal.MaterialRecipe>} */
    let recipes = MaterialRecipeCache.getAllRecipes();

    recipes.forEach(recipe => {
        let materialVariant = recipe.getMaterial().getVariant();
        let materialId = materialVariant.getId();
        if (materialRecipesCache.containsKey(materialId)) {
            // partBuilderRecipesCache.get(materialVariant).push({
            //     input: recipe.getIngredient().itemStacks,
            //     count: realValue
            // });
            let materialEntry = materialRecipesCache.get(materialId);
            if (materialEntry.containsKey(materialVariant)) {
                materialEntry.get(materialVariant).push(recipe);
            } else {
                materialEntry.put(materialVariant, [recipe]);
            }
        } else {
            /** @type {Internal.Map<Internal.MaterialVariantId, Internal.MaterialRecipe[]>} */
            let newEntry = Utils.newMap();
            // partBuilderRecipesCache.put(materialVariant, [{
            //     input: recipe.getIngredient().itemStacks,
            //     count: realValue
            // }]);
            newEntry.put(materialVariant, [recipe]);
            materialRecipesCache.put(materialId, newEntry);
        }
    });

    if (!materialRecipesCache.isEmpty()) initialized = true;
};

let ensureInitialized = () => {
    if (!initialized) {
        initialize();
    }
};


// initialize(Client.level.registryAccess());
// console.info(materialRecipesCache);

// eslint-disable-next-line no-unused-vars
const MaterialRecipesHelper = {
    /**
     * - Get the recipe map from material variants to recipes.
     * - 获取从材料变种到配方的表。
     * - - - - -
     * @param {Internal.MaterialId} material
     * - - - - -
     * @returns {Internal.Map<Internal.MaterialVariantId, Internal.MaterialRecipe[]> | null}
     */
    getPartBuilderRecipeOf: (material) => {
        ensureInitialized();
        let result = materialRecipesCache.getOrDefault(material, null);
        return result;
    },
    
    reset: () => {
        initialized = false;
    }
};