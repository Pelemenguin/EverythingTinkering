/**
 * @fileoverview Paper-Cutting | 剪纸
 * - - - - -
 * ## Paper-Cutting
 * ### Description
 * Deal damage to enemies attacked from the side.
 * - - - - -
 * ## 剪纸
 * ### 描述
 * ### 对从侧面攻击的敌人造成伤害。 
 * - - - - -
 * @copyright Pelemenguin 2025
 * @license LGPL-3.0-or-later
 * This file is part of EverythingTinkering.
 * Full license see file `COPYING.LESSER`
 * - - - - -
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * - - - - -
 * @author Pelemenguin
 */

/* global
    ModifierRegisterer
    ToolStats
    JavaMath
    Vec3d
    KubeJSDamageSources
    Utils
    EquipmentSlot
*/

/**
 * - Controls max cosine value allowed.
 * - 控制允许的最大余弦值。
 * - - - - -
 * @constant
 */
let PAPERCUTTING_MAX_CONSINE_ABSOLUTE = 0.2;

/**
 * - Controls max damage per level.
 * - 控制每级最大伤害。
 * - - - - -
 * @constant
 */
let PAPERCUTTING_MAX_DAMAGE = 5;

/** Record damaged entities in case of Stack Overflow. */
/**
 * @type {Internal.Map<Internal.Entity, [source, number, number]>}
 */
let PAPERCUT_TARGET_IN_THIS_TICK = Utils.newMap();
/** Record if server can clear this list now. */
let PAPERCUT_TARGET_LIST_CLEARABLE = true;

/**
 * 
 * @param {Internal.Entity} entity 
 * @param {number} damage 
 * @param {Internal.EquipmentSlot} numberSlot - 4 for default
 * @param {DamageSource} damageSource
 */
let addPlannedDamage = (entity, damage, slot, damageSource) => {
    let numberSlot = 4;
    switch (slot) {
        case EquipmentSlot.HEAD: numberSlot = 0; break;
        case EquipmentSlot.CHEST: numberSlot = 1; break;
        case EquipmentSlot.LEGS: numberSlot = 2; break;
        case EquipmentSlot.FEET: numberSlot = 3; break;
    }
    if (PAPERCUT_TARGET_IN_THIS_TICK.containsKey(entity)) {
        let [source, oldDamage, flag] = PAPERCUT_TARGET_IN_THIS_TICK.get(entity);
        if (flag & (1 << numberSlot) != 0) return;
        let newDamage = oldDamage + damage;
        let newFlag = flag | (1 << numberSlot);
        PAPERCUT_TARGET_IN_THIS_TICK.put(entity, [source, newDamage, newFlag]);
    } else {
        PAPERCUT_TARGET_IN_THIS_TICK.put(entity, [damageSource, damage, 1 << numberSlot]);
    }
};

/**
 * 
 * @param {Internal.MinecraftServer} server 
 */
let dealDamage = server => {
    server.getEntities().forEach(entity => {
        if (PAPERCUT_TARGET_IN_THIS_TICK.containsKey(entity)) {
            let [source, damage /*, flags */] = PAPERCUT_TARGET_IN_THIS_TICK.get(entity);
            entity.attack(source, damage);
        }
    });
    PAPERCUT_TARGET_IN_THIS_TICK.clear();
};

/**
 * 
 * @param {Vec3d} first 
 * @param {Vec3d} second 
 * - - - - -
 * @returns {number}
 */
let calcIncludedAngleCosine = (first, second) => {
    let dotProd = first.dot(second);
    if (dotProd == 0) return 0;
    let lengthProd = first.length() * second.length();
    if (lengthProd == 0) return 0;
    return (dotProd / lengthProd);
};

let PAPERCUTTING = ModifierRegisterer.registerModifier("kubejs:papercutting", ["armorTakeAttacked", "onServerTick"]);
PAPERCUTTING.armorTakeAttacked((view, lvl, context, slot, source, damage) => {

    if (context.getLevel().isClientSide()) return true;

    let attacker = source.getImmediate();
    if (attacker == null || !attacker.isLiving()) return true;

    let wearer = context.getEntity();

    if (JavaMath["abs(float)"](calcIncludedAngleCosine(wearer.getViewVector(1), new Vec3d(
        attacker.x - wearer.x,
        attacker.y - wearer.y,
        attacker.z - wearer.z
    ))) > PAPERCUTTING_MAX_CONSINE_ABSOLUTE) return true;

    // let armor = view.getStats().get(ToolStats.ARMOR);
    let armor = view.getStats().get(ToolStats.ARMOR);
    let toughness = view.getStats().get(ToolStats.ARMOR_TOUGHNESS);
    let returning = JavaMath["min(float,float)"](armor + JavaMath.log10(damage * toughness + 1), lvl * PAPERCUTTING_MAX_DAMAGE);

    /** Push attacker to the list, so it can't be attacked by papercutting again. */
    PAPERCUT_TARGET_LIST_CLEARABLE = false;
    // let damageSource = wearer.damageSources().thorns(wearer);
    let damageSource = KubeJSDamageSources.papercut(context.getLevel(), wearer, wearer);
    addPlannedDamage(attacker, returning, slot, damageSource);

    return false;

});
PAPERCUTTING.onServerTick(event => {
    if (PAPERCUT_TARGET_LIST_CLEARABLE) {
        dealDamage(event.getServer());
    }
    /** If not clearable, clear at next tick. */
    PAPERCUT_TARGET_LIST_CLEARABLE = true;
});