// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Night Owl | 夜猫子
 * - - - - -
 * Continuously gain night vision effect in the dark.
 * 在黑暗中持续获得夜视效果。
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
    MobEffectInstance
    ToolDamageUtil
*/

/**
 * - Minimum light level to not gain night vision effect.
 * - 不获得夜视效果的最低光照等级。
 * - - - - -
 * @constant
 */
let NIGHT_OWL_MIN_LIGHT = 7;

// eslint-disable-next-line no-unused-vars
let NIGHT_OWL = ModifierManager.registerCommonModifier("night_owl", "NightOwlModifier", {
    onInventoryTick: (tool, _modifier, world,/** @type {Internal.Player} */ holder, _itemSlot, _isSelected, isCorrectSlot, stack) => {
        if (world.isClientSide()) return;
        if (!isCorrectSlot) return;
        if (holder.isPlayer() && (world.isNight() || world.isThundering())) {
            if (holder.getBlock().getLight() > NIGHT_OWL_MIN_LIGHT) return;
            holder.addEffect(new MobEffectInstance("minecraft:night_vision", 401, 0, true, false, true));
            if (!holder.isCreative()) {
                if (world.getTime() % 60 == 0) {
                    ToolDamageUtil.damage(tool, 1, holder, stack);
                }
            }
        }
    },
    __class__: {
        extending: "slimeknights.tconstruct.library.modifiers.impl.NoLevelsModifier"
    }
});