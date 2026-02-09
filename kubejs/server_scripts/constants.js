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

const $Registries = Java.loadClass("net.minecraft.core.registries.Registries");
const $TagKey = Java.loadClass("net.minecraft.tags.TagKey");
const $MobSpawnType = Java.loadClass("net.minecraft.world.entity.MobSpawnType");
const $ItemStack = Java.loadClass("net.minecraft.world.item.ItemStack");
const $LootContextParams = Java.loadClass("net.minecraft.world.level.storage.loot.parameters.LootContextParams");

const ToolPartItem = Java.loadClass('slimeknights.tconstruct.library.tools.part.ToolPartItem');
const $ForgeRegistries = Java.loadClass('net.minecraftforge.registries.ForgeRegistries');
const MaterialRegistry = Java.loadClass('slimeknights.tconstruct.library.materials.MaterialRegistry');
const MaterialId = Java.loadClass('slimeknights.tconstruct.library.materials.definition.MaterialId');
const $MaterialVariantId = Java.loadClass("slimeknights.tconstruct.library.materials.definition.MaterialVariantId");
const MaterialVariant = Java.loadClass('slimeknights.tconstruct.library.materials.definition.MaterialVariant');
const $MaterialStatsId = Java.loadClass("slimeknights.tconstruct.library.materials.stats.MaterialStatsId");
const $ModifierId = Java.loadClass('slimeknights.tconstruct.library.modifiers.ModifierId');
const $ModifierNBT = Java.loadClass('slimeknights.tconstruct.library.tools.nbt.ModifierNBT');
const ResourceColorManager = Java.loadClass('slimeknights.mantle.client.ResourceColorManager');
const TextColor = Java.loadClass('net.minecraft.network.chat.TextColor');
const $MaterialIngredient = Java.loadClass("slimeknights.tconstruct.library.recipe.ingredient.MaterialIngredient");
const $IToolStackView = Java.loadClass("slimeknights.tconstruct.library.tools.nbt.IToolStackView");
const ToolStack = Java.loadClass('slimeknights.tconstruct.library.tools.nbt.ToolStack');
const $ArmorDefinitions = Java.loadClass("slimeknights.tconstruct.tools.ArmorDefinitions");
const TiCToolDefinitions = Java.loadClass('slimeknights.tconstruct.tools.ToolDefinitions');
const MaterialNBT = Java.loadClass('slimeknights.tconstruct.library.tools.nbt.MaterialNBT');
const $MaterialItem = Java.loadClass("slimeknights.tconstruct.library.tools.part.MaterialItem");
const TinkerToolParts = Java.loadClass("slimeknights.tconstruct.tools.TinkerToolParts");
const $FakeIngotItem = Java.loadClass("slimeknights.tconstruct.tools.item.FakeIngotItem");
const $IModifiable = Java.loadClass("slimeknights.tconstruct.library.tools.item.IModifiable");
const $RepairKitItem = Java.loadClass("slimeknights.tconstruct.tools.item.RepairKitItem");
const MaterialNBTBuilder = Java.loadClass('slimeknights.tconstruct.library.tools.nbt.MaterialNBT$Builder');

const LivingHurtEvent = Java.loadClass("net.minecraftforge.event.entity.living.LivingHurtEvent");
const CriticalHitEvent = Java.loadClass("net.minecraftforge.event.entity.player.CriticalHitEvent");
const $PartialNBTIngredient = Java.loadClass("net.minecraftforge.common.crafting.PartialNBTIngredient");

const JavaUtils = {
    Float: Java.loadClass("java.lang.Float")
};
const $HashSet = Java.loadClass("java.util.HashSet");
