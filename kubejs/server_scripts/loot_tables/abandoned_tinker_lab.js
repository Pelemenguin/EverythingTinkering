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
    event.addLootTableModifier("kubejs:chests/abandoned_tinker_lab/dps_test")
        .pool(pool => {
            pool.rolls({min: 3, max: 6});
            let entries = [];
            global.Artifacts.getRecursiveArtifactGroup("chest.abandoned_tinker_lab.dps_test").children.forEach((_key, artifact) => {
                if (artifact.isGroup()) {
                    return;
                }
                entries.push(artifact.createLootEntry(1).withWeight(1));
            });
            pool.addWeightedLoot(1, false, entries);
        })
    ;
});
