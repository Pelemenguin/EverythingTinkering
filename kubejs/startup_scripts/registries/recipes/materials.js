// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Material Recipes | 材料配方
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
    BatchMaterialRecipes
    $MaterialVariantId
    IngredientHelper
    StartupEvents
*/

/**
 * Run at post initialization for those client-only users.
 * Then once again at recipe registration for those dedicated server users.
 */
global.DeferredTasks.MaterialRecipesRegister = (() => {

    BatchMaterialRecipes.resetAllRecipes();

    BatchMaterialRecipes.Deploying.register("kubejs:tinkering/materials/steel_clad_copper/deploying",
        $MaterialVariantId.parse("tconstruct:copper"),
        $MaterialVariantId.parse("kubejs:steel_clad_copper"),
        IngredientHelper.tag("forge:plates/iron"),
        BatchMaterialRecipes.KnownStatGroups.FULL_MATERIAL
    );

    BatchMaterialRecipes.SequencedAssembly.register("kubejs:tinkering/material/mainspring/sequenced_assembly",
        $MaterialVariantId.parse("kubejs:andesite_alloy"),
        $MaterialVariantId.parse("kubejs:mainspring"),
        $MaterialVariantId.parse("kubejs:incomplete_mainspring"),
        (event, transitionalItem, _part) => [
            event.getRecipes().create.cutting(
                [transitionalItem],
                [transitionalItem]
            ),
            event.getRecipes().create.deploying(
                [transitionalItem],
                [transitionalItem, IngredientHelper.tag("forge:plates/gold")]
            ),
            event.getRecipes().create.cutting(
                [transitionalItem],
                [transitionalItem]
            ),
            event.getRecipes().create.deploying(
                [transitionalItem],
                [transitionalItem, IngredientHelper.tag("forge:glass_panes")]
            )
        ],
        1,
        (utils) => {
            utils.cutting();
            utils.deployingIngredient(IngredientHelper.tag("forge:plates/gold"));
            utils.cutting();
            utils.deployingIngredient(IngredientHelper.tag("forge:glass_panes"));
        },
        [
            BatchMaterialRecipes.KnownStats.HEAD,
            BatchMaterialRecipes.KnownStats.REPAIR_KIT
        ]
    );

    BatchMaterialRecipes.FluidInfusion.register(
        "kubejs:tinkering/materials/test/fluid_infusion",
        $MaterialVariantId.parse("kubejs:scrapped_tinker_metal"),
        $MaterialVariantId.parse("kubejs:animated_tinker_metal"),
        [
            global.Fluids.ANIMATION_FLUID.getStill(),
            global.Fluids.ANIMATION_FLUID.getStill(),
            global.Fluids.ANIMATION_FLUID.getStill(),
            global.Fluids.ANIMATION_FLUID.getStill()
        ],
        [
            BatchMaterialRecipes.KnownStats.HEAD,
            BatchMaterialRecipes.KnownStats.REPAIR_KIT
        ]
    );

});

StartupEvents.postInit(global.DeferredTasks.MaterialRecipesRegister);
