/* eslint-disable no-unused-vars */
// priority: 2147483647

/* global
    global: writable
    Java
    Item
*/

const ToolPartItem = Java.loadClass('slimeknights.tconstruct.library.tools.part.ToolPartItem');
const ForgeRegistries = Java.loadClass('net.minecraftforge.registries.ForgeRegistries');
const MaterialRegistry = Java.loadClass('slimeknights.tconstruct.library.materials.MaterialRegistry');
const MaterialId = Java.loadClass('slimeknights.tconstruct.library.materials.definition.MaterialId');
const MaterialVariant = Java.loadClass('slimeknights.tconstruct.library.materials.definition.MaterialVariant');
const ModifierId = Java.loadClass('slimeknights.tconstruct.library.modifiers.ModifierId');
const ModifierNBT = Java.loadClass('slimeknights.tconstruct.library.tools.nbt.ModifierNBT');
const ResourceColorManager = Java.loadClass('slimeknights.mantle.client.ResourceColorManager');
const TextColor = Java.loadClass('net.minecraft.network.chat.TextColor');
const ToolStack = Java.loadClass('slimeknights.tconstruct.library.tools.nbt.ToolStack');
const TiCToolDefinitions = Java.loadClass('slimeknights.tconstruct.tools.ToolDefinitions');
const MaterialNBT = Java.loadClass('slimeknights.tconstruct.library.tools.nbt.MaterialNBT');
const MaterialNBTBuilder = Java.loadClass('slimeknights.tconstruct.library.tools.nbt.MaterialNBT$Builder');

const LivingHurtEvent = Java.loadClass("net.minecraftforge.event.entity.living.LivingHurtEvent");
const CriticalHitEvent = Java.loadClass("net.minecraftforge.event.entity.player.CriticalHitEvent");

/**
 * @type {Internal.Item[]}
 */
var toolParts = [Item.of("tconstruct:repair_kit").item];
ForgeRegistries.ITEMS.getValues().forEach(item => {
    if (item instanceof ToolPartItem) {
        toolParts.push(item);
    }
});

global.CustomUtils.Tinker.TOOL_PARTS = toolParts;

/**
 * Get the color of a material by its ID.
 * Temporary proxy for the one in `global`.
 * 
 * @param {string} translation_key - The translation key of the material.
 * @returns {TextColor} The color of the material in hex format, or white if not found.
 */
function getMantleColor(translation_key) {
    return global.CustomUtils.Tinker.getMantleColor(translation_key);
}