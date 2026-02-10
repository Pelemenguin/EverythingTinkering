/**
 * - - - - -
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * @author Pelemenguin
 */

/* global
    global: writable
    ServerEvents
    console
*/

ServerEvents.tick(event => {

    global.TinkerFunctions.onServerTickFunctions.forEach((id, consumer) => {
        try {
            consumer(event);
        } catch (e) {
            console.error(`Exception occured while server ticking ${id}! ${e}`);
        }
    });

});