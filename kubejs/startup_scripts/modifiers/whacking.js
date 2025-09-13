// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Whacking | 猛击
 * - - - - -
 * Consume much more durability and deal more damage on critical hits.
 * 消耗更多耐久并在暴击时造成更多伤害。
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
    ToolDamageUtil
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
let WHACKING_DAMAGE_PERCENTAGE = 0.05;

// eslint-disable-next-line no-unused-vars
let WHACKING = ModifierManager.registerCommonModifier("whacking", "WhackingModifier", {
    getMeleeDamage: (tool, modifier, context, baseDamage, damage) => {
        if (context.getLevel().isClientSide()) return damage;
        if (!context.isCritical()) return damage;
        let durabilityPercentage = Math.round(tool.getCurrentDurability() * WHACKING_DURABILITY_PERCENTAGE * modifier.level);
        let durabilityLoss = Math.max(durabilityPercentage, 10);
        ToolDamageUtil["damageAnimated(slimeknights.tconstruct.library.tools.nbt.IToolStackView,int,net.minecraft.world.entity.LivingEntity,net.minecraft.world.entity.EquipmentSlot)"](tool, durabilityLoss, context.attacker, context.getSlotType());
        return damage * (1 + modifier.level * WHACKING_DAMAGE_PERCENTAGE);
    }
});