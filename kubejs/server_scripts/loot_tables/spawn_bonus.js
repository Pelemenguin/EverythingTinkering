// priority: -1000

/**
 * @fileoverview Spawn bonus chest | 初始奖励箱
 * - - - - -
 * ## Spawn bonus chest
 * ### Contains
 * - Artifact group `startup`
 * - Patterns
 * - Apples
 * - Honeyed Apples
 * - Jeweled Apples
 * - - - - -
 * ## 初始奖励箱
 * ### 包含
 * - Artifact 组 `初始`
 * - 模板
 * - 苹果
 * - 密渍苹果
 * - 宝钻苹果
 * @author Pelemenguin
 * @license CC-BY-NC-SA-4.0
 */

/* global
    global
    LootJS
    LootEntry
    Item
*/

/** */
let STARTUP_PICKAXE = global.Artifacts.get("startup").get("pickaxe").createStack();
let STARTUP_HAND_AXE = global.Artifacts.get("startup").get("hand_axe").createStack();
let STARTUP_SWORD = global.Artifacts.get("startup").get("sword").createStack();

LootJS.modifiers(event => {
    // ToolStack.ensureInitialized(StartupPickaxe)
    // ToolStack.ensureInitialized(StartupHandAxe)
    // ToolStack.ensureInitialized(StartupSword)
    event.addLootTableModifier("minecraft:chests/spawn_bonus_chest")
        .removeLoot(/.*/)
        .addLoot(LootEntry.of(STARTUP_PICKAXE, 1))
        .addLoot(LootEntry.of(STARTUP_HAND_AXE, 1))
        .addLoot(LootEntry.of(STARTUP_SWORD, 1))
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