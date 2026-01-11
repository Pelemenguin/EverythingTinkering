// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Incomplete | 半成品
 * - - - - -
 * Special modifier used for transitional materials used in sequenced assembly that prevents players from using the material to assemble tools.  
 * 特殊特性，用于序列组装中的过渡材料，阻止玩家使用该材料组装工具。
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
    Component
*/

ModifierManager.registerCommonModifier("incomplete", "IncompleteModifier", {
    validate: (_tool, _modifier) => {
        return Component.translatable("modifier.kubejs.incomplete.error");
    },
    __class__: {
        extending: "slimeknights.tconstruct.library.modifiers.impl.NoLevelsModifier"
    }
});
