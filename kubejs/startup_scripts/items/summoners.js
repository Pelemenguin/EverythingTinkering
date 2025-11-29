// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Icy Terracube
 * - - - - -
 * @copyright Pelemenguin 2025
 * @license LGPL-3.0-or-later
 * This file is part of EverythingTinkering.
 * Full license see file `COPYING.LESSER`
 * - - - - -
 * @author Pelemenguin
 */

/* global
    global: writable
    StartupEvents
    NBT
*/

global.ItemUseFunctions.BossSummoners = {};

/** @type {Internal.ItemBuilder$FinishUsingCallback_} */
global.ItemUseFunctions.BossSummoners.IcyTerracube = (_item, level, entity) => {
    let summoned = level.createEntity("kubejs:icy_terracube");
    let position = level.getHeightmapPos("world_surface", entity.blockPosition().offset(Math.random() < 0.5 ? 20 : -20, 0, Math.random() < 0.5 ? 20 : -20));
    summoned.setPos(position.getX(), position.getY(), position.getZ());
    summoned.getForgePersistentData().put("kubejs:icy_terracube", NBT.compoundTag({
        CanDespawn: NBT.byteTag(1)
    }));
    level.addFreshEntity(summoned);
    return "minecraft:air";
};

global.ItemUseFunctions.BossSummoners.Criterias = {};

/** @type {Internal.ItemBuilder$UseCallback_} */
global.ItemUseFunctions.BossSummoners.Criterias.IcyTerracube = (level, player) => {
    let biome = level.getBiome(player.blockPosition());
    return biome.get().getBaseTemperature() <= 0;
};

StartupEvents.registry("minecraft:item", event => {
    event.create("kubejs:cold_grout")
        .useDuration(() => 20)
        .use((level, player, hand) => global.ItemUseFunctions.BossSummoners.Criterias.IcyTerracube(level, player, hand))
        .useAnimation("bow")
        .finishUsing((item, level, entity) => global.ItemUseFunctions.BossSummoners.IcyTerracube(item, level, entity))
        .unstackable()
    ;
});
