const RELAYING_DAMAGE_PERCENTAGE = 0.5

/**
 * 
 * @param {Internal.LivingEntityHurtEventJS} event 
 * @param {int} level 
 */
function relaying(event, level) {
    let if_repeated = event.entity.nbt.get("ForgeData").get("RelayingTemporaryData")
    if (if_repeated == null) {
        console.info("Relaying detected!")
        let detect_radius = (0.5 * level) / 2
        let attacker = event.source.actual
        let facing = [attacker.yaw, attacker.pitch]
        let actual_yaw = JavaMath.toRadians(facing[0] + 90)
        let actual_pitch = JavaMath.toRadians(-facing[1])
        let x_step = detect_radius * JavaMath.cos(actual_yaw) * JavaMath.cos(actual_pitch)
        let y_step = detect_radius * JavaMath.sin(actual_pitch)
        let z_step = detect_radius * JavaMath.sin(actual_yaw) * JavaMath.cos(actual_pitch)
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