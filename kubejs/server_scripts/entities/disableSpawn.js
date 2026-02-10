// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Disable Entity Spawn | 禁用实体生成
 * - - - - -
 * Disable some entities from being spawned.  
 * 禁用某些实体的生成。
 * @author Pelemenguin
 */

/* global
    EntityEvents
    $MobSpawnType
*/

/** @type {(event: Internal.EntitySpawnedEventJS) => void} */
let DISABLE_ENTITY_SPAWN = (event) => {
    /** @type {Internal.Mob} */
    let entity = event.getEntity();
    if (entity.getSpawnType() === $MobSpawnType.CHUNK_GENERATION || entity.getSpawnType() === $MobSpawnType.NATURAL) {
        event.cancel();
    }
};

EntityEvents.spawned("thermal:basalz", DISABLE_ENTITY_SPAWN);
EntityEvents.spawned("thermal:blitz", DISABLE_ENTITY_SPAWN);
EntityEvents.spawned("thermal:blizz", DISABLE_ENTITY_SPAWN);
