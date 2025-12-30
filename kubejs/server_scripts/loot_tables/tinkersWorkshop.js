// priority: -1000

// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Tinker's Workshop | 工匠作坊
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
    LootJS
*/

LootJS.modifiers(event => {
    event.addLootTableModifier("kubejs:tinkers_workshop")
        .pool(pool => {
            pool.addWeightedLoot([
                global.Artifacts.getRecursiveArtifact("chest.tinkers_workshop.classic_pickaxe").createLootEntry(1).withWeight(2),
                global.Artifacts.getRecursiveArtifact("chest.tinkers_workshop.non_classic_pickaxe").createLootEntry(1).withWeight(1)
            ]);
        });
});
