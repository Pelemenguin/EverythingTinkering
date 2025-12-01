/**
 * - - - - -
 * @copyright Pelemenguin 2025
 * @license LGPL-3.0-or-later
 * This file is part of EverythingTinkering.
 * Full license see file `COPYING.LESSER`
 * - - - - -
 * SPDX-License-Identifier: LGPL-3.0-or-later
 * - - - - -
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