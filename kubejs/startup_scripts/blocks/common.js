// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Common Block Registration
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

StartupEvents.registry("minecraft:block", event => {
    event.create("kubejs:tinker_lab_wall")
        .unbreakable()
        .resistance(2000)
    ;
});
