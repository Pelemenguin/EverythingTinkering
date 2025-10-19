// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Icy Terracube
 * - - - - -
 * @copyright Pelemenguin 2025
 * @license LGPL-3.0-or-later
 * This file is part of EverythingTinkering.
 * Full license see file `COPYING.LESSER`
 * - - - - -
 * @author Pelemenguin
 */

/* global
    StartupEvents
*/

StartupEvents.registry("minecraft:entity_type", event => {
    
    event.create("kubejs:icy_terracube", "entityjs:living")
        .sized(4, 4)
        .modelSize(4, 4)
        .spawnPlacement("on_ground", "world_surface", () => false)
        .setMaxFallDistance(() => 32767)
        // .tick(living => {
            
        // })
    ;

});