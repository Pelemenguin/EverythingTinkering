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
    KubeJSAiHelper
    console
    Vec3d
    KubeJSDamageSources
    TagKey
    ResourceLocation
    JavaMath
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

            // Animations
            if (entity.onGround()) {
                if (controller.getMemory("animation/hasJustLanded")) {
                    controller.setMemory("animation/hasJustLanded", false);
                } else {
                    controller.setMemory("animation/hasJustLanded", true);
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

                let jumpInterval = (entity.getHealth() / entity.getMaxHealth() - 0.5) * 40;
                let jumpStrength = (entity.getHealth() / entity.getMaxHealth()) * 0.5 + 0.5;
                if (time - controller.getMemoryOrSetDefault("move/jumpTimer", time) < jumpInterval) return;

                if (Math.random() < 0.05) {
                    controller.activate("SmashAttack");
                    return;
                }

                controller.removeMemory("move/jumpTimer");
                controller.removeMemory("move/lookTarget");
                controller.deactivate("LookAtTarget");
                entity.setJumping(true);

                let direction = entity.getViewVector(1);

                entity.addDeltaMovement(new Vec3d(direction.x(), 0, direction.z()).normalize().scale(jumpStrength));
                entity.addDeltaMovement([0, 0.5, 0]);

                entity.triggerAnimation("JumpController", "animation.icy_terracube.jump");

                controller.setMemory("move/jumpStartPos", entity.position());
            }
        },
        SmashAttack: (entity, controller, timeLasted, _persistent) => {
            if (!controller.isMemoryPresent("core/attackTarget")) {
                controller.deactivate("SmashAttack");
                return;
            }
            let warningTime;
            if (!controller.isMemoryPresent("attack/smashWarningTime")) {
                // Always 40 in Peaceful and Easy
                warningTime = entity.getLevel().getDifficulty().getId() <= 1 ? 40 : Math.round(entity.getHealth() / entity.getMaxHealth() * 30 + 10);
                controller.setMemory("attack/smashWarningTime", warningTime);
            } else {
                warningTime = controller.getMemory("attack/smashWarningTime");
            }
            if (timeLasted == 0) {
                controller.deactivate("MoveTowardsTarget");
                controller.deactivate("MeleeAttack");
                if (!controller.isMemoryPresent("attack/smashTarget")) controller.setMemory("attack/smashTarget", controller.getMemory("core/attackTarget").position());
            } else if (0 < timeLasted && timeLasted < warningTime) {
                if (!controller.isMemoryPresent("attack/smashTarget")) {
                    controller.activate("MeleeAttack");
                    controller.activate("MoveTowardsTarget");
                    controller.deactivate("SmashAttack");
                    return;
                }
                let smashTarget = controller.getMemory("attack/smashTarget");
                entity.getLevel().spawnParticles(new DustParticleOptions(new Vec3f(1, 0, 0), 1), false, smashTarget.x(), smashTarget.y() + 0.1, smashTarget.z(), 1.2, 0, 1.2, 20, 0.1);
            } else if (timeLasted == warningTime) {
                entity.addDeltaMovement([0, 2, 0]);
            } else if (timeLasted == warningTime + 10) {
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
            } else if (timeLasted > warningTime + 10 && entity.onGround()) {

                let level = entity.getLevel();
                let atk = entity.getAttribute("minecraft:generic.attack_damage").getValue();
                level.getEntitiesWithin(entity.getBoundingBox().expandTowards(0, -5, 0)).forEach(e => {
                    if (e == entity) return;
                    if (!e.isAttackable()) return;
                    e.attack(KubeJSDamageSources.icyTerracubeSmash(level, entity), atk);
                });

                entity.removeAttribute("minecraft:generic.attack_damage", "Smash attack damage boost");
                entity.removeAttribute("forge:entity_gravity", "Smash attack gravity boost");

                controller.schedule("BigJumpAfterSmashAttack", 5);

                controller.removeMemory("attack/smashTarget");
                controller.removeMemory("attack/smashWarningTime");
                controller.setMemory("move/jumpsFailed", 0);

                controller.activate("MeleeAttack");
                controller.activate("MoveTowardsTarget");
                controller.deactivate("SmashAttack");
            }
        },
        BigJumpAfterSmashAttack: (entity, controller, _timeLasted, _persistent) => {
            entity.addDeltaMovement([Math.random(), 1, Math.random()]);
            controller.deactivate("BigJumpAfterSmashAttack");
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

            if (!controller.isActive("CircularRangedAttack") && level.getTime() - controller.getMemoryOrSetDefault("attack/lastLongRanged", -Infinity) > 300 && controller.getMemory("core/attackTarget").distanceToEntitySqr(entity) > 144) {
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
                if (controller.isActive("EatTerracubes")) {
                    controller.deactivate("EatTerracubes");
                    controller.activate("MeleeAttack");
                } else {
                    controller.activate("EatTerracubes");
                }
            }
        }
    },
    initAction: "Init"
};

global.Entities.AiFunctions.IcyTerracube = KubeJSAiFactory.createAi(ICY_TERRACUBE_AI_STEP);
/** @type {Internal.BaseLivingEntityBuilder$IAnimationPredicateJS_<Internal.MobEntityJS>} */
global.Entities.AiFunctions.IcyTerracube.JumpController = (event) => {
    let actionsController = global.Entities.AiFunctions.IcyTerracube.getController(event.getEntity());
    let animationController = event.getController();
    if (actionsController == undefined || animationController == undefined) return false;
    if (!event.getEntity().onGround()) {
        event.thenPlayAndHold("animation.icy_terracube.jump");
        return true;
    } else {
        animationController.stop();
    }
    if (actionsController.getMemory("animation/hasJustLanded")) {
        event.thenPlay("animation.icy_terracube.land");
        return true;
    }
    return false;
};

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
        .addAnimationController("jumpController", 0, event => {
            try {return global.Entities.AiFunctions.IcyTerracube.JumpController(event);}
            catch (e) {console.info("Error on Icy Terracube animation controller tick: " + e); return false;}
        })
        // .addTriggerableAnimationController("JumpController", 0, "animation.icy_terracube.jump", "animation.icy_terracube.jump", "HOLD_ON_LAST_FRAME")
        // .addTriggerableAnimationController("LandController", 0, "animation.")
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
