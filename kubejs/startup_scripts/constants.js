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
    StartupEvents
    Item
    console
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
const $ItemEntity = Java.loadClass("net.minecraft.world.entity.item.ItemEntity");
const $ItemStack = Java.loadClass("net.minecraft.world.item.ItemStack");
const $Ingredient = Java.loadClass("net.minecraft.world.item.crafting.Ingredient");
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
const $Projectile = Java.loadClass("net.minecraft.world.entity.projectile.Projectile");
const $MapColor = Java.loadClass("net.minecraft.world.level.material.MapColor");
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
const $FluidDeferredRegisterExtension = Java.loadClass("slimeknights.tconstruct.common.registration.FluidDeferredRegisterExtension");
const $TinkerFluids = Java.loadClass("slimeknights.tconstruct.fluids.TinkerFluids");
const $TinkerCommon = Java.loadClass("slimeknights.tconstruct.shared.TinkerCommons");
const $FluidParticleData = Java.loadClass("slimeknights.tconstruct.shared.particle.FluidParticleData");
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
const $MaterialStatsId = Java.loadClass("slimeknights.tconstruct.library.materials.stats.MaterialStatsId");
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
const $MaterialItem = Java.loadClass("slimeknights.tconstruct.library.tools.part.MaterialItem");
const $FakeIngotItem = Java.loadClass("slimeknights.tconstruct.tools.item.FakeIngotItem");
const $RepairKitItem = Java.loadClass("slimeknights.tconstruct.tools.item.RepairKitItem");
const ToolPartItem = Java.loadClass('slimeknights.tconstruct.library.tools.part.ToolPartItem');

// Create
const $FluidIngredient = Java.loadClass("com.simibubi.create.foundation.fluid.FluidIngredient");
const $DeployerApplicationRecipe = Java.loadClass("com.simibubi.create.content.kinetics.deployer.DeployerApplicationRecipe");
const $ProcessingRecipeBuilder = Java.loadClass("com.simibubi.create.content.processing.recipe.ProcessingRecipeBuilder");
const $DepotBlockEntity = Java.loadClass("com.simibubi.create.content.logistics.depot.DepotBlockEntity");

// TiC Modifier Modules
const ProtectionModule = Java.loadClass("slimeknights.tconstruct.library.modifiers.modules.armor.ProtectionModule");

// KubeJS
const KubeJS = Java.loadClass("dev.latvian.mods.kubejs.KubeJS");
const Context = Java.loadClass("dev.latvian.mods.rhino.Context");
const ConsoleJS = Java.loadClass("dev.latvian.mods.kubejs.util.ConsoleJS");
const $BlockEntityJS = Java.loadClass("dev.latvian.mods.kubejs.block.entity.BlockEntityJS");

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
const $Boolean = Java.loadClass("java.lang.Boolean");
const $ConcurrentHashMap = Java.loadClass("java.util.concurrent.ConcurrentHashMap");
const $Optional = Java.loadClass("java.util.Optional");
const $HashSet = Java.loadClass("java.util.HashSet");

// Forge
const $SoundActions = Java.loadClass("net.minecraftforge.common.SoundActions");
const $ForgeCapabilities = Java.loadClass("net.minecraftforge.common.capabilities.ForgeCapabilities");
const $FluidStack = Java.loadClass("net.minecraftforge.fluids.FluidStack");
const $FluidType$Properties = Java.loadClass("net.minecraftforge.fluids.FluidType$Properties");
/** @type {typeof Internal.FMLJavaModLoadingContext} */
const FMLJavaModLoadingContext = new NativeJavaClass(startupContext, topLevelScope, Class.forName("net.minecraftforge.fml.javafmlmod.FMLJavaModLoadingContext"));
const $NetworkRegistry = Java.loadClass("net.minecraftforge.network.NetworkRegistry");
const $ForgeRegistries = Java.loadClass('net.minecraftforge.registries.ForgeRegistries');

// ---------- Utils ---------- //

/**
 * - A list for all parts in Tinker's Construct.
 * - 匠魂中所有工具部件的列表
 * - - - - -
 * @type {(Internal.MaterialItem)[]}
 */
global.TOOL_PARTS;

/**
 * Store some deferred tasks to run.  
 * 存储一些延迟任务以运行。
 */
global.DeferredTasks;
if (global.DeferredTasks == undefined) {
    global.DeferredTasks = {};
}

StartupEvents.postInit(() => {
    /**
     * @type {Internal.MaterialItem[]}
     */
    var toolParts = [];
    $ForgeRegistries.ITEMS.getValues().forEach(item => {
        if (item instanceof $MaterialItem) {
            toolParts.push(item);
        }
    });

    global.TOOL_PARTS = toolParts;

    console.info(`Found tool part items:`);
    toolParts.forEach(i => console.info(i));
});
