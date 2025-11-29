// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Boss bar display
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
    PlayerEvents
    Utils
    Painter
*/

Painter.clear();

PlayerEvents.tick((() => {

    /** @type {Internal.Map<Internal.Player, Internal.Mob[]>} */
    let playerToBossesCache = Utils.newMap();
    /** @type {Internal.Map<Internal.Player, number>} */
    let lastTickBarCount = Utils.newMap();

    return (event) => {

        let player = event.player;

        let bosses;
        if (playerToBossesCache.containsKey(player)) {
            let cacheAvailable = true;
            let fromCache = playerToBossesCache.get(player);
            if (fromCache.length != player.getForgePersistentData().getList("kubejs:challenging_bosses", 10).size()) {
                cacheAvailable = false;
            }
            if (cacheAvailable) for (let boss of fromCache) {
                if (!boss.isAlive() || !global.Entities.KubeJSAiHelper.isChallenging(player, boss)) {
                    cacheAvailable = false;
                    break; // Immediately refresh cache for this player
                }
            }
            if (!cacheAvailable) bosses = playerToBossesCache.put(player, global.Entities.KubeJSAiHelper.getChallengingBosses(player));
            else bosses = fromCache;
        } else {
            bosses = playerToBossesCache.put(player, global.Entities.KubeJSAiHelper.getChallengingBosses(player));
        }

        for (let index = 0; index < bosses.length; ++ index) {

            let boss = bosses[index];

            let bossHealth = boss.getHealth() / boss.getMaxHealth();

            let painting = {};
            
            painting[`bossBar_${index}`] = {
                type: "rectangle",
                texture: "kubejs:textures/gui/boss_bars/icy_terracube.png",
                alignX: "center",
                y: index * 24,
                w: 256,
                u0: 0,
                v0: 0.5,
                u1: 1,
                v1: 1
            };

            painting[`bossHealth_${index}`] = {
                type: "rectangle",
                texture: "kubejs:textures/gui/boss_bars/icy_terracube.png",
                alignX: "center",
                w: 200 * bossHealth,
                h: 4,
                x: -100 * (1 - bossHealth),
                y: 8 + index * 24,
                u0: 0,
                v0: 0,
                u1: 0.078125 * bossHealth,
                v1: 0.09375
            };

            player.paint(painting);
        }

        if (lastTickBarCount.getOrDefault(player, 0) > bosses.length) {
            for (let i = bosses.length; i < lastTickBarCount.getOrDefault(player, 0); ++i) {
                let remover = {};
                remover[`bossBar_${i}`] = {remove: true};
                remover[`bossHealth_${i}`] = {remove: true};
                player.paint(remover);
            }
        }

        lastTickBarCount.put(player, bosses.length);
    };
})());
