// priority: 1000

// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Common Block Registration
 * @author Pelemenguin
 */

/* global
    StartupEvents
*/

StartupEvents.registry("minecraft:block", event => {
    event.create("kubejs:tinker_lab_wall")
        .unbreakable()
        .resistance(2000)
    ;
});
