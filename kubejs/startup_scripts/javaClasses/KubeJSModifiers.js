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
*/

// eslint-disable-next-line no-unused-vars
let ProjectileLaunchFunction = (new ClassCreator("ProjectileLaunchFunction"))
    .isInterface().defineHiddenClass(JavaUtils.MethodHandles.lookup());

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
    }).addMethod("onProjectileLaunch", '(Lslimeknights/tconstruct/library/tools/nbt/IToolStackView;Lslimeknights/tconstruct/library/modifiers/ModifierEntry;Lnet/minecraft/world/entity/LivingEntity;Lnet/minecraft/world/item/ItemStack;Lnet/minecraft/world/entity/projectile/Projectile;Lnet/minecraft/world/entity/projectile/AbstractArrow;Lslimeknights/tconstruct/library/tools/nbt/ModDataNBT;Z)V', method => {
        method.setPublic().addAttribute('Code', new CodeAttribute(3, 9, () => {
            let consoleRef = JavaUtils.ByteBuffer.allocate(2).putShort(0, method.parent.CONSTANT_Fieldref("dev/latvian/mods/kubejs/util/ConsoleJS", "STARTUP", "Ldev/latvian/mods/kubejs/util/ConsoleJS;")).array();
            let infoRef = JavaUtils.ByteBuffer.allocate(2).putShort(0, method.parent.CONSTANT_Methodref("dev/latvian/mods/kubejs/util/ConsoleJS", "info", "(Ljava/lang/Object;)Ldev/latvian/mods/kubejs/script/ConsoleLine;")).array();
            let baseDamageRef = JavaUtils.ByteBuffer.allocate(2).putShort(0, method.parent.CONSTANT_Methodref("net/minecraft/world/entity/projectile/AbstractArrow", "m_36789_", "()D")).array();
            let doubleValueOfRef = JavaUtils.ByteBuffer.allocate(2).putShort(0, method.parent.CONSTANT_Methodref("java/lang/Double", "valueOf", "(D)Ljava/lang/Double;")).array();

            return [
                0xb2, // getstatic: ConsoleJS.STARTUP                   // Stack: [ ConsoleJS object, (), () |
                consoleRef[0],
                consoleRef[1],
                0x19, // aload 6: AbstractArrow                         // Stack: [ ConsoleJS object, AbstractArrow object, () |
                0x06,
                0xb6, // invokevirtual: AbstractArrow.getBaseDamage()   // Stack: [ ConsoleJS object, double, ------ |
                baseDamageRef[0],
                baseDamageRef[1],
                0xb8, // invokestatic: Double.valueOf                   // Stack: [ ConsoleJS object, Double object, () |
                doubleValueOfRef[0],
                doubleValueOfRef[1],
                0xb6, // invokevirtual: ConsoleJS.info                  // Stack: [ (), (), () |
                infoRef[0],
                infoRef[1],
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
    }).defineHiddenClass(JavaUtils.MethodHandles.lookup());

StartupEvents.init(() => {
    const KUBEJS_MODIFIERS = new ModifierDeferredRegister.create("kubejs");

    // eslint-disable-next-line no-unused-vars
    let TEST_MODIFIER = KUBEJS_MODIFIERS.register("test_modifier", () => new TestModifier());

    KUBEJS_MODIFIERS.register(FMLJavaModLoadingContext.get().getModEventBus());
});