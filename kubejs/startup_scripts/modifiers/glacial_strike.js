// SPDX-License-Identifier: LGPL-3.0-or-later
 
/**
 * @fileoverview Glacial Strike | 霜滞冲击
 * - - - - -
 * Press the key (default: G) to jump high and smash down.
 * 按下特定按键（默认：G）跃起并砸向地面，造成范围伤害。
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
    KubeJSKeybindHelper
    $NetworkDirection
    KubeJSNetworkHelper
*/

KubeJSNetworkHelper.register("GlacialStrikeMessage", 378294469, {}, $NetworkDirection.PLAY_TO_SERVER, (_message, context) => {
    context.get().enqueueWork(() => {
        let item = context.get().getSender().getFeetArmorItem();
        item.damageValue += 1;
    });
    context.get().setPacketHandled(true);
});

// eslint-disable-next-line no-unused-vars
let GLACIAL_STRIKE = ModifierManager.registerCommonModifier("glacial_strike", "GlacialStrikeModifier", {
    __keybind__: {
        registerKeys: () => {
            KubeJSKeybindHelper.register("glacial_strike", 71, "modifier");
        },
    },
    onInventoryTick: (tool, modifier, world, holder, itemSlot, isSelected, isCorrectSlot, stack) => {
        if (!stack.canEquip("feet", holder)) return;
        if (!world.isClientSide()) {
            return;
        }
        if (!isCorrectSlot) return;
        if (KubeJSKeybindHelper.get("glacial_strike", "modifier").isDown()) {
            KubeJSNetworkHelper.CHANNEL.sendToServer(KubeJSNetworkHelper.createMessage("GlacialStrikeMessage", {}));
        }
    }
});
