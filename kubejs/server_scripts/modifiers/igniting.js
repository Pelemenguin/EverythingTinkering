const IGNITING_FIRE_PERCENTAGE_PER_LEVEL = 0.25

/**
 * 
 * @exports
 * @param {Internal.ItemStack} item 
 * @param {Internal.LivingEntity} target 
 * @param {int} level 
 */
function igniting_trigger(item, target, level) {

    // Get or set fire time
    console.info("[Igniting] Triggered!")
    /** @type {Internal.CompoundTag} */
    let persistent_data = NBT.compoundTag()
    try {
        persistent_data = item.nbt.get("tic_persistent")
    } catch (e) {}
    if (!persistent_data.contains("kubejs:igniting")) {
        persistent_data.put("kubejs:igniting", NBT.compoundTag())
    }
    /** @type {Internal.CompoundTag} */
    let trait_tag = persistent_data.get("kubejs:igniting")
    let fire_time = target.getRemainingFireTicks()
    if (!trait_tag.contains("fire")) {
        trait_tag.putInt("fire", 0)
        console.info(`[Igniting] "fire" tag does not exist. Created.`)
    }
    let tool_fire_time = trait_tag.get("fire")
    console.info(`[Igniting] Tool's fire time is ${tool_fire_time}`)
    console.info(`[Igniting] Target's fire time is ${fire_time}`)
    if (tool_fire_time > fire_time) {
        let applied_time = tool_fire_time * IGNITING_FIRE_PERCENTAGE_PER_LEVEL * level
        console.info(`[Igniting] Set target's fire time to ${applied_time}`)
        target.remainingFireTicks = JavaMath.round(applied_time)
    } else {
        console.info(`[Igniting] Set tool's fire time to ${fire_time}`)
        trait_tag.putInt("fire", fire_time)
    }
    if (tool_fire_time > 0 || fire_time > 0) {
        target.playSound("entity.generic.burn")
    }
}

/**
 * 
 * @exports
 * @param {Internal.ItemStack} item 
 * @param {Internal.Player} player 
 */
function igniting_tick(item, player) {
    
    /** @type {Internal.CompoundTag} */
    let persistent_data = item.nbt.get("tic_persistent")
    if (persistent_data == null) {return}
    /** @type {Internal.CompoundTag} */
    let trait_data = persistent_data.get("kubejs:igniting")
    if (trait_data == null) {return}
    /** @type {int} */
    let tool_fire_time = trait_data.get("fire")
    if (tool_fire_time == null) {return}
    if (tool_fire_time > 0) {
        if (item.nbt.get("tic_broken").asInt == 1) {
            console.info("[Igniting] Tool has already broken, set tool's fire to 0")
            trait_data.putInt("fire", 0)
            return
        }
        tool_fire_time -= 1
        trait_data.putInt("fire", tool_fire_time)
        if (tool_fire_time % 5 == 0) {
            player.playNotifySound("block.blastfurnace.fire_crackle", "players", 1, 1)
            if (!player.creative) {
                item.damageValue += 1
            }
        }
    }
}