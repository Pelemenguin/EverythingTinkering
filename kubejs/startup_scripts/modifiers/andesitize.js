// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Andesitize | 安山化
 * - - - - -
 * Use the tool on a Stone block to convert it to Andesite.
 * 将工具用于石头方块以将其转换为安山岩。
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
    ParticleTypes
    Blocks
    ToolDamageUtil
*/

ModifierManager.registerCommonModifier("andesitize", "AndesitizeModifier", {
    afterBlockUse: (tool, _modifier, context, _source) => {
        if (tool.isBroken()) return "pass";
        let level = context.getLevel();
        let block = level.getBlock(context.getClickedPos());
        if (block.hasTag("forge:stone")) {
            let pos = context.getClickedPos();
            level.setBlockAndUpdate(pos, Blocks.ANDESITE.defaultBlockState());
            level.spawnParticles(ParticleTypes.LAVA, false, pos.getX() + 0.5, pos.getY(), pos.getZ() + 0.5, -0.5, -0.5, -0.5, 20, 1);
            level.playSound(context.getPlayer(), context.getClickedPos(), "block.stone.break", "blocks");
            context.getPlayer().swing();
            ToolDamageUtil.damageAnimated(tool, 1, context.getPlayer());
            return "success";
        }
        return "pass";
    },
    __class__: {
        extending: "slimeknights.tconstruct.library.modifiers.impl.NoLevelsModifier"
    }
});
