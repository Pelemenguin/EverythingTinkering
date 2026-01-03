// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Material Recipes | 材料配方
 * - - - - -
 * @copyright Pelemenguin 2025
 * @license LGPL-3.0-or-later
 * This file is part of EverythingTinkering.
 * Full license see file `COPYING.LESSER`
 * - - - - -
 * @author Pelemenguin
 */

/* global
    BatchMaterialRecipes
    $MaterialVariantId
    IngredientHelper
*/

BatchMaterialRecipes.Deploying.register("tinkering/materials/steel_clad_copper/deploying",
    $MaterialVariantId.tryParse("tconstruct:copper"),
    $MaterialVariantId.tryParse("kubejs:steel_clad_copper"),
    IngredientHelper.tag("forge:plates/iron")
);
