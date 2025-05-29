const GLASS_TYPE_TO_PARTICLE = {
    "tconstruct:glass": "minecraft:glass",
    "tconstruct:glass#white_stained": "minecraft:white_stained_glass",
    "tconstruct:glass#orange_stained": "minecraft:orange_stained_glass",
    "tconstruct:glass#magenta_stained": "minecraft:magenta_stained_glass",
    "tconstruct:glass#light_blue_stained": "minecraft:light_blue_stained_glass",
    "tconstruct:glass#yellow_stained": "minecraft:yellow_stained_glass",
    "tconstruct:glass#lime_stained": "minecraft:lime_stained_glass",
    "tconstruct:glass#pink_stained": "minecraft:pink_stained_glass",
    "tconstruct:glass#gray_stained": "minecraft:gray_stained_glass",
    "tconstruct:glass#light_gray_stained": "minecraft:light_gray_stained_glass",
    "tconstruct:glass#cyan_stained": "minecraft:cyan_stained_glass",
    "tconstruct:glass#purple_stained": "minecraft:purple_stained_glass",
    "tconstruct:glass#blue_stained": "minecraft:blue_stained_glass",
    "tconstruct:glass#brown_stained": "minecraft:brown_stained_glass",
    "tconstruct:glass#green_stained": "minecraft:green_stained_glass",
    "tconstruct:glass#red_stained": "minecraft:red_stained_glass",
    "tconstruct:glass#black_stained": "minecraft:black_stained_glass",
    "tconstruct:glass#seared": "tconstruct:seared_glass",
    "tconstruct:glass#scorched": "tconstruct:scorched_glass"
}

/**
 * 
 * @param {Internal.LivingEntityHurtEventJS} event 
 * @param {Internal.ItemStack} item 
 * @param {int} level 
 */

function glass_shard(event, item, level) {
    let if_repeated = event.entity.nbt.get("ForgeData").get("GlassShardTemporaryData")
    if (if_repeated == null) {
        let damage = event.damage
        let source = event.source
        let chance = (damage - 5.0) * 0.2 * level
        if (JavaMath.random() < chance) {
            if (!event.source.player.creative) {
                item.damageValue += JavaMath.round(damage)
            }
            let target_x = event.entity.x
            let target_y = event.entity.y
            let target_z = event.entity.z
            let box = AABB.of(target_x-1, target_y-1, target_z-1, target_x+1, target_y+1, target_z+1)
            let raw_entity_list = event.level.getEntitiesWithin(box)
            let entity_list = []
            raw_entity_list.forEach(entity => {
                if (entity.attackable) {
                    entity.mergeNbt(NBT.toTagCompound({"ForgeData":{"GlassShardTemporaryData":{}}}))
                    entity_list.push(entity)
                }
            })
            let damage_per_entity = event.damage / entity_list.length
            entity_list.forEach(entity => {
                entity.attack(event.source, damage_per_entity)
            })
            entity_list.forEach(entity => {
                let new_forge_data = entity.nbt.get("ForgeData")
                new_forge_data.remove("GlassShardTemporaryData")
                // console.info("Removed "+entity)
                entity.mergeNbt(NBT.toTagCompound({"ForgeData":new_forge_data}))
            })
            let sound_pitch = 1 - (event.damage - 5.0) * 0.2
            item.nbt.get("tic_materials").forEach(material => {
                let material_name = material.asString
                if (material_name in GLASS_TYPE_TO_PARTICLE) {
                    let particle_block = GLASS_TYPE_TO_PARTICLE[material_name]
                    event.server.runCommandSilent("particle minecraft:block "+particle_block+" "+target_x+" "+target_y+" "+target_z+" 1 1 1 1 50")
                    event.server.runCommandSilent("playsound minecraft:block.glass.break player @a "+particle_block+" "+target_x+" "+target_y+" "+target_z+" 10 "+sound_pitch)
                }
            })
        }
    }
}