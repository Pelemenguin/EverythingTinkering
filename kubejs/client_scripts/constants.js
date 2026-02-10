// priority: 2147483647

/**
 * @fileoverview Constants
 * @author Pelemenguin
 */

/* global
    global: writable
    Java
*/

/* eslint-disable no-unused-vars */

// Java
const $Integer = Java.loadClass("java.lang.Integer");

// Minecraft
const TextColor = Java.loadClass('net.minecraft.network.chat.TextColor');
const $Minecraft = Java.loadClass("net.minecraft.client.Minecraft");
const $Rect2i = Java.loadClass("net.minecraft.client.renderer.Rect2i");
const $TooltipFlag = Java.loadClass("net.minecraft.world.item.TooltipFlag");

// Mantle
const ResourceColorManager = Java.loadClass('slimeknights.mantle.client.ResourceColorManager');

// Tinker's Construct
const $MaterialVariantId = Java.loadClass("slimeknights.tconstruct.library.materials.definition.MaterialVariantId");
const $MaterialStatsId = Java.loadClass("slimeknights.tconstruct.library.materials.stats.MaterialStatsId");
const $MaterialIngredient = Java.loadClass("slimeknights.tconstruct.library.recipe.ingredient.MaterialIngredient");
const ToolPartItem = Java.loadClass('slimeknights.tconstruct.library.tools.part.ToolPartItem');
const TinkerToolParts = Java.loadClass("slimeknights.tconstruct.tools.TinkerToolParts");
const $FakeIngotItem = Java.loadClass("slimeknights.tconstruct.tools.item.FakeIngotItem");
const $RepairKitItem = Java.loadClass("slimeknights.tconstruct.tools.item.RepairKitItem");

// Create
const $DepotBlockEntity = Java.loadClass("com.simibubi.create.content.logistics.depot.DepotBlockEntity");

// KubeJS
const $BlockEntityJS = Java.loadClass("dev.latvian.mods.kubejs.block.entity.BlockEntityJS");

// ---------- Utils ---------- //

/**
 * @namespace ClientUtils
 * Utility functions for client-side operations.  
 * 客户端操作的实用程序函数。
 */
global.ClientUtils = {};

/**
 * Get the color for a given text, usually translation keys for materials or modifiers.  
 * 根据给定的文本获取颜色，通常是材料或特性的翻译键。
 * - - - - -
 * @param {string} parameter 
 * @returns {Internal.TextColor}
 */
global.ClientUtils.getMantleColor = (parameter) => {
    try {
        return ResourceColorManager.getTextColor(parameter);
    } catch (e) {
        return TextColor.fromRgb(0x000000);
    }
};


