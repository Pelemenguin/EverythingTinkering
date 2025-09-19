/* eslint-disable no-unused-vars */
// priority: 2147483647

/**
 * - - - - -
 * @copyright Pelemenguin 2025
 * @license LGPL-3.0-or-later
 * This file is part of EverythingTinkering.
 * Full license see file `COPYING.LESSER`
 * - - - - -
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * - - - - -
 * @author Pelemenguin
 */

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

const JavaUtils = {
    Float: Java.loadClass("java.lang.Float")
};

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
