/**
 * @fileoverview Pottery | 陶片
 * - - - - -
 * ## Pottery
 * ### Description
 * Random damage boost after tool is damaged.
 * - - - - -
 * ## 陶片
 * ### 描述
 * 工具损伤后随机伤害提升
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
*/

let POTTERY = ModifierRegisterer.registerModifier("kubejs:pottery", ["getMeleeDamage"]);
POTTERY.getMeleeDamage((view, lvl, context, baseDamage, modifiedDamage) => {
    let boost = JavaMath.random() * (view.damage / (view.damage + view.currentDurability) * lvl);
    return modifiedDamage + boost;
});
