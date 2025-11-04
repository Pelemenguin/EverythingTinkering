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
    ResourceLocation
    JavaMath
    Entity$RemovalReason
    $Difficulty
    KubeJSAiFactory
    DustParticleOptions
    Vec3f
*/

let ICY_TERRACUBE_CONFIG = {
    SMALL_JUMP_INTERVAL: 10,
    BIG_JUMP_INTERVAL: 30,
    BIG_JUMP_MAX_DISTANCE: 7,
    BIG_JUMP_COOLDOWN: 160,
    LONG_THROW_COOLDOWN: 140,
    MAX_TARGET_DISTANCE: 50,
    FAILED_JUMP_DISTANCE_SQR: 1,
    CHALLENGING_PLAYERS_TAG: "ChallengingPlayers",
    CAN_DESPAWN_TAG: "CanDespawn"
};

/**
 * @type {Internal.Map<Internal.LivingEntity, Annotation.Entities.AiCaches.IcyTerracube>}
 */
global.Entities.AiCaches.IcyTerracube = Utils.newMap();

/**
 * @param {Internal.Mob} entity
 * @param {Annotation.Entities.AiCaches.IcyTerracube} cache
 * 
 * @deprecated
 */
// global.Entities.AiFunctions.IcyTerracube = 
(entity, cache) => {

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

    if (!("challengingPlayers" in cache)) {
        let challenging = 1;
        if (dataStorage.contains(ICY_TERRACUBE_CONFIG.CHALLENGING_PLAYERS_TAG)) {
            cache.challengingPlayers = dataStorage.getList(ICY_TERRACUBE_CONFIG.CHALLENGING_PLAYERS_TAG, 10).toArray().map(/** @param {Internal.CompoundTag} ct */ ct => level.getPlayerByUUID(ct.getUUID("UUID"))); // CompoundTag
            challenging = cache.challengingPlayers.length;
        } else {
            let challengers = level.getEntitiesWithin(entity.getBoundingBox().inflate(100)).filter(TARGET_PREDICATE);
            challengers.forEach(p => KubeJSAiHelper.chosenAsTarget(p, entity));
            challenging = challengers.size();
            dataStorage.put(ICY_TERRACUBE_CONFIG.CHALLENGING_PLAYERS_TAG, NBT.listTag(challengers.stream().map(e => {
                /** @type {Internal.CompoundTag} */
                let newTag = NBT.compoundTag();
                newTag.putUUID("UUID", e.getUuid());
                return newTag;
            }).toArray()));
            cache.challengingPlayers = challengers.toArray();
        }
        if (challenging > 1) {
            entity.modifyAttribute("minecraft:generic.max_health", "Multiplayer health boost", 100 * (challenging - 1), "addition");
            entity.setHealth(entity.getMaxHealth());
        }
    }

    let attackTarget;
    if (!("attackTarget" in cache)) {
        if (dataStorage.contains("AttackTarget")) {
            attackTarget = level.getPlayerByUUID(dataStorage.getUUID("AttackTarget"));
        } else {
            attackTarget = level.getNearestPlayer(entity.x, entity.y, entity.z, ICY_TERRACUBE_CONFIG.MAX_TARGET_DISTANCE, TARGET_PREDICATE);
            if (attackTarget == null) {
                if ((!dataStorage.contains(ICY_TERRACUBE_CONFIG.CAN_DESPAWN_TAG)) || dataStorage.getByte(ICY_TERRACUBE_CONFIG.CAN_DESPAWN_TAG) == 0) return;
                KubeJSAiHelper.bossDespawn(entity, cache.challengingPlayers);
                return;
            }
            // console.info(`[Icy Terracube] Found target: ${attackTarget}`);
            cache.attackTarget = attackTarget;
            dataStorage.putUUID("AttackTarget", attackTarget.getUuid());
            delete cache.despawnTimer;
        }
    } else {
        if (!dataStorage.contains("AttackTarget")) {
            dataStorage.putUUID(cache.attackTarget.getUuid());
        }
        attackTarget = level.getPlayerByUUID(dataStorage.getUUID("AttackTarget"));
        if (!ADVANCED_PREDICATE(attackTarget)) {
            delete cache.attackTarget;
            dataStorage.remove("AttackTarget");
            // console.info(`[Icy Terracube] Targegt lost: ${attackTarget}`);
            if ((!dataStorage.contains(ICY_TERRACUBE_CONFIG.CAN_DESPAWN_TAG)) || dataStorage.getByte(ICY_TERRACUBE_CONFIG.CAN_DESPAWN_TAG) == 0) return;
            KubeJSAiHelper.bossDespawn(entity, cache.challengingPlayers);
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

                if (entity.getHealth() < entity.getMaxHealth() * 0.5 && Math.random() < 0.05) {
                    cache.terracubesAte = 0;
                    cache.status = "HEAL";
                }

                if (cache.nextBigJump <= level.getTime() && entity.distanceToEntitySqr(attackTarget) >= 225) {
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
                    if (entity.getHealth() > entity.getMaxHealth() * 0.25 && Math.random() < 0.2) {
                        cache.status = "CIRCULAR_THROW";
                        cache.circularThrowLasted = 0;
                        break CONTROL;
                    } else {
                        cache.status = "IDLE";
                        break CONTROL;
                    }
                } else if ("shouldForceCircularThrow" in cache && cache.shouldForceCircularThrow) {
                    cache.status = "CIRCULAR_THROW";
                    cache.circularThrowLasted = 0;
                    cache.shouldForceCircularThrow = false;
                    break CONTROL;
                }
            }
            break;
        }
        case "SMASH_ATTACK": {

            if (cache.smashDuration == 0) {
                // Wait 1 second
                // console.info("[Icy Terracube] Smash attack begin!");
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
                // console.info("[Icy Terracube] Teleported!");
                entity.setPosition(cache.smashTarget.x(), cache.smashTarget.y() + 10, cache.smashTarget.z());

                let damageBoost;
                switch (entity.getLevel().getDifficulty()) {
                    case $Difficulty.PEACEFUL : damageBoost = 0  ; break;
                    case $Difficulty.EASY     : damageBoost = 5  ; break;
                    case $Difficulty.NORMAL   : damageBoost = 10 ; break;
                    case $Difficulty.HARD     : damageBoost = 15 ; break;
                    default: console.error("Unknown difficulty: " + entity.getLevel().getDifficulty());
                }

                entity.modifyAttribute("minecraft:generic.attack_damage", "Smash attack damage boost", damageBoost, "addition");
                entity.modifyAttribute("forge:entity_gravity", "Smash attack gravity boost", 0.24, "addition");
            } else if (cache.smashDuration > 28 && entity.onGround()) {
                // Back to IDLE state
                // console.info("[Icy Terracube] Smashed!");
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

                let h = entity.getEyePosition().y() - attackTarget.getEyePosition().y();
                let dSqr = entity.distanceToEntitySqr(attackTarget);
                let iniVel = Math.sqrt(dSqr * 0.015 / h);

                let throwPosition = entity.getEyePosition().add(facing);
                /** @type {Internal.Projectile} */
                let projectile = level.createEntity("kubejs:icy_clay_ball");
                projectile.setPosition(throwPosition.x(), throwPosition.y(), throwPosition.z());
                projectile.addDeltaMovement(facing.scale(iniVel));
                level.addFreshEntity(projectile);
                // console.info("Created projectile: " + projectile);
            }
            if (cache.longThrowLasted % 5 == 0) {
                entity.lookAt("eyes", attackTarget.position());
            }
            ++ cache.longThrowLasted;
            break;
        }
        case "CIRCULAR_THROW": {
            if (cache.circularThrowLasted >= 100) {
                delete cache.circularThrowLasted;
                cache.status = "IDLE";
                delete cache.attackTarget;
                dataStorage.remove("AttackTarget");
                break CONTROL;
            }
            if (cache.circularThrowLasted % 20 == 0) {
                let enoughTerracubes = level.getEntitiesWithin(entity.getBoundingBox().inflate(50)).stream().filter(e => e.getType() == "tconstruct:terracube").count() > 20;

                for (let i = 0; i < 20; i ++) {
                    let angle = JavaMath.PI * (i + cache.circularThrowLasted % 40 / 20) / 10;
                    let direction = new Vec3d(Math.cos(angle), 0, Math.sin(angle));

                    let throwing;
                    if (entity.getLevel().getDifficulty() !== $Difficulty.PEACEFUL && !enoughTerracubes && Math.random() < 0.1) {
                        /** @type {Internal.Slime} */
                        let created = level.createEntity("tconstruct:terracube");
                        created.setSize(2, true);
                        created.setHealth(created.getMaxHealth());
                        throwing = created;
                    } else {
                        throwing = level.createEntity("kubejs:icy_clay_ball");
                    }
                    let throwingPosition = entity.position().add(direction.scale(2)).add(0, 2, 0);
                    throwing.setPosition(throwingPosition.x(), throwingPosition.y(), throwingPosition.z());
                    throwing.addDeltaMovement(direction);
                    level.addFreshEntity(throwing);
                }
            }
            ++ cache.circularThrowLasted;
            break;
        }
        case "HEAL": {
            let eatTarget;

            if (!("eatTarget" in cache)) {
                /** @type {Internal.Entity[]} */
                let possibleEatTargets = level.getEntitiesWithin(entity.getBoundingBox().inflate(10)).filter(e => e.getType() == "tconstruct:terracube").toArray();

                if (possibleEatTargets.length == 0) {
                    cache.status = "IDLE";
                    break CONTROL;
                }

                let distance = +Infinity;
                let nearestEntityIndex = 0;
                possibleEatTargets.map(e => entity.distanceToEntitySqr(e)).forEach((v, i) => {
                    if (v < distance) {
                        distance = v;
                        nearestEntityIndex = i;
                    }
                });
                eatTarget = possibleEatTargets[nearestEntityIndex];
                // console.info("Found eat target: " + eatTarget);
                cache.eatTarget = eatTarget;
            } else {
                eatTarget = cache.eatTarget;
                if (eatTarget.isDeadOrDying()) {
                    delete cache.eatTarget;
                    delete cache.jumpsForEat;
                    cache.status = "IDLE";
                    break CONTROL;
                }
            }

            if (entity.onGround()) {

                if (cache.terracubesAte >= 5 || cache.jumpsForEat >= 5) {
                    delete cache.eatTarget;
                    delete cache.terracubesAte;
                    delete cache.jumpsForEat;
                    cache.status = "IDLE";
                    break CONTROL;
                }

                cache.nextJump = level.getTime() + (ICY_TERRACUBE_CONFIG.SMALL_JUMP_INTERVAL);
                entity.lookAt("eyes", eatTarget.getEyePosition());
                entity.addDeltaMovement([0, entity.getBlockStateOn().getBlock().getJumpFactor() * 0.5, 0]);
                let direction = entity.getViewVector(1);
                entity.addDeltaMovement(new Vec3d(direction.x(), 0, direction.z()).normalize().scale(0.5));

                if (entity.distanceToEntitySqr(eatTarget) <= 16) {
                    entity.heal(eatTarget.getHealth());
                    eatTarget.discard();
                    // console.info("Ate: " + eatTarget);
                    cache.jumpsForEat = 0;
                    delete cache.eatTarget;
                    ++ cache.terracubesAte;
                    if (Math.random() >= 0.5) {
                        delete cache.jumpsForEat;
                        entity.lookAt("eyes", attackTarget.position());
                        status = "MELEE_ATTACK";
                        break CONTROL;
                    }
                }

                ++ cache.jumpsForEat;

            }
            break;
        }
    }

};

