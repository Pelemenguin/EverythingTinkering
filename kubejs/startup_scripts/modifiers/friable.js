/**
 * @fileoverview Friable | 松散
 * - - - - -
 * ## Friable
 * ### Description
 * Every game tick, the tool has `(0.2 * level)`'s chance to lose durability.
 * - - - - -
 * ## 松散
 * ### 描述
 * 每游戏刻有 `(0.2 * level)` 的概率损失耐久。
 */

/* global

    ModifierRegisterer
    Player
    CustomUtils
    JavaMath

*/

ModifierRegisterer.registerModifier("kubejs:friable", modifier => {
    modifier.onInventoryTick((view, lvl, level, entity, slot, inMainHand, inAvailableSlot, itemStack) => {
        if (JavaMath.random() >= lvl * 0.2) return;
        if (entity instanceof Player && entity.isCreative()) return;
        if (CustomUtils.Tinker.isBroken(itemStack)) return;
        itemStack.damageValue += (lvl + JavaMath.round(level * 2 * JavaMath.random()));
    });
});