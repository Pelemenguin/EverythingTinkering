/**
 * @fileoverview Antifatigue | 抗疲劳
 * - - - - -
 * ## Antifatigue
 * ### Description
 * When the tool's level is greater that `mining_fatigue`'s effect level,
 * clear the `mining_fatigue` effect.
 * - - - - -
 * ## 抗疲劳
 * ### 描述
 * 当工具等级大于 `挖掘疲劳` 等级时，清除 `挖掘疲劳`。
 * - - - - -
 * @author Pelemenguin
 * @license CC-BY-NC-SA-4.0
 */

ModifierRegisterer.onRegisterEvent(event => {
    event.createNew("kubejs:antifatigue", modifier => {
        modifier.onInventoryTick(
            (view, lvl, level, entity, slot, inMainHand, inAvailableSlot, itemStack) => {
                if (!inMainHand) return;
                if (!entity.hasEffect("minecraft:mining_fatigue")) return;
                let effectLevel = entity.getEffect("minecraft:mining_fatigue").amplifier;
                // console.info(`[Antifatigue] Effect level: ${effectLevel}`);
                // console.info(`[Antifatigue] Tool level: ${lvl}`);
                if (effectLevel < lvl) {
                    entity.removeEffect("minecraft:mining_fatigue");
                    // console.info(`[Antifatigue] Removed effect`);
                }
            }
        );
    });
});