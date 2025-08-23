// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Antifatigue | 抗疲劳
 * - - - - -
 * Cancel mining speed reduction brought by **Mining Fatigue**,
 * at most trait-level levels of **Mining Fatigue**.  
 * 抵消**挖掘疲劳**带来的影响（最多抵消和特性等级相同级别的**挖掘疲劳**）
 * - - - - -
 * @copyright Pelemenguin 2025
 * @license LGPL-3.0-or-later
 * This file is part of EverythingTinkering.
 * Full license see file `COPYING.LESSER`
 * - - - - -
 * @author Pelemenguin
 */

/* global
    ModifierManager
    LivingEntity
*/

// eslint-disable-next-line no-unused-vars
let ANTIFATIGUE = ModifierManager.registerCommonModifier("antifatigue", "AntifatigueModifier", {
    onBreakSpeed: (tool, modifier, event /*, sideHit, isEffective, miningSpeedModifier*/) => {
        let entity = event.entity;
        if (entity instanceof LivingEntity) {
            /** @type {Internal.LivingEntity} */
            let living = entity;
            let effect = living.getEffect("minecraft:mining_fatigue");
            if (effect != null) {
                let divisor = 0.00081;
                switch (Math.min(effect.amplifier, modifier.level - 1)) {
                    case 0: divisor = 0.3; break;
                    case 1: divisor = 0.09; break;
                    case 2: divisor = 0.0027; break;
                    default: divisor = 0.00081;
                }
                // console.info(`Unmodified: ${currentSpeed}`);
                // console.info(`New speed:  ${breakSpeedEvent.newSpeed}`);
                // console.info(`Divisor:    ${divisor}`);
                event.newSpeed /= divisor;
            }
        }
    }
});