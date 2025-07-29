/**
 * @fileoverview Relaying | 传动
 * - - - - -
 * ## Relaying
 * ### Description
 * Deal damage to entites behind the direct target.
 * - - - - -
 * ## 传动
 * ### 描述
 * 对直接目标后方的实体造成伤害。
 * - - - - -
 * @author Pelemenguin
 * @license CC-BY-NC-SA-4.0
 */

/* global
    global: writable
    ModifierRegisterer
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

/**
 * @typedef {[Internal.UUID, number, number, DamageSource]} Annotation.Tinker.RelayingPlannedDamageEntry
 * @type {Annotation.Tinker.RelayingPlannedDamageEntry[]}
 */
global.Tinker.RELAYING_PLANNED_DAMAGE = [];

let RELAYING = ModifierRegisterer.registerModifier("kubejs:relaying", ["onBeforeMeleeHit", "onServerTick"]);
RELAYING.onBeforeMeleeHit((view, lvl, context, damage, baseKnockback, finalKnockback) => {
    
    let world = context.getLevel();
    if (world.isClientSide()) return finalKnockback;
    let multiplier = lvl * RELAYING_DAMAGE_PERCENTAGE;

    let ray = context.attacker.getViewVector(1);
    ray = ray.normalize().scale(RELAYING_ITERATOR_STEP);

    /**
     * @type {Internal.Map<Internal.UUID, Annotation.Tinker.RelayingPlannedDamageEntry[]>}
     */
    let plannedDamages = Utils.newMap();
    
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
        let entites = world.getEntitiesWithin(aabb).filter(e => !e.invulnerable && !plannedDamages.containsKey(e.uuid));
        if (!entites.isEmpty()) {
            let thisEntity = entites.get(0);
            plannedDamages.put(thisEntity.uuid, [thisEntity.uuid, curDamage, plannedTime, context.getLevel().damageSources().mobAttack(context.attacker)]);
            curDamage *= multiplier;
            sinceLastEntity = 0;
            plannedTime += 2;
        } else {
            sinceLastEntity += RELAYING_ITERATOR_STEP;
            curPos = nextPos;
        }
    }

    plannedDamages.forEach((uuid, entry) => {
        global.Tinker.RELAYING_PLANNED_DAMAGE.push(entry);
    });
    return finalKnockback;

});
RELAYING.onServerTick(event => {
    /** @type {Annotation.Tinker.RelayingPlannedDamageEntry[]} */
    let damagingEntries = [];
    global.Tinker.RELAYING_PLANNED_DAMAGE.forEach(entry => {
        if (entry[2] <= 0) {
            damagingEntries.push(entry);
        }
        entry[2] = entry[2] - 1;
    });
    global.Tinker.RELAYING_PLANNED_DAMAGE = global.Tinker.RELAYING_PLANNED_DAMAGE.filter(e => e[2] >= 0);

    damagingEntries.forEach(entry => {
        event.getServer().getEntities().filter(entity => entity.getUuid() == entry[0]).forEach(entity => {
            entity.attack(entry[3], entry[1]);
        });
    });
});