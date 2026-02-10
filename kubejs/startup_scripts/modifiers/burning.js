/**
 * @fileoverview Burining | 烫伤
 * - - - - -
 * Holding entity get burnt.
 * 手持的实体将被烫伤。
 * - - - - -
 * @author Pelemenguin
 */

/* global
    ModifierManager
    KubeJSDamageSources
*/

// eslint-disable-next-line no-unused-vars
let BURNING = ModifierManager.registerCommonModifier("burning", "BurningModifier", {
    onInventoryTick: (_tool, _modifier, world, holder, _itemSlot, isSelected, _isCorrectSlot, _stack) => {
        if (world.isClientSide()) return;
        if (isSelected) {
            let source = KubeJSDamageSources.hotTool(world, holder, null, holder.pos);
            holder.attack(source, 1);
        }
    },
    __class__: {
        extending: "slimeknights.tconstruct.library.modifiers.impl.NoLevelsModifier"
    }
});