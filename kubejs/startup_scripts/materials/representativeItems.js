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

const HIDDEN_MATERIAL = {};

/**
 * - Representative items map.
 * - 代表物品表
 * - - - - -
 * @type {{[materialId: string]: string | typeof HIDDEN_MATERIAL}}
 */
let reprItems = {

    // Tier 1

    // Non-Metal
    "tconstruct:wood": "minecraft:oak_log",
    "tconstruct:bamboo": "minecraft:bamboo",
    "tconstruct:cactus": "minecraft:cactus",
    "tconstruct:rock": "minecraft:stone",
    "kubejs:soil": "minecraft:dirt",
    "kubejs:terracotta": "minecraft:terracotta",
    "kubejs:brick": "minecraft:brick",

    // Minerals
    "kubejs:coal": "minecraft:coal",
    "kubejs:lapis_lazuli": "minecraft:lapis_lazuli",
    "kubejs:redstone": "minecraft:redstone",
    "kubejs:amethyst": "minecraft:amethyst_shard",

    // Other
    "tconstruct:flint": "minecraft:flint",
    "tconstruct:bone": "minecraft:bone",
    "kubejs:magma": "minecraft:magma_block",
    "tconstruct:chorus": "minecraft:popped_chorus_fruit",

    // Metal
    "tconstruct:copper": "minecraft:copper_ingot",
    "kubejs:andesite_alloy": "create:andesite_alloy",

    // Part-Specified Materials
    "kubejs:sugar_cane": "minecraft:sugar_cane",
    "tconstruct:string": "minecraft:string",
    "tconstruct:leather": "minecraft:leather",
    "kubejs:paper": "minecraft:paper",
    "tconstruct:vine": "minecraft:vine",
    "kubejs:kelp": "minecraft:kelp",
    "tconstruct:ice": "minecraft:ice",
    "kubejs:phantom_membrane": "minecraft:phantom_membrane",

    // Tier 2

    // Non-Metal Materials
    "tconstruct:treated_wood": "thermal:creosote_bucket",
    "tconstruct:seared_stone": "tconstruct:seared_brick",
    "tconstruct:scorched_stone": "tconstruct:scorched_brick",
    "tconstruct:slimewood": "tconstruct:greenheart_log",

    // Metals
    "tconstruct:iron": "minecraft:iron_ingot",
    "tconstruct:lead": "thermal:lead_ingot",
    "tconstruct:silver": "thermal:silver_ingot",
    "tconstruct:gold": "minecraft:gold_ingot",

    // Other
    "tconstruct:venombone": "tconstruct:venombone",
    "tconstruct:necrotic_bone": "tconstruct:necrotic_bone",
    "tconstruct:whitestone": "minecraft:end_stone",
    "tconstruct:skyslime_vine": "tconstruct:sky_slime_vine",
    "tconstruct:twisting_vine": "minecraft:twisting_vines",
    "tconstruct:weeping_vine": "minecraft:weeping_vines",
    "tconstruct:glass": "minecraft:glass",
    "tconstruct:slimeskin": "tconstruct:earth_slime_bucket",

    "kubejs:sea_alloy": HIDDEN_MATERIAL, // Not prepared yet

    // ========== Tier 3 ========== //

    // Non-Metal
    "tconstruct:obsidian": "minecraft:obsidian",
    "kubejs:crying_obsidian": "minecraft:crying_obsidian",

    // Metal
    "tconstruct:cobalt": "tconstruct:cobalt_ingot",
    
    // Alloys
    "tconstruct:steel": "tconstruct:steel_ingot",
    "tconstruct:bronze": "thermal:bronze_ingot",
    "tconstruct:constantan": "thermal:constantan_ingot",
    "tconstruct:invar": "thermal:invar_ingot",
    "tconstruct:electrum": "thermal:electrum_ingot",
    "tconstruct:rose_gold": "tconstruct:rose_gold_ingot",

    // Imaginary Alloys
    "tconstruct:amethyst_bronze": "tconstruct:amethyst_bronze_ingot",
    "tconstruct:pig_iron": "tconstruct:pig_iron_ingot",
    "tconstruct:slimesteel": "tconstruct:slimesteel_ingot",
    "tconstruct:pewter": "tconstruct:molten_pewter_bucket", // Pewter has no ingots, put it also here

    // Composite Materials
    "tconstruct:nahuatl": "tconstruct:nahuatl",
    "tconstruct:plated_slimewood": "create:brass_ingot",

    // Part-Specified Materials
    "tconstruct:darkthread": "minecraft:obsidian",
    "tconstruct:ichorskin": "tconstruct:ichor_bucket",

    // Tier 4
    "tconstruct:blazewood": "tconstruct:blazewood",
    "tconstruct:hepatizon": "tconstruct:hepatizon_ingot",
    "tconstruct:manyullyn": "tconstruct:manyullyn_ingot",
    "tconstruct:cinderslime": "tconstruct:cinderslime_ingot",
    "tconstruct:queens_slime": "tconstruct:queens_slime_ingot",
    "tconstruct:blazing_bone": "tconstruct:blazing_bone",
    "tconstruct:ancient_hide": "minecraft:netherite_scrap",
    "tconstruct:enderslime_vine": "tconstruct:ender_slime_vine",

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
        if (item === undefined || item === HIDDEN_MATERIAL) {
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
        let filtered = materialArray.filter(m => reprItems[m.getIdentifier().toString()] !== HIDDEN_MATERIAL);
        return filtered.sort((a, b) => {
            let aString = a.getIdentifier().toString();
            let bString = b.getIdentifier().toString();
            return ((keyToIndex[aString] === undefined ? 2147483647 : keyToIndex[aString])
            - (keyToIndex[bString] === undefined ? 2147483647 : keyToIndex[bString]));
        });
    }
};
