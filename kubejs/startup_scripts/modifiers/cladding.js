/**
 * @fileoverview Cladding | 覆层
 * - - - - -
 * Applying Iron Plates to enhance the attack damage of a tool.  
 * 使用铁板来提升工具的攻击伤害。
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

(() => {

/**
 * @param {Internal.IToolStackView} tool
 * @param {Internal.Player} player
 */
let damageCladding = (tool, player) => {
    if (player.isPlayer() && player.isCreative()) return;
    let originalCladding = tool.getPersistentData().getFloat("kubejs:cladding");
    let newCladding = Math.max(0, originalCladding - 0.02);
    tool.getPersistentData().putFloat("kubejs:cladding", newCladding);
};

/**
 * 
 * @param {Internal.IToolStackView} tool 
 * @param {number} max 
 * @returns {void}
 */
let repairCladding = (tool, max) => {
    let originalCladding = tool.getPersistentData().getFloat("kubejs:cladding");
    if (originalCladding >= max) return false;
    let newCladding = Math.min(max, originalCladding + 1);
    tool.getPersistentData().putFloat("kubejs:cladding", newCladding);
};

/** @param {Internal.IToolStackView} tool */
let claddingDamage = (tool) => tool.getPersistentData().getFloat("kubejs:cladding") * 0.2;
/** @param {Internal.IToolStackView} tool */
let claddingProtectionModifier = (tool) => tool.getPersistentData().getFloat("kubejs:cladding") * 0.125;
/** @param {Internal.IToolStackView} tool */
let claddingProjPower = (tool) => tool.getPersistentData().getFloat("kubejs:cladding") * 0.05;

ModifierManager.registerCommonModifier("cladding", "CladdingModifier", {
    overrideOtherStackedOnMe: (slotTool, modifier, held, _slot, _player, _access) => {
        if (held.hasTag("forge:plates/iron")) {
            held.shrink(1);
            repairCladding(slotTool, modifier.getLevel() * 5);
            return true;
        }
        return false;
    },
    getMeleeDamage: (tool, _modifier, context, _baseDamage, damage) => {
        damageCladding(tool, context.getAttacker());
        return damage + claddingDamage(tool);
    },
    getMeleeDamageForMonster: ModifierManager.SYNC_NORMAL_TO_MONSTER,
    getProtectionModifier: (tool, _modifier, _context, _slotType, _source, _modifierValue) => {
        return claddingProtectionModifier(tool);
    },
    modifyDamageTaken: (tool, _modifier, context, _slotType, _source, amount, _isDirectDamage) => {
        damageCladding(tool, context.getEntity());
        return amount;
    },
    modifyStat: (tool, _modifier, _living, stat, baseValue, _multiplier) => {
        if (stat === ToolStats.PROJECTILE_DAMAGE) {
            return baseValue + claddingProjPower(tool);
        }
        return baseValue;
    },
    onProjectileLaunch: (tool, _modifier, shooter, _ammo, _projectile, _arrow, _persistent, _isPrimary) => {
        damageCladding(tool, shooter);
    },
    addTooltip: (tool, modifier, player, tooltip, _tooltipKey, _tooltipFlag) => {
        let claddingAmount = tool.getPersistentData().getFloat("kubejs:cladding");

        // Cladding amount tooltip
        tooltip.add(Component.translatable("modifier.kubejs.cladding.amount", Component.literal(claddingAmount.toFixed(2))
            .color(modifier.getModifier().getColor())
            .append(Component.literal(" / ").gray())
            .append(Component.literal((modifier.getLevel() * 5).toFixed(2)))
        ));

        // Stat boost tooltip
        if (tool.hasTag(TagKeys.Item.Modifiable.RANGED)) {
            $TooltipModifierHook.addFlatBoost(modifier.getModifier(), Component.translatable("modifier.kubejs.cladding.projectile_power"), claddingProjPower(tool), tooltip);
        } else if (tool.hasTag(TagKeys.Item.Modifiable.ARMOR)) {
            ProtectionModule.addResistanceTooltip(tool, modifier.getModifier(), claddingProtectionModifier(tool), player, tooltip);
        } else {
            $TooltipModifierHook.addFlatBoost(modifier.getModifier(), Component.translatable("modifier.kubejs.cladding.attack_damage"), claddingDamage(tool), tooltip);
        }
    }
});

})();
