// priority: 1000

/**
 * @type {Internal.Item[]}
 */
var toolParts = [Item.of("tconstruct:repair_kit").item]
ForgeRegistries.ITEMS.getValues().forEach(item => {
    if (item instanceof ToolPartItem) {
        toolParts.push(item)
    }
})
console.info(`TConstruct tool part list: ${toolParts}`)

/**
 * Get the color of a material by its ID.
 * 
 * @param {string} translation_key - The translation key of the material.
 * @returns {TextColor} The color of the material in hex format, or white if not found.
 */
function getMantleColor(translation_key) {
    return ResourceColorManager.getTextColor(translation_key)
}

/**
 * Returns an object contains a TiC tool's traits
 * 
 * @param {Internal.ItemStack} item 
 */
// function getModifiersFromItem(item) {
    // /** @type {Internal.ListTag} */
    // let modifiers_tag = item.nbt.get("tic_modifiers")
    // if (modifiers_tag == null) {return}
    // let result = {}
    // modifiers_tag.forEach(modifier => {
        // /** @type {string} */
        // let name = modifier.get("name").asString
        // /** @type {int} */
        // let level = modifier.get("level").asInt
        // result[name] = level
    // })
    // return result
// }

function getModifiersFromItem(item) {
    // let toolStack = ToolStack.from(item)
    // let modNbt = toolStack.
    let raw = item.nbt.get("tic_modifiers")
    let modNbt = ModifierNBT.readFromNBT(raw)
    let result = {}
    modNbt.forEach(modifier => {
        let name = modifier.getId().toString()
        let level = modifier.level
        result[name] = level
    })
    return result
}

global.toolParts = toolParts
global.getMantleColor = getMantleColor
global.getModifiersFromItem = getModifiersFromItem