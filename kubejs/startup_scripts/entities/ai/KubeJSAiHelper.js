// priority: 32767

// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Icy Terracube
 * @author Pelemenguin
 */

/* global
    global: writable
    console
    Component
    NBT
*/

/**
 * - Stores entity related things.
 * - 储存实体相关。
 */
global.Entities = {};

/**
 * - Stores entity `ResourceKey`s.
 * - 储存实体的`ResourceKey`。
 */
global.Entities.ResourceKeys = {};

/**
 * - Stores AI related functions for entities.
 * - 储存实体的AI相关函数。
 */
global.Entities.AiFunctions = {};

/**
 * - Stores functions being called on entity's removal.
 * - 储存实体移除时调用的函数。
 */
global.Entities.RemovalFunctions = {};

/**
 * - Stores functions being called on entity being hurt.
 * - 储存实体受伤时调用的函数。
 */
global.Entities.HurtFunctions = {};

/**
 * - Caches for AI functions.
 *     Keys of this object are entity type.
 *     Values of this object are maps from entity instances to cached data.
 * - AI函数的缓存。
 *    此对象的键为实体类型。
 *   此对象的值为从实体实例到缓存数据的映射。
 */
global.Entities.AiCaches = {};

/**
 * - Stores common functions.
 * - 储存一般函数。
 */
global.Entities.CommonFunctions = {};

