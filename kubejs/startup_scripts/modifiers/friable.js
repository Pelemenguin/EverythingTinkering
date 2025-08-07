/**
 * @fileoverview Friable | 松散
 * - - - - -
 * ## Friable
 * ### Description
 * Every game tick, the tool has `(0.2 * level)`'s chance to lose durability.
 * - - - - -
 * ## 松散
 * ### 描述
 * 每游戏刻有 `(0.2 * level)` 的概率损失耐久。
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
    CustomUtils
    JavaMath

*/

let FRIABLE = ModifierRegisterer.registerModifier("kubejs:friable", ["onInventoryTick"]);
FRIABLE.onInventoryTick((view, lvl, level, entity, slot, inMainHand, inAvailableSlot, itemStack) => {
    if (JavaMath.random() >= 0.2 * lvl) return;
    CustomUtils.Tinker.tryDamageItem(itemStack, (lvl + JavaMath.round(lvl * 2 * JavaMath.random())), entity, level);
});