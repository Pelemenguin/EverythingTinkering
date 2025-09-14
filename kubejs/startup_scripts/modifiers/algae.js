// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Algea | 未定
 * - - - - -
 * ## Algea
 * ### Description
 * Chance to replace the rock behind the one you mined with ores.
 * - - - - -
 * ## 未定
 * ### 描述
 *在水中恢复耐久
 * - - - - -
 * @copyright Pelemenguin 2025
 * @license LGPL-3.0-or-later
 * This file is part of EverythingTinkering.
 * Full license see file `COPYING.LESSER`
 * - - - - -
 * @author Pelemenguin
 */

let ALGAE_REPAIR_CLOCK = 20;
// eslint-disable-next-line no-unused-vars
let ALGAE = ModifierManager.registerCommonModifier("algae", "AlgaeModifier", {
    onInventoryTick: (tool, modifier, world, holder, itemSlot, isSelected, isCorrectSlot, stack) => {
        if (world.isClientSide()) return;
        if(holder.isInWater()) {
            if(tool.damage >=0 ) {
                return;
            }
            if(world.getTime() % ALGAE_REPAIR_CLOCK == 0) {
                ToolDamageUtil.repair(tool,1);
            }
    }

}});