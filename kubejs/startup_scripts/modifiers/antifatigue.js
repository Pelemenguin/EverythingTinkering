/**
 * @fileoverview Antifatigue | 抗疲劳
 * - - - - -
 * ## Antifatigue
 * ### Description
 * Cancel mining speed reduction brought by **Mining Fatigue**,
 * at most trait-level levels of **Mining Fatigue**.
 * - - - - -
 * ## 抗疲劳
 * ### 描述
 * 抵消**挖掘疲劳**带来的影响（最多抵消和特性等级相同级别的**挖掘疲劳**）
 * - - - - -
 * @author Pelemenguin
 * @license CC-BY-NC-SA-4.0
 */

ModifierRegisterer.registerModifier("kubejs:antifatigue", modifier => {
    modifier.getBreakSpeed((view, lvl, breakSpeedEvent, direction, canDrop, currentSpeed) => {
        let entity = breakSpeedEvent.entity;
        if (entity instanceof LivingEntity) {
            /** @type {Internal.LivingEntity} */
            let living = entity;
            let effect = living.getEffect("minecraft:mining_fatigue");
            if (effect != null) {
                let divisor = 0.00081;
                switch (Math.min(effect.amplifier, lvl - 1)) {
                    case 0: divisor = 0.3; break;
                    case 1: divisor = 0.09; break;
                    case 2: divisor = 0.0027; break;
                    default: divisor = 0.00081;
                }
                // console.info(`Unmodified: ${currentSpeed}`);
                // console.info(`New speed:  ${breakSpeedEvent.newSpeed}`);
                // console.info(`Divisor:    ${divisor}`);
                breakSpeedEvent.newSpeed /= divisor;
            }
        }
    });
});