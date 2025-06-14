/**
 * Pottery - Random damage boost
 * 
 * @param {Internal.Internal.LivingHurtEvent}
 * @param {Internal.ItemStack} item 
 * @param {int} level 
 */
function pottery(event, item, level) {
    let boost = JavaMath.random() * (item.damageValue / item.maxDamage) * level + 0.5
    event.amount += boost
}