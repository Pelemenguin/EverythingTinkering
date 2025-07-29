/**
 * @author Pelemenguin
 * @license CC-BY-NC-SA-4.0
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
            console.error(`Exception occured! ${e}`);
        }
    });

});