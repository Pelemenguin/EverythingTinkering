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
    $MaterialStatsId
 */

ServerEvents.recipes(event => {

    const BatchMaterialRecipes = global.BatchMaterialRecipes;

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

            event.getRecipes().create.deploying(
                [OutputItem.of(part.withMaterialForDisplay(entry.outputMaterial))],
                [inputPart, InputItem.of(entry.usingItem, 1)]
            ).id(recipeId.toString() + "/" + part.getId().replace(":", "/"));
        }
    }

    // Sequenced Assembly
    for (let recipeId in BatchMaterialRecipes.SequencedAssembly.ALL) {
        let entry = BatchMaterialRecipes.SequencedAssembly.ALL[recipeId];
        console.info(`Registering sequenced assembly batch recipe: ${recipeId} (${entry.inputMaterial} -> ${entry.outputMaterial})`);
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
            let transitionalItem = part.withMaterialForDisplay(entry.transitionalMaterial);

            event.getRecipes().create.sequenced_assembly(
                [OutputItem.of(part.withMaterialForDisplay(entry.outputMaterial))],
                inputPart,
                entry.sequence(event, transitionalItem, part),
                part.withMaterialForDisplay(entry.transitionalMaterial),
                entry.loops
            ).id(recipeId.toString() + "/" + part.getId().replace(":", "/"));
        }
    }

});
