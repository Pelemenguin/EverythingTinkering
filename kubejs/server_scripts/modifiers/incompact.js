/**
 * 
 * @param {Internal.ItemStack} item 
 * @param {Internal.Player} player 
 * @param {int} level 
 */
function incompact(item, player, level) {
    if (player.creative) {return}
    if (item.nbt.get("tic_broken").asInt == 1) {return}
    let chance = level * 0.2
    if (JavaMath.random() < chance) {
        let durability_loss = level + JavaMath.round(level * 2 * JavaMath.random)
        item.damageValue += durability_loss
    }
}