/**
 * @author Pelemenguin
 * @license CC-BY-NC-SA-4.0
 */

/* global
    global: writable
    ServerEvents
*/

ServerEvents.tick(event => {
    /** @type {Annotation.Tinker.RelayingPlannedDamageEntry[]} */
    let damagingEntries = [];
    global.Tinker.RELAYING_PLANNED_DAMAGE.forEach(entry => {
        if (entry[2] <= 0) {
            damagingEntries.push(entry);
        }
        entry[2] = entry[2] - 1;
    });
    global.Tinker.RELAYING_PLANNED_DAMAGE = global.Tinker.RELAYING_PLANNED_DAMAGE.filter(e => e[2] >= 0);

    damagingEntries.forEach(entry => {
        event.getServer().getEntities().filter(entity => entity.getUuid() == entry[0]).forEach(entity => {
            entity.attack(entry[3], entry[1]);
        });
    });
});