let getMantleColor = global.getMantleColor

/**
 * @exports
 * @param {Internal.ItemStack} item 
 * @param {number} time 
 * @param {Internal.Player} player 
 */
function welcome_remove(item, time, player) {
    if (time > 72000) {
        ToolStack.from(item).removeModifier(ModifierId.tryBuild("kubejs", "welcome"), 1)
        player.sendSystemMessage({
            "translate": "modifier.kubejs.welcome.hint",
            "color": getMantleColor("modifier.kubejs.welcome").toString(),
            "with": [
                item.displayName
            ]
        })
    }
}