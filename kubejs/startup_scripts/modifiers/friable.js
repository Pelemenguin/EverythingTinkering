// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Friable | 松散
 * - - - - -
 * Every game tick, the tool has `(0.2 * level)`'s chance to lose durability.  
 * 每游戏刻有 `(0.2 * level)` 的概率损失耐久。
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
let FIRABLE = ModifierManager.registerCommonModifier("friable", "FriableModifier", {
    onInventoryTick: (tool, modifier, world, holder/*, itemSlot, isSelected, isCorrectSlot, stack*/) => {
        if (world.isClientSide()) return;
        if (holder.isPlayer() && holder.isCreative()) return;
        if (JavaMath.random() >= 0.2 * modifier.level) return;
        tool.damage += modifier.level + JavaMath.round(modifier.level * 2 * JavaMath.random());
    }
});