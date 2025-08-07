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
    "tconstruct:wood": "minecraft:oak_log",
    "kubejs:soil": "minecraft:dirt",
    "tconstruct:rock": "minecraft:stone",
    "kubejs:brick": "minecraft:brick",
    "kubejs:coal": "minecraft:coal",
    "tconstruct:flint": "minecraft:flint",
    "tconstruct:bone": "minecraft:bone",
    "tconstruct:copper": "minecraft:copper_ingot",
    "kubejs:terracotta": "minecraft:terracotta",
    "tconstruct:bamboo": "minecraft:bamboo",
    "kubejs:lapis_lazuli": "minecraft:lapis_lazuli",
    "kubejs:andesite_alloy": "create:andesite_alloy",
    "tconstruct:chorus": "minecraft:popped_chorus_fruit",
    "tconstruct:string": "minecraft:string",
    "tconstruct:leather": "minecraft:leather",
    "kubejs:paper": "minecraft:paper",
    "tconstruct:vine": "minecraft:vine"
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
    }
};
