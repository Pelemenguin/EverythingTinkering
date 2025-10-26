// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Icy Terracube
 * - - - - -
 * @copyright Pelemenguin 2025
 * @license LGPL-3.0-or-later
 * This file is part of EverythingTinkering.
 * Full license see file `COPYING.LESSER`
 * - - - - -
 * @author Pelemenguin
 */

/* global
    EntityJSEvents
*/

// EntityJSEvents.buildBrainProvider("kubejs:icy_terracube", event => {
//     event.addMemory("minecraft:attack_target");
//     event.addMemory("minecraft:look_target");
//     event.addSensor("minecraft:nearest_players");
// });

// EntityJSEvents.buildBrain("kubejs:icy_terracube", event => {
//     const CORE_ACTIVITY = [

//     ];
//     const IDLE_ACTIVITY = [
//         event.behaviors.animalPanic(2)
//     ];
//     const FIGHT_ACTIVITY = [
//         event.behaviors.gotoTargetLocation("minecraft:attack_target", 20, 1),
//         event.behaviors.meleeAttack(5)
//     ];
//     event.coreActivity(0, CORE_ACTIVITY);
//     event.idleActivity(0, IDLE_ACTIVITY);
//     event.addActivity("fight", 1, FIGHT_ACTIVITY);
// });

// EntityJSEvents.addGoalSelectors("kubejs:icy_terracube", event => {
//     event.meleeAttack(0, 1, true);
//     event.leapAtTarget(1, 2);
// });

// EntityJSEvents.addGoals("kubejs:icy_terracube", event => {
//     event.nearestAttackableTarget(1, Java.loadClass("net.minecraft.world.entity.player.Player"), 20, false, false, () => true, event.entity.boundingBox.inflate(20));
// });
