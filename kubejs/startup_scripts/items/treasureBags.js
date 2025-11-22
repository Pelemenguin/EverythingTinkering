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
*/

global.ItemUseFunctions.TreasureBags = {};

/**
 * 
 * @param {string} treasureBagType 
 * @returns {Internal.ItemBuilder$FinishUsingCallback_}
 */
global.ItemUseFunctions.TreasureBags.BUILDER = (treasureBagType) => {
    return (itemStack, level,/** @type {Internal.Player} */ entity) => {
        itemStack.shrink(1);
        if (level.isClientSide()) return;
        const lootTable = level.getServer().getLootData().getLootTable(`kubejs:treasure_bag/${treasureBagType}`);
        lootTable.getRandomItems(new $LootParams$Builder(level)
            .withParameter($LootContextParams.ORIGIN, entity.position())
            .withParameter($LootContextParams.THIS_ENTITY, entity)
            .create($LootContextParamSets.CHEST)
        ).forEach(itemStack => entity.give(itemStack));
        return itemStack;
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
    const treasureBagTypes = global.ItemUseFunctions.TreasureBags.TYPES;

    for (let treasureBagType of treasureBagTypes) {
        event.create(`kubejs:${treasureBagType}_treasure_bag`)
            .maxStackSize(16)
            .useAnimation("none")
            .useDuration(() => 1)
            .use(() => true)
            .finishUsing((i, l, e) => global.ItemUseFunctions.TreasureBags.INSTANCES.icy_terracube(i, l, e))
        ;
    }
});
