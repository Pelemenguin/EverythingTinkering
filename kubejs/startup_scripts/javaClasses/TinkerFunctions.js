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
*/

/* eslint-disable no-unused-vars */

let TinkerFunctions = (new ClassCreator("TinkerFunctions"))
    .createDefaultConstructor()
    .defineClass(JavaUtils.MethodHandles.lookup());

/**
 * @type {typeof Annotation.TinkerFunctions.ProjectileLaunchFunction}
 */
let TinkerFunctions$ProjectileLaunchFunction = (new ClassCreator("TinkerFunctions$ProjectileLaunchFunction"))
    .setIsInterface()
    .addMethod('onProjectileLaunch', '(Lslimeknights/tconstruct/library/tools/nbt/IToolStackView;Lslimeknights/tconstruct/library/modifiers/ModifierEntry;Lnet/minecraft/world/entity/LivingEntity;Lnet/minecraft/world/item/ItemStack;Lnet/minecraft/world/entity/projectile/Projectile;Lnet/minecraft/world/entity/projectile/AbstractArrow;Lslimeknights/tconstruct/library/tools/nbt/ModDataNBT;Z)V', method => {
        method.setAbstract();
    })
    .addAttribute('RuntimeVisibleAnnotations', {
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
    })
    .defineClass(JavaUtils.MethodHandles.lookup());

const TinkerFunctionsSet = {
    ProjectileLaunchFunction: TinkerFunctions$ProjectileLaunchFunction
};