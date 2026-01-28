// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Tin Pest | 锡疫
 * - - - - -
 * Increase durability loss when exposed to low temperatures, but increase damage when used in hot environments.  
 * 在低温环境下增加耐久损失，但在高温环境下增加伤害。
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
    ToolStats
    Component
    global
    $TooltipModifierHook
*/

(() => {

/**
 * Random tool damage increase, [0, -5 * temperature + 2) (temperature < 0.2), then floor it
 * @param {number} temperature 
 * @returns {number}
 */
let durabilityLossIncrease = (temperature) => temperature >= 0.2 ? 0 : Math.floor(Math.random() * (-5 * temperature + 2));

/**
 * Constant damage increase
 * @param {number} temperature
 * @returns {number}
 */
let attackDamageIncrease = (temperature) => 0.5 * temperature;

ModifierManager.registerCommonModifier("tin_pest", "TinPestModifier", {
    onDamageTool: (_tool, _modifier, amount, holder, _stack) => {
        let world = holder.getLevel();

        let temperature = world.getBiome(holder.blockPosition()).value().getTemperature(holder.blockPosition());
        let damageIncrease = durabilityLossIncrease(temperature);
        return amount + damageIncrease;
    },
    getMeleeDamage: (tool, modifier, context, _baseDamage, damage) => {
        let world = context.getLevel();

        let temperature = world.getBiome(context.getAttacker().blockPosition()).value().getTemperature(context.getAttacker().blockPosition());
        let damageIncrease = attackDamageIncrease(temperature);
        return damage + damageIncrease * modifier.getLevel() * tool.getMultiplier(ToolStats.ATTACK_DAMAGE);
    },
    modifyStat: (_tool, modifier, living, stat, baseValue, multiplier) => {
        if (stat === ToolStats.PROJECTILE_DAMAGE) {
            let world = living.getLevel();
            let temperature = world.getBiome(living.blockPosition()).value().getTemperature(living.blockPosition());
            let damageIncrease = 0.5 * attackDamageIncrease(temperature);
            return baseValue + damageIncrease * modifier.getLevel() * multiplier;
        }
        return baseValue;
    },
    addTooltip: (tool, modifier, player, tooltip, _tooltipKey, _tooltipFlag) => {
        if (player == null) return;

        let world = player.getLevel();
        let temperature = world.getBiome(player.blockPosition()).value().getTemperature(player.blockPosition());

        if (temperature < 0.2) {
            tooltip.add(Component.translatable("modifier.kubejs.tin_pest.durability", 
                `0~${(-5 * temperature + 2).toFixed(2)}`
            ).color(modifier.getModifier().getColor()));
        } else if (temperature > 0.9) {
            if (tool.hasTag(global.TagKeys.Item.Modifiable.RANGED)) {
                $TooltipModifierHook.addFlatBoost(modifier.getModifier(), Component.translatable("modifier.kubejs.tin_pest.projectile_power"), attackDamageIncrease(temperature) * 0.5 * modifier.getLevel(), tooltip);
            } else {
                $TooltipModifierHook.addFlatBoost(modifier.getModifier(), Component.translatable("modifier.kubejs.tin_pest.attack_damage"), attackDamageIncrease(temperature) * modifier.getLevel(), tooltip);
            }
        } else {
            tooltip.add(Component.translatable("modifier.kubejs.tin_pest.no_effect").color(modifier.getModifier().getColor()));
        }
    }
});

})();
