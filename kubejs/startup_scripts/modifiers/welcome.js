/**
 * @fileoverview Welcome | 欢迎
 * - - - - -
 * ## Welcome
 * ### Description
 * Give stat boost at the beginning of the game.
 * - - - - -
 * ## 欢迎
 * ### 描述
 * 游戏开始时，给予属性提升。
 * - - - - -
 * @copyright Pelemenguin 2025
 * @license LGPL-3.0-or-later
 * This file is part of EverythingTinkering.
 * Full license see file `COPYING.LESSER`
 * - - - - -
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * - - - - -
 * @author Pelemenguin
 */

/* global
    ModifierRegisterer
    ToolStack
    ModifierId
    CustomUtils
    TinkerToolStats
*/

/**
 * - Controls when `welcome` disappears.
 * - 控制什么时候 `欢迎` 消失。
 * - - - - -
 * @const
 */
let WELCOME_DISAPPEAR_TIME = 72000;

let WELCOME = ModifierRegisterer.registerModifier("kubejs:welcome", ["onInventoryTick", "addToolStats"]);
WELCOME.onInventoryTick((view, lvl, level, entity, slot, inMainHand, inAvailableSlot, itemStack) => {
    if (level.isClientSide()) return;
    if (level.getTime() > WELCOME_DISAPPEAR_TIME) {
        ToolStack.from(itemStack).removeModifier(ModifierId.tryBuild("kubejs", "welcome"), 1);
        entity.sendSystemMessage({
            translate: "modifier.kubejs.welcome.hint",
            color: CustomUtils.Tinker.getMantleColor("modifier.kubejs.welcome").toString(),
            with: [
                itemStack.displayName
            ]
        });
    }
});
WELCOME.addToolStats((context, lvl, builder) => {
    TinkerToolStats.ATTACK_DAMAGE.add(builder, 1.0);
    TinkerToolStats.MINING_SPEED.add(builder, 1.5);
});

// let getMantleColor = global.getMantleColor

// /**
//  * @exports
//  * @param {Internal.ItemStack} item 
//  * @param {number} time 
//  * @param {Internal.Player} player 
//  */
// function welcome_remove(item, time, player) {
//     if (time > 72000) {
//         ToolStack.from(item).removeModifier(ModifierId.tryBuild("kubejs", "welcome"), 1)
//         player.sendSystemMessage({
//             "translate": "modifier.kubejs.welcome.hint",
//             "color": getMantleColor("modifier.kubejs.welcome").toString(),
//             "with": [
//                 item.displayName
//             ]
//         })
//     }
// }