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
    EntityJSEvents
    ResourceKey
    Registries
    Utils
    KubeJSAiHelper
    console
    NBT
    Vec3d
*/

/**
 * @type {Internal.Map<Internal.LivingEntity, Annotation.Entities.AiCaches.IcyTerracube>}
 */
global.Entities.AiCaches.IcyTerracube = Utils.newMap();

/**
 * @param {Internal.LivingEntity} entity
 * @param {Annotation.Entities.AiCaches.IcyTerracube} cache
 */
global.Entities.AiFunctions.IcyTerracube = (entity, cache) => {

    const MAX_TARGET_DISTANCE = 100;

    /** @param {Internal.Entity} target */
    const TARGET_PREDICATE = (target) => {
        return (target.isPlayer() && !(/** @type {Internal.Player} */ target).isCreative() && !target.isSpectator() && target.isAlive());
    };

    /** @param {Internal.Entity} */
    const ADVANCED_PREDICATE = (target) => {
        return (TARGET_PREDICATE(target) && entity.distanceToEntitySqr(target) <= MAX_TARGET_DISTANCE * MAX_TARGET_DISTANCE);
    };

    let level = entity.getLevel();

    if (level.isClientSide()) return;

    // Initialization
    let persistent = entity.getForgePersistentData();
    /** @type {Internal.CompoundTag} */
    let dataStorage;
    if (!persistent.contains("kubejs:icy_terracube")) {
        dataStorage = NBT.compoundTag();
        persistent.put("kubejs:icy_terracube", dataStorage);
    } else {
        dataStorage = persistent.getCompound("kubejs:icy_terracube");
    }

    let attackTarget;
    if (!("attackTarget" in cache)) {
        attackTarget = level.getNearestPlayer(entity.x, entity.y, entity.z, MAX_TARGET_DISTANCE, TARGET_PREDICATE);
        if (attackTarget == null) return;
        console.info(`Found target: ${attackTarget}`);
        if (attackTarget == null) {
            cache.status = "WATING_FOR_DESPAWN";
        }
        cache.attackTarget = attackTarget;
        dataStorage.putUUID("attackTarget", attackTarget.getUuid());
    } else {
        attackTarget = level.getPlayerByUUID(dataStorage.getUUID("attackTarget"));
        if (!ADVANCED_PREDICATE(attackTarget)) {
            delete cache.attackTarget;
            console.info(`Targegt lost: ${attackTarget}`);
        }
    }

    /** @type {Annotation.Entities.AiCaches.IcyTerracube["status"]} */
    let status;
    if (!("status" in cache)) {
        status = "IDLE";
    } else {
        status = cache.status;
    }

    const JUMP_HEIGHT = (Math.random() / 4) + 0.5;
    const MOVE_SPEED = 0.3;
    const JUMP_INTERVAL = 20;

    CONTROL:
    switch (status) {
        case "IDLE": {
            entity.lookAt("eyes", attackTarget.getEyePosition());
            cache.status = "MELEE_ATTACK";
            break;
        }
        case "MELEE_ATTACK":{
            if (entity.onGround()) {
                // 10 ticks between last land and next jump
                if (!("lastJump" in cache)) {
                    cache.lastJump = level.getTime();
                    break CONTROL;
                } else {
                    if ((level.getTime() - cache.lastJump) < JUMP_INTERVAL) break CONTROL;
                }
                cache.lastJump = level.getTime();
                entity.lookAt("eyes", attackTarget.getEyePosition());
                entity.addDeltaMovement([0, entity.getBlockStateOn().getBlock().getJumpFactor() * JUMP_HEIGHT, 0]);
                let direction = entity.getViewVector(1);
                entity.addDeltaMovement(new Vec3d(direction.x(), 0, direction.z()).normalize().scale(MOVE_SPEED));
                let succeeded = KubeJSAiHelper.tryMeleeAttack(entity, attackTarget, entity.reachDistance);
                if (succeeded) cache.status = "IDLE";
            }
            break;
        }
        case "SMASH_ATTACK": {
            break;
        }
    }

};

StartupEvents.registry("minecraft:entity_type", event => {

    const FALL_DAMAGE_RESOURCE_KEY = ResourceKey.create(Registries.DAMAGE_TYPE, "minecraft:fall");

    event.create("kubejs:icy_terracube", "entityjs:mob")
        .sized(4, 4)
        .modelSize(4, 4)
        .spawnPlacement("on_ground", "world_surface", () => false)
        .isInvulnerableTo(ctx => ctx.damageSource.is(FALL_DAMAGE_RESOURCE_KEY))
        .aiStep(KubeJSAiHelper.aiStepCallbackHelper("IcyTerracube"))
        .onRemovedFromWorld(KubeJSAiHelper.removeCache("IcyTerracube"))
    ;

});

EntityJSEvents.attributes(event => {
    event.modify("kubejs:icy_terracube", attr => {
        attr.add("minecraft:generic.max_health", 100);
        attr.add("minecraft:generic.attack_damage", 8);
        attr.add("forge:entity_reach", 5.0);
        attr.add("forge:block_reach", 5.0);
    });
});
