// priority: 10000

// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview
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
    Utils
*/

global.BlockFunctions = {};

// Init Fluid Infusion Core as they have recipes to register

global.BlockFunctions.FluidInfusionCore = {};

/**
 * @typedef {{
 *     inputMaterial: Internal.MaterialVariantId,
 *     inputFluids: Internal.Fluid[],
 *     outputMaterial: Internal.MaterialVariantId
 *     statTypes: Internal.Set<Internal.MaterialStatsId>
 * }} Annotation.BatchRecipes.FluidInfusion.Material
 * 
 * @typedef {{
 *     inputItem: Internal.Ingredient,
 *     inputFluids: Internal.Fluid[],
 *     outputItem: Internal.ItemStack,
 * }} Annotation.BatchRecipes.FluidInfusion.Item
 */

/** @type {Internal.Map<Internal.MaterialVariantId, Internal.Map<Internal.Fluid[], Annotation.BatchRecipes.FluidInfusion.Material>>} */
global.BlockFunctions.FluidInfusionCore.MATERIAL_RECIPES = Utils.newMap();

/** @type {Internal.Map<Internal.Ingredient, Internal.Map<Internal.Fluid[], Annotation.BatchRecipes.FluidInfusion.Item>>} */
global.BlockFunctions.FluidInfusionCore.RECIPES = Utils.newMap();
