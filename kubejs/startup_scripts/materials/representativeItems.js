// priority: 10000

/* eslint-disable no-unused-vars */

/**
 * @fileoverview Representative items
 * 
 * @author Pelemenguin
 * @license CC-BY-NC-SA-4.0
 */

/* global
    Item
*/

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
            return Item.of("tconstruct:repair_kit", 1, {Material: id});
        } else {
            return item;
        }
    }
};

let reprItems = {
    "tconstruct:wood": Item.of("minecraft:oak_log"),
    "kubejs:soil": Item.of("minecraft:dirt"),
    "tconstruct:rock": Item.of("minecraft:stone"),
    "kubejs:brick": Item.of("minecraft:brick"),
    "kubejs:coal": Item.of("minecraft:coal"),
    "tconstruct:flint": Item.of("minecraft:flint"),
    "tconstruct:bone": Item.of("minecraft:bone"),
    "tconstruct:copper": Item.of("minecraft:copper_ingot"),
    "kubejs:terracotta": Item.of("minecraft:terracotta"),
    "tconstruct:bamboo": Item.of("minecraft:bamboo"),
    "kubejs:lapis_lazuli": Item.of("minecraft:lapis_lazuli"),
    "kubejs:andesite_alloy": Item.of("create:andesite_alloy"),
    "tconstruct:chorus": Item.of("minecraft:popped_chorus_fruit"),
    "tconstruct:string": Item.of("minecraft:string"),
    "tconstruct:leather": Item.of("minecraft:leather"),
    "kubejs:paper": Item.of("minecraft:paper"),
    "tconstruct:vine": Item.of("minecraft:vine")
};