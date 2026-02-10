// priority: -1000

/**
 * @fileoverview Spawn bonus chest | 初始奖励箱
 * @author Pelemenguin
 */

/* global
    global
    LootJS
    LootEntry
    Item
*/

/** @type {Artifact} */ let STARTUP_PICKAXE = global.Artifacts.get("chest").get("startup").get("pickaxe");
/** @type {Artifact} */ let STARTUP_HAND_AXE = global.Artifacts.get("chest").get("startup").get("hand_axe");
/** @type {Artifact} */ let STARTUP_SWORD = global.Artifacts.get("chest").get("startup").get("sword");

LootJS.modifiers(event => {
    // ToolStack.ensureInitialized(StartupPickaxe)
    // ToolStack.ensureInitialized(StartupHandAxe)
    // ToolStack.ensureInitialized(StartupSword)
    event.addLootTableModifier("minecraft:chests/spawn_bonus_chest")
        .removeLoot(/.*/)
        .addLoot(STARTUP_PICKAXE.createLootEntry(1))
        .addLoot(STARTUP_HAND_AXE.createLootEntry(1))
        .addLoot(STARTUP_SWORD.createLootEntry(1))
        .addLoot(LootEntry.of("tconstruct:crafting_station", 1))
        .addLoot(LootEntry.of(Item.of('tconstruct:part_builder', '{texture:"minecraft:oak_planks"}'), 1))
        .addLoot(LootEntry.of(Item.of('tconstruct:tinker_station', '{texture:"minecraft:oak_planks"}'), 1))
        .pool(pool => {
            pool.rolls({"min": 3, "max": 5});
            pool.addLoot(LootEntry.of("tconstruct:pattern", 3));
        })
        .pool(pool => {
            pool.rolls(5)
                .addWeightedLoot([
                LootEntry.of("minecraft:apple", 1).withWeight(77),
                LootEntry.of("create:honeyed_apple", 1).withWeight(22),
                LootEntry.of("tconstruct:jeweled_apple", 1).withWeight(1)
            ]);
        });
});