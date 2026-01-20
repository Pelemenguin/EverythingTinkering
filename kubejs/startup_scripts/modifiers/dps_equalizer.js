// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview DPS Equalizer | DPS均衡器
 * - - - - -
 * Increase damage for melee attacks that are not fully charged.  
 * 对未完全蓄力的近战攻击增加伤害。
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
*/

ModifierManager.registerCommonModifier("dps_equalizer", "DpsEqualizerModifier", {
    getMeleeDamage: (tool, modifier, context, baseDamage, damage) => {
        if (context.isExtraAttack()) return damage;
        let cooldown = context.getCooldown();

        let attackSpeed = context.getAttacker().getAttribute($Attributes.ATTACK_SPEED).getValue();
        if (attackSpeed <= 0) return damage;
        let fullyCharging = 20 / attackSpeed;
        let maxDamage = context.getAttacker().getAttribute($Attributes.ATTACK_DAMAGE).getValue();
        let maxDps = attackSpeed * maxDamage;

        let curTicks = cooldown * fullyCharging;

        // let preferredCooldown;
        // if (!tool.getPersistentData().contains("kubejs:dps_equalizer")) {
        //     preferredCooldown = cooldown;
        //     /** @type {Internal.CompoundTag} */
        //     let tag = NBT.compoundTag();
        //     tag.putFloat("Preference", preferredCooldown);
        //     tool.getPersistentData().put("kubejs:dps_equalizer", tag);
        // } else {
        //     let tag = tool.getPersistentData().getCompound("kubejs:dps_equalizer");
        //     preferredCooldown = (cooldown + tag.getFloat("Preference")) / 2;
        //     tag.putFloat("Preference", preferredCooldown);
        // }

        if (curTicks < 10) return damage;
        let curSpeed = 20 / curTicks;
        let wantedDamage = maxDps / curSpeed;
        let result = wantedDamage / (0.2 + 0.8 * cooldown * cooldown);
        // return result - 3 * (result - damage) * Math.abs(preferredCooldown - cooldown);
        return result;

        // TODO: Discuss whether preferred cooldown is necessary
    },
    __class__: {
        extending: "slimeknights.tconstruct.library.modifiers.impl.NoLevelsModifier"
    }
});