/**
 * @param {Internal.Mob} entity
 * @param {Annotation.Entities.AiCaches.IcyTerracube} cache
 */
global.Entities.RemovalFunctions.IcyTerracube = (entity, cache) => {
    if (entity.removalReason === Entity$RemovalReason.KILLED) {
        KubeJSAiHelper.bossDefeat(entity, cache.challengingPlayers);
    }
};

/**
 * @param {Internal.ContextUtils$EntityDamageContext} context
 * @param {Annotation.Entities.AiCaches.IcyTerracube} cache
 */
global.Entities.HurtFunctions.IcyTerracube = (context, cache) => {
    let entity = context.entity;
    let threshold = entity.getMaxHealth() * 0.5;

    if ((entity.getHealth() - context.damageAmount < threshold) && (entity.getHealth() >= threshold)) {
        cache.shouldForceCircularThrow = true;
    }
};

global.Entities.TagKeys.ICY_TERRACUBE = TagKey.create(Registries.ENTITY_TYPE, "kubejs:icy_terracube");

let ICY_TERRACUBE_NBT = {
    attackTarget: "AttackTarget"
};

/**
 * @type {Annotation.Entities.AiActionsMap<Annotation.Entities.AiActions.IcyTerracube, Annotation.Entities.AiMemories.IcyTerracube>}
 */
