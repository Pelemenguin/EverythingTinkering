// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Shulker | 潜影
 * - - - - -
 * Grants more defense when sneaking.
 * 潜行时获取更多护甲值。
 * - - - - -
 * @copyright Pelemenguin 2025
 * @license LGPL-3.0-or-later
 * This file is part of EverythingTinkering.
 * Full license see file `COPYING.LESSER`
 * - - - - -
 * @author Pelemenguin
 */

// eslint-disable-next-line no-unused-vars
let SHULKER = ModifierManager.registerCommonModifier("shulker", "ShulkerModifier", {
    /**
     * @param {Internal.Player} living
     */
    modifyStat: (_tool, modifier, living, stat, baseValue, _multiplier) => {
        if (living.isPlayer() && living.isShiftKeyDown()) {
            if (stat == ToolStats.ARMOR) {
                return baseValue + 2 * modifier.level;
            }
        }
        return baseValue;
    }
});
