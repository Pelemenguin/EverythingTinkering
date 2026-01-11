// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Kinetic Accumulator | 动能蓄能器
 * - - - - -
 * Increases movement speed after dealing damage.  
 * 造成伤害后增加移动速度。
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
    $Attributes
    $AttributeModifier
    UUID
*/

ModifierManager.registerCommonModifier("kinetic_accumulator", "KineticAccumulatorModifier", (() => {

    const KINETIC_ACCUMULATOR_MOVEMENT_SPEED_MODIFIER_UUID = UUID.fromString("dfef6f84-dbb0-47aa-ad27-1f431321e971");

    return {
        beforeMeleeHit: (tool, _modifier, _context, _damage, _baseKnockback, knockback) => {
            let speedBoost = tool.getPersistentData().getFloat("kubejs:kinetic_accumulator");

            // Use this formula to calculate new speed boost
            let arg = (speedBoost + 60) / 50;
            let newSpeedBoost = 40 * Math.log2(arg);

            tool.getPersistentData().putFloat("kubejs:kinetic_accumulator", newSpeedBoost);

            return knockback;
        },
        onMonsterMeleeHit: ModifierManager.SYNC_NORMAL_TO_MONSTER,
        onInventoryTick: (tool, _modifier, _world, _holder, _itemSlot, _isSelected, _isCorrectSlot, _stack) => {
            let speedBoost = tool.getPersistentData().getFloat("kubejs:kinetic_accumulator");
            let newSpeedBoost = Math.max(0, speedBoost - 0.1);
            tool.getPersistentData().putFloat("kubejs:kinetic_accumulator", newSpeedBoost);
        },
        addAttributes: (tool, _modifier, _slot, consumer) => {
            let speedBoost = tool.getPersistentData().getFloat("kubejs:kinetic_accumulator");
            consumer.accept(
                $Attributes.MOVEMENT_SPEED,
                new $AttributeModifier(
                    KINETIC_ACCUMULATOR_MOVEMENT_SPEED_MODIFIER_UUID,
                    "Kinetic Accumulator speed boost",
                    speedBoost / 100,
                    "multiply_base"
                )
            );
        },
        __class__: {
            extending: "slimeknights.tconstruct.library.modifiers.impl.NoLevelsModifier"
        }
    };
})());
