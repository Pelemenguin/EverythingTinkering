/**
 * @fileoverview Boss bar display
 * @author Pelemenguin
 */

/* global
    global: writable
    PlayerEvents
    Utils
    Painter
    ResourceLocation
    Component
*/

Painter.clear();

PlayerEvents.tick((() => {

    /** @type {Internal.Map<Internal.Player, Internal.Mob[]>} */
    let playerToBossesCache = Utils.newMap();
    /** @type {Internal.Map<Internal.Player, number>} */
    let lastTickBarCount = Utils.newMap(); // Clear extra unnecessary boss bars

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

        if (bosses == null) return;

        bosses = bosses.slice(0, 5);

        for (let index = 0; index < bosses.length; ++ index) {

            let boss = bosses[index];
            let bossType = ResourceLocation.tryParse(boss.getType());

            let bossHealth = boss.getHealth() / boss.getMaxHealth();

            let painting = {};

            painting[`bossBar_${index}`] = {
                type: "rectangle",
                texture: `${bossType.getNamespace()}:textures/gui/boss_bars/${bossType.getPath()}.png`,
                alignX: "center",
                y: 4 + index * 24,
                w: 256,
                u0: 0,
                v0: 0.5,
                u1: 1,
                v1: 1
            };

            painting[`bossHealth_${index}`] = {
                type: "rectangle",
                texture: `${bossType.getNamespace()}:textures/gui/boss_bars/${bossType.getPath()}.png`,
                alignX: "center",
                w: 200 * bossHealth,
                h: 4,
                x: -100 * (1 - bossHealth),
                y: 12 + index * 24,
                u0: 0,
                v0: 0,
                u1: 0.78125 * bossHealth,
                v1: 0.125
            };

            painting[`bossName_${index}`] = {
                type: "text",
                text: Component.translatable(`entity.${bossType.getNamespace()}.${bossType.getPath()}`).getString(),
                x: "$screenW/2-96",
                y: 18 + index * 24,
                shadow: true
            };

            painting[`bossHealthNumber_${index}`] = {
                type: "text",
                text: `${Math.round(boss.getHealth())} / ${boss.getMaxHealth()}`,
                x: `-$screenW/2+48`,
                alignX: "right",
                y: 18 + index * 24,
                shadow: true
            };

            painting[`bossHealthPercentage_${index}`] = {
                type: "text",
                text: `${(bossHealth * 100).toFixed(2)}%`,
                x: `-$screenW/2+96`,
                alignX: "right",
                y: 18 + index * 24,
                shadow: true
            };

            player.paint(painting);
        }

        if (lastTickBarCount.getOrDefault(player, 0) > bosses.length) {
            for (let i = bosses.length; i < lastTickBarCount.getOrDefault(player, 0); ++i) {
                let remover = {};
                remover[`bossBar_${i}`] = {remove: true};
                remover[`bossHealth_${i}`] = {remove: true};
                remover[`bossName_${i}`] = {remove: true};
                remover[`bossHealthNumber_${i}`] = {remove: true};
                remover[`bossHealthPercentage_${i}`] = {remove: true};
                player.paint(remover);
            }
        }

        lastTickBarCount.put(player, bosses.length);
    };
})());
