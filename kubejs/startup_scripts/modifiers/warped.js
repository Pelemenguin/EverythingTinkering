// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Warped | 扭曲
 * - - - - -
 * Add protection in Warped Forest biome.  
 * 在诡异森林中增加防护。
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
    ResourceLocation
    ProtectionModule
*/

/**
 * @param {Internal.Holder<Internal.Biome>} biome 
 * @returns {boolean}
 */
let WARPED_BIOME_PREDICATE = (biome) => {
    return biome.is(ResourceLocation.tryParse("minecraft:warped_forest"));
};

/**
 * - Controls protection boost per level in Warped Forest biome.
 * - 控制在诡异森林中每级的防护提升。
 */
let WARPED_PROTECTION_BOOST = 1;

/**
 * - If `true`, the modifier's tooltip will only be displayed when the player is inside Warped Forest biome.
 * - 如果为`true`，则只有当玩家在诡异森林中时才会显示该特性的提示信息。
 */
let WARPED_TOOLTIP_REQUIRES_BIOME = false;

// eslint-disable-next-line no-unused-vars
let WARPED = ModifierManager.registerCommonModifier("warped", "WarpedModifier", {
    getProtectionModifier: (_tool, modifier, context, _slotType, _source, modifierValue) => {
        if (context.getEntity() == null) return modifierValue;
        if (!WARPED_BIOME_PREDICATE(context.getLevel().getBiome(context.getEntity().blockPosition()))) return modifierValue;
        return modifierValue + WARPED_PROTECTION_BOOST * modifier.level;
    },
    addTooltip: (tool, modifier, player, tooltip, _tooltipKey, _tooltipFlag) => {
        if (player == null) return;
        if (WARPED_BIOME_PREDICATE(player.getLevel().getBiome(player.blockPosition()))) {
            ProtectionModule.addResistanceTooltip(tool, modifier.getModifier(), WARPED_PROTECTION_BOOST * modifier.level, player, tooltip);
        } else if (!WARPED_TOOLTIP_REQUIRES_BIOME) {
            ProtectionModule.addResistanceTooltip(tool, modifier.getModifier(), 0, player, tooltip);
        }
    }
});