const KubeJSAiHelper = {

    boundingBoxInflateConstant: Math.sqrt(2.04) - 0.6,

    /**
     * @deprecated Entity AI cache system deprecated.
     * @type {(
     *     entityName: Annotation.Entities.AiCaches.ALL
     * ) => (entity: Internal.LivingEntity) => void}
     * 
     * @param entityName
     * The entity type name.  
     * 实体类型名称。
     * 
     * @returns
     * The AI step callback.  
     * AI步骤回调。
     */
    aiStepCallbackHelper: (entityName) => (entity) => {

        // Stop AI when dead or No AI
        if (entity.isDeadOrDying()) return;
        if (entity.isNoAi()) return;

        if (entity.getLevel().isClientSide()) return;
        let callback = global.Entities.AiFunctions[entityName];
        let cacheMap = global.Entities.AiCaches[entityName];
        let cache = cacheMap.get(entity);
        if (cache == null) {
            cache = {};
            cacheMap.put(entity, cache);
        }
        callback(entity, cache);

    },

    /**
     * @deprecated Entity AI cache system deprecated.
     * @type {(
     *     entityName: Annotation.Entities.AiCaches.ALL
     * ) => (entity: Internal.LivingEntity) => void}
     * 
     * @param entityName 
     * The entity type name.
     * 实体类型名称。
     * 
     * @returns
     * The on remove from world callback.
     * 实体移除时的回调。
     */
    onRemovedFromWorldCallbackHelper: (entityName) => (entity) => {
        if (entity.getLevel().isClientSide()) return;
        global.Entities.RemovalFunctions[entityName](entity, global.Entities.AiCaches[entityName].get(entity));
        KubeJSAiHelper.removeCache(entityName)(entity);
    },

    /**
     * @deprecated Entity AI cache system deprecated.
     * @param {Annotation.Entities.AiCaches.ALL} entityName 
     * @returns {(context: Internal.ContextUtils$EntityDamageContext) => void}
     */
    onHurtCallbackHelper: (entityName) => (context) => {

        let entity = context.entity;

        // Stop AI when dead or No AI
        if (entity.isDeadOrDying()) return;
        if (entity.isNoAi()) return;

        if (entity.getLevel().isClientSide()) return;
        let callback = global.Entities.HurtFunctions[entityName];
        let cacheMap = global.Entities.AiCaches[entityName];
        let cache = cacheMap.get(entity);
        if (cache == null) {
            cache = {};
            cacheMap.put(entity, cache);
        }
        callback(context, cache);

    },

    /**
     * @deprecated Entity AI cache system deprecated.
     * - - - - -
     * @type {(
     *     entityName: Annotation.Entities.AiCaches.ALL
     * ) => (entity: Internal.LivingEntity) => void}
     */
    removeCache: (entityName) => (entity) => {
        if (entity.getLevel().isClientSide()) return;
        console.info("Cache removed for entity " + entity);
        global.Entities.AiCaches[entityName].remove(entity);
    },

    /**
     * @param {Internal.LivingEntity} entity 
     * @param {Internal.LivingEntity} target
     * @param {number} boundingBoxInflates
     * @returns {boolean}
     */
    attackTarget: (entity, target, boundingBoxInflates) => {
        if (target.getBoundingBox().intersects(entity.getBoundingBox().inflate(boundingBoxInflates))) {
            return entity.doHurtTarget(target);
        }
        return false;
    },

    /**
     * @param {Internal.Mob} entity 
     * The boss entity to despawn.  
     * 要消失的Boss。
     * @param {Internal.Player[]} receivers
     * The players to receive the message.  
     * 接收消息的玩家。
     */
    bossDespawn: (entity, receivers) => {
        receivers.forEach(p => p.sendSystemMessage(Component.translate("entity.kubejs.boss.despawn", entity.getDisplayName().copy().gold()).lightPurple()));
        entity.discard();
    },

    /**
     * @param {Internal.Mob} entity 
     * The boss entity defeated.  
     * 被击败的Boss。
     * @param {Internal.Player[]} receivers
     * The players to receive the message.  
     * 接收消息的玩家。
     */
    bossDefeat: (entity, receivers) => {
        receivers.forEach(p => p.sendSystemMessage(Component.translate("entity.kubejs.boss.defeat", entity.getDisplayName().copy().gold()).lightPurple()));
    },

    /**
     * @param {Internal.Player} player 
     * The player to be considered as challenger.  
     * 被选中的玩家
     * @param {Internal.Mob} boss 
     * The boss.
     * Boss。
     */
    chosenAsTarget: (player, boss) => {
        if (!KubeJSAiHelper.isTargetOf(player, boss)) {
            /** @type {Internal.CompoundTag} */
            const newPlayer = NBT.compoundTag();
            newPlayer.putUUID("UUID", player.getUuid());
            newPlayer.putDouble("DamageTaken", 0);

            const persistent = boss.getForgePersistentData();
            if (persistent.contains("kubejs:boss_targets")) {
                let bossTarget = persistent.getList("kubejs:boss_targets", 10); // 10 refers to CompoundTag
                bossTarget.add(newPlayer);
            } else {
                boss.getForgePersistentData().merge(NBT.compoundTag({
                    "kubejs:boss_targets": NBT.listTag([newPlayer])
                }));
            }
        }

        if (!KubeJSAiHelper.isChallenging(player, boss)) {
            /** @type {Internal.CompoundTag} */
            const newBoss = NBT.compoundTag();
            newBoss.putUUID("UUID", boss.getUuid());

            const playerPersistent = player.getForgePersistentData();
            if (playerPersistent.contains("kubejs:challenging_bosses")) {
                const challenging = playerPersistent.getList("kubejs:challenging_bosses", 10);
                challenging.add(newBoss);
            } else {
                player.getForgePersistentData().merge(NBT.compoundTag({
                    "kubejs:challenging_bosses": NBT.listTag([newBoss])
                }));
            }
            player.sendSystemMessage(Component.translate("entity.kubejs.boss.challenging", boss.getDisplayName().copy().gold()).lightPurple());
        }
    },

    /**
     * 
     * @param {Internal.Player} player 
     * The player to be checked.  
     * 被检查的玩家。
     * @param {Internal.Mob} boss 
     * The boss.  
     * Boss。
     * @returns {boolean}
     */
    isTargetOf: (player, boss) => {
        const persistent = boss.getForgePersistentData();
        if (!persistent.contains("kubejs:boss_targets")) return false;
        /** @type {Internal.CompoundTag[]} */
        let targets = persistent.getList("kubejs:boss_targets", 10).toArray();
        for (let target of targets) {
            if (target.getUUID("UUID").equals(player.getUuid())) return true;
        }
        return false;
    },

    /**
     * @param {Internal.Player} player
     * 
     * @param {Internal.Mob} boss
     * The boss to be checked.  
     * 被检查的Boss。
     * @param {boolean}
     */
    isChallenging: (player, boss) => {
        const playerData = player.getForgePersistentData();
        /** @type {Internal.CompoundTag[]} */
        const challengingBosses = playerData.getList("kubejs:challenging_bosses", 10).toArray();
        for (let data of challengingBosses) {
            if (data.getUUID("UUID").equals(boss.getUuid())) return true;
        }
        return false;
    },

    /**
     * @param {Internal.Mob} boss
     * The boss entity.  
     * Boss实体。
     * @param {Internal.UUID} playerUUID
     * The UUID of the player taken damage.  
     * 受到伤害的玩家的UUID。
     * @param {number} amount
     * The damage amount to send.  
     * 发送的伤害数值。
     */
    sendDamageTakenToBoss: (boss, playerUUID, amount) => {
        const persistent = boss.getForgePersistentData();
        if (!persistent.contains("kubejs:boss_targets")) return;

        /** @type {Internal.CompoundTag[]} */
        let targets = persistent.getList("kubejs:boss_targets", 10).toArray();
        for (let target of targets) {
            if (target.getUUID("UUID").equals(playerUUID)) {
                let currentDamage = target.getDouble("DamageTaken");
                target.putDouble("DamageTaken", currentDamage + amount);
                break;
            }
        }
    },

    /**
     * @param {Internal.Mob} boss 
     * The boss entity.  
     * Boss实体。
     * @returns {Internal.Player[]}
     * All challengers of the boss.  
     * Boss的所有挑战者。
     */
    getChallengers: (boss) => {
        const persistent = boss.getForgePersistentData();
        if (!persistent.contains("kubejs:boss_targets")) return [];
        /** @type {Internal.CompoundTag[]} */
        let targets = persistent.getList("kubejs:boss_targets", 10).toArray();
        const result = [];
        const level = boss.getLevel();
        targets.forEach(tag => {
            const player = level.getPlayerByUUID(tag.getUUID("UUID"));
            if (player != null && player.isAlive()) {
                result.push(player);
            }
        });
        return result;
    },

    /**
     * @param {Internal.Mob} boss 
     * The boss entity.  
     * Boss实体。
     * @returns {Internal.CompoundTag[]}
     * All raw challengers data of the boss.  
     * Boss的所有原始挑战者数据。
     */
    getRawChallengersList: (boss) => {
        const persistent = boss.getForgePersistentData();
        if (!persistent.contains("kubejs:boss_targets")) return [];
        return persistent.getList("kubejs:boss_targets", 10).toArray();
    },

    /**
     * @param {Internal.Player} player 
     * @returns {Internal.Mob[]}
     */
    getChallengingBosses: (player) => {
        let persistent = player.getForgePersistentData();
        if (!persistent.contains("kubejs:challenging_bosses")) return [];
        /** @type {Internal.CompoundTag[]} */
        let targets = persistent.getList("kubejs:challenging_bosses", 10).toArray();
        let result = [];
        let level = player.getLevel();
        targets.forEach(tag => {
            let uuid = tag.getUUID("UUID");
            let boss = level.getEntities().toArray().find((/** @type {Internal.Entity} */ entity) => entity.getUuid().equals(uuid));
            if (boss != null && boss.isAlive()) {
                result.push(boss);
            }
        });
        return result;
    }

};

// Pass to server_scripts
global.Entities.KubeJSAiHelper = KubeJSAiHelper;
