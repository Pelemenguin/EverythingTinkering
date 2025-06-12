//priority: -100

import { StartupPickaxe } from "../artifacts/startup/pickaxe"
import { StartupHandAxe } from "../artifacts/startup/hand_axe"
import { StartupSword } from "../artifacts/startup/sword"

LootJS.modifiers(event => {
    ToolStack.ensureInitialized(StartupPickaxe)
    ToolStack.ensureInitialized(StartupHandAxe)
    ToolStack.ensureInitialized(StartupSword)
    event.addLootTableModifier("minecraft:chests/spawn_bonus_chest")
        .removeLoot(/.*/)
        .addLoot(LootEntry.of(StartupPickaxe, 1))
        .addLoot(LootEntry.of(StartupHandAxe, 1))
        .addLoot(LootEntry.of(StartupSword, 1))
        .addLoot(LootEntry.of("tconstruct:crafting_station", 1))
        .addLoot(LootEntry.of(Item.of('tconstruct:part_builder', '{texture:"minecraft:oak_planks"}'), 1))
        .addLoot(LootEntry.of(Item.of('tconstruct:tinker_station', '{texture:"minecraft:oak_planks"}'), 1))
        .pool(pool => {
            pool.rolls({"min": 3, "max": 5})
            pool.addLoot(LootEntry.of("tconstruct:pattern", 3))
        })
        .pool(pool => {
            pool.rolls(5)
                .addWeightedLoot([
                LootEntry.of("minecraft:apple", 1).withWeight(77),
                LootEntry.of("create:honeyed_apple", 1).withWeight(22),
                LootEntry.of("tconstruct:jeweled_apple", 1).withWeight(1)
            ])
        })
})