const OFFHAND_ATTACKABLE_MODIFIER = [
    "tconstruct:offhand_attack",
    "tconstruct:dual_wielding"
]

ForgeEvents.onEvent("net.minecraftforge.event.entity.living.LivingHurtEvent", event => {

    console.info(`[LivingHurtEvent] Triggered by ${event.entity}`)
    try {
        let mainhandItem = (event.source.actual.handSlots[0])
        let offhandItem = (event.source.actual.handSlots[1])

        if (mainhandItem.nbt != null) {
            if (mainhandItem.nbt.get("tic_broken").asInt != 1) {
                let attacker_weapon_modifier_data = mainhandItem.nbt.get("tic_modifiers")
                var attacker_weapon_modifiers = {}
                attacker_weapon_modifier_data.forEach(modifier => {
                    let name = modifier.get("name").asString
                    let level = modifier.get("level").asInt
                    attacker_weapon_modifiers[name] = level
                })

                run_modifiers(event, mainhandItem, attacker_weapon_modifiers)
            }
        }

        if (offhandItem.nbt != null) {
        if (offhandItem.nbt.get("tic_broken").asInt != 1) {
            let attacker_offhand_weapon_modifier_data = offhandItem.nbt.get("tic_modifiers")
            let attacker_offhand_weapon_modifiers = {}
            let valid_offhand = false
            attacker_offhand_weapon_modifier_data.forEach(modifier => {
                let name = modifier.get("name").asString
                let level = modifier.get("level").asInt
                attacker_offhand_weapon_modifiers[name] = level
                if (OFFHAND_ATTACKABLE_MODIFIER.indexOf(name) != -1) {
                    valid_offhand = true
                }
            })
            console.info(valid_offhand)
            if (valid_offhand) {
                run_modifiers(event, offhandItem, attacker_offhand_weapon_modifiers)
            }
        }
    }
    } catch (e) {
        console.error("Error occured!")
        console.error(e)
    }

})

/**
 * 
 * @param {Internal.LivingHurtEvent} event 
 * @param {Internal.ItemStack} item 
 * @param {any} modifiers 
 */
function run_modifiers(event, item, modifiers) {
    if ("kubejs:whacking" in modifiers) {
        whacking(event, item, modifiers["kubejs:whacking"])
    }
}

/**
 * Whacking - Multiplies damage of critical hits, consumes 25% of remaining durability
 * 
 * @param {Internal.LivingHurtEvent} event 
 * @param {Internal.ItemStack} item 
 * @param {int} level 
 */
function whacking(event, item, level) {
    console.info("[Whacking] Triggered!")
    let source = event.source

    /** @type {Internal.ServerPlayer} */
    let attacker = source.actual
    console.info(`[Whacking] ${attacker}`)

    // Check if crit
    if (attacker && attacker.isPlayer()) {
        if (
            !attacker.onGround() &&
            !attacker.onClimbable() &&
            !attacker.isInWater() &&
            !attacker.isInLava() &&
            !attacker.isPassenger() &&
            !attacker.isSprinting() &&
            attacker.fallDistance > 0
        ) {
            console.info(`[Whacking] Damage doubled. Original damage ${event.amount}`)
            event.amount *= 1.25 + level * 0.25

            // Damage item
            if (!attacker.creative) {
                let remaining_dura = item.maxDamage - item.damageValue
                let consuming_dura = JavaMath.max(JavaMath.ceil(remaining_dura * 0.25), 10)
                console.info(`[Whacking] Item damaged ${consuming_dura}`)
                item.damageValue += consuming_dura
            } else {
                console.info(`[Whacking] Item not damaged for player is in creative mode.`)
            }
        }
    }
}