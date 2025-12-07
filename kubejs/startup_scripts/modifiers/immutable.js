// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Immutable | 不可变
 * - - - - -
 * Reject any attempt that modifies the tool's materials and modifiers.
 * 拒绝任何修改工具材料和特性的尝试。
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

// eslint-disable-next-line no-unused-vars
let IMMUTABLE = ModifierManager.registerCommonModifier("immutable", "ImmutableModifier", {
    validate: (_tool, _modifier) => {
        return Component.translatable("modifier.kubejs.immutable.error");
    },
    onRemoved: (_tool, _modifier) => {
        return Component.translatable("modifier.kubejs.immutable.error");
    },
    __class__: {
        extending: "slimeknights.tconstruct.library.modifiers.impl.NoLevelsModifier"
    }
});
