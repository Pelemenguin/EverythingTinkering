import { uncertain } from "../modifiers/uncertain";

var getModifiersFromItem = global.getModifiersFromItem

BlockEvents.broken(event => {
    let entity = event.entity
    if (entity == null) {return}
    let mainhandItem = entity.handSlots[0]

    if (mainhandItem != null && mainhandItem.nbt != null) {        
        process_item_on_mine(event, mainhandItem)
    }
})

/**
 * 
 * @param {Internal.BlockBrokenEventJS} event 
 * @param {Internal.ItemStack} item 
 */
function process_item_on_mine(event, item) {

    let modifier_data = item.nbt.get("tic_modifiers")
    if (modifier_data == null) {return}
    var modifiers = getModifiersFromItem(item)
    
    if ("kubejs:uncertain" in modifiers) {
        uncertain(item, event.block, event.entity, modifiers["kubejs:uncertain"])
    }
}