// priority: 10000

/**
 * @fileoverview Usage Suggestion | 用途建议
 * - Suggestions for material usage.
 * - 材料用途的建议。
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
    TinkerItemElement
    Utils
    Component
    Item
    NBT
*/

/**
 * @type {{[materialId: string]: [Annotation.MaterialUsage, number]}}
 * - - - - -
 * Suggestion Multipliers:
 * - `0.0`: Completely not suggested. Only for `NOT_SUGGESTED`.
 * - `0.1`: Not very suggested. Usually the weakest material in the category.
 * - `0.2`: Consider use the material when players are short of other materials. Not very suggested neither.
 * - `0.3`: Possibly useful at the beginning of the stage.
 * - `0.4`: Consider to use this if necessary.
 * - `0.5`: A normal material
 * - `0.6`: Consider use this when don't know what to use.
 * - `0.7`: Very useful and suggested to use.
 * - `0.8`: Worth to get this material.
 * - `0.9`: Worth to get this material at any cost.
 * - `1.0`: Usually the key to step into the next stage.
 * - - - - -
 * - `>1.0`: Used for next stages. For example, `3.5` represetns a normal material in stage 4.
 */
let suggestions = {

    // Tier 1
    "tconstruct:wood": ["ALTERNATIVE", 0.1],
    "tconstruct:rock": ["ALTERNATIVE", 0.15],
    "kubejs:soil": ["NOT_RECOMMENDED", 0],
    "kubejs:brick": ["DAMAGE", 0.3],
    "kubejs:coal": ["FUNCTIONAL", 0.4],
    "tconstruct:flint": ["DAMAGE", 0.5],
    "tconstruct:bone": ["DAMAGE", 0.5],
    "tconstruct:copper": ["MINING", 0.6],
    "kubejs:terracotta": ["DAMAGE", 0.1],
    "kubejs:lapis_lazuli": ["FUNCTIONAL", 0.8],
    "kubejs:andesite_alloy": ["DAMAGE", 0.7],
    "tconstruct:chorus": ["FUNCTIONAL", 0.5],
    "tconstruct:string": ["DURABILITY", 0.5],
    "tconstruct:leather": ["DURABILITY", 0.5],
    "tconstruct:vine": ["DURABILITY", 0.5]

};

/**
 * @param {(number) => Internal.ItemStack} item 
 * @param {string} id
 * - - - - -
 * @returns {(number, number, number, number) => Internal.TinkerItemElement}
 */
let reprItemElementBase = (item, id) => {
    return (x, y, scale, multiplier) => {
        let result = new TinkerItemElement(item(multiplier));
        result.x = x;
        result.y = y;
        result.tooltip = Utils.newList();
        result.tooltip.add(Component.translatable(`book.kubejs.material.suggestion.${id}.name`).color(usageReprColor[id]).underlined());
        result.tooltip.add(Component.translatable(`book.kubejs.material.suggestion.${id}.description`).gray());
        return result;
    };
};

let usageRepr = {
    "MISSING": reprItemElementBase(() => Item.of("minecraft:barrier"), "missing"),

    "DURABILITY": reprItemElementBase((multiplier) => Item.of("tconstruct:plate_shield", 1, {
        Damage: NBT.intTag((1 - multiplier % 1) * 100),
        tic_materials: [
            "tconstruct:nahuatl",
            "tconstruct:obsidian"
        ],
        tic_stats: {
            "tconstruct:durability": 100.0
        },
        tic_display: true
    }), "durability"),

    "DAMAGE": reprItemElementBase((multiplier) => Item.of("tconstruct:sword", 1, {
        Damage: NBT.intTag((1 - multiplier % 1) * 100),
        tic_materials: [
            "tconstruct:iron",
            "tconstruct:iron",
            "kubejs:lapis_lazuli"
        ],
        tic_stats: {
            "tconstruct:durability": 100.0
        },
        tic_display: true
    }), "damage"),

    "FUNCTIONAL": reprItemElementBase((multiplier) => Item.of("tconstruct:kama", 1, {
        Damage: NBT.intTag((1 - multiplier % 1) * 100),
        tic_materials: [
            "tconstruct:rose_gold",
            "tconstruct:rose_gold",
            "tconstruct:rose_gold"
        ],
        tic_stats: {
            "tconstruct:durability": 100.0
        },
        tic_display: true
    }), "functional"),

    "ALTERNATIVE": reprItemElementBase((multiplier) => Item.of("tconstruct:flint_and_brick", 1, {
        Damage: NBT.intTag((1 - multiplier % 1) * 100),
        tic_stats: {
            "tconstruct:durability": 100.0
        },
        tic_display: true
    }), "alternative"),

    "NOT_RECOMMENDED": reprItemElementBase(() => Item.of("tconstruct:sword", 1, {
        Damage: NBT.intTag(0),
        tic_broken: true,
        tic_materials: [
            "kubejs:soil",
            "kubejs:soil",
            "kubejs:soil"
        ],
        tic_stats: {
            "tconstruct:durability": 100.0
        },
        tic_display: true
    }), "not_recommended"),

    "MINING": reprItemElementBase((multiplier) => Item.of("tconstruct:pickaxe", 1, {
        Damage: NBT.intTag((1 - multiplier % 1) * 100),
        tic_materials: [
            "tconstruct:copper",
            "tconstruct:copper",
            "tconstruct:copper"
        ],
        tic_stats: {
            "tconstruct:durability": 100.0
        },
        tic_display: true
    }), "mining")

};

let usageReprColor = {
    "missing": "#FF0000",
    "durability": "#160075",
    "damage": "#999999",
    "functional": "#FFB9A8",
    "alternative": "#383838",
    "not_recommended": "#744E1C",
    "mining": "#E77C56"
};

const MaterialSuggestions = {
    /**
     * - Get the suggested usage of the material.
     * - 获取材料的推荐用途。
     * - - - - -
     * @param {string} materialId
     * - - - - -
     * @returns {[Annotation.MaterialUsage, number]}
     */
    getUsage: (materialId) => {
        let usage = suggestions[materialId];
        return usage === undefined ? ["MISSING", 0] : usage;
    },

    /**
     * - Get a book element for the suggestion.
     * - 获取代表建议的一个书本元素。
     * - - - - -
     * @param {string} materialId
     * @param {number} x
     * @param {number} y
     * - - - - -
     * @returns {Internal.TinkerItemElement}
     */
    getElement: (materialId, x, y) => {
        let [suggestion, multiplier] = MaterialSuggestions.getUsage(materialId);
        return (usageRepr[suggestion])(x, y, 1, multiplier);
    },

    /**
     * @param {Annotation.MaterialUsage}
     */
    getColor: (usageId) => {
        let color = usageReprColor[usageId];
        if (color === undefined) {
            return "#000000";
        }
        return color;
    }
};