let ICY_TERRACUBE_AI_STEP = {
    actions: {
        Init: (entity, controller, _timeLasted, _persistent) => {
            if (entity.getLevel().isClientSide()) return;
            console.info(`[Terracube] Init for ${entity}`);

            controller.deactivate("Init");
            controller.activate("Core");
            controller.activate("MeleeAttack");
            controller.activate("MoveTowardsTarget");
        },
        Core: (entity, controller, _timeLasted, persistent) => {
            let level = entity.getLevel();
    
            if (!controller.isMemoryPresent("core/attackTarget")) {
                if (persistent.contains(ICY_TERRACUBE_NBT.attackTarget)) {
                    let attackTarget = entity.getLevel().getPlayerByUUID(persistent.getUUID(ICY_TERRACUBE_NBT.attackTarget));
                    if (attackTarget != null) {
                        controller.setMemory("core/attackTarget", attackTarget);
                        controller.activate("MoveTowardsTarget");
                    }
                    else persistent.remove(ICY_TERRACUBE_NBT.attackTarget);
                } else {
                    let attackTarget = level.getNearestPlayer(entity.x, entity.y, entity.z, ICY_TERRACUBE_CONFIG.MAX_TARGET_DISTANCE, entity => entity.isPlayer() && !entity.isCreative() && !entity.isSpectator());

                    if (attackTarget != null) {
                        persistent.putUUID(ICY_TERRACUBE_NBT.attackTarget, attackTarget.getUuid());
                        controller.setMemory("core/attackTarget", attackTarget);
                        controller.activate("MoveTowardsTarget");
                        return;
                    }
                }
            } else {
                let attackTarget = controller.getMemory("core/attackTarget");
                if (attackTarget.isDeadOrDying() || attackTarget.isCreative() || attackTarget.isSpectator() || attackTarget.distanceToEntitySqr(entity) > 2500) {
                    controller.removeMemory("core/attackTarget");
                    persistent.remove(ICY_TERRACUBE_NBT.attackTarget);

                    controller.deactivate("MoveTowardsTarget");
                    return;
                }
            }
        },
        MoveTowardsTarget: (entity, controller, _timeLasted, _persistent) => {
            if (!controller.isMemoryPresent("move/moveTarget")) return;
            let time = entity.getLevel().getTime();
            if (entity.onGround()) {

                if (controller.isMemoryPresent("move/jumpStartPos")) {
                    let differece = entity.position().subtract(controller.getMemory("move/jumpStartPos"));
                    if (differece.horizontalDistanceSqr() <= 1) {
                        controller.setMemory("move/jumpsFailed", controller.getMemoryOrSetDefault("move/jumpsFailed", 0) + 1);
                    } else {
                        controller.setMemory("move/jumpsFailed", 0);
                    }
                    if (controller.getMemory("move/jumpsFailed", 0) >= 3) {
                        controller.activate("SmashAttack");
                        return;
                    }
                    controller.removeMemory("move/jumpStartPos");
                    controller.setMemory("eat/hasJustLanded", true);
                }

                entity.setJumping(false);
                controller.activate("LookAtTarget");
                controller.setMemory("move/lookTarget", controller.getMemory("move/moveTarget"));
                entity.lookAt("eyes", controller.getMemory("move/moveTarget"));
                if (time - controller.getMemoryOrSetDefault("move/jumpTimer", time) < 20) return;

                if (Math.random() < 0.05) {
                    controller.activate("SmashAttack");
                    return;
                }

                controller.removeMemory("move/jumpTimer");
                controller.removeMemory("move/lookTarget");
                controller.deactivate("LookAtTarget");
                entity.setJumping(true);

                let direction = entity.getViewVector(1);

                entity.addDeltaMovement(new Vec3d(direction.x(), 0, direction.z()).normalize());
                entity.addDeltaMovement([0, 0.5, 0]);

                controller.setMemory("move/jumpStartPos", entity.position());
            }
        },
        SmashAttack: (entity, controller, timeLasted, _persistent) => {
            if (!controller.isMemoryPresent("core/attackTarget")) {
                controller.deactivate("SmashAttack");
                return;
            }
            if (timeLasted == 0) {
                controller.deactivate("MoveTowardsTarget");
                controller.deactivate("MeleeAttack");
                if (!controller.isMemoryPresent("attack/smashTarget")) controller.setMemory("attack/smashTarget", controller.getMemory("core/attackTarget").position());
            } else if (0 < timeLasted && timeLasted < 40) {
                if (!controller.isMemoryPresent("attack/smashTarget")) {
                    controller.activate("MeleeAttack");
                    controller.activate("MoveTowardsTarget");
                    controller.deactivate("SmashAttack");
                    return;
                }
                let smashTarget = controller.getMemory("attack/smashTarget");
                entity.getLevel().spawnParticles(new DustParticleOptions(new Vec3f(1, 0, 0), 1), false, smashTarget.x(), smashTarget.y() + 0.1, smashTarget.z(), 1.2, 0, 1.2, 20, 0.1);
            } else if (timeLasted == 40) {
                entity.addDeltaMovement([0, 2, 0]);
            } else if (timeLasted == 50) {
                let smashTarget = controller.getMemory("attack/smashTarget");
                entity.setPos(smashTarget.x(), smashTarget.y() + 15, smashTarget.z());
                entity.setMotionY(0);

                let damageBoost;
                switch (entity.getLevel().getDifficulty()) {
                    case $Difficulty.PEACEFUL : damageBoost = 0  ; break;
                    case $Difficulty.EASY     : damageBoost = 5  ; break;
                    case $Difficulty.NORMAL   : damageBoost = 10 ; break;
                    case $Difficulty.HARD     : damageBoost = 15 ; break;
                    default: console.error("Unknown difficulty: " + entity.getLevel().getDifficulty());
                }

                entity.modifyAttribute("minecraft:generic.attack_damage", "Smash attack damage boost", damageBoost, "addition");
                entity.modifyAttribute("forge:entity_gravity", "Smash attack gravity boost", 0.24, "addition");
            } else if (timeLasted > 50 && entity.onGround()) {

                let level = entity.getLevel();
                let atk = entity.getAttribute("minecraft:generic.attack_damage").getValue();
                level.getEntitiesWithin(entity.getBoundingBox().expandTowards(0, -5, 0)).forEach(e => {
                    if (e == entity) return;
                    if (!e.isAttackable()) return;
                    e.attack(KubeJSDamageSources.icyTerracubeSmash(level, entity), atk);
                });

                entity.removeAttribute("minecraft:generic.attack_damage", "Smash attack damage boost");
                entity.removeAttribute("forge:entity_gravity", "Smash attack gravity boost");

                entity.addDeltaMovement([Math.random(), 1, Math.random()]);

                controller.removeMemory("attack/smashTarget");
                controller.setMemory("move/jumpsFailed", 0);

                controller.activate("MeleeAttack");
                controller.activate("MoveTowardsTarget");
                controller.deactivate("SmashAttack");
            }
        },
        LongRangedAttack: (entity, controller, timeLasted, _persistent) => {
            if (!controller.isMemoryPresent("core/attackTarget")) return;
            controller.setMemory("move/lookTarget", controller.getMemory("core/attackTarget").position());
            if (timeLasted >= 100) {
                controller.deactivate("LookAtTarget");
                controller.deactivate("LongRangedAttack");
                controller.activate("SmashAttack");
                controller.setMemory("attack/lastLongRanged", entity.getLevel().getTime());
                return;
            }
            controller.deactivate("MeleeAttack");
            controller.deactivate("MoveTowardsTarget");
            controller.activate("LookAtTarget");
            let difference = controller.getMemory("core/attackTarget").getEyePosition().subtract(entity.getEyePosition());
            let h = difference.y();
            let created = entity.getLevel().createEntity("kubejs:icy_clay_ball");

            let start = entity.getEyePosition();
            created.setPosition(start.x(), start.y(), start.z());
            let velSize = Math.min(Math.sqrt(difference.horizontalDistanceSqr() * 0.015 / Math.abs(h)), 10);

            // 我真求你了别崩了
            // 算个初速度崩多少回了
            if (isNaN(velSize) || !isFinite(velSize)) return;

            let vel = new Vec3d(difference.x(), 0, difference.z()).normalize().scale(velSize);
            created.addDeltaMovement(vel.add(Math.random() * 0.1, Math.random() * 0.1, Math.random() * 0.1));
            entity.getLevel().addFreshEntity(created);
        },
        CircularRangedAttack: (entity, controller, timeLasted, _persistent) => {
            if (timeLasted > 100) {
                controller.removeMemory("move/lookTarget");
                controller.setMemory("attack/lastCircularRanged", entity.getLevel().getTime());
                controller.deactivate("CircularRangedAttack");
            }

            if (timeLasted % 20 == 0) {
                for (let i = 0; i < 20; i ++) {
                    let rad = JavaMath.PI * i / 10;
                    let created;
                    if (entity.getLevel().getDifficulty() !== $Difficulty.PEACEFUL && Math.random() < 0.05) {
                        /** @type {Internal.Slime} */ // Currently the typings of the class Terracube are not generated
                        let terracube = entity.getLevel().createEntity("tconstruct:terracube");
                        terracube.setSize(2, true);
                        terracube.setHealth(terracube.getMaxHealth());
                        created = terracube;
                    } else {
                        created = entity.getLevel().createEntity("kubejs:icy_clay_ball");
                    }
                    let direction = new Vec3d(Math.cos(rad), 0, Math.sin(rad));
                    let pos = entity.getEyePosition().add(direction);
                    created.setPos(pos);
                    created.setDeltaMovement(direction);
                    entity.getLevel().addFreshEntity(created);
                }
            }
        },
        MeleeAttack: (entity, controller, _timeLasted, _persistent) => {
            let level = entity.getLevel();
            if (!controller.isMemoryPresent("core/attackTarget")) return;
            KubeJSAiHelper.tryMeleeAttack(entity, controller.getMemory("core/attackTarget"));
            controller.setMemory("move/moveTarget", controller.getMemory("core/attackTarget").position());

            if (controller.isActive("CircularRangedAttack") && level.getTime() - controller.getMemoryOrSetDefault("attack/lastLongRanged", -Infinity) > 300 && controller.getMemory("core/attackTarget").distanceToEntitySqr(entity) > 144) {
                controller.activate("LongRangedAttack");
                return;
            }
            if (level.getTime() - controller.getMemoryOrSetDefault("attack/lastCircularRanged", -Infinity) > 200 && controller.getMemory("core/attackTarget").distanceToEntitySqr(entity) <= 16) {
                controller.activate("CircularRangedAttack");
            }

        },
        LookAtTarget: (entity, controller, _timeLasted, _persistent) => {
            if (entity.getLevel().isClientSide()) return;
            if (!controller.isMemoryPresent("move/lookTarget")) return;
            entity.lookAt("feet", controller.getMemory("move/lookTarget"));
        },
        EatTerracubes: (entity, controller, _timeLasted, _persistent) => {
            let level = entity.getLevel();
            controller.deactivate("MeleeAttack");

            if (controller.getMemory("eat/hasJustLanded")) {
                /** @type {Internal.LivingEntity[]} */
                let terracubes = level.getEntitiesWithin(entity.getBoundingBox().inflate(20)).filter(e => e.getType() == "tconstruct:terracube").toArray().sort((e1, e2) => entity.distanceToEntitySqr(e1) - entity.distanceToEntitySqr(e2));
                if (terracubes.length == 0) {
                    controller.deactivate("EatTerracubes");
                    controller.activate("MeleeAttack");
                    return;
                }
                let eatTarget = terracubes[0];
                console.info(eatTarget);
                if (!eatTarget.isAlive()) controller.removeMemory("move/moveTarget");
                else controller.setMemory("move/moveTarget", eatTarget.position());

                if (entity.getBoundingBox().inflate(1).intersects(eatTarget.getBoundingBox())) {
                    eatTarget.discard();

                    entity.heal(eatTarget.getHealth());
                    controller.setMemory("eat/terracubesEaten", controller.getMemoryOrSetDefault("eat/terracubesEaten", 0) + 1);
                    controller.setMemory("eat/jumpsToEat", 0);
                } else {
                    controller.setMemory("eat/jumpsToEat", controller.getMemoryOrSetDefault("eat/jumpsToEat", 0) + 1);
                }

                if (controller.getMemory("eat/jumpsToEat") >= 5 || controller.getMemory("eat/terracubesEaten") >= 5 || entity.getHealth() > entity.getMaxHealth() * 0.5) {
                    controller.deactivate("EatTerracubes");
                    controller.activate("MeleeAttack");
                    return;
                }

                controller.setMemory("eat/hasJustLanded", false);
            }
        }
    },
    onHurt: (context, controller) => {
        let entity = context.entity;

        if (entity.getHealth() < entity.getMaxHealth() * 0.25) {
            if (Math.random() < 0.2) {
                controller.activate("EatTerracubes");
            }
        }
    },
    initAction: "Init"
};

