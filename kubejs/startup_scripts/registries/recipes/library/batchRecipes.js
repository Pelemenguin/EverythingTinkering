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

/**
 * Batch Sequenced Assembly recipes.  
 * 批量机械手使用配方。
 * - - - - -
 * @typedef {{
 *     inputMaterial: Internal.MaterialVariantId,
 *     outputMaterial: Internal.MaterialVariantId,
 *     partStatTypes: Internal.Set<Internal.MaterialStatsId>,
 *     sequence: (event: Internal.RecipesEventJS, transitionalItem: Internal.Ingredient, part: Internal.ToolPartItem | Internal.RepairKitItem) => Internal.RecipeJS[],
 *     loops: number,
 *     transitionalMaterial: Internal.MaterialVariantId,
 *     displayRecipes: (utils: {
 *         cutting: () => void,
 *         deployingIngredient: (ingredient: Internal.Ingredient) => void,
 *         deployingMaterial: (material: Internal.MaterialVariantId) => void,
 *     }) => void,
 * }} Annotation.BatchRecipes.SequencedAssembly
 */
BatchMaterialRecipes.SequencedAssembly = {
    /**
     * @type {{[recipeId: string]: Annotation.BatchRecipes.SequencedAssembly}}
     */
    ALL: {},
    /**
     * Cache for already created recipes.
     * Mapping from material ids to sequenced assembly batch recipes.
     * Used for recipe display in books.  
     * 机械手使用配方的缓存。
     * 将材料ID映射到机械手使用批量配方。
     * 用于书籍中的配方显示。
     * - - - - -
     * @type {Internal.Map<Internal.MaterialId, Annotation.BatchRecipes.SequencedAssembly[]>}
     */
    CACHE: Utils.newMap(),
    /**
     * @param {string} recipeId 
     * @param {Internal.MaterialVariantId} inputMaterial 
     * @param {Internal.MaterialVariantId} outputMaterial 
     * @param {Internal.MaterialVariantId} transitionalMaterial 
     * @param {(event: Internal.RecipesEventJS, transitionalItem: Internal.ItemStack, part: Internal.ToolPartItem | Internal.RepairKitItem) => Internal.RecipeJS[]} sequence 
     * @param {number} loops 
     * @param {Annotation.BatchRecipes.SequencedAssembly["displayRecipes"]} displayRecipes 
     * @param {Internal.MaterialStatsId[]} partStatTypes 
     */
    register: (recipeId, inputMaterial, outputMaterial, transitionalMaterial, sequence, loops, displayRecipes, partStatTypes) => {
        let statTypeSet = new $HashSet();
        for (let statType of partStatTypes) {
            statTypeSet.add(statType);
        }

        let recipe = {
            inputMaterial: inputMaterial,
            outputMaterial: outputMaterial,
            partStatTypes: statTypeSet,
            sequence: sequence,
            loops: loops,
            transitionalMaterial: transitionalMaterial,
            displayRecipes: displayRecipes
        };

        BatchMaterialRecipes.SequencedAssembly.ALL[recipeId] = recipe;

        // Cache for book display
        let materialId = outputMaterial.getId();
        if (!BatchMaterialRecipes.SequencedAssembly.CACHE.containsKey(materialId)) {
            BatchMaterialRecipes.SequencedAssembly.CACHE.put(materialId, []);
        }
        BatchMaterialRecipes.SequencedAssembly.CACHE.get(materialId).push(recipe);
    }
};

/**
 * Batch fluid infusion recipe.  
 * 批量流体注入配方。
 */
BatchMaterialRecipes.FluidInfusion = {
    /**
     * @type {Internal.Map<Internal.MaterialId, Annotation.BatchRecipes.FluidInfusion.Material[]>}
     */
    CACHE: Utils.newMap(),
    /**
     * @param {string} recipeId 
     * @param {Internal.MaterialVariantId} inputMaterial 
     * @param {Internal.MaterialVariantId} outputMaterial 
     * @param {Internal.Fluid[]} fluidList 
     * @param {Internal.MaterialStatsId[]} partStatTypes 
     */
    register: (recipeId, inputMaterial, outputMaterial, fluidList, partStatTypes) => {
        let statTypeSet = new $HashSet();
        for (let statType of partStatTypes) {
            statTypeSet.add(statType);
        }

        let recipe = {
            inputMaterial: inputMaterial,
            inputFluids: fluidList,
            outputMaterial: outputMaterial,
            statTypes: statTypeSet,
            recipeId: recipeId
        };

        let recipeCache = global.BlockFunctions.FluidInfusionCore.MATERIAL_RECIPES;

        if (recipeCache.containsKey(recipe.inputMaterial)) {
            recipeCache.get(recipe.inputMaterial).put(recipe.inputFluids, recipe);
        } else {
            let innerMap = Utils.newMap();
            innerMap.put(recipe.inputFluids, recipe);
            recipeCache.put(recipe.inputMaterial, innerMap);
        }

        // Cache for book display
        let materialId = outputMaterial.getId();
        if (!BatchMaterialRecipes.FluidInfusion.CACHE.containsKey(materialId)) {
            BatchMaterialRecipes.FluidInfusion.CACHE.put(materialId, [recipe]);
        } else {
            BatchMaterialRecipes.FluidInfusion.CACHE.get(materialId).push(recipe);
        }
    },
    /**
     * @param {string} recipeId 
     * @param {Internal.Ingredient} ingredient 
     * @param {Internal.Fluid[]} ingredient 
     * @param {Internal.ItemStack} output 
     */
    registerSingle: (recipeId, ingredient, fluids, output) => {
        /** @type {Annotation.BatchRecipes.FluidInfusion.Item} */
        let recipe = {
            inputItem: ingredient,
            outputItem: output,
            inputFluids: fluids,
            recipeId: recipeId
        };

        let recipeCache = global.BlockFunctions.FluidInfusionCore.RECIPES;
        if (recipeCache.containsKey(recipe.inputItem)) {
            recipeCache.get(recipe.inputItem).put(recipe.inputFluids, recipe);
        } else {
            let innerMap = Utils.newMap();
            innerMap.put(recipe.inputFluids, recipe);
            recipeCache.put(recipe.inputItem, innerMap);
        }
    }
};

/**
 * Resets all the batch recipes.  
 * 重置所有批量配方。
 */
BatchMaterialRecipes.resetAllRecipes = () => {

    // Deploying
    BatchMaterialRecipes.Deploying.ALL = {};
    BatchMaterialRecipes.Deploying.CACHE.clear();

    // Sequenced Assembly
    BatchMaterialRecipes.SequencedAssembly.ALL = {};
    BatchMaterialRecipes.SequencedAssembly.CACHE.clear();

    // Fluid Infusion
    global.BlockFunctions.FluidInfusionCore.MATERIAL_RECIPES.clear();
    global.BlockFunctions.FluidInfusionCore.RECIPES.clear();

};

global.BatchMaterialRecipes = BatchMaterialRecipes;
