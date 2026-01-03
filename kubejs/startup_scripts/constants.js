// priority: 2147483647

// SPDX-License-Identifier: LGPL-3.0-or-later

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

// Minecraft
/** @type {typeof Internal.SimpleSoundInstance} */
const SimpleSoundInstance = Java.tryLoadClass("net.minecraft.client.resources.sounds.SimpleSoundInstance");
const $Holder = Java.loadClass("net.minecraft.core.Holder");
const NonNullList = Java.loadClass("net.minecraft.core.NonNullList");
const $Registries = Java.loadClass("net.minecraft.core.registries.Registries");
const ResourceKey = Java.loadClass("net.minecraft.resources.ResourceKey");
const $TagKey = Java.loadClass("net.minecraft.tags.TagKey");
const $AttributeModifier = Java.loadClass("net.minecraft.world.entity.ai.attributes.AttributeModifier");
const $Attributes = Java.loadClass("net.minecraft.world.entity.ai.attributes.Attributes");
const LivingEntity = Java.loadClass("net.minecraft.world.entity.LivingEntity");
const Player = Java.loadClass("net.minecraft.world.entity.player.Player");
const Entity = Java.loadClass("net.minecraft.world.entity.Entity");
const Entity$RemovalReason = Java.loadClass("net.minecraft.world.entity.Entity$RemovalReason");
const EquipmentSlot = Java.loadClass("net.minecraft.world.entity.EquipmentSlot");
const $ItemStack = Java.loadClass("net.minecraft.world.item.ItemStack");
const MobEffectInstance = Java.loadClass("net.minecraft.world.effect.MobEffectInstance");
const ChatFormatting = Java.loadClass("net.minecraft.ChatFormatting");
const LanguageManager = Java.loadClass("net.minecraft.client.resources.language.LanguageManager");
const ParticleOptions = Java.loadClass("net.minecraft.core.particles.ParticleOptions");
const ParticleTypes = Java.loadClass("net.minecraft.core.particles.ParticleTypes");
const $BlockParticleOption = Java.loadClass("net.minecraft.core.particles.BlockParticleOption");
const DustParticleOptions = Java.loadClass("net.minecraft.core.particles.DustParticleOptions");
const $ItemParticleOption = Java.loadClass("net.minecraft.core.particles.ItemParticleOption");
const $FriendlyByteBuf = Java.loadClass("net.minecraft.network.FriendlyByteBuf");
const $NetworkDirection = Java.loadClass("net.minecraftforge.network.NetworkDirection");
const $Difficulty = Java.loadClass("net.minecraft.world.Difficulty");
const $TargetingConditions = Java.loadClass("net.minecraft.world.entity.ai.targeting.TargetingConditions");
const $EvokerFangs = Java.loadClass("net.minecraft.world.entity.projectile.EvokerFangs");
const $LootParams$Builder = Java.loadClass("net.minecraft.world.level.storage.loot.LootParams$Builder");
const $LootContextParams = Java.loadClass("net.minecraft.world.level.storage.loot.parameters.LootContextParams");
const $LootContextParamSets = Java.loadClass("net.minecraft.world.level.storage.loot.parameters.LootContextParamSets");

// Mantle
/** @type {typeof Internal.ResourceColorManager} */
const ResourceColorManager = Java.tryLoadClass('slimeknights.mantle.client.ResourceColorManager');
/** @type {typeof Internal.BookTransformer} */
const BookTransformer = Java.tryLoadClass("slimeknights.mantle.client.book.transformer.BookTransformer");
/** @type {typeof Internal.ContentPageIconList} */
const ContentPageIconList = Java.tryLoadClass("slimeknights.mantle.client.book.data.content.ContentPageIconList");
/** @type {typeof Internal.ContentPageIconList$PageWithIcon} */
const ContentPageIconList$PageWithIcon = Java.tryLoadClass("slimeknights.mantle.client.book.data.content.ContentPageIconList$PageWithIcon");

