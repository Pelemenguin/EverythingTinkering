// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Uncertain | 未定
 * - - - - -
 * Chance to replace the rock behind the one you mined with ores.
 * 有概率将你挖的方块后面的岩石替换为矿物。
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
    CustomUtils
    NBT
    JavaMath
    Direction
    ResourceLocation
    Component
*/

let UNCERTAIN_ID = "kubejs:uncertain";

/**
 * - Controls initial probability of `uncertain`.
 * - 控制 `未定` 的初始概率。
 * - - - - -
 * @constant
 */
let UNCERTAIN_MAX_PROBABILITY = 0.20;
/**
 * - Controls durability decay per block mined.
 *   Decay happens even if mined blocks are not stone.
 * - 控制每方块概率衰减。
 *   即使挖掘的方块不是石头也会衰减。
 * - - - - -
 * @constant
 */
let UNCERTAIN_PROBABILITY_REDUCE = 0.0002;

/**
 * - Record which tags to use for `uncertain`.
 * - 记录 `未定` 使用的标签。
 * - - - - -
 * @constant
 */
let UNCERTAIN_TAGS = {
    stone: new ResourceLocation("kubejs", "uncertain_can_duplicate/stone"),
    deepslate: new ResourceLocation("kubejs", "uncertain_can_duplicate/deepslate"),
    netherrack: new ResourceLocation("kubejs", "uncertain_can_duplicate/netherrack")
};

/**
 * @param {number} mined 
 * @param {number} level 
 * @returns number
 */
let UNCERTAIN_GET_PROBABILITY = (mined, level) => UNCERTAIN_MAX_PROBABILITY - mined * UNCERTAIN_PROBABILITY_REDUCE / level;

/**
 * - Add a tool with `uncertain`'s persistent data.
 * - 增加带有 `未定` 的工具的 Persistent 数据。
 * - - - - -
 * @param {Internal.ItemStack} item -
 * - The item to set persistent data to.
 * - 要设置 Persistent 数据的物品。
 * @param {number} value -
 * - The value to set.
 * - 要设置的数值。
 * - - - - -
 * @returns {boolean}
 * - Whether this is successful or not.
 * - 是否成功。
 */
let addUncertainPersistent = (item, value) => {
    try {
        if (!(UNCERTAIN_ID in CustomUtils.Tinker.getModifiersFromItem(item))) return false;
        try {
            CustomUtils.Tinker.Persistent.set(item, UNCERTAIN_ID, NBT.intTag(CustomUtils.Tinker.Persistent.get(item, UNCERTAIN_ID).asInt + value));
        // eslint-disable-next-line no-unused-vars
        } catch (e) {
            CustomUtils.Tinker.Persistent.set(item, UNCERTAIN_ID, NBT.intTag(value));
            return true;
        }
    // eslint-disable-next-line no-unused-vars
    } catch (e) {
        return false;
    }
    return true;
};

/**
 * - Replace blocks.
 * - 替换方块。
 * - - - - -
 * @param {ResourceLocation} tag -
 * - Resource Location of a block tag.
 * - 一个方块标签的资源路径。
 * @param {Internal.BlockState} duplicating -
 * - The block state of the block to duplicate.
 * - 要复制的方块状态。
 * @param {Internal.BlockContainerJS_} container -
 * - Block Container of the placing position.
 * - 要放置的位置的 Block Container
 * @param {string} originalDirection -
 * - The direction of the block mined relative to the block to be set.
 * - 挖掘的方块相对于要被设置的方块的方向。
 */
let runUncertain = (tag, duplicating, container, originalDirection) => {
    if (!duplicating.getTags().anyMatch((t) => (t.location() == tag))) return;
    let isBuried = true;
    Direction.ALL.forEach(direction => {
        if (direction == originalDirection) return;
        /** @type {Internal.BlockContainerJS} */
        let checking = container[direction];
        if (!checking.blockState.canOcclude()) {
            isBuried = false;
        }
    });
    if (!isBuried) return;
    container.set(duplicating.getBlock().getId());
};

/**
 * - Calculate tooltip color.
 * - 计算工具提示颜色。
 * - - - - -
 * @param {number} percentage 
 * - The `Current Probability / Max Probability`.
 * - `当前概率 / 最大概率`。
 * @returns {number}
 */
let calcUncertainColor = (percentage) => {
    let easedProgress = percentage * percentage * (3 - 2 * percentage);

    let start = [0, 127, 255];
    let end = [127 + 128 * easedProgress, 0, 0];

    // #7F0000 -> #007FFF
    let r = Math.round(end[0] + (start[0] - end[0]) * easedProgress);
    let g = Math.round(end[1] + (start[1] - end[1]) * easedProgress);
    let b = Math.round(end[2] + (start[2] - end[2]) * easedProgress);

    return ((r << 16) + (g << 8) + b);
};

// eslint-disable-next-line no-unused-vars
let UNCERTAIN = ModifierManager.registerCommonModifier("uncertain", "UncertainModifier", {
    afterBlockBreak: (tool, modifier, context) => {
        if (context.getWorld().isClientSide()) return;
        let mined = 0;
        try {
            mined = tool.persistentData.getInt(UNCERTAIN_ID);
        // eslint-disable-next-line no-unused-vars
        } catch (e) { /* Do nothing */ }
        context.getLiving().handSlots.forEach(item => {
            addUncertainPersistent(item, 1);
        });
        if (JavaMath.random() >= UNCERTAIN_GET_PROBABILITY(mined, modifier.level)) return;
        let miningBlock = context.getWorld().getBlock(context.getPos());
        /** @type {Internal.BlockContainerJS} */
        let replacingBlock = miningBlock[context.sideHit.getOpposite().toString()];
        switch (replacingBlock.getBlockState().getBlock().getId()) {
            case "minecraft:stone":
                runUncertain(UNCERTAIN_TAGS.stone, context.getState(), replacingBlock, context.getSideHit());
                break;
            case "minecraft:deepslate":
                runUncertain(UNCERTAIN_TAGS.deepslate, context.getState(), replacingBlock, context.getSideHit());
                break;
            case "minecraft:netherrack":
                runUncertain(UNCERTAIN_TAGS.netherrack, context.getState(), replacingBlock, context.getSideHit());
                break;
        }
    },
    addTooltip: (tool, modifier, player, tooltip, _tooltipKey, _tooltipFlag) => {
        if (tool.persistentData.getInt(UNCERTAIN_ID) == null) player.getHandSlots().forEach(item => addUncertainPersistent(item, 0));
        let probability = Math.max(UNCERTAIN_GET_PROBABILITY(tool.persistentData.getInt(UNCERTAIN_ID), modifier.level), 0);
        let max = UNCERTAIN_GET_PROBABILITY(0, modifier.level);
        tooltip.add(Component.translatable("modifier.kubejs.uncertain.tooltip", Component.literal("")
            .append(Component.literal((probability * 100).toFixed(2) + '%').color(calcUncertainColor(probability / max)))
            .append(Component.literal(' / ').gray())
            .append(Component.literal((max * 100).toFixed(2) + '%').color(32767))
        ));
    }
});