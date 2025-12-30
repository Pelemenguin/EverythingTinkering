// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Pottery | 陶片
 * - - - - -
 * Random damage boost after tool is damaged.
 * 工具损伤后随机伤害提升
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
    JavaMath
*/

// eslint-disable-next-line no-unused-vars
let POTTERY = ModifierManager.registerCommonModifier("pottery", "PotteryModifier", {
    getMeleeDamage: (tool, modifier, context, baseDamage, damage) => {
        let boost = JavaMath.random() * (tool.damage / (tool.damage + tool.currentDurability) * modifier.level);
        return damage + Math.min(boost, damage);
    },
    getMeleeDamageForMonster: ModifierManager.SYNC_NORMAL_TO_MONSTER
});