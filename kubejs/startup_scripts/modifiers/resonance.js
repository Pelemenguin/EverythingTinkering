// SPDX-License-Identifier: LGPL-3.0-or-later
 
/**
 * @fileoverview Resonance | 共振
 * - - - - -
 * Show all the same type of entites nearby on attack.
 * 攻击时显示周围所有同种实体。
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
    AABB
    MobEffectInstance
*/

// eslint-disable-next-line no-unused-vars
let RESONANCE = ModifierManager.registerCommonModifier("resonance", "ResonanceModifier", {
    beforeMeleeHit: (tool, modifier, context, damage, baseKnockback, knockback) => {
        let target = context.getTarget();
        if (!target.isLiving()) return knockback;
        let targetPos = target.position();
        let span = modifier.level * 2 + damage;
        let aabb = AABB.of(
            targetPos.x() - span,
            targetPos.y() - span,
            targetPos.z() - span,
            targetPos.x() + span,
            targetPos.y() + span,
            targetPos.z() + span
        );
        let entites = context.getLevel().getEntitiesWithin(aabb).filter(entity => entity.getType() == context.getTarget().getType());
        entites.forEach((/** @type {Internal.LivingEntity} */entity) => {
            if (entity.getUuid() == target.getUuid()) return;
            entity.addEffect(new MobEffectInstance("minecraft:glowing", 40, 0, true, false));
            entity.playSound("minecraft:block.amethyst_block.resonate");
        });
        return knockback;
    }
});