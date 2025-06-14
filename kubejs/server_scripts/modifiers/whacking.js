/**
 * Whacking - Multiplies damage when falling, consumes 25% of remaining durability
 * 
 * @param {Internal.LivingHurtEvent} event 
 * @param {boolean} isCritical 
 * @param {int} level 
 */
function whacking(event, isCritical, level) {
    // let source = event.source

    // /** @type {Internal.ServerPlayer} */
    // let attacker = source.actual

    // // Check if crit
    // if (attacker && attacker.isPlayer()) {
        // if (
            // !attacker.onGround() &&
            // !attacker.onClimbable() &&
            // !attacker.isInWater() &&
            // !attacker.isInLava() &&
            // !attacker.isPassenger() &&
            // !attacker.isSprinting() &&
            // attacker.fallDistance > 0
        // ) {
            // event.amount *= 1.25 + level * 0.25

            // // Damage item
            // if (!attacker.creative) {
                // let remaining_dura = item.maxDamage - item.damageValue
                // let consuming_dura = JavaMath.max(JavaMath.ceil(remaining_dura * 0.25), 10)
                // item.damageValue += consuming_dura
            // }
        // }
    // 
    if (isCritical) {
        event.setDamageModifier(event.getDamageModifier() + level * 0.5)
    }
}