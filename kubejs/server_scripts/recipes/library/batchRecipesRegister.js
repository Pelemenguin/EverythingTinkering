// priority: 32767

/**
 * @fileoverview Batch Recipe Registration | 批量配方注册
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
    $RepairKitItem
    $FakeIngotItem
 */

ServerEvents.recipes(event => {

    const BatchMaterialRecipes = global.BatchMaterialRecipes;

    global.DeferredTasks.MaterialRecipesRegister.Task();

    console.info(`Registering batch material recipes...`);
    console.info(`Available tool parts: ${global.TOOL_PARTS.map(part => part.getId()).join(", ")}`);
    
    const REPAIR_KIT_STAT_ID = $MaterialStatsId.tryParse("tconstruct:repair_kit");
    const FAKE_INGOT_STAT_ID = $MaterialStatsId.tryParse("tconstruct:ingot");

    // Deploying
    for (let recipeId in BatchMaterialRecipes.Deploying.ALL) {
        let entry = BatchMaterialRecipes.Deploying.ALL[recipeId];
        console.info(`Registering deploying batch recipe: ${recipeId} (${entry.inputMaterial} + ${entry.usingItem} -> ${entry.outputMaterial})`);
        for (let part of global.TOOL_PARTS) {
            if (part instanceof $RepairKitItem) {
                if (part instanceof $FakeIngotItem) {
                    if (!entry.partStatTypes.contains(FAKE_INGOT_STAT_ID)) {
                        console.info(`Skipping ${part.getId()} as for stat type tconstruct:ingot`);
                        continue;
                    }
                }
                if (!entry.partStatTypes.contains(REPAIR_KIT_STAT_ID)) {
                    console.info(`Skipping ${part.getId()} as for stat type tconstruct:repair_kit`);
                    continue;
                }
            } else if (part instanceof ToolPartItem) {
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
        for (let part of global.TOOL_PARTS) {
            if (part instanceof $RepairKitItem) {
                if (part instanceof $FakeIngotItem) {
                    if (!entry.partStatTypes.contains(FAKE_INGOT_STAT_ID)) {
                        console.info(`Skipping ${part.getId()} as for stat type tconstruct:ingot`);
                        continue;
                    }
                }
                if (!entry.partStatTypes.contains(REPAIR_KIT_STAT_ID)) {
                    console.info(`Skipping ${part.getId()} as for stat type tconstruct:repair_kit`);
                    continue;
                }
            } else if (part instanceof ToolPartItem) {
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
