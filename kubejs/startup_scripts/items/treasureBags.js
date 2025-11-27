// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Treasure Bags
 * - - - - -
 * @copyright Pelemenguin 2025
 * @license LGPL-3.0-or-later
 * This file is part of EverythingTinkering.
 * Full license see file `COPYING.LESSER`
 * - - - - -
 * @author Pelemenguin
 */

/* global
    global: writable
    StartupEvents
    $LootParams$Builder
    $LootContextParams
    $LootContextParamSets
    Items
*/

global.ItemUseFunctions.TreasureBags = {};

/**
 * 
 * @param {string} treasureBagType 
 * @returns {Internal.ItemBuilder$FinishUsingCallback_}
 */
global.ItemUseFunctions.TreasureBags.BUILDER = (treasureBagType) => {
    return (itemStack, level,/** @type {Internal.Player} */ entity) => {
        let isConsuming = !entity.isPlayer() || !(entity.isCreative() || entity.isSpectator());
        let isReplacing = isConsuming && itemStack.getCount() == 1;
        let resultStack = itemStack;
        if (!level.isClientSide()) {
            let lootTable = level.getServer().getLootData().getLootTable(`kubejs:treasure_bag/${treasureBagType}`);
            let items = lootTable.getRandomItems(new $LootParams$Builder(level)
                .withParameter($LootContextParams.ORIGIN, entity.position())
                .withParameter($LootContextParams.THIS_ENTITY, entity)
                .create($LootContextParamSets.CHEST)
            ).toArray();
            items.forEach(isReplacing ? (i, index) => {if (index != 0) entity.give(i);} : i => entity.give(i));
            if (isReplacing) resultStack = items.length == 0 ? Items.AIR.getDefaultInstance() : items[0];
        }
        if (isConsuming) resultStack.shrink(1);
        return resultStack;
    };
};

/**
 * @typedef {"icy_terracube"} Annotation.ItemUseFunctions.TreasureBags.Types
 * @type {Annotation.ItemUseFunctions.TreasureBags.Types[]}
 */
global.ItemUseFunctions.TreasureBags.TYPES = [
    "icy_terracube"
];

/** @type {{[T in Annotation.ItemUseFunctions.TreasureBags.Types]: Internal.ItemBuilder$FinishUsingCallback_}} */
global.ItemUseFunctions.TreasureBags.INSTANCES = {};

for (let type of global.ItemUseFunctions.TreasureBags.TYPES) {
    global.ItemUseFunctions.TreasureBags.INSTANCES[type] = global.ItemUseFunctions.TreasureBags.BUILDER(type);
}

StartupEvents.registry("minecraft:item", event => {
    for (let treasureBagType of global.ItemUseFunctions.TreasureBags.TYPES) {
        event.create(`kubejs:${treasureBagType}_treasure_bag`)
            .maxStackSize(16)
            .useAnimation("none")
            .useDuration(() => 1)
            .use(() => true)
            .finishUsing((i, l, e) => global.ItemUseFunctions.TreasureBags.INSTANCES.icy_terracube(i, l, e))
            .rarity("rare")
        ;
    }
});
