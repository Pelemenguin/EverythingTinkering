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
 */

/* global
    ModifierRegisterer
    ToolStats
    JavaMath
    Vec3d
*/

/**
 * - Controls max cosine value allowed.
 * - 控制允许的最大余弦值。
 * - - - - -
 * @constant
 */
let PAPERCUTTING_MAX_CONSINE_ABSOLUTE = 0.5;

/** Record damaged entities in case of Stack Overflow. */
let PAPERCUT_TARGET_IN_THIS_TICK = [];
/** Record if server can clear this list now. */
let PAPERCUT_TARGET_LIST_CLEARABLE = true;

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
    if (PAPERCUT_TARGET_IN_THIS_TICK.indexOf(attacker) != -1) return true;

    let wearer = context.getEntity();

    if (JavaMath["abs(float)"](calcIncludedAngleCosine(wearer.getViewVector(1), new Vec3d(
        attacker.x - wearer.x,
        attacker.y - wearer.y,
        attacker.z - wearer.z
    ))) > PAPERCUTTING_MAX_CONSINE_ABSOLUTE) return true;

    let armor = view.getStats().get(ToolStats.ARMOR);
    let toughness = view.getStats().get(ToolStats.ARMOR_TOUGHNESS);
    let returning = armor + JavaMath.log10(damage * toughness + 1);

    /** Push attacker to the list, so it can't be attacked by papercutting again. */
    PAPERCUT_TARGET_LIST_CLEARABLE = false;
    PAPERCUT_TARGET_IN_THIS_TICK.push(attacker);
    attacker.attack(wearer.damageSources().thorns(wearer), returning);

    return false;

});
PAPERCUTTING.onServerTick(() => {
    if (PAPERCUT_TARGET_LIST_CLEARABLE) {
        PAPERCUT_TARGET_IN_THIS_TICK = [];
    }
    /** If not clearable, clear at next tick. */
    PAPERCUT_TARGET_LIST_CLEARABLE = true;
});