global.Entities.AiFunctions.IcyTerracube = KubeJSAiFactory.createAi(ICY_TERRACUBE_AI_STEP);

StartupEvents.registry("minecraft:entity_type", event => {

    const FALL_DAMAGE_RESOURCE_KEY = ResourceKey.create(Registries.DAMAGE_TYPE, "minecraft:fall");

    event.create("kubejs:icy_terracube", "entityjs:mob")
        .eggItem(egg => egg.backgroundColor(0xa8c2cf).highlightColor(0x62ddf3))
        .sized(4, 4)
        .modelSize(4, 4)
        .spawnPlacement("on_ground", "world_surface", () => false)
        .fallSounds(ResourceLocation.tryParse("minecraft:entity.slime.squish"), ResourceLocation.tryParse("minecraft:entity.slime.squish"))
        .setHurtSound(() => "minecraft:entity.slime.hurt")
        .isInvulnerableTo(ctx => ctx.damageSource.is(FALL_DAMAGE_RESOURCE_KEY))
        .aiStep(mob => global.Entities.AiFunctions.IcyTerracube.aiStep(mob))
        .onHurt(mob => global.Entities.AiFunctions.IcyTerracube.onHurt(mob))
    ;

});

EntityJSEvents.attributes(event => {
    event.modify("kubejs:icy_terracube", attr => {
        attr.add("minecraft:generic.max_health", 200);
        attr.add("minecraft:generic.attack_damage", 8);
        attr.add("forge:entity_reach", 3.0);
        attr.add("forge:block_reach", 3.0);
    });
});
