// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Modifier Client Tick
 * @author Pelemenguin
 */

/* global
    global: writable
    ClientEvents
    console
*/

ClientEvents.tick(event => {

    global.TinkerFunctions.onClientTickFunctions.forEach((id, consumer) => {
        try {
            consumer(event);
        } catch (e) {
            console.error(`Exception occured while client ticking ${id}! ${e}`);
        }
    });

});