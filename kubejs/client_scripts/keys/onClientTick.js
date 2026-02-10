/**
 * @copyright Pelemenguin 2025
 * @license LGPL-3.0-or-later
 * This file is part of EverythingTinkering.
 * Full license see file `COPYING.LESSER`
 * @author Pelemenguin
 */

/* global
    global: writable
    ClientEvents
*/

ClientEvents.tick(() => {

    let KeyMappings = global.KeyMappings;

    for (let key in KeyMappings) {
        let obj = KeyMappings[key];

        if (!obj.key.isDown()) obj.consumed = false;
    }

});