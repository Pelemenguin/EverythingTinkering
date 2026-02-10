/**
 * @fileoverview DPS Equalizer | DPS均衡器
 * - - - - -
 * Increase damage for melee attacks that are not fully charged.  
 * 对未完全蓄力的近战攻击增加伤害。
 * - - - - -
 * @author Pelemenguin
 */

/* global
    ModifierManager
*/

ModifierManager.registerCommonModifier("dps_equalizer", "DpsEqualizerModifier", {
    getMeleeDamage: (tool, modifier, context, baseDamage, damage) => {
        if (context.isExtraAttack()) return damage;
        let cooldown = context.getCooldown();

        let wantedDamage = damage * cooldown;
        let result = wantedDamage / (0.2 + 0.8 * cooldown * cooldown);
        return result;
    },
    __class__: {
        extending: "slimeknights.tconstruct.library.modifiers.impl.NoLevelsModifier"
    },
    getPriority: () => -2147483648
});
