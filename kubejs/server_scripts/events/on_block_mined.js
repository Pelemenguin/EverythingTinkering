import { uncertain } from "../modifiers/uncertain";

var getModifiersFromItem = global.getModifiersFromItem

var lastBlockPos = new BlockPos(new Vec3i(0, -32767, 0))
var lastBrokenTime = -1

BlockEvents.broken(event => {

    // 防止执行两次
    let thisBrokenTime = event.level.time
    let thisBlockPos = event.getBlock().getPos()
    if (thisBlockPos == lastBlockPos && thisBrokenTime == lastBrokenTime) {return}
    lastBlockPos = thisBlockPos
    lastBrokenTime = thisBrokenTime
    
    // console.info('A block is mined: '+lastBlockPos)
    let entity = event.entity
    if (entity == null) {return}
    let mainhandItem = entity.handSlots[0]

    if (mainhandItem != null && mainhandItem.nbt != null) {
        // console.info('Before calling')
        process_item_on_mine(event, mainhandItem)
    }
})

/**
 * 
 * @param {Internal.BlockBrokenEventJS} event 
 * @param {Internal.ItemStack} item 
 */
function process_item_on_mine(event, item) {
    
    // console.info('Function called!')
    let modifier_data = item.nbt.get("tic_modifiers")
    if (modifier_data == null) {return}
    var modifiers = getModifiersFromItem(item)
    
    if ("kubejs:uncertain" in modifiers) {
        uncertain(item, event.block, event.entity, event.level, modifiers["kubejs:uncertain"])
    }
}