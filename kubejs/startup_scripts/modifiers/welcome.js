// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Welcome | 欢迎
 * - - - - -
 * Give stat boost at the beginning of the game.
 * 游戏开始时，给予属性提升。
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
    ToolStack
    $ModifierId
    CustomUtils
    ToolStats
    Component
*/

/**
 * - Controls when `welcome` disappears.
 * - 控制什么时候 `欢迎` 消失。
 * - - - - -
 * @const
 */
let WELCOME_DISAPPEAR_TIME = 72000;

// eslint-disable-next-line no-unused-vars
let WELCOME = ModifierManager.registerCommonModifier("welcome", "WelcomeModifier", {
    onInventoryTick: (tool, modifier, world, holder, itemSlot, isSelected, isCorrectSlot, stack) => {
        if (world.isClientSide()) return;
        let traitColor = CustomUtils.Tinker.getMantleColor("modifier.kubejs.welcome");
        let colorNumber = traitColor.getValue();
        let darkenedColorChannels = [Math.round(((colorNumber & 0xFF0000) >> 16) / 2), Math.round(((colorNumber & 0x00FF00) >> 8) / 2), Math.round((colorNumber & 0x0000FF) / 2)];
        let darkenedColor = (darkenedColorChannels[0] << 16) + (darkenedColorChannels[1] << 8) + darkenedColorChannels[2];
        if (world.getTime() > WELCOME_DISAPPEAR_TIME) {
            ToolStack.from(stack).removeModifier($ModifierId.tryBuild("kubejs", "welcome"), 1);
            holder.sendSystemMessage(Component.translatable("modifier.kubejs.welcome.hint", Component.of(stack.hoverName).color(darkenedColor)).color(traitColor));
        }
    },
    addToolStats: (context, modifier, builder) => {
        ToolStats.ATTACK_DAMAGE.add(builder, 1.0);
        ToolStats.MINING_SPEED.add(builder, 1.5);
    },
    __class__: {
        extending: "slimeknights.tconstruct.library.modifiers.impl.NoLevelsModifier"
    }
});