// Tinker's Construct
const MaterialId = Java.loadClass('slimeknights.tconstruct.library.materials.definition.MaterialId');
const MaterialVariant = Java.loadClass('slimeknights.tconstruct.library.materials.definition.MaterialVariant');
const $MaterialVariantId = Java.loadClass("slimeknights.tconstruct.library.materials.definition.MaterialVariantId");
const TinkerBook = Java.loadClass("slimeknights.tconstruct.library.client.book.TinkerBook");
const MaterialRegistry = Java.loadClass('slimeknights.tconstruct.library.materials.MaterialRegistry');
const MaterialStatsId = Java.loadClass("slimeknights.tconstruct.library.materials.stats.MaterialStatsId");
const Modifier = Java.loadClass("slimeknights.tconstruct.library.modifiers.Modifier");
const $ModifierEntry = Java.loadClass("slimeknights.tconstruct.library.modifiers.ModifierEntry");
const $ModifierId = Java.loadClass('slimeknights.tconstruct.library.modifiers.ModifierId');
const ToolMaterialHook = Java.loadClass("slimeknights.tconstruct.library.tools.definition.module.material.ToolMaterialHook");
const ToolDamageUtil = Java.loadClass("slimeknights.tconstruct.library.tools.helper.ToolDamageUtil");
const ToolStack = Java.loadClass('slimeknights.tconstruct.library.tools.nbt.ToolStack');
const MaterialNBT = Java.loadClass('slimeknights.tconstruct.library.tools.nbt.MaterialNBT');
const MaterialNBTBuilder = Java.loadClass('slimeknights.tconstruct.library.tools.nbt.MaterialNBT$Builder');
const $ModifierNBT = Java.loadClass("slimeknights.tconstruct.library.tools.nbt.ModifierNBT");
const ToolStatId = Java.loadClass("slimeknights.tconstruct.library.tools.stat.ToolStatId");
const ToolStats = Java.loadClass('slimeknights.tconstruct.library.tools.stat.ToolStats');
const TiCToolDefinitions = Java.loadClass('slimeknights.tconstruct.tools.ToolDefinitions');
/** @type {typeof Internal.TinkerItemElement} */
const TinkerItemElement = Java.tryLoadClass("slimeknights.tconstruct.library.client.book.elements.TinkerItemElement");
const $LevelingInt = Java.loadClass("slimeknights.tconstruct.library.json.LevelingInt");
const MaterialCastingLookup = Java.loadClass("slimeknights.tconstruct.library.recipe.casting.material.MaterialCastingLookup");
const MaterialRecipeCache = Java.loadClass("slimeknights.tconstruct.library.recipe.material.MaterialRecipeCache");
const TinkerToolParts = Java.loadClass("slimeknights.tconstruct.tools.TinkerToolParts");
const TinkerTools = Java.loadClass("slimeknights.tconstruct.tools.TinkerTools");
const ModifierDeferredRegister = Java.loadClass("slimeknights.tconstruct.library.modifiers.util.ModifierDeferredRegister");
const $ModifierHooks = Java.loadClass("slimeknights.tconstruct.library.modifiers.ModifierHooks");
const $TooltipModifierHook = Java.loadClass("slimeknights.tconstruct.library.modifiers.hook.display.TooltipModifierHook");
const $CapacityBarModule = Java.loadClass("slimeknights.tconstruct.library.modifiers.modules.capacity.CapacityBarModule");
const $DurabilityShieldModule = Java.loadClass("slimeknights.tconstruct.library.modifiers.modules.capacity.DurabilityShieldModule");
const $ModifiableItem = Java.loadClass("slimeknights.tconstruct.library.tools.item.ModifiableItem");

// TiC Modifier Modules
const ProtectionModule = Java.loadClass("slimeknights.tconstruct.library.modifiers.modules.armor.ProtectionModule");

// KubeJS
const KubeJS = Java.loadClass("dev.latvian.mods.kubejs.KubeJS");
const Context = Java.loadClass("dev.latvian.mods.rhino.Context");
const ConsoleJS = Java.loadClass("dev.latvian.mods.kubejs.util.ConsoleJS");

// Logger
const logger = KubeJS.LOGGER;

// KubeJS Constants
const startupContext = KubeJS.getStartupScriptManager().context;
const topLevelScope = KubeJS.getStartupScriptManager().topLevelScope;

// MantleJS
const PageDataJS = Java.loadClass("pelemenguin.mantlejs.content.book.data.PageDataJS");
const MantleJSTransformer = Java.loadClass("pelemenguin.mantlejs.content.book.transformer.MantleJSTransformer");

