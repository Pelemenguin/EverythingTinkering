// priority: 2147483647

/**
 * @fileoverview Constants | 常量
 * - Because Rhino made `const`-defined objects global, use a special JS file to create these.
 * - 由于 Rhino 使得 `const` 定义的对象全局可访问，这里使用一个特殊文件来创建。
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

/* eslint-disable no-unused-vars */

/* global
    Java
    global
    JavaMath
*/

// ---------- Java classes ---------- //

/** @type {typeof Internal.Class} */
const Class = Java.loadClass("java.lang.Object").__javaObject__.getClass();
const NativeJavaClass = Java.loadClass("dev.latvian.mods.rhino.NativeJavaClass");

const NonNullList = Java.loadClass("net.minecraft.core.NonNullList");

const SimpleSoundInstance = Java.loadClass("net.minecraft.client.resources.sounds.SimpleSoundInstance");
const Registries = Java.loadClass("net.minecraft.core.registries.Registries");
const ResourceKey = Java.loadClass("net.minecraft.resources.ResourceKey");
const TagKey = Java.loadClass("net.minecraft.tags.TagKey");
const LivingEntity = Java.loadClass("net.minecraft.world.entity.LivingEntity");
const Player = Java.loadClass("net.minecraft.world.entity.player.Player");
const Entity = Java.loadClass("net.minecraft.world.entity.Entity");
const EquipmentSlot = Java.loadClass("net.minecraft.world.entity.EquipmentSlot");
const ItemStack = Java.loadClass("net.minecraft.world.item.ItemStack");
const MobEffectInstance = Java.loadClass("net.minecraft.world.effect.MobEffectInstance");
const ChatFormatting = Java.loadClass("net.minecraft.ChatFormatting");
const LanguageManager = Java.loadClass("net.minecraft.client.resources.language.LanguageManager");
const ParticleOptions = Java.loadClass("net.minecraft.core.particles.ParticleOptions");
const DustParticleOptions = Java.loadClass("net.minecraft.core.particles.DustParticleOptions");

const ResourceColorManager = Java.loadClass('slimeknights.mantle.client.ResourceColorManager');
const BookTransformer = Java.loadClass("slimeknights.mantle.client.book.transformer.BookTransformer");
const ContentPageIconList = Java.loadClass("slimeknights.mantle.client.book.data.content.ContentPageIconList");
const ContentPageIconList$PageWithIcon = Java.loadClass("slimeknights.mantle.client.book.data.content.ContentPageIconList$PageWithIcon");

const MaterialId = Java.loadClass('slimeknights.tconstruct.library.materials.definition.MaterialId');
const MaterialVariant = Java.loadClass('slimeknights.tconstruct.library.materials.definition.MaterialVariant');
const MaterialVariantId = Java.loadClass("slimeknights.tconstruct.library.materials.definition.MaterialVariantId");
const TinkerBook = Java.loadClass("slimeknights.tconstruct.library.client.book.TinkerBook");
const MaterialRegistry = Java.loadClass('slimeknights.tconstruct.library.materials.MaterialRegistry');
const MaterialStatsId = Java.loadClass("slimeknights.tconstruct.library.materials.stats.MaterialStatsId");
const Modifier = Java.loadClass("slimeknights.tconstruct.library.modifiers.Modifier");
const ModifierId = Java.loadClass('slimeknights.tconstruct.library.modifiers.ModifierId');
const ToolMaterialHook = Java.loadClass("slimeknights.tconstruct.library.tools.definition.module.material.ToolMaterialHook");
const ToolStack = Java.loadClass('slimeknights.tconstruct.library.tools.nbt.ToolStack');
const MaterialNBT = Java.loadClass('slimeknights.tconstruct.library.tools.nbt.MaterialNBT');
const MaterialNBTBuilder = Java.loadClass('slimeknights.tconstruct.library.tools.nbt.MaterialNBT$Builder');
const ModifierNBT = Java.loadClass("slimeknights.tconstruct.library.tools.nbt.ModifierNBT");
const ToolStatId = Java.loadClass("slimeknights.tconstruct.library.tools.stat.ToolStatId");
const ToolStats = Java.loadClass('slimeknights.tconstruct.library.tools.stat.ToolStats');
const TiCToolDefinitions = Java.loadClass('slimeknights.tconstruct.tools.ToolDefinitions');
const TinkerItemElement = Java.loadClass("slimeknights.tconstruct.library.client.book.elements.TinkerItemElement");
const MaterialCastingLookup = Java.loadClass("slimeknights.tconstruct.library.recipe.casting.material.MaterialCastingLookup");
const MaterialRecipeCache = Java.loadClass("slimeknights.tconstruct.library.recipe.material.MaterialRecipeCache");
const TinkerToolParts = Java.loadClass("slimeknights.tconstruct.tools.TinkerToolParts");
const TinkerTools = Java.loadClass("slimeknights.tconstruct.tools.TinkerTools");

