/**
 * @fileoverview Thawing | 融雪
 * - - - - -
 * Thaw the surrounding snow.
 * 融化周围的雪。
 * - - - - -
 * @author Pelemenguin
 */

/* global
    ModifierManager
    Blocks
*/

// eslint-disable-next-line no-unused-vars
let THAWING = ModifierManager.registerCommonModifier("thawing", "ThawingModifier", {
    onInventoryTick: (_tool, _modifier, world, holder, _itemSlot, _isSelected, isCorrectSlot, _stack) => {
        if (world.isClientSide()) return;
        if (!isCorrectSlot) return;
        if (!holder.onGround()) return;
        let holderPos = holder.blockPosition();
        for (let x = -2; x <= 2; x++) {
            for (let z = -2; z <= 2; z++) {
                if (Math.random() >= 0.05) continue;
                let checkPos = holderPos.offset(x, 0, z);
                let block = world.getBlock(checkPos);
                if (block.getBlockState().getBlock() === Blocks.SNOW) {
                    world.setBlockAndUpdate(checkPos, Blocks.AIR.defaultBlockState());
                }
            }
        }
    },
    __class__: {
        extending: "slimeknights.tconstruct.library.modifiers.impl.NoLevelsModifier"
    }
});
