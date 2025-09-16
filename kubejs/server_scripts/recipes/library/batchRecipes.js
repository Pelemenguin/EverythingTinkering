// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Batcb recipes | 批量配方
 * - - - - -
 * @copyright Pelemenguin 2025
 * @license LGPL-3.0-or-later
 * This file is part of EverythingTinkering.
 * Full license see file `COPYING.LESSER`
 * - - - - -
 * @author Pelemenguin
 */

/* global
    ServerEvents
*/

ServerEvents.recipes(event => {

    global.Recipes.PART_BUILDER_COMPOSITE.forEach((id, recipe) => {
        global.CustomUtils.Tinker.TOOL_PARTS.forEach(item => {
            if (!item.canUseMaterial(MaterialRegistry.getInstance().getMaterial(recipe.input.getId()))) return;
            let compositing = recipe.material === undefined ? recipe.output : recipe.material;
            event.custom({
                type: "tconstruct:item_part_builder",
                pattern: item.getId(),
                pattern_item: {
                    item: item.getId(),
                    nbt: {
                        Material: recipe.input.toString()
                    }
                },
                material: compositing.toString(),
                cost: 1, // TODO: Temporarily set it to 1
                result: {
                    item: item.getId(),
                    nbt: {
                        Material: compositing.toString()
                    }
                }
            }).id(`${id}/${item.getIdLocation().getPath()}`);
        })
    })

});
