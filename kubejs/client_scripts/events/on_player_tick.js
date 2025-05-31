import { draw } from "../modifier_painter/main";

PlayerEvents.tick(event => {
    let player = event.player
    let item = player.mainHandItem
    draw_modifiers(item)
})

/**
 * 
 * @param {Internal.ItemStack} item 
 */
function draw_modifiers(item) {
    if (item == null) {return}
    if (item.nbt == null) {return}
    let modifiers_tag = item.nbt.get("tic_modifiers")
    if (modifiers_tag == null) {return}
    let modifiers = []
    modifiers_tag.forEach(modifier => {
        modifiers.push(modifier.get("name"))
    })
}