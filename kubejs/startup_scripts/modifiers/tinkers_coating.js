// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Durability Protection | 耐久保护
 * - - - - -
 * Grants 20 durability protection per level at one time. After comsuming all of them, recover the durability protection in 30 seconds.
 * 授予每级20点耐久保护一次性使用。使用完后，30秒内恢复耐久保护。
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
    $CapacityBarModule
    $DurabilityShieldModule
    ToolStats
    $LevelingInt
    $ModifierHooks
    Component
    CustomUtils
*/

// eslint-disable-next-line no-unused-vars
let TINKER_COATING = ModifierManager.registerCommonModifier("tinker_coating", "TinkerCoatingModifier", {
    __class__: {
        addModule: (_thisModifier, builder) => {
            builder.addModule(new $CapacityBarModule("kubejs:tinker_coating_shield", $LevelingInt.eachLevel(20), ToolStats.DURABILITY));
            builder.addModule(new $DurabilityShieldModule(0xffa263));
        }
    },
    onInventoryTick: (tool, modifier, _world, _holer, _itemSlot, _isSelected, _isCorrectSlot, _stack) => {
        if (modifier.getHook($ModifierHooks.CAPACITY_BAR).getAmount(tool) <= 0) {
            let cd = tool.getPersistentData().getInt("kubejs:tinker_coating_recovery");
            tool.getPersistentData().putInt("kubejs:tinker_coating_recovery", cd - 1);
            if (cd <= 0) {
                modifier.getHook($ModifierHooks.CAPACITY_BAR).setAmount(tool, modifier, modifier.getHook($ModifierHooks.CAPACITY_BAR).getCapacity(tool, modifier));
                tool.getPersistentData().putInt("kubejs:tinker_coating_recovery", 601);
            }
        }
    },
    getPriority: () => 200,
    addTooltip: (tool, modifier, _player, tooltip, _tooltipKey, _tooltipFlag) => {
        let shieldAmount = modifier.getHook($ModifierHooks.CAPACITY_BAR).getAmount(tool);
        let maxShield = modifier.getHook($ModifierHooks.CAPACITY_BAR).getCapacity(tool, modifier);
        if (shieldAmount > 0) {
            tooltip.add(
                Component.translatable("modifier.kubejs.tinker_coating.tooltip.shield", Component.literal(shieldAmount.toFixed()).color(CustomUtils.Tinker.getMantleColor("modifier.kubejs.tinker_coating"))
                    .append(Component.literal(" / ").gray())
                    .append(Component.literal(maxShield.toFixed()).color(CustomUtils.Tinker.getMantleColor("modifier.kubejs.tinker_coating")))
                )
            );
        } else {
            let recoveryTime = Math.ceil(tool.getPersistentData().getInt("kubejs:tinker_coating_recovery") / 20).toFixed();
            tooltip.add(
                Component.translatable("modifier.kubejs.tinker_coating.tooltip.recovery", Component.literal(recoveryTime).color(CustomUtils.Tinker.getMantleColor("modifier.kubejs.tinker_coating"))
                    .append(Component.literal(" / ").gray())
                    .append(Component.literal("30").color(CustomUtils.Tinker.getMantleColor("modifier.kubejs.tinker_coating")))
                )
            );
        }
    }
});
