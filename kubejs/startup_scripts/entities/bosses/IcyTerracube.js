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
    ParticleTypes
    MobEffectInstance
    KubeJSDamageSources
    TagKey
*/

let ICY_TERRACUBE_CONFIG = {
    SMALL_JUMP_INTERVAL: 10,
    BIG_JUMP_INTERVAL: 30,
    BIG_JUMP_MAX_DISTANCE: 7,
    BIG_JUMP_COOLDOWN: 60,
    LONG_THROW_COOLDOWN: 140,
    MAX_TARGET_DISTANCE: 50,
    FAILED_JUMP_DISTANCE_SQR: 1
};

/**
 * @type {Internal.Map<Internal.LivingEntity, Annotation.Entities.AiCaches.IcyTerracube>}
 */
global.Entities.AiCaches.IcyTerracube = Utils.newMap();

/**
 * @param {Internal.LivingEntity} entity
 * @param {Annotation.Entities.AiCaches.IcyTerracube} cache
 */
global.Entities.AiFunctions.IcyTerracube = (entity, cache) => {

    // Stop AI when dead
    if (entity.isDeadOrDying()) return;

    // Prevent boat / minecart trick
    if (entity.isPassenger()) {
        entity.stopRiding();
    }

    /** @param {Internal.Entity} target */
    const TARGET_PREDICATE = (target) => {
        return (target.isPlayer() && !(/** @type {Internal.Player} */ target).isCreative() && !target.isSpectator() && target.isAlive());
    };

    /** @param {Internal.Entity} */
    const ADVANCED_PREDICATE = (target) => {
        return (TARGET_PREDICATE(target) && entity.distanceToEntitySqr(target) <= ICY_TERRACUBE_CONFIG.MAX_TARGET_DISTANCE * ICY_TERRACUBE_CONFIG.MAX_TARGET_DISTANCE);
    };

    let level = entity.getLevel();

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
        if (dataStorage.contains("attackTarget")) {
            attackTarget = level.getPlayerByUUID(dataStorage.getUUID("attackTarget"));
        } else {
            attackTarget = level.getNearestPlayer(entity.x, entity.y, entity.z, ICY_TERRACUBE_CONFIG.MAX_TARGET_DISTANCE, TARGET_PREDICATE);
            if (attackTarget == null) {
                entity.discard();
                return;
            }
            console.info(`[Icy Terracube] Found target: ${attackTarget}`);
            cache.attackTarget = attackTarget;
            dataStorage.putUUID("attackTarget", attackTarget.getUuid());
            delete cache.despawnTimer;
        }
    } else {
        if (!dataStorage.contains("attackTarget")) {
            dataStorage.putUUID(cache.attackTarget.getUuid());
        }
        attackTarget = level.getPlayerByUUID(dataStorage.getUUID("attackTarget"));
        if (!ADVANCED_PREDICATE(attackTarget)) {
            delete cache.attackTarget;
            console.info(`[Icy Terracube] Targegt lost: ${attackTarget}`);
            entity.discard();
        } else {
            delete cache.despawnTimer;
        }
    }

    /** @type {Annotation.Entities.AiCaches.IcyTerracube["status"]} */
    let status;
    if (!("status" in cache)) {
        cache.status = "IDLE";
        status = "IDLE";
    } else {
        status = cache.status;
    }

    // Control
    CONTROL:
    switch (status) {
        case "IDLE": {
            entity.lookAt("eyes", attackTarget.getEyePosition());
            cache.status = "MELEE_ATTACK";
            break;
        }
        case "MELEE_ATTACK":{
            // Keeps damaging
            KubeJSAiHelper.tryMeleeAttack(entity, attackTarget);

            if (entity.onGround()) {

                if (cache.nextBigJump <= level.getTime() && entity.distanceToEntitySqr(attackTarget) >= 400) {
                    cache.status = "LONG_THROW";
                    cache.nextBigJump = level.getTime() + ICY_TERRACUBE_CONFIG.LONG_THROW_COOLDOWN;
                    cache.longThrowLasted = 0;
                    break CONTROL;
                }

                // Failed Jumps
                if ("jumpStartPos" in cache) {
                    let delta = entity.getPosition(1).subtract(cache.jumpStartPos);
                    if (delta.horizontalDistanceSqr() < ICY_TERRACUBE_CONFIG.FAILED_JUMP_DISTANCE_SQR) {
                        cache.failedJumps = ("failedJumps" in cache) ? cache.failedJumps + 1 : 1;
                        if (cache.failedJumps >= 3) {
                            // GOTO: SMASH_ATTACK
                            cache.status = "SMASH_ATTACK";
                            cache.smashDuration = 0;
                            break CONTROL;
                        }
                    } else {
                        cache.failedJumps = 0;
                    }
                }

                let bigJump = false;
                if ("nextBigJump" in cache) {
                    if (level.getTime() >= cache.nextBigJump) {
                        if (entity.distanceToEntitySqr(attackTarget) < ICY_TERRACUBE_CONFIG.BIG_JUMP_MAX_DISTANCE * ICY_TERRACUBE_CONFIG.BIG_JUMP_MAX_DISTANCE) {
                            bigJump = true;
                            cache.nextBigJump = level.getTime() + ICY_TERRACUBE_CONFIG.BIG_JUMP_COOLDOWN;
                        }
                    }
                } else {
                    cache.nextBigJump = level.getTime() + ICY_TERRACUBE_CONFIG.BIG_JUMP_COOLDOWN;
                }

                cache.jumpStartPos = entity.getPosition(1);

                if (!("nextJump" in cache)) {
                    cache.nextJump = level.getTime();
                    break CONTROL;
                } else if (level.getTime() < cache.nextJump) break CONTROL;

                let jumpMultiplier = bigJump ? 1.2 : 0.5;
                let moveMultiplier = bigJump ? 0.4 : 0.5;

                cache.nextJump = level.getTime() + (bigJump ? ICY_TERRACUBE_CONFIG.BIG_JUMP_INTERVAL : ICY_TERRACUBE_CONFIG.SMALL_JUMP_INTERVAL);
                entity.lookAt("eyes", attackTarget.getEyePosition());
                entity.addDeltaMovement([0, entity.getBlockStateOn().getBlock().getJumpFactor() * jumpMultiplier, 0]);
                let direction = entity.getViewVector(1);
                entity.addDeltaMovement(new Vec3d(direction.x(), 0, direction.z()).normalize().scale(moveMultiplier));
                if (bigJump) {
                    delete cache.attackTarget;
                    dataStorage.remove("attackTarget");
                }
            }
            break;
        }
        case "SMASH_ATTACK": {

            if (cache.smashDuration == 0) {
                // Wait 1 second
                console.info("[Icy Terracube] Smash attack begin!");
                cache.smashTarget = attackTarget.getPosition(1);
            } else if (cache.smashDuration == 20) {
                // Jump up
                entity.addDeltaMovement([0, 2, 0]);

                // Horizontal speed
                let differece = attackTarget.getPosition(1).subtract(entity.getPosition(1));
                entity.addDeltaMovement(new Vec3d(differece.x(), 0, differece.y()).scale(0.05));
            } else if (cache.smashDuration == 25) {
                // Invisibility
                entity.addEffect(new MobEffectInstance("minecraft:invisibility", 5));
            } else if (cache.smashDuration == 28) {
                // Teleport
                console.info("[Icy Terracube] Teleported!");
                entity.setPosition(cache.smashTarget.x(), cache.smashTarget.y() + 10, cache.smashTarget.z());

                let damageBoost;
                switch (entity.getLevel().getDifficulty().getId()) {
                    case 0: damageBoost = 0; break;
                    case 1: damageBoost = 5; break;
                    case 2: damageBoost = 10; break;
                    case 3: damageBoost = 15; break;
                    default: console.info("Unknown difficulty: " + entity.getLevel().getDifficulty().getId());
                }

                entity.modifyAttribute("minecraft:generic.attack_damage", "Smash attack damage boost", damageBoost, "addition");
                entity.modifyAttribute("forge:entity_gravity", "Smash attack gravity boost", 0.24, "addition");
            } else if (cache.smashDuration > 28 && entity.onGround()) {
                // Back to IDLE state
                console.info("[Icy Terracube] Smashed!");
                delete cache.smashDuration;
                delete cache.smashTarget;
                cache.failedJumps = 0;

                // Ban 5 seconds big jumps
                cache.nextBigJump = level.getTime() + 100;

                // Deal squash damage
                level.getEntitiesWithin(entity.getBoundingBox().expandTowards(0, -5, 0)).forEach(e => {
                    if (e == entity) return;
                    if (!e.isAttackable()) return;
                    let atk = entity.getAttribute("minecraft:generic.attack_damage").getValue();
                    e.attack(KubeJSDamageSources.icyTerracubeSmash(level, entity), atk);
                });

                entity.removeAttribute("minecraft:generic.attack_damage", "Smash attack damage boost");
                entity.removeAttribute("forge:entity_gravity", "Smash attack gravity boost");

                entity.addDeltaMovement([Math.random(), 1, Math.random()]);

                // GOTO: IDLE
                cache.status = "IDLE";
                return;
            }
            ++ cache.smashDuration;

            /** @type {Internal.ServerLevel} */
            let serverLevel = level;
            serverLevel.sendParticles(ParticleTypes.ITEM_SNOWBALL, entity.x, entity.y, entity.z, 1, 1, 1, 50, 1);
            serverLevel.sendParticles(ParticleTypes.ITEM_SNOWBALL, cache.smashTarget.x(), cache.smashTarget.y() + attackTarget.eyeHeight, cache.smashTarget.z(), 0, 1, 0, 100, 0.2);

            break;
        }
        case "LONG_THROW": {
            if (cache.longThrowLasted >= 100) {
                delete cache.longThrowLasted;
                cache.status = "SMASH_ATTACK";
                cache.smashDuration = 0;
                break CONTROL;
            }
            if (cache.longThrowLasted % 2 == 0) {
                let facing = entity.getViewVector(1);
                let throwPosition = entity.getEyePosition().add(facing);
                /** @type {Internal.Projectile} */
                let projectile = level.createEntity("kubejs:icy_clay_ball");
                projectile.setPosition(throwPosition.x(), throwPosition.y(), throwPosition.z());
                projectile.addDeltaMovement(facing.scale(entity.distanceToEntity(attackTarget) / 10));
                level.addFreshEntity(projectile);
                console.info("Created projectile: " + projectile);
            }
            if (cache.longThrowLasted % 5 == 0) {
                entity.lookAt("eyes", attackTarget.position());
            }
            ++ cache.longThrowLasted;
            break;
        }
    }

};