const KubeJS = Java.loadClass("dev.latvian.mods.kubejs.KubeJS");
const Context = Java.loadClass("dev.latvian.mods.rhino.Context");

const startupContext = KubeJS.getStartupScriptManager().context;
const topLevelScope = KubeJS.getStartupScriptManager().topLevelScope;

const PageDataJS = Java.loadClass("pelemenguin.mantlejs.content.book.data.PageDataJS");
const MantleJSTransformer = Java.loadClass("pelemenguin.mantlejs.content.book.transformer.MantleJSTransformer");

const JavaUtils = {
    ArrayList: Java.loadClass("java.util.ArrayList"),
    Collectors: Java.loadClass("java.util.stream.Collectors"),
    /** @type {typeof Internal.ByteBuffer} */
    ByteBuffer: new NativeJavaClass(startupContext, topLevelScope, Class.forName("java.nio.ByteBuffer")),
    /** @type {typeof Internal.ByteArrayOutputStream} */
    ByteArrayOutputStream: new NativeJavaClass(startupContext, topLevelScope, Class.forName("java.io.ByteArrayOutputStream")),
    /** @type {typeof Internal.DataOutputStream} */
    DataOutputStream: new NativeJavaClass(startupContext, topLevelScope, Class.forName("java.io.DataOutputStream")),
    /** @type {typeof Internal.MethodHandles} */
    MethodHandles: new NativeJavaClass(startupContext, topLevelScope, Class.forName("java.lang.invoke.MethodHandles"))
};

// ---------- Utils ---------- //

/**
 * - An interface for custom KubeJS utils.
 * - 用于自定义 KubeJS 杂项的接口。
 * - - - - -
 * @class
 * @interface
 */
const CustomUtils = function() {};

CustomUtils.toString = () => "CustomUtils";

/**
 * - n interface for tinker things.
 * - 用于匠魂相关的接口。
 * - - - - -
 * @class
 * @interface
 */
CustomUtils.Tinker = function() {};

CustomUtils.Tinker.toString = () => "CustomUtils.Tinker";

/**
 * - Check if a tool is broken.
 * - 检查一个工具是否损坏。
 * - - - - -
 * @param {Internal.ItemStack} item 
 * - - - - -
 * @returns {boolean}
 */
CustomUtils.Tinker.isBroken = (item) => {
    let nbt = item.getNbt();
    if (nbt.contains("tic_broken")) {
        try {
            return (nbt.get("tic_broken").asInt == 1);
        } catch (e) { /* empty */ }
    }
    return (item.damageValue == item.maxDamage);
};

/**
 * - Get modifiers from an item.
 * - 从物品上获取匠魂特性。
 * - - - - -
 * @param {Internal.ItemStack} item -
 * - The item to get modifiers from.
 * - 要获取特性的物品。
 * - - - - -
 * @returns 
 * - Result object.
 *   Keys are modifiers' ids,
 *   values are their level.
 * - 结果。键为特性 ID，值为等级。
 */
CustomUtils.Tinker.getModifiersFromItem = function(item) {
    let raw = item.nbt.get("tic_modifiers");
    if (raw == null) return;
    let modNbt = ModifierNBT.readFromNBT(raw);
    /** @type {Object<string, number>} */
    let result = {};
    modNbt.forEach(modifier => {
        let name = modifier.getId().toString();
        let level = modifier.level;
        result[name] = level;
    });
    return result;
};

