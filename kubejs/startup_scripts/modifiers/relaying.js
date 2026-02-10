/**
 * @fileoverview Relaying | 传动
 * - - - - -
 * Deal damage to entites behind the direct target.
 * 对直接目标后方的实体造成伤害。
 * - - - - -
 * @author Pelemenguin
 */

/* global
    ModifierManager
    AABB
    Utils
    Vec3d
*/

/**
 * - Controls damage decay.
 * - 控制伤害衰减。
 * - - - - -
 * @constant
 */
let RELAYING_DAMAGE_PERCENTAGE = 0.2;

/**
 * - Controls max distance after detecting each entity
 * - 控制检测到生物后，与下一个生物之间的最大距离。
 * - - - - -
 * @constant
 */
let RELAYING_MAX_DISTANCE = 3.0;

/**
 * - Controls iterator's step.
 * - 控制迭代的步进距离。
 * - - - - -
 * @constant
 */
let RELAYING_ITERATOR_STEP = 0.2;

// eslint-disable-next-line no-unused-vars
let RELAYING = ModifierManager.registerCommonModifier("relaying", "RelayingModifier", {
    beforeMeleeHit: (tool, modifier, context, damage, baseKnockback, knockback) => {
        
        let world = context.getLevel();
        if (world.isClientSide()) return knockback;
        let multiplier = modifier.level * RELAYING_DAMAGE_PERCENTAGE;

        let ray = context.attacker.getViewVector(1);
        ray = ray.normalize().scale(RELAYING_ITERATOR_STEP);

        /** @type {Internal.Map<Internal.UUID, undefined>} */
        let selectedEntities = Utils.newMap(); // Why Set cannot work
        
        let curDamage = damage;
        let curPos = new Vec3d(context.target.x, context.target.y + context.target.getEyeHeight(), context.target.z);
        let sinceLastEntity = 0;
        let plannedTime = 0;
        while (curDamage >= 1.0 && sinceLastEntity <= RELAYING_MAX_DISTANCE) {
            let nextPos = curPos.add(ray);
            let aabb = AABB.of(
                curPos.x(), curPos.y(), curPos.z(),
                nextPos.x(), nextPos.y(), nextPos.z()
            );
            /** @type {Internal.Entity} */
            let thisEntity = world.getEntitiesWithin(aabb).toArray().find(/** @param {Internal.Entity} e */ e => !e.invulnerable && !selectedEntities.containsKey(e.getUuid()));
            if (thisEntity == undefined) {
                sinceLastEntity += RELAYING_ITERATOR_STEP;
                curPos = nextPos;
                continue;
            }
            selectedEntities.put(thisEntity.getUuid(), undefined);
            let damageCopied = curDamage; // Variable used in lambdas must be effectively constant
            context.getLevel().getServer().scheduleInTicks(plannedTime, () => {
                thisEntity.attack(thisEntity.damageSources().mobAttack(context.getAttacker()), damageCopied);
            });
            curDamage *= multiplier;
            sinceLastEntity = 0;
            plannedTime += 2;
        }

        return knockback;

    },
    onMonsterMeleeHit: ModifierManager.SYNC_NORMAL_TO_MONSTER
});