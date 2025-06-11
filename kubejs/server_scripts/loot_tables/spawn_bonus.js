import { StartupPickaxe } from "../artifacts/startup/pickaxe"

LootJS.modifiers(event => {
    event.addLootTableModifier("minecraft:chests/spawn_bonus_chest")
        .removeLoot(/.*/)
        // .addLoot(LootEntry.of("tconstruct:pickaxe", 1))
        .addLoot(LootEntry.of(StartupPickaxe, 1))
})