// priority: -1

// import { getModifiersFromItem } from "../../startup_scripts/globals"
// import { incompact } from "../modifiers/incompact"
// import { igniting_tick } from "../modifiers/igniting"
import { welcome_remove } from "../modifiers/welcome_remove"

let getModifiersFromItem = global.CustomUtils.Tinker.getModifiersFromItem;

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
    if (modifier_data == null) {return}
    var modifiers = getModifiersFromItem(item)

    // Incompact
    if ("kubejs:incompact" in modifiers) {
        // incompact(item, event.player, modifiers["kubejs:incompact"])
    }

    // Igniting
    if ("kubejs:igniting" in modifiers) {
        // igniting_tick(item, event.player)
    }
    
    // Welcome
    if ("kubejs:welcome" in modifiers) {
        welcome_remove(item, event.level.time, event.player)
    }

}