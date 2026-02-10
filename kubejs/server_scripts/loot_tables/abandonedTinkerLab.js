// priority: -1000

/**
 * @fileoverview Tinker's Workshop | 工匠作坊
 * @author Pelemenguin
 */

/* global
    global: writable
    LootJS
    TinkerToolParts
*/

LootJS.modifiers(event => {
    event.addLootTableModifier("kubejs:chests/abandoned_tinker_lab/dps_test")
        .pool(pool => {
            pool.rolls({min: 3, max: 6});
            let entries = [];
            global.Artifacts.getRecursiveArtifactGroup("chest.abandoned_tinker_lab.dps_test").children.forEach((_key, artifact) => {
                if (artifact.isGroup()) {
                    return;
                }
                entries.push(artifact.createLootEntry(1).withWeight(1));
            });
            pool.addWeightedLoot(1, false, entries);
        })
        .pool(global.LootFunctions.addRandomToolPartPool({
            "tconstruct:wood#oak": 1,
            "tconstruct:wood#birch": 1,
            "tconstruct:wood#cherry": 1,
            "tconstruct:rock#stone": 2,
            "tconstruct:rock#diorite": 2,
            "tconstruct:copper#oxidized": 1,
        }, [
            TinkerToolParts.smallBlade.getOrNull(),
            TinkerToolParts.toolHandle.getOrNull(),
        ], 3, undefined))
    ;
});

LootJS.modifiers(event => {
    event.addLootTableModifier("kubejs:chests/abandoned_tinker_lab/electromagnetics")
        .pool(global.LootFunctions.addRandomToolPartPool({
            "tconstruct:copper#oxidized": 4,
            "tconstruct:iron#oxidized": 1,
            "kubejs:scrapped_tinker_metal": 2
        }, [
            global.BatchMaterialRecipes.KnownStats.HANDLE,
            global.BatchMaterialRecipes.KnownStats.BINDING,
        ], {min: 2, max: 5, type: "uniform"}, undefined));
});

LootJS.modifiers(event => {
    event.addLootTableModifier("kubejs:chests/abandoned_tinker_lab/animation")
        .pool(global.LootFunctions.addRandomToolPartPool({
            "kubejs:scrapped_tinker_metal": 1
        }, [
            global.BatchMaterialRecipes.KnownStats.HEAD,
            global.BatchMaterialRecipes.KnownStats.HANDLE,
            global.BatchMaterialRecipes.KnownStats.BINDING,
            global.BatchMaterialRecipes.KnownStats.REPAIR_KIT,
        ], {min: 0, max: 2, type: "uniform"}, undefined))
        .pool(global.LootFunctions.addRandomToolPartPool({
            "kubejs:animated_tinker_metal": 1
        }, [
            global.BatchMaterialRecipes.KnownStats.HEAD,
            global.BatchMaterialRecipes.KnownStats.REPAIR_KIT,
        ], {min: 0, max: 2, type: "uniform"}, undefined));
});