/**
 * - Try to damage item.
 * - 尝试损坏物品。
 * - - - - -
 * ### Success
 * - Return `damage` itself or actual damage.
 * ### Fail
 * - If:
 *   - Player is creative.
 *   - Or item is not damagable.
 *   - Or level is on client side.
 * - Return `0`
 * - - - - -
 * ### 成功
 * - 返回 `damage` 或实际损坏值。
 * ### 失败
 * - 当：
 *   - 玩家是创造模式。
 *   - 或物品不能损坏。
 *   - 或维度在客户端上。
 * - 返回 `0`。
 * - - - - -
 * @param {Internal.ItemStack} item -
 * - The item to damage.
 * - 要损坏的物品。
 * @param {number} damage -
 * - The damage value.
 * - 损坏值。
 * @param {Internal.Entity} entity -
 * - The entity which the item belongs to.
 *   Can be `undefined` if you don't care about this.
 *   - If entity is a player and is creative,
 *     will cause failure of damaging item.
 * - 物品所属的实体。如果你不关心这个，传入 `undefined`。
 *   - 如果该实体是一个玩家且处于创造模式，
 *     将导致损坏物品的尝试失败。
 * @param {Internal.Level} level -
 * - The level where the item is.
 *   Can be `undefined` if you don't care about this.
 *   - If level is on the client side, return `0`.
 * - 物品所处的维度。
 *   如果你不关心这个，传入 `undefined`。
 *   - 如果维度是客户端的，返回 `0`。
 * - - - - -
 * @returns {number} 
 * - Actual damage dealt to the item.
 * - 实际损坏值
 */
CustomUtils.Tinker.tryDamageItem = (item, damage, entity, level) => {
    if (entity !== undefined && entity instanceof Player && entity.isCreative()) return 0;
    if (level !== undefined && level.isClientSide()) return 0;
    if (!item.isDamageableItem()) return 0;
    try {
        if (item.nbt.get("tic_broken").asByte == 1) return 0;
    } catch (e) {/* Do nothing */}
    let remainDura = item.maxDamage - item.damageValue + 1;
    let actualDamage = JavaMath["min(int,int)"](remainDura, damage);
    item.damageValue += actualDamage;
    return actualDamage;
};

/**
 * - A list for all parts in Tinker's Construct.
 * - **Actually loaded in server_scripts**
 * - 所有匠魂部件的列表。
 * - **实际在 server_scripts 中加载**
 * - - - - -
 * @type {(Internal.ToolPartItem | Internal.RepairKitItem)[]}
 */
CustomUtils.Tinker.TOOL_PARTS = [];

/**
 * - Interface for tinker's persistent data.
 * - 匠魂 Persistent 数据的接口
 * - - - - -
 * @class
 * @interface
 */
CustomUtils.Tinker.Persistent = function() {};

/**
 * - Set the persistent data of an item.
 * - 设置一个物品的 Persistent 数据。
 * - - - - -
 * @param {Internal.ItemStack} item -
 * - The item to set persistent data to.
 * - 要设置 Persistent 数据的物品。
 * @param {string} modifierId -
 * - The id of the modifier.
 * - 特性 ID。
 * @param {any} value -
 * - The value of the persistent data.
 * - 要设置的 Persistent 数据的值。
 */
CustomUtils.Tinker.Persistent.set = (item, modifierId, value) => {
    let newData = {tic_persistent: {}};
    newData.tic_persistent[modifierId] = value;
    item.nbt.merge(newData);
};
/**
 * - Get the persistent data from an item.
 * - 从一个物品上获取 Persistent 数据。
 * - - - - -
 * @param {Internal.ItemStack} item -
 * - The item to get persistent data from.
 * - 要获取 Persistent 数据的物品。
 * - - - - -
 * @param {string} modifierId -
 * - The id of the modifier.
 * - 特性 ID。
 * - - - - -
 * @return {?Internal.Tag} 
 * - Result of the persistent data of the given modifier of the item.
 * - 该物品的给定特性的 Persistent 数据结果。
 */
CustomUtils.Tinker.Persistent.get = (item, modifierId) => {
    /** @type {Internal.CompoundTag} */
    let persistent = item.nbt.get("tic_persistent");
    if (persistent == null) return;
    try {
        return persistent.get(modifierId);
    } catch (e) {
        return null;
    }
};

/**
 * - Get a color from Mantle's Resource Color Manager.
 * - 从 Mantle 的 Resource Color Manager 中获取颜色
 * 
 * @param {string} translation_key - 
 * - The translation key.
 * - 翻译键
 * @returns {Internal.TextColor}
 * - The color of the material in hex format, or white if not found.
 * - 对应翻译键的颜色，若未找到，则为白色。
 */
CustomUtils.Tinker.getMantleColor = (translation_key) => {
    return ResourceColorManager.getTextColor(translation_key);
};

/**
 * - An interface for custom KubeJS utils.
 * - 用于自定义 KubeJS 杂项的接口。
 * - - - - -
 * @class
 * @interface
 */
global.CustomUtils = CustomUtils;

/**
 * - An interface for modifier data.
 * - 用于特性数据的接口。
 * - - - - -
 * @class
 * @interface
 */
global.Tinker = function() {};