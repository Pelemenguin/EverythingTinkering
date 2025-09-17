// priority: 1000

// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Part Builder Composite Recipes
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
*/

/**
 * @param {string} id
 * @param {string} input
 * @param {string} output
 * @param {string?} using
 */
let addPartBuilderCompositeRecipes = (id, input, output, using) => {
    global.Recipes.PART_BUILDER_COMPOSITE.put(`kubejs:tinkering/part_builder_composite/${id}`, {
        input: MaterialVariantId.tryParse(input),
        output: MaterialVariantId.tryParse(output),
        material: MaterialVariantId.tryParse(using === undefined ? output : using)
    });
}

// Crying Obsidian
addPartBuilderCompositeRecipes("crying_obsidian", "tconstruct:obsidian", "kubejs:crying_obsidian");
