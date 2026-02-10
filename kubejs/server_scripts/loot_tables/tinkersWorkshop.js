// priority: -1000

/**
 * @fileoverview Tinker's Workshop | 工匠作坊
 * @author Pelemenguin
 */

/* global
    global: writable
    LootJS
*/

LootJS.modifiers(event => {
    event.addLootTableModifier("kubejs:tinkers_workshop")
        .pool(pool => {
            pool.addWeightedLoot([
                global.Artifacts.getRecursiveArtifact("chest.tinkers_workshop.classic_pickaxe").createLootEntry(1).withWeight(2),
                global.Artifacts.getRecursiveArtifact("chest.tinkers_workshop.non_classic_pickaxe").createLootEntry(1).withWeight(1)
            ]);
        });
});
