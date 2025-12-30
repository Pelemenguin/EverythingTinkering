// priority: 32767

// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Batch Recipe Registration | 批量配方注册
 * - - - - -
 * @copyright Pelemenguin 2025
 * @license LGPL-3.0-or-later
 * This file is part of EverythingTinkering.
 * Full license see file `COPYING.LESSER`
 * - - - - -
 * @author Pelemenguin
 */

/* global
    global: writable
    ServerEvents
    $MaterialIngredient
 */

const BatchMaterialRecipes = {};

/**
 * Batch Deploying recipes.  
 * 批量机械手使用配方。
 * - - - - -
 * @typedef {{
 *     inputMaterial: Internal.MaterialVariantId,
 *     outputMaterial: Internal.MaterialVariantId,
 *     usingItem: Internal.Ingredient_
 * }} Annotation.BatchRecipes.Deploying
 */
BatchMaterialRecipes.Deploying = {
    /**
     * @type {{[recipeId: string]: Annotation.BatchRecipes.Deploying}}
     */
    ALL: {},
    /**
     * 
     * @param {string} recipeId 
     * @param {Internal.MaterialVariantId} inputMaterial 
     * @param {Internal.MaterialVariantId} outputMaterial 
     * @param {Internal.Ingredient_} usingItem 
     */
    register: (recipeId, inputMaterial, outputMaterial, usingItem) => {
        BatchMaterialRecipes.Deploying.ALL[recipeId] = {
            inputMaterial: inputMaterial,
            outputMaterial: outputMaterial,
            usingItem: usingItem
        };
    }
};

ServerEvents.recipes(event => {
    // event.getRecipes().create.deploying(
    //     [TinkerToolParts.largePlate.getOrNull().withMaterial($MaterialVariantId.parse("kubejs:andesite_alloy"))],
    //     [$MaterialIngredient["of(net.minecraft.world.level.ItemLike,slimeknights.tconstruct.library.materials.definition.MaterialVariantId)"]("tconstruct:large_plate", $MaterialVariantId.parse("tconstruct:rock")), Items.IRON_NUGGET.asIngredient()]
    // );

    for (let recipeId in BatchMaterialRecipes.Deploying.ALL) {
        let entry = BatchMaterialRecipes.Deploying.ALL[recipeId];
        for (let part of global.CustomUtils.Tinker.TOOL_PARTS) {
            event.getRecipes().create.deploying(
                [part.withMaterial(entry.outputMaterial)],
                [$MaterialIngredient["of(net.minecraft.world.level.ItemLike,slimeknights.tconstruct.library.materials.definition.MaterialVariantId)"](part, entry.inputMaterial), entry.usingItem]
            ).id(recipeId.toString() + "/" + part.getId().replace(":", "/"));
        }
    }
});