// Java
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
    MethodHandles: new NativeJavaClass(startupContext, topLevelScope, Class.forName("java.lang.invoke.MethodHandles")),
    String: Java.loadClass("java.lang.String"),
    Integer: Java.loadClass("java.lang.Integer"),
    Byte: Java.loadClass("java.lang.Byte"),
    /** @type {typeof Internal.ClassLoader} */
    ClassLoader: new NativeJavaClass(startupContext, topLevelScope, Class.forName("java.lang.ClassLoader")),
    /** @type {typeof Internal.Thread} */
    Thread: new NativeJavaClass(startupContext, topLevelScope, Class.forName("java.lang.Thread"))
};
const $ConcurrentHashMap = Java.loadClass("java.util.concurrent.ConcurrentHashMap");
const $Optional = Java.loadClass("java.util.Optional");

// Forge
/** @type {typeof Internal.FMLJavaModLoadingContext} */
const FMLJavaModLoadingContext = new NativeJavaClass(startupContext, topLevelScope, Class.forName("net.minecraftforge.fml.javafmlmod.FMLJavaModLoadingContext"));
const $NetworkRegistry = Java.loadClass("net.minecraftforge.network.NetworkRegistry");
const $ForgeRegistries = Java.loadClass('net.minecraftforge.registries.ForgeRegistries');

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
 * - An interface for tinker things.
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
    let modNbt = $ModifierNBT.readFromNBT(raw);
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
 * Set the persistent data of an item.  
 * 设置一个物品的 Persistent 数据。
 * - - - - -
 * @param {Internal.ItemStack} item -
 * The item to set persistent data to.  
 * 要设置 Persistent 数据的物品。
 * 
 * @param {string} modifierId -
 * The id of the modifier.  
 * 特性 ID。
 * 
 * @param {any} value -
 * The value of the persistent data.  
 * 要设置的 Persistent 数据的值。
 */
CustomUtils.Tinker.Persistent.set = (item, modifierId, value) => {
    let newData = {tic_persistent: {}};
    newData.tic_persistent[modifierId] = value;
    item.nbt.merge(newData);
};
/**
 * Get the persistent data from an item.  
 * 从一个物品上获取 Persistent 数据。
 * - - - - -
 * @param {Internal.ItemStack} item -
 * The item to get persistent data from.  
 * 要获取 Persistent 数据的物品。
 * 
 * @param {string} modifierId -
 * The id of the modifier.  
 * 特性 ID。
 * 
 * @returns {?Internal.Tag} 
 * Result of the persistent data of the given modifier of the item.  
 * 该物品的给定特性的 Persistent 数据结果。
 */
CustomUtils.Tinker.Persistent.get = (item, modifierId) => {
    /** @type {Internal.CompoundTag} */
    let persistent = item.nbt.get("tic_persistent");
    if (persistent == null) return null;
    try {
        return persistent.get(modifierId);
    } catch (e) {
        return null;
    }
};

/**
 * Get or set default persistent data from an item.  
 * 从一个物品上获取或设置默认 Persistent 数据。
 * - - - - -
 * @type {<T extends Internal.Tag>(
 *     item: Internal.ItemStack,
 *     modifierId: string,
 *     defaultValue: T
 * ) => T}
 * - - - - -
 * @param item 
 * The item to get or set persistent data from.  
 * 要获取或设置 Persistent 数据的物品。
 * 
 * @param modifierId 
 * The id of the modifier.  
 * 特性 ID。
 * 
 * @param defaultValue 
 * The default value of the persistent data.  
 * Persistent 数据的默认值。
 * 
 * @returns 
 * Result of the persistent data of the given modifier of the item.
 * If not found, set to `defaultValue` and return it.  
 * 该物品的给定特性的 Persistent 数据结果。
 * 若未找到，则设置为 `defaultValue` 并返回它。
 */
CustomUtils.Tinker.Persistent.getOrSetDefault = (item, modifierId, defaultValue) => {
    let persistent = CustomUtils.Tinker.Persistent.get(item, modifierId);
    if (persistent == null) {
        CustomUtils.Tinker.Persistent.set(item, modifierId, defaultValue);
        return defaultValue;
    }
    return persistent;
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