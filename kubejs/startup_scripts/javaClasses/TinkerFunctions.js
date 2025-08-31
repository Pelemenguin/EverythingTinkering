// priority: 65536

// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Tinker Functions
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
    JavaUtils
    CodeAttribute
*/

/* eslint-disable no-unused-vars */

/**
 * @param {ClassCreator} classCreator 
 */
let addFunctionalInterfaceAnnotation = (classCreator) => {
    return classCreator.addAttribute('RuntimeVisibleAnnotations', {
        generateByteCode: (classCreator) => {
            let references = JavaUtils.ByteBuffer.allocate(2)
                .putShort(classCreator.CONSTANT_Utf8("Ljava/lang/FunctionalInterface;"))
                .array();

            return [
                0x00, 0x01,
                references[0], references[1],
                0x00, 0x00
            ];
        }
    });
};

let TinkerFunctions = (new ClassCreator("TinkerFunctions"))
    .createDefaultConstructor()
    .defineClass(JavaUtils.MethodHandles.lookup());

let TinkerFunctions$InventoryTickFunction = addFunctionalInterfaceAnnotation(
    (new ClassCreator("TinkerFunctions$InventoryTickFunction"))
        .setIsInterface()
        .addMethod("onInventoryTick", "(Lslimeknights/tconstruct/library/tools/nbt/IToolStackView;Lslimeknights/tconstruct/library/modifiers/ModifierEntry;Lnet/minecraft/world/level/Level;Lnet/minecraft/world/entity/LivingEntity;IZZLnet/minecraft/world/item/ItemStack;)V", method => {
            method.setAbstract();
        })
).defineClass(JavaUtils.MethodHandles.lookup());

let TinkerFunctions$AddTooltipFunction = addFunctionalInterfaceAnnotation(
    (new ClassCreator("TinkerFunctions$AddTooltipFunction"))
        .setIsInterface()
        .addMethod("addTooltip", "(Lslimeknights/tconstruct/library/tools/nbt/IToolStackView;Lslimeknights/tconstruct/library/modifiers/ModifierEntry;Lnet/minecraft/world/entity/player/Player;Ljava/util/List;Lslimeknights/mantle/client/TooltipKey;Lnet/minecraft/world/item/TooltipFlag;)V", method => {
            method.setAbstract();
        })
).defineClass(JavaUtils.MethodHandles.lookup());

let TinkerFunctions$MeleeDamageFunction = addFunctionalInterfaceAnnotation(
    (new ClassCreator("TinkerFunctions$MeleeDamageFunction"))
        .setIsInterface()
        .addMethod("getMeleeDamage", "(Lslimeknights/tconstruct/library/tools/nbt/IToolStackView;Lslimeknights/tconstruct/library/modifiers/ModifierEntry;Lslimeknights/tconstruct/library/tools/context/ToolAttackContext;FF)F", method => {
            method.setAbstract();
        })
).defineClass(JavaUtils.MethodHandles.lookup());

let TinkerFunctions$BeforeMeleeHitFunction = addFunctionalInterfaceAnnotation(
    (new ClassCreator("TinkerFunctions$BeforeMeleeHitFunction"))
        .setIsInterface()
        .addMethod("beforeMeleeHit", "(Lslimeknights/tconstruct/library/tools/nbt/IToolStackView;Lslimeknights/tconstruct/library/modifiers/ModifierEntry;Lslimeknights/tconstruct/library/tools/context/ToolAttackContext;FFF)F", method => {
            method.setAbstract();
        })
).defineClass(JavaUtils.MethodHandles.lookup());

let TinkerFunctions$AfterMeleeHitFunction = addFunctionalInterfaceAnnotation(
    (new ClassCreator("TinkerFunctions$AfterMeleeHitFunction"))
        .setIsInterface()
        .addMethod("afterMeleeHit", "(Lslimeknights/tconstruct/library/tools/nbt/IToolStackView;Lslimeknights/tconstruct/library/modifiers/ModifierEntry;Lslimeknights/tconstruct/library/tools/context/ToolAttackContext;F)V", method => {
            method.setAbstract();
        })
).defineClass(JavaUtils.MethodHandles.lookup());

