// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Common Items
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
    event.create("kubejs:scrapped_tinker_metal");
    event.create("kubejs:animated_tinker_metal");
});
