// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Cladding | 覆层
 * - - - - -
 * Applying Iron Plates to enhance the attack damage of a tool.  
 * 使用铁板来提升工具的攻击伤害。
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
    $TooltipModifierHook
    TagKeys
    ProtectionModule
*/

ModifierManager.registerCommonModifier("cladding", "CladdingModifier", {
    overrideOtherStackedOnMe: (slotTool, modifier, held, _slot, _player, _access) => {
        if (held.hasTag("forge:plates/iron")) {
            let originalCladding = slotTool.getPersistentData().getFloat("kubejs:cladding");
            let maxCladding = modifier.getLevel() * 10;
            if (originalCladding >= maxCladding) return false;
            let newCladding = Math.min(maxCladding, originalCladding + 1);
            slotTool.getPersistentData().putFloat("kubejs:cladding", newCladding);
            held.shrink(1);
            return true;
        }
        return false;
    },
    getMeleeDamage: (tool, _modifier, _context, _baseDamage, damage) => {
        return damage + tool.getPersistentData().getFloat("kubejs:cladding") * 0.15;
    },
    getMeleeDamageForMonster: ModifierManager.SYNC_NORMAL_TO_MONSTER,
    getProtectionModifier: (tool, _modifier, _context, _slotType, _source, _modifierValue) => {
        let originalCladding = tool.getPersistentData().getFloat("kubejs:cladding");
        return originalCladding / 4;
    },
    modifyStat: (tool, _modifier, _living, stat, baseValue, _multiplier) => {
        if (stat === ToolStats.PROJECTILE_DAMAGE) {
            return baseValue + tool.getPersistentData().getFloat("kubejs:cladding") * 0.1;
        }
        return baseValue;
    },
    addTooltip: (tool, modifier, player, tooltip, _tooltipKey, _tooltipFlag) => {
        let claddingAmount = tool.getPersistentData().getFloat("kubejs:cladding");

        // Cladding amount tooltip
        tooltip.add(Component.translatable("modifier.kubejs.cladding.amount", Component.literal(claddingAmount.toFixed(2))
            .color(modifier.getModifier().getColor())
            .append(Component.literal(" / ").gray())
            .append(Component.literal((modifier.getLevel() * 10).toFixed(2)))
        ));

        // Stat boost tooltip
        if (tool.hasTag(TagKeys.Item.Modifiable.RANGED)) {
            $TooltipModifierHook.addFlatBoost(modifier.getModifier(), Component.translatable("modifier.kubejs.cladding.projectile_power"), 0.1 * tool.getPersistentData().getFloat("kubejs:cladding"), tooltip);
        } else if (tool.hasTag(TagKeys.Item.Modifiable.ARMOR)) {
            ProtectionModule.addResistanceTooltip(tool, modifier.getModifier(), tool.getPersistentData().getFloat("kubejs:cladding") / 4, player, tooltip);
        } else {
            $TooltipModifierHook.addFlatBoost(modifier.getModifier(), Component.translatable("modifier.kubejs.cladding.attack_damage"), 0.15 * tool.getPersistentData().getFloat("kubejs:cladding"), tooltip);
        }
    },
    onDamageTool: (tool, _modifier, amount, _holder, _stack) => {
        let originalCladding = tool.getPersistentData().getFloat("kubejs:cladding");
        let newCladding = Math.max(0, originalCladding - 0.01 * amount);
        tool.getPersistentData().putFloat("kubejs:cladding", newCladding);
        return amount;
    }
});