let TinkerFunctions$OnAttackedFunction = addFunctionalInterfaceAnnotation(
    (new ClassCreator("TinkerFunctions$OnAttackedFunction"))
        .setIsInterface()
        .addMethod("onAttacked", "(Lslimeknights/tconstruct/library/tools/nbt/IToolStackView;Lslimeknights/tconstruct/library/modifiers/ModifierEntry;Lslimeknights/tconstruct/library/tools/context/EquipmentContext;Lnet/minecraft/world/entity/EquipmentSlot;Lnet/minecraft/world/damagesource/DamageSource;FZ)V", method => {
            method.setAbstract();
        })
).defineClass(JavaUtils.MethodHandles.lookup());

let TinkerFunctions$BreakSpeedFunction = addFunctionalInterfaceAnnotation(
    (new ClassCreator("TinkerFunctions$BreakSpeedFunction"))
    .setIsInterface()
    .addMethod("onBreakSpeed", "(Lslimeknights/tconstruct/library/tools/nbt/IToolStackView;Lslimeknights/tconstruct/library/modifiers/ModifierEntry;Lnet/minecraftforge/event/entity/player/PlayerEvent$BreakSpeed;Lnet/minecraft/core/Direction;ZF)V", method => {
        method.setAbstract();
    })
).defineClass(JavaUtils.MethodHandles.lookup());

let TinkerFunctions$BlockBreakFunction = addFunctionalInterfaceAnnotation(
    (new ClassCreator("TinkerFunctions$BlockBreakFunction"))
    .setIsInterface()
    .addMethod("afterBlockBreak", "(Lslimeknights/tconstruct/library/tools/nbt/IToolStackView;Lslimeknights/tconstruct/library/modifiers/ModifierEntry;Lslimeknights/tconstruct/library/tools/context/ToolHarvestContext;)V", method => {
        method.setAbstract();
    })
).defineClass(JavaUtils.MethodHandles.lookup());

let TinkerFunctions$ProjectileLaunchFunction = addFunctionalInterfaceAnnotation(
    (new ClassCreator("TinkerFunctions$ProjectileLaunchFunction"))
        .setIsInterface()
        .addMethod('onProjectileLaunch', '(Lslimeknights/tconstruct/library/tools/nbt/IToolStackView;Lslimeknights/tconstruct/library/modifiers/ModifierEntry;Lnet/minecraft/world/entity/LivingEntity;Lnet/minecraft/world/item/ItemStack;Lnet/minecraft/world/entity/projectile/Projectile;Lnet/minecraft/world/entity/projectile/AbstractArrow;Lslimeknights/tconstruct/library/tools/nbt/ModDataNBT;Z)V', method => {
            method.setAbstract();
        })
    ).defineClass(JavaUtils.MethodHandles.lookup());

/**
 * @param {typeof any} tinkerFunctionClass
 * @param {string} methodDescriptor
 * @param {string} implementingInterface
 * @param {string} functionName
 * @param {number} maxStackAndLocals
 * @param {((references: number[]) => number[])} byteCodeGenerator
 * @returns {((classCreator: ClassCreator) => void)}
 */
let addClassMethodHelper = (tinkerFunctionClass, methodDescriptor, implementingInterface, functionName, maxStack, maxLocals, byteCodeGenerator) => {
    /**
     * @param {ClassCreator} classCreator
     */
    return (classCreator) => {
        let interfaceName = tinkerFunctionClass.__javaObject__.getName().replace('.', '/');

        classCreator.implements(implementingInterface)
            .addField(`${functionName}Function`, `L${interfaceName};`, 9)
            .addMethod(functionName, methodDescriptor, method => {
                method.addAttribute("Code", new CodeAttribute(maxStack, maxLocals).setCustomByteCodeGenerator(() => {
                    let references = JavaUtils.ByteBuffer.allocate(4)
                        .putShort(0, classCreator.CONSTANT_Fieldref(classCreator.internalName, `${functionName}Function`, `L${interfaceName};`))
                        .putShort(2, classCreator.CONSTANT_InterfaceMethodref(interfaceName, functionName, methodDescriptor))
                        .array();

                    return byteCodeGenerator(references);
                }));
            });
    };
};

