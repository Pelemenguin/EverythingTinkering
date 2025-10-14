// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Heating | 岩浆
 * - - - - -
 * Append 1 extra damage.
 * 附加1点额外伤害。
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
    KubeJSDamageSources
*/

// eslint-disable-next-line no-unused-vars
let HEATING = ModifierManager.registerCommonModifier("heating", "HeatingModifier", {
    afterMeleeHit: (tool, modifier, context, _damageDealt) => {
        if (context.getLevel().isClientSide()) return;
        if (!context.getTarget().isLiving()) return;
        /** @type {Internal.LivingEntity} */
        let target = context.getTarget();
        target.attack(KubeJSDamageSources.hotToolAttack(context.getLevel(), context.getAttacker(), context.getAttacker()), 1);
        target.playSound("minecraft:entity.player.hurt_on_fire");
    },
    __class__: {
        extending: "slimeknights.tconstruct.library.modifiers.impl.NoLevelsModifier"
    }
});