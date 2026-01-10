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
    TinkerToolParts
    $MaterialVariantId
*/

const HIDDEN_MATERIAL = {};
const DISPLAY_AS_LARGE_PLATE = {};

/**
 * - Representative items map.
 * - 代表物品表
 * - - - - -
 * @type {{[materialId: string]: string | typeof HIDDEN_MATERIAL}}
 */
let reprItems = {

    // ========== Main Line / No Line ========== //

    // ---------- Herbal ---------- //

    // Common
    "tconstruct:wood": "minecraft:oak_log",
    "tconstruct:bamboo": "minecraft:bamboo",
    "tconstruct:cactus": "minecraft:cactus",
    "tconstruct:leaves": "minecraft:oak_leaves",
    "kubejs:sugar_cane": "minecraft:sugar_cane",
    "kubejs:kelp": "minecraft:kelp",
    "tconstruct:slimewood": "tconstruct:greenheart_log",
    "tconstruct:blazewood": "tconstruct:blazewood",

    // Vine-Like
    "tconstruct:vine": "minecraft:vine",
    "tconstruct:skyslime_vine": "tconstruct:sky_slime_vine",
    "tconstruct:enderslime_vine": "tconstruct:ender_slime_vine",
    "tconstruct:twisting_vine": "minecraft:twisting_vines",
    "tconstruct:weeping_vine": "minecraft:weeping_vines",

    // End
    "tconstruct:chorus": "minecraft:popped_chorus_fruit",

    // ---------- Geological---------- //

    // Ground
    "kubejs:soil": "minecraft:dirt",
    "tconstruct:rock": "minecraft:stone",
    "kubejs:terracotta": "minecraft:terracotta",
    "tconstruct:ice": "minecraft:ice",

    // Relatively Rare
    "tconstruct:flint": "minecraft:flint",
    "tconstruct:prismarine": "minecraft:prismarine_shard",

    // Nether
    "kubejs:magma": "minecraft:magma_block",
    "tconstruct:obsidian": "minecraft:obsidian", // Not very "Nether", but put it after Magma Block
    "kubejs:crying_obsidian": "minecraft:crying_obsidian",
    "tconstruct:glowstone": "minecraft:glowstone_dust",

    // Common Ore
    "kubejs:coal": "minecraft:coal",
    "kubejs:lapis_lazuli": "minecraft:lapis_lazuli",
    "kubejs:redstone": "minecraft:redstone",

    // Ingots
    "tconstruct:copper": "minecraft:copper_ingot",
    "tconstruct:iron": "minecraft:iron_ingot",
    "tconstruct:lead": "thermal:lead_ingot",
    "tconstruct:silver": "thermal:silver_ingot",
    "tconstruct:gold": "minecraft:gold_ingot",
    "tconstruct:cobalt": "tconstruct:cobalt_ingot",

    // Alloy Ingots // Not very `geological`, but place them after Ingots
    "tconstruct:steel": "tconstruct:steel_ingot",
    "tconstruct:bronze": "thermal:bronze_ingot",
    "tconstruct:constantan": "thermal:constantan_ingot",
    "tconstruct:invar": "thermal:invar_ingot",
    "tconstruct:electrum": "thermal:electrum_ingot",
    "tconstruct:rose_gold": "tconstruct:rose_gold_ingot",
    "tconstruct:amethyst_bronze": "tconstruct:amethyst_bronze_ingot",
    "tconstruct:pig_iron": "tconstruct:pig_iron_ingot",
    "tconstruct:pewter": "tconstruct:molten_pewter_bucket", // Pewter has no ingots, put it also here
    "tconstruct:plated_slimewood": "create:brass_ingot",
    "tconstruct:hepatizon": "tconstruct:hepatizon_ingot",
    "tconstruct:manyullyn": "tconstruct:manyullyn_ingot",

    "tconstruct:slimesteel": "tconstruct:slimesteel_ingot",
    "tconstruct:cinderslime": "tconstruct:cinderslime_ingot",
    "tconstruct:queens_slime": "tconstruct:queens_slime_ingot",
    "tconstruct:knightmetal": "tconstruct:knightmetal_ingot",

    // Crystals
    "tconstruct:quartz": "minecraft:quartz",
    "tconstruct:amethyst": "minecraft:amethyst_shard",
    "tconstruct:earthslime": "tconstruct:earth_slime_crystal",
    "tconstruct:skyslime": "tconstruct:sky_slime_crystal",
    "tconstruct:enderslime": "tconstruct:ender_slime_crystal",
    "tconstruct:ichor": "tconstruct:ichor_slime_crystal",

    // End
    "tconstruct:whitestone": "minecraft:end_stone",

    // Other Metal
    "tconstruct:magnetite": "tconstruct:steel_shard",
    "tconstruct:knightly": "tconstruct:knightmetal_shard",
    "tconstruct:ancient_hide": "minecraft:netherite_scrap",

    // ---------- Building ---------- //

    "tconstruct:glass": "minecraft:glass",
    "kubejs:brick": "minecraft:brick",
    "tconstruct:seared_stone": "tconstruct:seared_brick",
    "tconstruct:scorched_stone": "tconstruct:scorched_brick",
    "tconstruct:nahuatl": "tconstruct:nahuatl",
    "tconstruct:end_rod": "minecraft:end_rod",

    // ---------- Loot ---------- //

    // Passive
    "tconstruct:feather": "minecraft:feather",
    "tconstruct:wool": "minecraft:white_wool",
    "tconstruct:leather": "minecraft:leather",
    "tconstruct:slimeskin": "tconstruct:earth_slime_bucket",
    "tconstruct:ichorskin": "tconstruct:ichor_bucket",

    // Aggresive
    "tconstruct:bone": "minecraft:bone",
    "tconstruct:venombone": "tconstruct:venombone",
    "tconstruct:necrotic_bone": "tconstruct:necrotic_bone",
    "tconstruct:blazing_bone": "tconstruct:blazing_bone",
    "tconstruct:string": "minecraft:string",
    "tconstruct:gunpowder": "minecraft:gunpowder",
    "tconstruct:ender_pearl": "minecraft:ender_pearl",
    "tconstruct:slimeball": "minecraft:slime_ball",
    "tconstruct:magma": "minecraft:magma_cream",
    "tconstruct:blaze": "minecraft:blaze_rod",
    "kubejs:phantom_membrane": "minecraft:phantom_membrane",
    "tconstruct:shulker": "minecraft:shulker_shell",
    "tconstruct:dragon_scale": "tconstruct:dragon_scale",

    // ---------- Miscalleous ---------- //

    "tconstruct:paper": "minecraft:paper",
    "tconstruct:darkthread": "minecraft:obsidian",

    // ========== Technology Line ========== //

    "tconstruct:treated_wood": "thermal:creosote_bucket",
    "kubejs:andesite_alloy": "create:andesite_alloy",
    "kubejs:steel_clad_copper": DISPLAY_AS_LARGE_PLATE,

    // ========== Adventure Line ========== //

    "kubejs:scrapped_tinker_metal": "kubejs:scrapped_tinker_metal",

    // ========== Hidden ========== //

    "kubejs:sea_alloy": HIDDEN_MATERIAL, // Not prepared yet

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
        if (item === undefined || item === HIDDEN_MATERIAL || item === DISPLAY_AS_LARGE_PLATE) {
            // return Item.of("tconstruct:large_plate", 1, {Material: id});
            return TinkerToolParts.largePlate.get().withMaterialForDisplay($MaterialVariantId.parse(id));
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
