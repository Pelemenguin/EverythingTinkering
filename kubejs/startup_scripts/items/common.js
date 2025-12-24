// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Common Items
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

StartupEvents.registry("minecraft:item", event => {
    // Technology Line
    event.create("kubejs:basic_mechanism");
    event.create("kubejs:incomplete_basic_mechanism", "create:sequenced_assembly");

    // Adventure Line
    event.create("kubejs:deserted_tinker_metal");
});
