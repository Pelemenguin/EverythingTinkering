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

let TinkerFunctions$ProjectileLaunchFunction = addFunctionalInterfaceAnnotation(
        (new ClassCreator("TinkerFunctions$ProjectileLaunchFunction"))
        .setIsInterface()
        .addMethod('onProjectileLaunch', '(Lslimeknights/tconstruct/library/tools/nbt/IToolStackView;Lslimeknights/tconstruct/library/modifiers/ModifierEntry;Lnet/minecraft/world/entity/LivingEntity;Lnet/minecraft/world/item/ItemStack;Lnet/minecraft/world/entity/projectile/Projectile;Lnet/minecraft/world/entity/projectile/AbstractArrow;Lslimeknights/tconstruct/library/tools/nbt/ModDataNBT;Z)V', method => {
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

const TinkerFunctionsSet = {
    ProjectileLaunchFunction: {
        class: TinkerFunctions$ProjectileLaunchFunction,

        /** @type {string} */
        internalName: TinkerFunctions$ProjectileLaunchFunction.__javaObject__.getName().replace('.', '/'),

        /**
         * @param {ClassCreator} classCreator 
         */
        addClassMethod: (classCreator) => {
            let interfaceName = TinkerFunctionsSet.ProjectileLaunchFunction.internalName;
            let methodDescriptor = "(Lslimeknights/tconstruct/library/tools/nbt/IToolStackView;Lslimeknights/tconstruct/library/modifiers/ModifierEntry;Lnet/minecraft/world/entity/LivingEntity;Lnet/minecraft/world/item/ItemStack;Lnet/minecraft/world/entity/projectile/Projectile;Lnet/minecraft/world/entity/projectile/AbstractArrow;Lslimeknights/tconstruct/library/tools/nbt/ModDataNBT;Z)V";

            classCreator.implements("slimeknights.tconstruct.library.modifiers.hook.ranged.ProjectileLaunchModifierHook")
                .addField("onProjectileLaunchFunction", `L${interfaceName};`, 9)
                .addMethod("onProjectileLaunch", methodDescriptor, method => {
                    method.addAttribute("Code", new CodeAttribute(9, 9).setCustomByteCodeGenerator((classCreator) => {
                        let references = JavaUtils.ByteBuffer.allocate(4)
                            .putShort(0, classCreator.CONSTANT_Fieldref(classCreator.name.replace(/\./g, '/'), "onProjectileLaunchFunction", `L${interfaceName};`))
                            .putShort(2, classCreator.CONSTANT_InterfaceMethodref(interfaceName, "onProjectileLaunch", methodDescriptor))
                            .array();

                        return [
                            0xb2, // getstatic thisClass.onProjectileLaunchFunction
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
                            0x19, // aload 7
                                0x07,
                            0x15, // iload 8
                                0x08,
                            0xb9, // invokeinterface
                                references[2],
                                references[3],
                                0x09,
                                0x00,
                            0xb1, // return
                        ];
                    }));
                });
        }
    },
    BreakSpeedFunction: {
        class: TinkerFunctions$BreakSpeedFunction,

        /** @type {string} */
        internalName: TinkerFunctions$BreakSpeedFunction.__javaObject__.getName().replace('.', '/'),

        /**
         * @param {ClassCreator} classCreator 
         */
        addClassMethod: (classCreator) => {
            let interfaceName = TinkerFunctionsSet.BreakSpeedFunction.class.__javaObject__.getName().replace('.', '/');
            let methodDescriptor = "(Lslimeknights/tconstruct/library/tools/nbt/IToolStackView;Lslimeknights/tconstruct/library/modifiers/ModifierEntry;Lnet/minecraftforge/event/entity/player/PlayerEvent$BreakSpeed;Lnet/minecraft/core/Direction;ZF)V";

            classCreator.implements("slimeknights.tconstruct.library.modifiers.hook.mining.BreakSpeedModifierHook")
                .addField("onBreakSpeedFunction", `L${interfaceName};`, 9)
                .addMethod("onBreakSpeed", methodDescriptor, method => {
                    method.addAttribute("Code", new CodeAttribute(7, 7).setCustomByteCodeGenerator(classCreator => {
                        let references = JavaUtils.ByteBuffer.allocate(4)
                            .putShort(0, classCreator.CONSTANT_Fieldref(classCreator.name.replace(/\./g, '/'), "onBreakSpeedFunction", `L${interfaceName};`))
                            .putShort(2, classCreator.CONSTANT_InterfaceMethodref(interfaceName, "onBreakSpeed", methodDescriptor))
                            .array();

                        return [
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
                        ];
                    }));
                });
        }
    }
};