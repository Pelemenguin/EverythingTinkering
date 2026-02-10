// priority: 1000

// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Random Tool Part Pool
 * @author Pelemenguin
 */

/* global
    global: writable
    $HashSet
    $RepairKitItem
    $MaterialStatsId
    $FakeIngotItem
    ToolPartItem
    LootEntry
    $MaterialItem
    $MaterialVariantId
*/



/**
 * Adds a loot pool of random tool parts matching the given material and stat types.  
 * 向战利品池添加一个随机工具部件战利品池，使用给定的材料和属性类型。
 * - - - - -
 * @param {{[materialVariantId: string]: number}} material 
 * An object mapping `MaterialVariantId`s to their weights.  
 * 一个将`MaterialVariantId`映射到它们权重的对象。
 * 
 * @param {(Internal.MaterialStatsId | Internal.MaterialItem)[]} statTypes 
 * A list of `MaterialStatsId`s, the tool parts will be selected from those stat types.
 *`MaterialStatsId`列表，工具部件将会从这些属性类型中选择。
 * 
 * @param {Internal.NumberProvider_} rolls
 * The number of rolls for the loot pool.  
 * 战利品池的抽取次数。
 * 
 * @param {undefined | (pool: Internal.GroupedLootBuilder) => void} poolInit 
 * A function that initializes the loot pool, it will be called with the loot pool builder as parameter.
 * 一个初始化战利品池的函数，战利品池构建器作为参数传入。
 * 
 * @returns {(pool: Internal.GroupedLootBuilder) => void}
 * A loot function that adds a pool of random tool parts matching the given material and stat types.  
 * 一个战利品函数，添加一个随机工具部件战利品池，匹配给定的材料和属性类型。
 */
global.LootFunctions.addRandomToolPartPool = (material, statTypes, rolls, poolInit) => {
    let itemSet = new $HashSet();
    /** @type {Internal.HashSet<Internal.MaterialStatsId>} */
    let statTypeSet = new $HashSet(statTypes.filter(value => {
        if (value instanceof $MaterialStatsId) {
            return true;
        } else if (value instanceof $MaterialItem) {
            itemSet.add(value);
            return false;
        }
        return false;
    }));
    let partList = global.TOOL_PARTS.filter(item => {
        if (itemSet.contains(item)) {
            return true;
        }
        if (item instanceof $RepairKitItem) {
            return statTypeSet.contains(new $MaterialStatsId("tconstruct", "repair_kit"));
        } else if (item instanceof $FakeIngotItem) {
            return statTypeSet.contains(new $MaterialStatsId("tconstruct", "ingot"));
        } else if (item instanceof ToolPartItem) {
            return statTypeSet.contains(item.getStatType());
        }
        return false;
    });

    let lootList = [];
    for (let materialVariantId in material) {
        let weight = material[materialVariantId];
        for (let part of partList) {
            lootList.push(LootEntry.of(part.withMaterialForDisplay($MaterialVariantId.parse(materialVariantId))).withWeight(weight));
        }
    }

    return (pool) => {
        if (poolInit != undefined) {
            poolInit(pool);
        }
        pool.addWeightedLoot(rolls, lootList);
    };
};
