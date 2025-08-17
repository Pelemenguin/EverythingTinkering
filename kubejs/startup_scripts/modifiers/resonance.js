// SPDX-License-Identifier: LGPL-3.0-or-later
 
/**
 * @fileoverview Resonance | 共振
 * - - - - -
 * ## Resonance
 * ### Description
 * Show all the same type of entites nearby on attack.
 * - - - - -
 * ## 共振
 * ### 描述
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
    ModifierRegisterer
    AABB
    MobEffectInstance
*/

let RESONANCE = ModifierRegisterer.registerModifier("kubejs:resonance", ["onBeforeMeleeHit"]);
RESONANCE.onBeforeMeleeHit((view, lvl, context, damage, baseKnockback, finalKnockback) => {
    let target = context.getTarget();
    if (!target.isLiving()) return finalKnockback;
    let targetPos = target.position();
    let span = lvl * 2 + damage;
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
    return finalKnockback;
});
