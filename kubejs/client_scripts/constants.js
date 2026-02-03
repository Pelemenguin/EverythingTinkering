// priority: 2147483647

// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Constants
 * - - - - -
 * @copyright Pelemenguin 2025
 * @license LGPL-3.0-or-later
 * This file is part of EverythingTinkering.
 * Full license see file `COPYING.LESSER`
 * - - - - -
 * @author Pelemenguin
 */

/* global
    Java
*/

/* eslint-disable no-unused-vars */

// Java
const $Integer = Java.loadClass("java.lang.Integer");

// Minecraft
const $Minecraft = Java.loadClass("net.minecraft.client.Minecraft");
const $Rect2i = Java.loadClass("net.minecraft.client.renderer.Rect2i");
const $TooltipFlag = Java.loadClass("net.minecraft.world.item.TooltipFlag");

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
