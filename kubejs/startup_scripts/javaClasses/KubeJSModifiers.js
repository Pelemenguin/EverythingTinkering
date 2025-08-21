// priority: 65536

// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview KubeJSModifiers
 * - - - - -
 * @copyright Pelemenguin 2025
 * @license LGPL-3.0-or-later
 * This file is part of EverythingTinkering.
 * Full license see file `COPYING.LESSER`
 * - - - - -
 * @author Pelemenguin
 */

/* global
    ClassCreator
    CodeAttribute
    JavaUtils
    ModifierDeferredRegister
    FMLJavaModLoadingContext
    StartupEvents
    console
*/

let ProjectileLaunchFunctionCreator = (new ClassCreator("ProjectileLaunchFunction"))
    .setIsInterface().addMethod('onProjectileLaunch', '(Lslimeknights/tconstruct/library/tools/nbt/IToolStackView;Lslimeknights/tconstruct/library/modifiers/ModifierEntry;Lnet/minecraft/world/entity/LivingEntity;Lnet/minecraft/world/item/ItemStack;Lnet/minecraft/world/entity/projectile/Projectile;Lnet/minecraft/world/entity/projectile/AbstractArrow;Lslimeknights/tconstruct/library/tools/nbt/ModDataNBT;Z)V', method => {
        method.setAbstract();
    }).addAttribute('RuntimeVisibleAnnotations', {
        generateByteCode: () => {
            let references = JavaUtils.ByteBuffer.allocate(2)
                .putShort(ProjectileLaunchFunctionCreator.CONSTANT_Utf8("Ljava/lang/FunctionalInterface;"))
                .array();

            return [
                0x00, 0x01,
                references[0], references[1],
                0x00, 0x00
            ];
        }
    });

// eslint-disable-next-line no-unused-vars
let ProjectileLaunchFunction = ProjectileLaunchFunctionCreator.defineClass(JavaUtils.MethodHandles.lookup());

