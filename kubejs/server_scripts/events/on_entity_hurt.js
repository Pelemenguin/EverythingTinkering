const Particle = Java.loadClass("net.minecraft.client.particle.Particle")

const RELAYING_DAMAGE_PERCENTAGE = 0.5

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
    "tconstruct:glass#black_stained": "minecraft:black_stained_glass"
}

const OFFHAND_ATTACKABLE_MODIFIER = [
    "tconstruct:offhand_attack",
    "tconstruct:dual_wielding"
]

EntityEvents.hurt(event => {

    if (event.source.actual == null) {event.exit()}

    if (event.source.actual.handSlots[0].nbt != null) {
        if (event.source.actual.handSlots[0].nbt.get("tic_broken").asInt != 1) {
            let attacker_weapon_modifier_data = event.source.actual.handSlots[0].nbt.get("tic_modifiers")
            // console.info(attacker_weapon_modifier_data)
            var attacker_weapon_modifiers = {}
            attacker_weapon_modifier_data.forEach(modifier => {
                let name = modifier.get("name").asString
                let level = modifier.get("level").asInt
                // console.info(name)
                // console.info(level)
                attacker_weapon_modifiers[name] = level
            })
            // console.info(attacker_weapon_modifiers)

            run_modifiers(event, event.source.actual.handSlots[0], attacker_weapon_modifiers)
        }
    }

    if (event.source.actual.handSlots[1].nbt != null) {
        if (event.source.actual.handSlots[1].nbt.get("tic_broken").asInt != 1) {
            let attacker_offhand_weapon_modifier_data = event.source.actual.handSlots[1].nbt.get("tic_modifiers")
            let attacker_offhand_weapon_modifiers = {}
            let valid_offhand = false
            attacker_offhand_weapon_modifier_data.forEach(modifier => {
                let name = modifier.get("name").asString
                let level = modifier.get("level").asInt
                // console.info(name)
                // console.info(level)
                attacker_offhand_weapon_modifiers[name] = level
                if (OFFHAND_ATTACKABLE_MODIFIER.indexOf(name) != -1) {
                    valid_offhand = true
                }
            })
            console.info(valid_offhand)
            if (valid_offhand) {
                run_modifiers(event, event.source.actual.handSlots[1], attacker_offhand_weapon_modifiers)
            }
        }
    }
})

function run_modifiers(event, item, attacker_weapon_modifiers) {

    // Relaying
    if ("kubejs:relaying" in attacker_weapon_modifiers) {
        relaying(event, attacker_weapon_modifiers["kubejs:relaying"])
    }

    // Glass Shard
    if ("kubejs:glass_shard" in attacker_weapon_modifiers) {
        glass_shard(event, item, attacker_weapon_modifiers["kubejs:glass_shard"])
    }

}

function relaying(event, level) {
    let if_repeated = event.entity.nbt.get("ForgeData").get("RelayingTemporaryData")
    if (if_repeated == null) {
        console.info("Relaying detected!")
        let detect_radius = (0.5 * level) / 2
        let attacker = event.source.actual
        let facing = [attacker.yaw, attacker.pitch]
        // console.info(facing)
        let actual_yaw = JavaMath.toRadians(facing[0] + 90)
        let actual_pitch = JavaMath.toRadians(-facing[1])
        // console.info([actual_yaw, actual_pitch])
        let x_step = detect_radius * JavaMath.cos(actual_yaw) * JavaMath.cos(actual_pitch)
        let y_step = detect_radius * JavaMath.sin(actual_pitch)
        let z_step = detect_radius * JavaMath.sin(actual_yaw) * JavaMath.cos(actual_pitch)
        // console.info([x_step, y_step, z_step])
        let target_x = event.entity.x
        let target_y = event.entity.y
        let target_z = event.entity.z
        let box = AABB.of(
            target_x + x_step - detect_radius,
            target_y + y_step - detect_radius,
            target_z + z_step - detect_radius,
            target_x + x_step + detect_radius,
            target_y + y_step + detect_radius,
            target_z + z_step + detect_radius
        )
        let world = event.level
        let entity_list = world.getEntitiesWithin(box)
        entity_list.forEach(entity => {
            console.info(entity.attackable)
            entity.mergeNbt(NBT.toTagCompound({"ForgeData":{"RelayingTemporaryData":{}}}))
            if (entity.attackable) {
                console.info(entity)
                entity.attack(event.source, RELAYING_DAMAGE_PERCENTAGE * event.damage)
            }
        })
        entity_list.forEach(entity => {
            let new_forge_data = entity.nbt.get("ForgeData")
            new_forge_data.remove("RelayingTemporaryData")
            entity.mergeNbt(NBT.toTagCompound({"ForgeData":new_forge_data}))
        })
    }
}

function glass_shard(event, item, level) {
    let if_repeated = event.entity.nbt.get("ForgeData").get("GlassShardTemporaryData")
    if (if_repeated == null) {
        // Internal.LivingEntityHurtEventJS.prototype
        let damage = event.damage
        let source = event.source
        let chance = (damage - 5.0) * 0.2 * level
        if (JavaMath.random() < chance) {
            // console.info("Glass Shard triggered")
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
            item.nbt.get("tic_materials").forEach(material => {
                let material_name = material.asString
                if (material_name in GLASS_TYPE_TO_PARTICLE) {
                    let particle_block = GLASS_TYPE_TO_PARTICLE[material_name]
                    event.server.runCommandSilent("particle minecraft:block "+particle_block+" "+target_x+" "+target_y+" "+target_z+" 1 1 1 1 50")
                    // console.info("Command run: "+"particle minecraft:block "+particle_block+" "+target_x+" "+target_y+" "+target_z+" 1 1 1 1 50")
                }
            })
        }
    }
}