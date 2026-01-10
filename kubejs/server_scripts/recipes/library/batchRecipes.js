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
    console
    InputItem
    OutputItem
    ToolPartItem
    $HashSet
    $MaterialStatsId
    Utils
    Ingredient
 */

const BatchMaterialRecipes = {};

/**
 * Stores some predefined `MaterialStatsId`s for materials.  
 * 材料的已知属性类型。
 */
BatchMaterialRecipes.KnownStats = {
    REPAIR_KIT: $MaterialStatsId.tryParse("tconstruct:repair_kit"),

    HEAD: $MaterialStatsId.tryParse("tconstruct:head"),
    HANDLE: $MaterialStatsId.tryParse("tconstruct:handle"),
    BINDING: $MaterialStatsId.tryParse("tconstruct:binding"),

    LIMB: $MaterialStatsId.tryParse("tconstruct:limb"),
    GRIP: $MaterialStatsId.tryParse("tconstruct:grip"),
    BOWSTRING: $MaterialStatsId.tryParse("tconstruct:bowstring"),

    PLATING_HELMET: $MaterialStatsId.tryParse("tconstruct:plating_helmet"),
    PLATING_CHESTPLATE: $MaterialStatsId.tryParse("tconstruct:plating_chestplate"),
    PLATING_LEGGINGS: $MaterialStatsId.tryParse("tconstruct:plating_leggings"),
    PLATING_BOOTS: $MaterialStatsId.tryParse("tconstruct:plating_boots"),
    PLATING_SHIELD: $MaterialStatsId.tryParse("tconstruct:plating_shield"),
    MAILLE: $MaterialStatsId.tryParse("tconstruct:maille"),
    SHIELD_CORE: $MaterialStatsId.tryParse("tconstruct:shield_core")
};

/**
 * Groups of known stats.  
 * 已知属性类型的分组。
 */
BatchMaterialRecipes.KnownStatGroups = {
    TOOL: [
        BatchMaterialRecipes.KnownStats.HEAD,
        BatchMaterialRecipes.KnownStats.HANDLE,
        BatchMaterialRecipes.KnownStats.BINDING
    ],
    BOW: [
        BatchMaterialRecipes.KnownStats.LIMB,
        BatchMaterialRecipes.KnownStats.GRIP
    ],
    ARMOR: [
        BatchMaterialRecipes.KnownStats.PLATING_HELMET,
        BatchMaterialRecipes.KnownStats.PLATING_CHESTPLATE,
        BatchMaterialRecipes.KnownStats.PLATING_LEGGINGS,
        BatchMaterialRecipes.KnownStats.PLATING_BOOTS,
        BatchMaterialRecipes.KnownStats.PLATING_SHIELD,
        BatchMaterialRecipes.KnownStats.MAILLE
    ],
    /**
     * All stats for some common materials (iron, copper for example).  
     * 适用于某些常见材料（例如铁、铜）的所有属性类型。
     * - - - - -
     * @type {Internal.MaterialStatsId[]}
     */
    FULL_MATERIAL: []
};

BatchMaterialRecipes.KnownStatGroups.FULL_MATERIAL = [BatchMaterialRecipes.KnownStats.REPAIR_KIT]
    .concat(BatchMaterialRecipes.KnownStatGroups.TOOL)
    .concat(BatchMaterialRecipes.KnownStatGroups.BOW)
    .concat(BatchMaterialRecipes.KnownStatGroups.ARMOR);

/**
 * Batch Deploying recipes.  
 * 批量机械手使用配方。
 * - - - - -
 * @typedef {{
 *     inputMaterial: Internal.MaterialVariantId,
 *     outputMaterial: Internal.MaterialVariantId,
 *     usingItem: Internal.Ingredient,
 *     partStatTypes: Internal.Set<Internal.MaterialStatsId>
 * }} Annotation.BatchRecipes.Deploying
 */
BatchMaterialRecipes.Deploying = {
    /**
     * @type {{[recipeId: string]: Annotation.BatchRecipes.Deploying}}
     */
    ALL: {},
    /**
     * Cache for already created recipes.
     * Mapping from material ids to deploying batch recipes.
     * Used for recipe display in books.  
     * 机械手使用配方的缓存。
     * 将材料ID映射到机械手使用批量配方。
     * 用于书籍中的配方显示。
     * - - - - -
     * @type {Internal.Map<Internal.MaterialId, Annotation.BatchRecipes.Deploying[]>}
     */
    CACHE: Utils.newMap(),
    /**
     * 
     * @param {string} recipeId 
     * @param {Internal.MaterialVariantId} inputMaterial 
     * @param {Internal.MaterialVariantId} outputMaterial 
     * @param {Internal.Ingredient_} usingItem 
     * @param {Internal.MaterialStatsId[]} partStatTypes
     */
    register: (recipeId, inputMaterial, outputMaterial, usingItem, partStatTypes) => {

        let statTypeSet = new $HashSet();
        for (let statType of partStatTypes) {
            statTypeSet.add(statType);
        }

        let recipe = {
            inputMaterial: inputMaterial,
            outputMaterial: outputMaterial,
            usingItem: Ingredient.of(usingItem),
            partStatTypes: statTypeSet
        };

        BatchMaterialRecipes.Deploying.ALL[recipeId] = recipe;

        // Cache for book display
        let materialId = outputMaterial.getId();
        if (!BatchMaterialRecipes.Deploying.CACHE.containsKey(materialId)) {
            BatchMaterialRecipes.Deploying.CACHE.put(materialId, []);
        }
        BatchMaterialRecipes.Deploying.CACHE.get(materialId).push(recipe);
    }
};

ServerEvents.recipes(event => {

    console.info(`Registering batch material recipes...`);
    console.info(`Available tool parts: ${global.CustomUtils.Tinker.TOOL_PARTS.map(part => part.getId()).join(", ")}`);
    
    const REPAIR_KIT_STAT_ID = $MaterialStatsId.tryParse("tconstruct:repair_kit");

    // Deploying
    for (let recipeId in BatchMaterialRecipes.Deploying.ALL) {
        let entry = BatchMaterialRecipes.Deploying.ALL[recipeId];
        console.info(`Registering deploying batch recipe: ${recipeId} (${entry.inputMaterial} + ${entry.usingItem} -> ${entry.outputMaterial})`);
        for (let part of global.CustomUtils.Tinker.TOOL_PARTS) {
            if (!(part instanceof ToolPartItem)) {
                if (!entry.partStatTypes.contains(REPAIR_KIT_STAT_ID)) {
                    console.info(`Skipping ${part.getId()} as for stat type tconstruct:repair_kit`);
                    continue;
                }
            } else {
                if (!entry.partStatTypes.contains(part.getStatType())) {
                    console.info(`Skipping ${part.getId()} for stat type ${part.getStatType()}`);
                    continue;
                }
            }

            let inputPart = InputItem.of($MaterialIngredient["of(net.minecraft.world.level.ItemLike,slimeknights.tconstruct.library.materials.definition.MaterialVariantId)"](part, entry.inputMaterial), 1);

            let recipe = event.getRecipes().create.deploying(
                [OutputItem.of(part.withMaterialForDisplay(entry.outputMaterial))],
                [inputPart, InputItem.of(entry.usingItem, 1)]
            ).id(recipeId.toString() + "/" + part.getId().replace(":", "/"));

            console.info(recipe.readOutputItem(recipe));
        }
    }

});

global.BatchMaterialRecipes = BatchMaterialRecipes;
