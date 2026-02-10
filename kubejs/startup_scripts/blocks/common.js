// priority: 1000

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
