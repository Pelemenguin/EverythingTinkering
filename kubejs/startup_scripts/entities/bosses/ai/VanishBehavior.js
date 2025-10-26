// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Vanish Behavior
 * - - - - -
 * @copyright Pelemenguin 2025
 * @license LGPL-3.0-or-later
 * This file is part of EverythingTinkering.
 * Full license see file `COPYING.LESSER`
 * - - - - -
 * @author Pelemenguin
 */

// /* global
//     ClassCreator
//     LivingEntity
// */

// // eslint-disable-next-line no-unused-vars
// let VanishBehavior = ClassCreator.create("entity.ai.behavior.VanishBehavior")
//     .extending("net.minecraft.world.entity.ai.behavior.Behavior")
//     .signature(sig => {
//         sig.withTypeParameter("E", E => E.extending(LivingEntity))
//             .extending("net.minecraft.world.entity.ai.behavior.Behavior", B => B.appendTypeVariable("E"));
//     })
//     .createMethod("tryStart", ["net.minecraft.server.level.ServerLevel", LivingEntity, "long"], "boolean")
//         .toPublic().codeJS((/** @type {Internal.ServerLevel} */ _world, /** @type {Internal.LivingEntity} */ living, /** @type {number} */ _tick) => {
//             if (living.getBrain().getMemory("minecraft:attack_target").isEmpty()) return true;
//             return false;
//         })
//     .createMethod("tickOrStop", ["net.minecraft.server.level.ServerLevel", LivingEntity, "long"], "void")
//         .toPublic().codeJS((/** @type {Internal.ServerLevel} */ _world, /** @type {Internal.LivingEntity} */ living, /** @type {number} */ _tick) => {
//             if (living.getBrain().getMemory("minecraft:attack_target").isPresent()) {
//                 living.getBrain().getSensors().get()
//             }
//         })
//     .createMethod("doStop", ["net.minecraft.server.level.ServerLevel", LivingEntity, "long"], "void")
//         .toPublic().codeJS((/** @type {Internal.ServerLevel} */ _world, /** @type {Internal.LivingEntity} */ _living, /** @type {number} */ _tick) => {
//         })
//     .createMethod("debugString", [], "java.lang.String")
//         .toPublic().codeJS(() => "VanishBehavior")
//     .defaultConstructor()
//     .defineClass();
