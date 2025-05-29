/**
 * Whacking - Multiplies damage when falling, consumes 25% of remaining durability
 * 
 * @param {Internal.LivingHurtEvent} event 
 * @param {Internal.ItemStack} item 
 * @param {int} level 
 */
function whacking(event, item, level) {
    let source = event.source

    /** @type {Internal.ServerPlayer} */
    let attacker = source.actual

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
            console.info("[Whacking] Triggered!")
            console.info(`[Whacking] ${attacker}`)
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