global.Entities.TagKeys.ICY_TERRACUBE = TagKey.create(Registries.ENTITY_TYPE, "kubejs:icy_terracube");

StartupEvents.registry("minecraft:entity_type", event => {

    const FALL_DAMAGE_RESOURCE_KEY = ResourceKey.create(Registries.DAMAGE_TYPE, "minecraft:fall");

    event.create("kubejs:icy_terracube", "entityjs:mob")
        .sized(4, 4)
        .modelSize(4, 4)
        .spawnPlacement("on_ground", "world_surface", () => false)
        .isInvulnerableTo(ctx => ctx.damageSource.is(FALL_DAMAGE_RESOURCE_KEY))
        .aiStep(KubeJSAiHelper.aiStepCallbackHelper("IcyTerracube"))
        .onRemovedFromWorld(KubeJSAiHelper.removeCache("IcyTerracube"))
        .fallSounds("minecraft:entity.slime.squish", "minecraft:entity.slime.squish")
        .setHurtSound(() => "minecraft:entity.slime.hurt")
    ;

});

EntityJSEvents.attributes(event => {
    event.modify("kubejs:icy_terracube", attr => {
        attr.add("minecraft:generic.max_health", 100);
        attr.add("minecraft:generic.attack_damage", 8);
        attr.add("forge:entity_reach", 3.0);
        attr.add("forge:block_reach", 3.0);
    });
});