const TinkerFunctionsSet = {

    InventoryTickFunction: {
        class: TinkerFunctions$InventoryTickFunction,

        /** @type {string} */
        internalName: TinkerFunctions$InventoryTickFunction.__javaObject__.getName().replace('.', '/'),

        addClassMethod: addClassMethodHelper(
            TinkerFunctions$InventoryTickFunction,
            "(Lslimeknights/tconstruct/library/tools/nbt/IToolStackView;Lslimeknights/tconstruct/library/modifiers/ModifierEntry;Lnet/minecraft/world/level/Level;Lnet/minecraft/world/entity/LivingEntity;IZZLnet/minecraft/world/item/ItemStack;)V",
            "slimeknights.tconstruct.library.modifiers.hook.interaction.InventoryTickModifierHook",
            "onInventoryTick",
            9,
            9,
            (references) => [
                0xb2, // 0: getstatic thisClass.onProjectileLaunchFunction
                    references[0], references[1],
                0x2b, // 3: aload_1
                0x2c, // 4: aload_2
                0x2d, // 5: aload_3
                0x19, // 6: aload #4
                    0x04,
                0x15, // 8: iload #5
                    0x05,
                0x15, // 10: iload #6
                    0x06,
                0x15, // 12: iload #7
                    0x07,
                0x19, // 14: aload #8
                    0x08,
                0xb9, // 16: invokeinterface
                    references[2],
                    references[3],
                    0x09,
                    0x00,
                0xb1, // 21: return
            ]
        )
    },

    AddTooltipFunction: {
        class: TinkerFunctions$AddTooltipFunction,

        /** @type {string} */
        internalName: TinkerFunctions$AddTooltipFunction.__javaObject__.getName().replace('.', '/'),

        addClassMethod: addClassMethodHelper(
            TinkerFunctions$AddTooltipFunction,
            "(Lslimeknights/tconstruct/library/tools/nbt/IToolStackView;Lslimeknights/tconstruct/library/modifiers/ModifierEntry;Lnet/minecraft/world/entity/player/Player;Ljava/util/List;Lslimeknights/mantle/client/TooltipKey;Lnet/minecraft/world/item/TooltipFlag;)V",
            "slimeknights.tconstruct.library.modifiers.hook.display.TooltipModifierHook",
            "addTooltip",
            7,
            7,
            (references) => [
                0xb2, // getstatic thisClass.addTooltipFunction
                    references[0], references[1],
                0x2b, // aload_1
                0x2c, // aload_2
                0x2d, // aload_3
                0x19, // aload 4
                    0x04,
                0x19, // aload 5
                    0x05,
                0x19, // aload 6
                    0x06,
                0xb9, // invokeinterface
                    references[2], references[3],
                    0x07, 0x00,
                0xb1, // return
            ]
        )
    },

    MeleeDamageFunction: {
        class: TinkerFunctions$MeleeDamageFunction,

        /** @type {string} */
        internalName: TinkerFunctions$MeleeDamageFunction.__javaObject__.getName().replace('.', '/'),

        addClassMethod: addClassMethodHelper(
            TinkerFunctions$MeleeDamageFunction,
            "(Lslimeknights/tconstruct/library/tools/nbt/IToolStackView;Lslimeknights/tconstruct/library/modifiers/ModifierEntry;Lslimeknights/tconstruct/library/tools/context/ToolAttackContext;FF)F",
            "slimeknights.tconstruct.library.modifiers.hook.combat.MeleeDamageModifierHook",
            "getMeleeDamage",
            7,
            7,
            (references) => [
                0xb2, // getstatic thisClass.getMeleeDamageFunction
                    references[0], references[1],
                0x2b, // aload_1
                0x2c, // aload_2
                0x2d, // aload_3
                0x17, // fload #4
                    0x04,
                0x17, // fload #5
                    0x05,
                0xb9, // invokeinterface
                    references[2], references[3],
                    0x06, 0x00,
                0xae, // freturn
            ]
        )
    },
    
    BeforeMeleeHitFunction: {
        class: TinkerFunctions$BeforeMeleeHitFunction,

        /** @type {string} */
        internalName: TinkerFunctions$BeforeMeleeHitFunction.__javaObject__.getName().replace('.', '/'),

        addClassMethod: addClassMethodHelper(
            TinkerFunctions$BeforeMeleeHitFunction,
            "(Lslimeknights/tconstruct/library/tools/nbt/IToolStackView;Lslimeknights/tconstruct/library/modifiers/ModifierEntry;Lslimeknights/tconstruct/library/tools/context/ToolAttackContext;FFF)F",
            "slimeknights.tconstruct.library.modifiers.hook.combat.MeleeHitModifierHook",
            "beforeMeleeHit",
            7,
            7,
            (references) => [
                0xb2, // getstatic thisClass.beforeMeleeHitFunction
                    references[0], references[1],
                0x2b, // aload_1
                0x2c, // aload_2
                0x2d, // aload_3
                0x17, // fload 4
                    0x04,
                0x17, // fload 5
                    0x05,
                0x17, // fload 6
                    0x06,
                0xb9, // invokeinterface
                    references[2], references[3],
                    0x07, 0x00,
                0xae, // freturn
            ]
        )
    },

    AfterMeleeHitFunction: {
        class: TinkerFunctions$AfterMeleeHitFunction,

        /** @type {string} */
        internalName: TinkerFunctions$AfterMeleeHitFunction.__javaObject__.getName().replace('.', '/'),

        addClassMethod: addClassMethodHelper(
            TinkerFunctions$AfterMeleeHitFunction,
            "(Lslimeknights/tconstruct/library/tools/nbt/IToolStackView;Lslimeknights/tconstruct/library/modifiers/ModifierEntry;Lslimeknights/tconstruct/library/tools/context/ToolAttackContext;F)V",
            "slimeknights.tconstruct.library.modifiers.hook.combat.MeleeHitModifierHook",
            "afterMeleeHit",
            5,
            5,
            (references) => [
                0xb2, // getstatic thisClass.afterMeleeHitFunction
                    references[0], references[1],
                0x2b, // aload_1
                0x2c, // aload_2
                0x2d, // aload_3
                0x17, // fload 4
                    0x04,
                0xb9, // invokeinterface
                    references[2], references[3],
                    0x05, 0x00,
                0xb1, // return
            ]
        )
    },

    OnAttackedFunction: {
        class: TinkerFunctions$OnAttackedFunction,

        /** @type {string} */
        internalName: TinkerFunctions$OnAttackedFunction.__javaObject__.getName().replace('.', '/'),

        addClassMethod: addClassMethodHelper(
            TinkerFunctions$OnAttackedFunction,
            "(Lslimeknights/tconstruct/library/tools/nbt/IToolStackView;Lslimeknights/tconstruct/library/modifiers/ModifierEntry;Lslimeknights/tconstruct/library/tools/context/EquipmentContext;Lnet/minecraft/world/entity/EquipmentSlot;Lnet/minecraft/world/damagesource/DamageSource;FZ)V",
            "slimeknights.tconstruct.library.modifiers.hook.armor.OnAttackedModifierHook",
            "onAttacked",
            8,
            8,
            (references) => [
                0xb2, // getstatic thisClass.onAttackedFunction
                    references[0], references[1],
                0x2b, // aload_1
                0x2c, // aload_2
                0x2d, // aload_3
                0x19, // aload 4
                    0x04,
                0x19, // aload #5
                    0x05,
                0x17, // fload #6
                    0x06,
                0x15, // iload #7
                    0x07,
                0xb9, // invokeinterface
                    references[2], references[3],
                    0x08, 0x00,
                0xb1, // return
            ]
        )
    },

    BreakSpeedFunction: {
        class: TinkerFunctions$BreakSpeedFunction,

        /** @type {string} */
        internalName: TinkerFunctions$BreakSpeedFunction.__javaObject__.getName().replace('.', '/'),

        addClassMethod: addClassMethodHelper(
            TinkerFunctions$BreakSpeedFunction,
            "(Lslimeknights/tconstruct/library/tools/nbt/IToolStackView;Lslimeknights/tconstruct/library/modifiers/ModifierEntry;Lnet/minecraftforge/event/entity/player/PlayerEvent$BreakSpeed;Lnet/minecraft/core/Direction;ZF)V",
            "slimeknights.tconstruct.library.modifiers.hook.mining.BreakSpeedModifierHook",
            "onBreakSpeed",
            7,
            7,
            (references) => [
                0xb2, // getstatic thisClass.onBreakSpeedFunction
                    references[0], references[1],
                0x2b, // aload_1
                0x2c, // aload_2
                0x2d, // aload_3
                0x19, // aload 4
                    0x04,
                0x15, // iload 5
                    0x05,
                0x17, // fload 6
                    0x06,
                0xb9, // invokeinterface
                    references[2], references[3],
                    0x07, 0x00,
                0xb1, // return
            ]
        )
    },

    BlockBreakFunction: {
        class: TinkerFunctions$BlockBreakFunction,

        /** @type {string} */
        internalName: TinkerFunctions$BlockBreakFunction.__javaObject__.getName().replace('.', '/'),

        addClassMethod: addClassMethodHelper(
            TinkerFunctions$BlockBreakFunction,
            "(Lslimeknights/tconstruct/library/tools/nbt/IToolStackView;Lslimeknights/tconstruct/library/modifiers/ModifierEntry;Lslimeknights/tconstruct/library/tools/context/ToolHarvestContext;)V",
            "slimeknights.tconstruct.library.modifiers.hook.mining.BlockBreakModifierHook",
            "afterBlockBreak",
            4,
            4,
            (references) => [
                0xb2, // getstatic thisClass.afterBlockBreakFunction
                    references[0], references[1],
                0x2b, // aload_1
                0x2c, // aload_2
                0x2d, // aload_3
                0xb9, // invokeinterface
                    references[2], references[3],
                    0x04, 0x00,
                0xb1, // return
            ]
        )
    },

    ProjectileLaunchFunction: {
        class: TinkerFunctions$ProjectileLaunchFunction,

        /** @type {string} */
        internalName: TinkerFunctions$ProjectileLaunchFunction.__javaObject__.getName().replace('.', '/'),

        addClassMethod: addClassMethodHelper(
            TinkerFunctions$ProjectileLaunchFunction,
            "(Lslimeknights/tconstruct/library/tools/nbt/IToolStackView;Lslimeknights/tconstruct/library/modifiers/ModifierEntry;Lnet/minecraft/world/entity/LivingEntity;Lnet/minecraft/world/item/ItemStack;Lnet/minecraft/world/entity/projectile/Projectile;Lnet/minecraft/world/entity/projectile/AbstractArrow;Lslimeknights/tconstruct/library/tools/nbt/ModDataNBT;Z)V",
            "slimeknights.tconstruct.library.modifiers.hook.ranged.ProjectileLaunchModifierHook",
            "onProjectileLaunch",
            9,
            9,
            (references) => [
                0xb2, // 0: getstatic thisClass.onProjectileLaunchFunction
                    references[0], references[1],
                0x2b, // 3: aload_1
                0x2c, // 4: aload_2
                0x2d, // 5: aload_3
                0x19, // 6: aload #4
                    0x04,
                0x19, // 8: aload #5
                    0x05,
                0x19, // 10: aload #6
                    0x06,
                0x19, // 12: aload #7
                    0x07,
                0x15, // 14: iload #8
                    0x08,
                0xb9, // 16: invokeinterface
                    references[2],
                    references[3],
                    0x09,
                    0x00,
                0xb1, // 21: return
            ]
        )
    }
};