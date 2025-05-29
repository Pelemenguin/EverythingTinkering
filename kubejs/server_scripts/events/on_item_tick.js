// priority: -1

import { incompact } from "../modifiers/incompact";

PlayerEvents.tick(event => {
    let player = event.player
    player.inventory.allItems.forEach(item => {
        if (item.nbt != null) {
            process_item(event, item)
        }
    })
})

/**
 * 
 * @param {Internal.SimplePlayerEventJS} event 
 * @param {Internal.ItemStack} item 
 * @returns 
 */
function process_item(event, item) {
    let modifier_data = item.nbt.get("tic_modifiers")
    if (modifier_data == null) {
        return
    }
    var modifiers = {}
    modifier_data.forEach(modifier => {
        let name = modifier.get("name").asString
        let level = modifier.get("level").asInt
        modifiers[name] = level
    })

    // Incompact
    if ("kubejs:incompact" in modifiers) {
        incompact(item, event.player, modifiers["kubejs:incompact"])
    }

    // Igniting
    if ("kubejs:igniting" in modifiers) {
        igniting_tick(item, event.player)
    }

    // console.info(modifiers)
}

/**
 * 
 * @param {Internal.ItemStack} item 
 * @param {Internal.Player} player 
 */
function igniting_tick(item, player) {
    
    if (item.nbt.get("tic_broken").asInt == 1) {
        console.info("[Igniting] Tool has already broken")
        return
    }

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
        tool_fire_time -= 1
        trait_data.putInt("fire", tool_fire_time)
        if (tool_fire_time % 5 == 0) {
            if (!player.creative) {
                item.damageValue += 1
            }
            player.playSound(`block.furnace.fire_crackle`)
        }
    }
}