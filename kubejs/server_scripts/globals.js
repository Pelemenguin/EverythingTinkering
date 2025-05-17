// priority: 1000

const ToolPartItem = Java.loadClass('slimeknights.tconstruct.library.tools.part.ToolPartItem')
// const Item = Java.loadClass('net.minecraft.world.item.Item')
const ForgeRegistries = Java.loadClass('net.minecraftforge.registries.ForgeRegistries')
const MaterialRegistry = Java.loadClass('slimeknights.tconstruct.library.materials.MaterialRegistry')
const MaterialId = Java.loadClass('slimeknights.tconstruct.library.materials.definition.MaterialId')
const ResourceColorManager = Java.loadClass('slimeknights.mantle.client.ResourceColorManager')
const TextColor = Java.loadClass('net.minecraft.network.chat.TextColor')

var toolParts = []
ForgeRegistries.ITEMS.getValues().forEach(item => {
    if (item instanceof ToolPartItem) {
        toolParts.push(item)
    }
})

/**
 * @description Get the color of a material by its ID.
 * 
 * @param {string} translation_key - The translation key of the material.
 * @returns {TextColor} The color of the material in hex format, or white if not found.
 */
function getMantleColor(translation_key) {
    return ResourceColorManager.getTextColor(translation_key)
}