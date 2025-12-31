// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Kinetic Linkage | 动力连动
 * - - - - -
 * After attacking a target, one random entity in a certain area around the target will also be attacked.
 * This process may happen multiple times in succession, which stops after damage is less than or equal to 1.  
 * 攻击目标后，目标周围一定范围内的一个随机实体也会受到攻击。
 * 此过程可能会连续发生多次，直到伤害小于等于1为止。
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
    $ItemParticleOption
    ParticleTypes
*/

ModifierManager.registerCommonModifier("kinetic_linkage", "KineticLinkageModifier", {
    beforeMeleeHit: (tool, modifier, context, damage, baseKnockback, knockback) => {
        if (context.getLevel().isClientSide()) return knockback;
        if (!context.isFullyCharged()) return knockback;

        let attacker = context.getAttacker();

        let multiplier = 1 - Math.pow(0.25, modifier.getLevel());

        let dealingDamage = damage * multiplier;
        let centerEntity = context.getTarget();
        let delay = 1;
        let allEntities = [];
        let isCancelled = false;
        while (dealingDamage > 1) {
            // Find random entity

            let area = centerEntity.getBoundingBox().inflate(modifier.getLevel() * 3);
            let entities = context.getLevel().getEntitiesWithin(area).filter(e => e != centerEntity
                && e != attacker
                && e.isAlive()
                && e.isLiving()
                && e.getEntityType() === centerEntity.getEntityType()
                && attacker.canAttack(e)
            );
            if (entities.length == 0) break;
            let targetEntity = entities[Math.floor(Math.random() * entities.length)];
            allEntities.push(targetEntity);

            let damageSource = attacker.isPlayer() ? attacker.damageSources().playerAttack(attacker) : attacker.damageSources().mobAttack(attacker);
            let theDamage = dealingDamage;
            let theDelay = delay;
            let previousEntity = centerEntity;
            context.getLevel().getServer().scheduleInTicks(theDelay * 2, () => {
                if (isCancelled) return;
                if (!targetEntity.isAlive()) return;
                if (!(
                    previousEntity.getBoundingBox().inflate(modifier.getLevel() * 3).intersects(targetEntity.getBoundingBox())
                        && targetEntity.isLiving()
                        && targetEntity.getEntityType() === previousEntity.getEntityType()
                        && attacker.canAttack(targetEntity)
                )) {
                    // Target entity run out of range
                    context.getAttacker().playSound("minecraft:entity.item.break");
                    isCancelled = true;
                    return;
                }
                targetEntity.attack(damageSource, theDamage);
                for (let i = theDelay - 1; i < theDelay * 2 - 1 && i < allEntities.length && i < theDelay + 31; i ++) {
                    let e = allEntities[i];
                    context.getLevel().spawnParticles(new $ItemParticleOption(ParticleTypes.ITEM, "create:andesite_alloy"), false, e.getX(), e.getY() + e.getEyeHeight(), e.getZ(), 0, 1, 0, 25, 0);
                }
            });
            context.getLevel().getServer().scheduleInTicks(theDelay * 2 - 1, () => {
                if (isCancelled) return;
                for (let i = theDelay - 1; i < theDelay * 2 - 2 && i < allEntities.length && i < theDelay + 31; i ++) {
                    let e = allEntities[i];
                    context.getLevel().spawnParticles(new $ItemParticleOption(ParticleTypes.ITEM, "create:andesite_alloy"), false, e.getX(), e.getY() + e.getEyeHeight(), e.getZ(), 0, 1, 0, 25, 0);
                }
            });

            centerEntity = targetEntity;
            dealingDamage *= multiplier;
            delay ++;
        }

        // Not modified
        return knockback;
    }
});
