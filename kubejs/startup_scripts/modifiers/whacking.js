/**
 * @fileoverview Whacking | 猛击
 * - - - - -
 * ## Whacking
 * ### Description
 * Consume much more durability and deal more damage on critical hits.
 * - - - - -
 * ## 猛击
 * ### 描述
 * 消耗更多耐久并在暴击时造成更多伤害。
 * - - - - -
 * @copyright Pelemenguin 2025
 * @license LGPL-3.0-or-later
 * This file is part of EverythingTinkering.
 * Full license see file `COPYING.LESSER`
 * - - - - -
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * - - - - -
 * @author Pelemenguin
 */

/* global
    ModifierRegisterer
    JavaMath
    Player
*/

/**
 * - Controls how much percentage of durability will `whacking` consume per level.
 * - 控制 `猛击` 每级消耗耐久百分比。
 * - - - - -
 * @constant
 */
let WHACKING_DURABILITY_PERCENTAGE = 0.05;

/**
 * - Controls damage boost percentage per level.
 * - 控制 `猛击` 每级的伤害提升百分比。
 * - - - - -
 * @constant
 */
let WHACKING_DAMAGE_PERCENTAGE = 0.15;

let WHACKING = ModifierRegisterer.registerModifier("kubejs:whacking", ["getMeleeDamage"]);
WHACKING.getMeleeDamage((view, lvl, context, baseDamage, modifiedDamage) => {
    if (context.getLevel().isClientSide()) return modifiedDamage;
    if (!context.isCritical()) return modifiedDamage;
    let durabilityPercentage = JavaMath["round(float)"](view.getCurrentDurability() * WHACKING_DURABILITY_PERCENTAGE * lvl);
    let durabilityLoss = JavaMath["max(int,int)"](durabilityPercentage, 10);
    if (!(context.attacker instanceof Player && context.attacker.isCreative())) view.setDamage(durabilityLoss + view.getDamage() - 1);
    return modifiedDamage * (1 + lvl * WHACKING_DAMAGE_PERCENTAGE);
});
