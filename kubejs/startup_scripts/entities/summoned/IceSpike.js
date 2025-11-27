// SPDX-License-Identifier: LGPL-3.0-or-later

/**
 * @fileoverview Ice Spike
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
    KubeJSDamageSources
    ParticleTypes
*/

global.Entities.AiFunctions.IceSpike = {
    /**
     * @param {Internal.Entity} entity 
     */
    tick: (entity) => {
        if (entity.getLevel().isClientSide()) return;
        if (entity.age == 10) {
            /** @type {DamageSource} */
            let damageSource = null;
            let persistent = entity.getForgePersistentData();
            if (persistent != null && persistent.contains("kubejs:ice_spike_owner")) {
                let uuid = persistent.getUUID("kubejs:ice_spike_owner");
                if (uuid != null) {
                    let owner = entity.getLevel().getEntities().toArray().find((/** @type {Internal.Entity} */ entity) => entity.getUuid().equals(uuid));
                    if (owner != null) {
                        damageSource = KubeJSDamageSources.iceSpike(entity.getLevel(), entity, owner);
                    }
                }
            }
            if (damageSource == null) damageSource = KubeJSDamageSources.iceSpike(entity.getLevel(), entity);

            entity.getLevel().getEntitiesWithin(entity.getBoundingBox().expandTowards(0, 1, 0)).forEach(e => {
                if (!e.isAttackable()) return;
                if (e.attack(damageSource, 4)) {
                    const ticksFrozen = e.getTicksFrozen();
                    if (ticksFrozen <= 300) e.setTicksFrozen(ticksFrozen + 200);
                }
            });

            entity.getLevel().spawnParticles(ParticleTypes.SNOWFLAKE, false, entity.getX(), entity.getY() + 1.5, entity.getZ(), 0, 0, 0, 20, 0.1);
        }
        if (entity.age >= 20) {
            entity.discard();
        }
    },
    /**
     * @param {Internal.BaseEntityBuilder$AnimationEventJS<Internal.BaseEntityJS>} context 
     */
    animationTick: (context) => {
        context.thenPlay("animation.ice_spike.attack");
        return true;
    },
    /**
     * @param {Internal.Entity} iceSpike
     * @param {Internal.Entity} owner
     */
    setOwner: (iceSpike, owner) => {
        iceSpike.getForgePersistentData().putUUID("kubejs:ice_spike_owner", owner.getUuid());
    }
};

StartupEvents.registry("minecraft:entity_type", event => {
    event.create("kubejs:ice_spike", "entityjs:nonliving")
        .sized(0.5, 0.5)
        .tick(entity => global.Entities.AiFunctions.IceSpike.tick(entity))
        .addAnimationController("attackController", 0, context => global.Entities.AiFunctions.IceSpike.animationTick(context))
    ;
});