let TestModifier = (new ClassCreator("TestModifier"))
    .extends("slimeknights.tconstruct.library.modifiers.Modifier")
    .implements("slimeknights.tconstruct.library.modifiers.hook.ranged.ProjectileLaunchModifierHook")
    .addMethod('<init>', '()V', method => {
        method.setPublic().addAttribute('Code', new CodeAttribute(1, 1, () => [
            0x2a, // aload_0
            0xb7, // invokespecial: `superClass`.<init>()V
        ].concat(
            JavaUtils.ByteBuffer.allocate(2).putShort(0, method.parent.CONSTANT_Methodref("slimeknights/tconstruct/library/modifiers/Modifier", "<init>", "()V")).array()
        ).concat([
            0xb1, // return
        ])));
    }).addField("projectileLaunchFunction", "Ldev/latvian/mods/rhino/ProjectileLaunchFunction;", 9 /** PUBLIC, STATIC */)
    .addMethod("onProjectileLaunch", '(Lslimeknights/tconstruct/library/tools/nbt/IToolStackView;Lslimeknights/tconstruct/library/modifiers/ModifierEntry;Lnet/minecraft/world/entity/LivingEntity;Lnet/minecraft/world/item/ItemStack;Lnet/minecraft/world/entity/projectile/Projectile;Lnet/minecraft/world/entity/projectile/AbstractArrow;Lslimeknights/tconstruct/library/tools/nbt/ModDataNBT;Z)V', method => {
        method.setPublic().addAttribute('Code', new CodeAttribute(9, 9, () => {
            // let consoleRef = JavaUtils.ByteBuffer.allocate(2).putShort(0, method.parent.CONSTANT_Fieldref("dev/latvian/mods/kubejs/util/ConsoleJS", "STARTUP", "Ldev/latvian/mods/kubejs/util/ConsoleJS;")).array();
            // let infoRef = JavaUtils.ByteBuffer.allocate(2).putShort(0, method.parent.CONSTANT_Methodref("dev/latvian/mods/kubejs/util/ConsoleJS", "info", "(Ljava/lang/Object;)Ldev/latvian/mods/kubejs/script/ConsoleLine;")).array();
            // let baseDamageRef = JavaUtils.ByteBuffer.allocate(2).putShort(0, method.parent.CONSTANT_Methodref("net/minecraft/world/entity/projectile/AbstractArrow", "m_36789_", "()D")).array();
            // let doubleValueOfRef = JavaUtils.ByteBuffer.allocate(2).putShort(0, method.parent.CONSTANT_Methodref("java/lang/Double", "valueOf", "(D)Ljava/lang/Double;")).array();

            // return [
            //     0xb2, // getstatic: ConsoleJS.STARTUP                   // Stack: [ ConsoleJS object, (), () |
            //     consoleRef[0],
            //     consoleRef[1],
            //     0x19, // aload 6: AbstractArrow                         // Stack: [ ConsoleJS object, AbstractArrow object, () |
            //     0x06,
            //     0xb6, // invokevirtual: AbstractArrow.getBaseDamage()   // Stack: [ ConsoleJS object, double, ------ |
            //     baseDamageRef[0],
            //     baseDamageRef[1],
            //     0xb8, // invokestatic: Double.valueOf                   // Stack: [ ConsoleJS object, Double object, () |
            //     doubleValueOfRef[0],
            //     doubleValueOfRef[1],
            //     0xb6, // invokevirtual: ConsoleJS.info                  // Stack: [ (), (), () |
            //     infoRef[0],
            //     infoRef[1],
            //     0xb1, // return
            // ];
            let references = JavaUtils.ByteBuffer.allocate(4)
                .putShort(0, method.parent.CONSTANT_Fieldref(method.parent.name.replace(/\./g, '/'), "projectileLaunchFunction", "Ldev/latvian/mods/rhino/ProjectileLaunchFunction;"))
                .putShort(2, method.parent.CONSTANT_InterfaceMethodref("dev/latvian/mods/rhino/ProjectileLaunchFunction", "onProjectileLaunch", '(Lslimeknights/tconstruct/library/tools/nbt/IToolStackView;Lslimeknights/tconstruct/library/modifiers/ModifierEntry;Lnet/minecraft/world/entity/LivingEntity;Lnet/minecraft/world/item/ItemStack;Lnet/minecraft/world/entity/projectile/Projectile;Lnet/minecraft/world/entity/projectile/AbstractArrow;Lslimeknights/tconstruct/library/tools/nbt/ModDataNBT;Z)V'))
                .array();
            
            return [
                0xb2, // getstatic: projectileLaunchFunction  // Stack: [ object ProjectileLaunchFunction
                references[0],
                references[1],
                0x2b, // aload_1                              // Stack: [ object ProjectileLaunchFunction, object IToolStackView,
                0x2c, // aload_2                              // Stack: [ object ProjectileLaunchFunction, object IToolStackView, object ModifierEntry
                0x2d, // aload_3                              // Stack: [ object ProjectileLaunchFunction, object IToolStackView, object ModifierEntry, object LivingEntity
                0x19, // aload: 4                             // Stack: [ object ProjectileLaunchFunction, object IToolStackView, object ModifierEntry, object LivingEntity, object ItemStack,
                0x04,
                0x19, // aload: 5                             // Stack: [ object ProjectileLaunchFunction, object IToolStackView, object ModifierEntry, object LivingEntity, object ItemStack, object Projectile,
                0x05,
                0x19, // aload: 6                             // Stack: [ object ProjectileLaunchFunction, object IToolStackView, object ModifierEntry, object LivingEntity, object ItemStack, object Projectile, object AbstractArrow,
                0x06,
                0x19, // aload: 7                             // Stack: [ object ProjectileLaunchFunction, object IToolStackView, object ModifierEntry, object LivingEntity, object ItemStack, object Projectile, object AbstractArrow, object ModDataNBT
                0x07,
                0x15, // iload: 8                             // Stack: [ object ProjectileLaunchFunction, object IToolStackView, object ModifierEntry, object LivingEntity, object ItemStack, object Projectile, object AbstractArrow, object ModDataNBT, int || MAX STACK REACHED
                0x08,
                0xb9, // invokeinterface                      // Stack: [
                references[2],
                references[3],
                0x09,
                0x00,
                0xb1, // return
            ];
        }));
    }).addMethod("registerHooks", '(Lslimeknights/tconstruct/library/module/ModuleHookMap$Builder;)V', method => {
        method.setProtected().addAttribute('Code', new CodeAttribute(3, 2, () => {
            let addHookRef = JavaUtils.ByteBuffer.allocate(2).putShort(0, method.parent.CONSTANT_Methodref("slimeknights/tconstruct/library/module/ModuleHookMap$Builder", "addHook", "(Ljava/lang/Object;Lslimeknights/tconstruct/library/module/ModuleHook;)Lslimeknights/tconstruct/library/module/ModuleHookMap$Builder;")).array();
            let projectileLauchHookRef = JavaUtils.ByteBuffer.allocate(2).putShort(0, method.parent.CONSTANT_Fieldref("slimeknights/tconstruct/library/modifiers/ModifierHooks", "PROJECTILE_LAUNCH", "Lslimeknights/tconstruct/library/module/ModuleHook;")).array();

            return [
                0x2b, // aload_1: builder
                0x2a, // aload_0: this
                0xb2, // getstatic: ModifierHooks.PROJECTILE_LAUNCH
                projectileLauchHookRef[0],
                projectileLauchHookRef[1],
                0xb6, // invokevirtual
                addHookRef[0],
                addHookRef[1],
                0xb1
            ];
        }));
    }).defineClass(JavaUtils.MethodHandles.lookup());

TestModifier.projectileLaunchFunction = (tool, entry, shooter, ammo, projectile, arrow) => {
    try {
        console.info(`Arrow Base Damage: ${arrow.baseDamage}`);
    }
    catch (e) {
        console.info(e);
    }
};

StartupEvents.init(() => {
    const KUBEJS_MODIFIERS = new ModifierDeferredRegister.create("kubejs");

    // eslint-disable-next-line no-unused-vars
    let TEST_MODIFIER = KUBEJS_MODIFIERS.register("test_modifier", () => new TestModifier());

    KUBEJS_MODIFIERS.register(FMLJavaModLoadingContext.get().getModEventBus());
});