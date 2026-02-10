/**
 * @fileoverview Algae | 海藻
 * - - - - -
 * Recovers durability under water.
 * 在水下回复耐久
 * - - - - -
 * @author Pelemenguin
 */

/* global
    ModifierManager
    ToolDamageUtil
*/

/**
 * - Passed tick count every 1 durability point recovers.
 * - 每1回复耐久值经过的Tick数。
 */
let ALGAE_REPAIR_CLOCK = 60;

// eslint-disable-next-line no-unused-vars
let ALGAE = ModifierManager.registerCommonModifier("algae", "AlgaeModifier", {
    onInventoryTick: (tool, _modifier, world, holder, _itemSlot, _isSelected, _isCorrectSlot, _stack) => {
        if (world.isClientSide()) return;
        if (holder.isPlayer() && holder.isCreative()) return;
        if (holder.isUnderWater()) {
            if(world.getTime() % ALGAE_REPAIR_CLOCK == 0) {
                ToolDamageUtil.repair(tool, 1);
            }
        }
    },
    __class__: {
        extending: "slimeknights.tconstruct.library.modifiers.impl.NoLevelsModifier"
    }
});