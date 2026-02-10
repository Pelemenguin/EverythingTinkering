/**
 * @fileoverview Treasure Bags
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
 * @param {string} treasureBagType 
 * @param {boolean} isNoHit 
 * @returns {Internal.ItemBuilder$FinishUsingCallback_}
 */
global.ItemUseFunctions.TreasureBags.BUILDER = (treasureBagType, isNoHit) => {

    /**
     * @param {Internal.Level} level 
     * @param {Internal.Player} entity 
     * @returns {Internal.ItemStack[]}
     */
    let item = (level, entity) => {
        let lootTable = level.getServer().getLootData().getLootTable(`kubejs:treasure_bag/${treasureBagType}`);
        return lootTable.getRandomItems(new $LootParams$Builder(level)
            .withParameter($LootContextParams.ORIGIN, entity.position())
            .withParameter($LootContextParams.THIS_ENTITY, entity)
            .create($LootContextParamSets.CHEST)
        ).toArray();
    };

    /**
     * @param {Internal.ItemStack} itemStack 
     * @param {Internal.Level} level 
     * @param {Internal.Player} entity 
     * @param {() => Internal.ItemStack[]} items 
     * @returns {Internal.ItemStack}
     */
    let give = (itemStack, level, /** @type {Internal.Player} */ entity, items) => {
        let isReplacing = itemStack.getCount() == 1;
        let resultStack = itemStack;
        if (!level.isClientSide()) {
            let itemList = items();
            itemList.forEach(isReplacing ? (i, index) => {if (index != 0) entity.give(i);} : i => entity.give(i));
            if (isReplacing) resultStack = itemList.length == 0 ? Items.AIR.getDefaultInstance() : itemList[0];
        }
        resultStack.shrink(1);
        return resultStack;
    };

    if (isNoHit) {
        /**
         * @param {Internal.Level} level 
         * @param {Internal.Player} entity 
         */
        let noHitItem = (level, entity) => {
            let lootTable = level.getServer().getLootData().getLootTable(`kubejs:treasure_bag/no_hit/${treasureBagType}`);
            return item(level, entity).concat(lootTable.getRandomItems(new $LootParams$Builder(level)
                .withParameter($LootContextParams.ORIGIN, entity.position())
                .withParameter($LootContextParams.THIS_ENTITY, entity)
                .create($LootContextParamSets.CHEST)
            ).toArray());
        };

        return (i, l, e) => give(i, l, e, () => noHitItem(l, e));
    }

    return (i, l, e) => give(i, l, e, () => item(l, e));
};

/**
 * @typedef {"icy_terracube"} Annotation.ItemUseFunctions.TreasureBags.Types
 * @type {Annotation.ItemUseFunctions.TreasureBags.Types[]}
 */
global.ItemUseFunctions.TreasureBags.TYPES = [
    "icy_terracube"
];

/** @type {{[T in Annotation.ItemUseFunctions.TreasureBags.Types | `${Annotation.ItemUseFunctions.TreasureBags.Types}_nohit`]: Internal.ItemBuilder$FinishUsingCallback_}} */
global.ItemUseFunctions.TreasureBags.INSTANCES = {};

for (let type of global.ItemUseFunctions.TreasureBags.TYPES) {
    global.ItemUseFunctions.TreasureBags.INSTANCES[type] = global.ItemUseFunctions.TreasureBags.BUILDER(type, false);
    global.ItemUseFunctions.TreasureBags.INSTANCES[type + "_nohit"] = global.ItemUseFunctions.TreasureBags.BUILDER(type, true);
}

StartupEvents.registry("minecraft:item", event => {
    for (let treasureBagType of global.ItemUseFunctions.TreasureBags.TYPES) {
        event.create(`kubejs:${treasureBagType}_treasure_bag`)
            .maxStackSize(16)
            .useAnimation("none")
            .useDuration(() => 1)
            .use(() => true)
            .finishUsing((i, l, e) => global.ItemUseFunctions.TreasureBags.INSTANCES[treasureBagType](i, l, e))
            .rarity("rare")
        ;
        event.create(`kubejs:${treasureBagType}_treasure_bag_no_hit`)
            .maxStackSize(16)
            .useAnimation("none")
            .useDuration(() => 1)
            .use(() => true)
            .finishUsing((i, l, e) => global.ItemUseFunctions.TreasureBags.INSTANCES[treasureBagType + "_nohit"](i, l, e))
            .rarity("epic")
            .texture("layer0", `kubejs:item/${treasureBagType}_treasure_bag`)
            .glow(true)
        ;
    }
});
