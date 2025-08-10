// priority: 10000

/* eslint-disable no-unused-vars */

/**
 * @fileoverview Representative items
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
    Item
*/

/**
 * - Representative items map.
 * - 代表物品表
 * - - - - -
 * @type {{[materialId: string]: string}}
 */
let reprItems = {

    // Tier 1
    "tconstruct:wood": "minecraft:oak_log",
    "tconstruct:bamboo": "minecraft:bamboo",
    "tconstruct:rock": "minecraft:stone",
    "kubejs:soil": "minecraft:dirt",
    "kubejs:terracotta": "minecraft:terracotta",
    "kubejs:brick": "minecraft:brick",
    "kubejs:coal": "minecraft:coal",
    "tconstruct:flint": "minecraft:flint",
    "tconstruct:bone": "minecraft:bone",
    "tconstruct:copper": "minecraft:copper_ingot",
    "kubejs:lapis_lazuli": "minecraft:lapis_lazuli",
    "kubejs:andesite_alloy": "create:andesite_alloy",
    "tconstruct:chorus": "minecraft:popped_chorus_fruit",
    "tconstruct:string": "minecraft:string",
    "tconstruct:leather": "minecraft:leather",
    "kubejs:paper": "minecraft:paper",
    "tconstruct:vine": "minecraft:vine",

    // Tier 2
    "tconstruct:iron": "minecraft:iron_ingot",
    "tconstruct:seared_stone": "tconstruct:seared_brick",
    "tconstruct:venombone": "tconstruct:venombone",
    "tconstruct:slimewood": "tconstruct:greenheart_log",
    "tconstruct:necrotic_bone": "tconstruct:necrotic_bone",
    "tconstruct:scorched_stone": "tconstruct:scorched_brick",
    "kubejs:sea_alloy": "minecraft:sea_lantern",
    "tconstruct:whitestone": "minecraft:end_stone",
    "tconstruct:skyslime_vine": "tconstruct:sky_slime_vine",
    "tconstruct:twisting_vine": "minecraft:twisting_vines",
    "tconstruct:weeping_vine": "minecraft:weeping_vines",
    "tconstruct:glass": "minecraft:glass"

};

/**
 * - Representative items to show in the book.
 * - 在书中显示的代表物品。
 */
const RepresentativeItems = {
    /**
     * @param {string} id 
     * - - - - -
     * @returns {Internal.ItemStack}
     */
    get: (id) => {
        /** @type {string} */
        let item = reprItems[id];
        if (item === undefined) {
            return Item.of("tconstruct:large_plate", 1, {Material: id});
        } else {
            return Item.of(item);
        }
    },

    /**
     * @param {Internal.IMaterial[]} materialArray
     */
    sortMaterials: (materialArray) => {
        let keys = Object.keys(reprItems);
        let keyToIndex = {};
        keys.forEach((v, i) => {keyToIndex[v] = i + 1;});
        return materialArray.sort((a, b) => {
            let aString = a.getIdentifier().toString();
            let bString = b.getIdentifier().toString();
            return ((keyToIndex[aString] === undefined ? 2147483647 : keyToIndex[aString])
            - (keyToIndex[bString] === undefined ? 2147483647 : keyToIndex[bString]));
        });
    }
};
