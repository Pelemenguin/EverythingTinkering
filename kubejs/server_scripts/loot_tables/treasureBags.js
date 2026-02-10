// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Treasure Bags
 * @author Pelemenguin
 */

/* global
    global: writable
    LootJS
*/

// Only for adding special items
// Original definitions can be found in `data` folder

LootJS.modifiers(event => {
    event.addLootTableModifier("kubejs:treasure_bag/no_hit/icy_terracube")
        .pool(pool => {
            pool.addLoot(global.Artifacts.getRecursive("boss_no_hit.icy_terracube").createLootEntry(1));
        })
    ;
});
