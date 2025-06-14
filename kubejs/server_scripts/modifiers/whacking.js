/**
 * Whacking - Multiplies damage when falling, consumes 25% of remaining durability
 * 
 * @param {Internal.CriticalHitEvent} event 
 * @param {Internal.ItemStack} item 
 * @param {boolean} isCritical 
 * @param {int} level 
 */
function whacking(event, item, isCritical, level) {
    if (isCritical) {
        event.setDamageModifier(event.damageModifier + level * 0.5)
        // Damage item
        if (!event.entity.creative) {
            let remaining_dura = item.maxDamage - item.damageValue
            let consuming_dura = JavaMath.max(JavaMath.ceil(remaining_dura * 0.25), 10)
            item.damageValue += consuming_dura
        }
    }
}