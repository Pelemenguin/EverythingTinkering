// priority: 32767

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
    console
*/

/**
 * - Stores entity related things.
 * - 储存实体相关。
 */
global.Entities = {};

/**
 * - Stores entity `TagKey`s.
 * - 储存实体的`TagKey`。
 */
global.Entities.TagKeys = {};

/**
 * - Stores AI related functions for entities.
 * - 储存实体的AI相关函数。
 */
global.Entities.AiFunctions = {};

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
     * @param {Internal.Mob} entity 
     * The entity performing a melee attack.  
     * 执行近战攻击的实体。
     * 
     * @param {Internal.LivingEntity} target 
     * The target of the melee attack.  
     * 近战攻击的目标。
     * 
     * @returns {boolean}
     * Whether the attack was successful.  
     * 攻击是否成功。
     */
    tryMeleeAttack: (entity, target) => {
        let d = entity.getPerceivedTargetDistanceSquareForMeleeAttack(target);
        let atkReachSqr = entity.getBbWidth() * 2 + target.getBbWidth();
        if (d <= atkReachSqr) {
            return entity.doHurtTarget(target);
        }
        return false;
    },

    /**
     * @param {Internal.LivingEntity} entity
     * The entity performing melee attacks on touched players.  
     * 执行对触碰到的玩家进行近战攻击的实体。
     */
    meleeAttackTouchedPlayers: (entity) => {
        entity.getLevel().getEntitiesWithin(entity.getBoundingBox().inflate(KubeJSAiHelper.boundingBoxInflateConstant)).forEach(/** @param {Internal.LivingEntity} e */ e => {
            KubeJSAiHelper.tryMeleeAttack(entity, e);
        });
    }

};
